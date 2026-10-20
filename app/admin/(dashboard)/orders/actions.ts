"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

type ActionResult = { success: boolean; error?: string };

const paymentStatuses = ["PENDING", "UNDER_REVIEW", "PAID", "REJECTED"] as const;
const orderStatuses = ["PENDING_PAYMENT", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type PaymentStatus = (typeof paymentStatuses)[number];
type OrderStatus = (typeof orderStatuses)[number];

function refreshOrders() {
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

class StockUnavailableError extends Error {
  constructor(name: string) {
    super(`المخزون غير كافي للعطر: ${name}. لا يمكن تأكيد الدفع قبل حل المشكلة.`);
  }
}
class ConcurrentChangeError extends Error {}

export async function updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<ActionResult> {
  await requireAdmin();
  if (!orderId || !paymentStatuses.includes(status)) return { success: false, error: "بيانات حالة الدفع غير صحيحة." };

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true, status: true, paymentStatus: true, stockDeductedAt: true, refundStatus: true,
          items: { select: { productId: true, quantity: true, productName: true } },
        },
      });
      if (!order) return { success: false, error: "الطلب غير موجود." };
      if (order.paymentStatus === status) return { success: true };
      if (order.refundStatus !== "NONE") return { success: false, error: "لا يمكن تغيير الدفع أثناء إجراء استرداد." };
      if (order.status === "CANCELLED") return { success: false, error: "الطلب ملغي. لا يمكن تعديل الدفع." };
      if (order.paymentStatus === "PAID") return { success: false, error: "لا يمكن إلغاء حالة الدفع المستلم من هنا. لازم مراجعة مالية أولًا." };
      if (status !== "PAID" && order.status !== "PENDING_PAYMENT") {
        return { success: false, error: "لا يمكن تغيير الدفع إلى غير مستلم بعد بدء تنفيذ الطلب." };
      }
      if (status === "PAID" && order.status !== "PENDING_PAYMENT") {
        return { success: false, error: "حالة الطلب لا تسمح بتأكيد الدفع." };
      }

      // A conditional update makes the first successful payment confirmation the sole stock owner.
      // All writes are in the same transaction, so any stock failure rolls the status back.
      const claimed = await tx.order.updateMany({
        where: { id: orderId, paymentStatus: order.paymentStatus, status: "PENDING_PAYMENT" },
        data: { paymentStatus: status },
      });
      if (claimed.count !== 1) throw new ConcurrentChangeError();

      if (status === "PAID") {
        if (order.stockDeductedAt) throw new Error("المخزون مسجل كخصم مسبقًا؛ راجع الطلب يدويًا.");
        if (order.items.length === 0) throw new Error("الطلب لا يحتوي على منتجات.");
        const quantities = new Map<string, { quantity: number; name: string }>();
        for (const item of order.items) {
          const current = quantities.get(item.productId);
          quantities.set(item.productId, {
            quantity: (current?.quantity ?? 0) + item.quantity,
            name: item.productName,
          });
        }
        for (const [productId, item] of quantities) {
          const updated = await tx.product.updateMany({
            where: { id: productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (updated.count !== 1) throw new StockUnavailableError(item.name);
          await tx.stockMovement.create({ data: { orderId, productId, type: "SALE", quantity: item.quantity } });
        }
        await tx.order.update({ where: { id: orderId }, data: { stockDeductedAt: new Date(), status: "CONFIRMED" } });
      }
      return { success: true };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5000, timeout: 10000 });

    if (result.success) refreshOrders();
    return result;
  } catch (error) {
    if (error instanceof StockUnavailableError) return { success: false, error: error.message };
    if (error instanceof ConcurrentChangeError || (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034")) {
      return { success: false, error: "تم تعديل الطلب بالتزامن مع العملية. حدّث الصفحة وحاول مرة أخرى." };
    }
    console.error("Update payment failed:", error);
    return { success: false, error: "حصل خطأ أثناء تحديث حالة الدفع." };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<ActionResult> {
  await requireAdmin();
  if (!orderId || !orderStatuses.includes(status)) return { success: false, error: "حالة الطلب غير صحيحة." };

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, select: { id: true, status: true, paymentStatus: true, refundStatus: true } });
      if (!order) return { success: false, error: "الطلب غير موجود." };
      if (order.status === status) return { success: true };
      if (order.refundStatus !== "NONE") return { success: false, error: "يوجد استرداد معلق أو مكتمل؛ لا يمكن تغيير حالة الطلب." };
      if (order.status === "CANCELLED" || order.status === "DELIVERED") {
        return { success: false, error: "الطلب ملغي أو تم تسليمه بالفعل. لا يمكن تغيير حالته من هنا." };
      }
      if (status === "CANCELLED" && order.paymentStatus === "PAID") {
        return { success: false, error: "الطلب مدفوع. الإلغاء يتطلب إجراء استرداد وإرجاع مخزون منفصل." };
      }
      if (status !== "PENDING_PAYMENT" && status !== "CANCELLED" && order.paymentStatus !== "PAID") {
        return { success: false, error: "لازم تتأكد من استلام المبلغ كاملًا وتغيّر حالة الدفع إلى تم الدفع الأول." };
      }
      const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
        PENDING_PAYMENT: ["CONFIRMED", "CANCELLED"],
        CONFIRMED: ["PROCESSING", "CANCELLED"],
        PROCESSING: ["SHIPPED", "CANCELLED"],
        SHIPPED: ["DELIVERED"],
        DELIVERED: [], CANCELLED: [],
      };
      if (!allowedTransitions[order.status as OrderStatus]?.includes(status)) {
        return { success: false, error: "انتقال حالة الطلب غير مسموح. اتبع مراحل التنفيذ بالترتيب." };
      }
      const changed = await tx.order.updateMany({
        where: { id: orderId, status: order.status, paymentStatus: order.paymentStatus },
        data: { status },
      });
      if (changed.count !== 1) throw new ConcurrentChangeError();
      return { success: true };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    if (result.success) refreshOrders();
    return result;
  } catch (error) {
    if (error instanceof ConcurrentChangeError || (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034")) {
      return { success: false, error: "تم تعديل الطلب بالتزامن. حدّث الصفحة وحاول مرة أخرى." };
    }
    console.error("Update order failed:", error);
    return { success: false, error: "حصل خطأ أثناء تحديث الطلب." };
  }
}


// Refund is a two-stage manual financial workflow. No money is transferred by these actions.
export async function requestOrderRefund(orderId: string, note: string): Promise<ActionResult> {
  await requireAdmin();
  if (!orderId || !note.trim() || note.trim().length > 2000) return { success: false, error: "اكتب سبب الاسترداد (بحد أقصى 2000 حرف)." };
  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, select: { paymentStatus: true, status: true, refundStatus: true, stockDeductedAt: true } });
      if (!order) return { success: false, error: "الطلب غير موجود." };
      if (order.paymentStatus !== "PAID") return { success: false, error: "الطلب غير مدفوع؛ استخدم الإلغاء العادي." };
      if (order.status === "SHIPPED" || order.status === "DELIVERED") return { success: false, error: "الطلب مشحون أو مُسلّم؛ يحتاج نظام مرتجعات منفصل." };
      if (order.status === "CANCELLED") return { success: false, error: "الطلب ملغي بالفعل." };
      if (order.refundStatus !== "NONE") return { success: false, error: "يوجد طلب استرداد لهذا الطلب بالفعل." };
      if (!order.stockDeductedAt) return { success: false, error: "طلب قديم بدون سجل خصم مخزون. راجع مخزونه قبل الاسترداد." };
      const updated = await tx.order.updateMany({ where: { id: orderId, refundStatus: "NONE", status: order.status }, data: { refundStatus: "PENDING", refundNote: note.trim() } });
      if (updated.count !== 1) throw new ConcurrentChangeError();
      return { success: true };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    if (result.success) refreshOrders();
    return result;
  } catch (error) {
    console.error("Request refund failed:", error);
    return { success: false, error: "تعذر تسجيل طلب الاسترداد. حدّث الصفحة وحاول مرة أخرى." };
  }
}

// Only call after the external bank/wallet refund has actually been completed.
export async function completeOrderRefund(orderId: string, moneyReturned: boolean): Promise<ActionResult> {
  await requireAdmin();
  if (!orderId || moneyReturned !== true) return { success: false, error: "لازم تؤكد إن الفلوس اترجعت فعليًا للعميل." };
  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (!order) return { success: false, error: "الطلب غير موجود." };
      if (order.refundStatus === "COMPLETED") return { success: false, error: "الاسترداد اتنفذ بالفعل؛ لن يتم إرجاع المخزون مرة تانية." };
      if (order.refundStatus !== "PENDING" || order.paymentStatus !== "PAID") return { success: false, error: "لا يوجد طلب استرداد معلق لطلب مدفوع." };
      if (order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "CANCELLED") return { success: false, error: "حالة الطلب لا تسمح بالاسترداد المباشر." };
      if (!order.stockDeductedAt || order.stockRestoredAt) return { success: false, error: "سجل المخزون غير متسق؛ يحتاج مراجعة يدوية." };
      const claimed = await tx.order.updateMany({ where: { id: orderId, refundStatus: "PENDING", stockRestoredAt: null, status: order.status }, data: { refundStatus: "COMPLETED", refundedAt: new Date(), stockRestoredAt: new Date(), status: "CANCELLED" } });
      if (claimed.count !== 1) throw new ConcurrentChangeError();
      const quantities = new Map<string, number>();
      for (const item of order.items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
      if (quantities.size === 0) throw new Error("الطلب بلا منتجات.");
      for (const [productId, quantity] of quantities) {
        const sale = await tx.stockMovement.findUnique({ where: { orderId_productId_type: { orderId, productId, type: "SALE" } } });
        if (!sale || sale.quantity !== quantity) throw new Error("حركة الخصم غير متطابقة؛ يلزم مراجعة المخزون يدويًا.");
        const product = await tx.product.updateMany({ where: { id: productId }, data: { stock: { increment: quantity } } });
        if (product.count !== 1) throw new Error("المنتج غير موجود؛ يلزم مراجعة يدوية.");
        await tx.stockMovement.create({ data: { orderId, productId, type: "RETURN", quantity } });
      }
      return { success: true };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5000, timeout: 10000 });
    if (result.success) refreshOrders();
    return result;
  } catch (error) {
    console.error("Complete refund failed:", error);
    return { success: false, error: "تعذر إتمام الاسترداد أو إعادة المخزون؛ لم يتم اعتماد أي تغيير. راجع السجلات." };
  }
}
