import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import OrdersManager from "./OrdersManager";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        orderBy: { id: "asc" },
      },
    },
  });

  return (
    <OrdersManager
      orders={orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        phone: order.phone,
        alternatePhone: order.alternatePhone,
        governorate: order.governorate,
        city: order.city,
        address: order.address,
        notes: order.notes,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shippingFee),
        total: Number(order.total),
        createdAt: order.createdAt.toISOString(),
        itemCount: order.items.length,
        refundStatus: order.refundStatus,
        refundNote: order.refundNote,
        stockDeductedAt: order.stockDeductedAt?.toISOString() ?? null,
        stockRestoredAt: order.stockRestoredAt?.toISOString() ?? null,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productSlug: item.productSlug,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          total: Number(item.total),
        })),
      }))}
    />
  );
}
