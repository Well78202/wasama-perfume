
"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

type ActionResult = {
  success: boolean;
  error?: string;
};

const paymentStatuses = [
  "PENDING",
  "UNDER_REVIEW",
  "PAID",
  "REJECTED",
] as const;

const orderStatuses = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type PaymentStatus = (typeof paymentStatuses)[number];
type OrderStatus = (typeof orderStatuses)[number];

class ConcurrentChangeError extends Error {}

function refreshOrders() {
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

function isConcurrentError(error: unknown): boolean {
  return (
    error instanceof ConcurrentChangeError ||
    (error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034")
  );
}

const transactionOptions = {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  maxWait: 5000,
  timeout: 10000,
};

// ============================================
// UPDATE PAYMENT STATUS
// ============================================

export async function updatePaymentStatus(
  orderId: string,
  status: PaymentStatus
): Promise<ActionResult> {
  await requireAdmin();

  if (!orderId || !paymentStatuses.includes(status)) {
    return {
      success: false,
      error: "بيانات حالة الدفع غير صحيحة.",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          refundStatus: true,
          items: {
            select: { id: true },
          },
        },
      });

      if (!order) {
        return { success: false, error: "الطلب غير موجود." };
      }

      if (order.paymentStatus === status) {
        return { success: true };
      }

      if (order.refundStatus !== "NONE") {
        return {
          success: false,
          error: "لا يمكن تغيير الدفع أثناء إجراء استرداد.",
        };
      }

      if (order.status === "CANCELLED") {
        return {
          success: false,
          error: "الطلب ملغي. لا يمكن تعديل الدفع.",
        };
      }

      if (order.paymentStatus === "PAID") {
        return {
          success: false,
          error: "لا يمكن تغيير حالة الدفع المستلم بدون مراجعة مالية.",
        };
      }

      if (order.status !== "PENDING_PAYMENT") {
        return {
          success: false,
          error: "لا يمكن تعديل الدفع بعد بدء تنفيذ الطلب.",
        };
      }

      if (status === "PAID" && order.items.length === 0) {
        return {
          success: false,
          error: "الطلب لا يحتوي على منتجات.",
        };
      }

      const updated = await tx.order.updateMany({
        where: {
          id: orderId,
          paymentStatus: order.paymentStatus,
          status: "PENDING_PAYMENT",
          refundStatus: "NONE",
        },
        data: {
          paymentStatus: status,
          ...(status === "PAID"
            ? { status: "CONFIRMED" as const }
            : {}),
        },
      });

      if (updated.count !== 1) {
        throw new ConcurrentChangeError();
      }

      return { success: true };
    }, transactionOptions);

    if (result.success) refreshOrders();

    return result;
  } catch (error) {
    if (isConcurrentError(error)) {
      return {
        success: false,
        error: "تم تعديل الطلب بالتزامن. حدّث الصفحة وحاول مرة أخرى.",
      };
    }

    console.error("Update payment failed:", error);

    return {
      success: false,
      error: "حصل خطأ أثناء تحديث حالة الدفع.",
    };
  }
}

// ============================================
// UPDATE ORDER STATUS
// ============================================

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<ActionResult> {
  await requireAdmin();

  if (!orderId || !orderStatuses.includes(status)) {
    return {
      success: false,
      error: "حالة الطلب غير صحيحة.",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          refundStatus: true,
        },
      });

      if (!order) {
        return { success: false, error: "الطلب غير موجود." };
      }

      if (order.status === status) {
        return { success: true };
      }

      if (order.refundStatus !== "NONE") {
        return {
          success: false,
          error: "يوجد استرداد معلق أو مكتمل.",
        };
      }

      if (
        order.status === "CANCELLED" ||
        order.status === "DELIVERED"
      ) {
        return {
          success: false,
          error: "لا يمكن تعديل حالة طلب ملغي أو تم تسليمه.",
        };
      }

      if (status === "CANCELLED" && order.paymentStatus === "PAID") {
        return {
          success: false,
          error: "الطلب مدفوع. يجب إجراء الاسترداد المالي أولًا.",
        };
      }

      if (
        status !== "PENDING_PAYMENT" &&
        status !== "CANCELLED" &&
        order.paymentStatus !== "PAID"
      ) {
        return {
          success: false,
          error: "لازم تتأكد من استلام المبلغ كاملًا أولًا.",
        };
      }

      const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
        PENDING_PAYMENT: ["CONFIRMED", "CANCELLED"],
        CONFIRMED: ["PROCESSING", "CANCELLED"],
        PROCESSING: ["SHIPPED", "CANCELLED"],
        SHIPPED: ["DELIVERED"],
        DELIVERED: [],
        CANCELLED: [],
      };

      if (
        !allowedTransitions[order.status as OrderStatus]?.includes(
          status
        )
      ) {
        return {
          success: false,
          error: "انتقال حالة الطلب غير مسموح.",
        };
      }

      const updated = await tx.order.updateMany({
        where: {
          id: orderId,
          status: order.status,
          paymentStatus: order.paymentStatus,
          refundStatus: "NONE",
        },
        data: { status },
      });

      if (updated.count !== 1) {
        throw new ConcurrentChangeError();
      }

      return { success: true };
    }, transactionOptions);

    if (result.success) refreshOrders();

    return result;
  } catch (error) {
    if (isConcurrentError(error)) {
      return {
        success: false,
        error: "تم تعديل الطلب بالتزامن. حدّث الصفحة وحاول مرة أخرى.",
      };
    }

    console.error("Update order failed:", error);

    return {
      success: false,
      error: "حصل خطأ أثناء تحديث الطلب.",
    };
  }
}

// ============================================
// REQUEST REFUND
// ============================================

// This records a refund request only.
// It does NOT transfer money.

export async function requestOrderRefund(
  orderId: string,
  note: string
): Promise<ActionResult> {
  await requireAdmin();

  if (
    !orderId ||
    typeof note !== "string" ||
    !note.trim() ||
    note.trim().length > 2000
  ) {
    return {
      success: false,
      error: "اكتب سبب الاسترداد بحد أقصى 2000 حرف.",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          paymentStatus: true,
          status: true,
          refundStatus: true,
        },
      });

      if (!order) {
        return { success: false, error: "الطلب غير موجود." };
      }

      if (order.paymentStatus !== "PAID") {
        return {
          success: false,
          error: "الطلب غير مدفوع؛ استخدم الإلغاء العادي.",
        };
      }

      if (
        order.status === "SHIPPED" ||
        order.status === "DELIVERED"
      ) {
        return {
          success: false,
          error: "الطلب مشحون أو مُسلّم؛ يحتاج إجراء مرتجعات منفصل.",
        };
      }

      if (order.status === "CANCELLED") {
        return {
          success: false,
          error: "الطلب ملغي بالفعل.",
        };
      }

      if (order.refundStatus !== "NONE") {
        return {
          success: false,
          error: "يوجد طلب استرداد بالفعل.",
        };
      }

      const updated = await tx.order.updateMany({
        where: {
          id: orderId,
          paymentStatus: "PAID",
          refundStatus: "NONE",
          status: order.status,
        },
        data: {
          refundStatus: "PENDING",
          refundNote: note.trim(),
        },
      });

      if (updated.count !== 1) {
        throw new ConcurrentChangeError();
      }

      return { success: true };
    }, transactionOptions);

    if (result.success) refreshOrders();

    return result;
  } catch (error) {
    if (isConcurrentError(error)) {
      return {
        success: false,
        error: "تم تعديل الطلب بالتزامن. حدّث الصفحة وحاول مرة أخرى.",
      };
    }

    console.error("Request refund failed:", error);

    return {
      success: false,
      error: "تعذر تسجيل طلب الاسترداد.",
    };
  }
}

// ============================================
// COMPLETE REFUND
// ============================================

// Call ONLY after money has actually been
// returned through Vodafone Cash or InstaPay.

export async function completeOrderRefund(
  orderId: string,
  moneyReturned: boolean
): Promise<ActionResult> {
  await requireAdmin();

  if (!orderId || moneyReturned !== true) {
    return {
      success: false,
      error: "لازم تؤكد إن الفلوس اترجعت فعليًا للعميل.",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          status: true,
          paymentStatus: true,
          refundStatus: true,
        },
      });

      if (!order) {
        return { success: false, error: "الطلب غير موجود." };
      }

      if (order.refundStatus === "COMPLETED") {
        return {
          success: false,
          error: "الاسترداد مكتمل بالفعل.",
        };
      }

      if (
        order.refundStatus !== "PENDING" ||
        order.paymentStatus !== "PAID"
      ) {
        return {
          success: false,
          error: "لا يوجد طلب استرداد معلق لطلب مدفوع.",
        };
      }

      if (
        order.status === "SHIPPED" ||
        order.status === "DELIVERED" ||
        order.status === "CANCELLED"
      ) {
        return {
          success: false,
          error: "حالة الطلب لا تسمح بالاسترداد المباشر.",
        };
      }

      const updated = await tx.order.updateMany({
        where: {
          id: orderId,
          paymentStatus: "PAID",
          refundStatus: "PENDING",
          status: order.status,
        },
        data: {
          refundStatus: "COMPLETED",
          refundedAt: new Date(),
          status: "CANCELLED",
        },
      });

      if (updated.count !== 1) {
        throw new ConcurrentChangeError();
      }

      return { success: true };
    }, transactionOptions);

    if (result.success) refreshOrders();

    return result;
  } catch (error) {
    if (isConcurrentError(error)) {
      return {
        success: false,
        error: "تم تعديل الطلب بالتزامن. حدّث الصفحة وحاول مرة أخرى.",
      };
    }

    console.error("Complete refund failed:", error);

    return {
      success: false,
      error: "تعذر إتمام الاسترداد. راجع السجلات.",
    };
  }
}
