
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import OrdersManager from "./OrdersManager";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  // ================= ADMIN AUTH =================

  await requireAdmin();

  // ================= FETCH ORDERS =================

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      items: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  // ================= FORMAT ORDERS =================

  const formattedOrders = orders.map((order) => ({
    id: order.id,

    orderNumber: order.orderNumber,

    // CUSTOMER
    customerName: order.customerName,
    phone: order.phone,
    alternatePhone: order.alternatePhone,

    // ADDRESS
    governorate: order.governorate,
    city: order.city,
    address: order.address,
    notes: order.notes,

    // PAYMENT
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,

    // ORDER STATUS
    status: order.status,

    // TOTALS
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    total: Number(order.total),

    // DATE
    createdAt: order.createdAt.toISOString(),

    // ITEMS COUNT
    itemCount: order.items.length,

    // REFUND
    refundStatus: order.refundStatus,
    refundNote: order.refundNote,

    // ORDER ITEMS
    items: order.items.map((item) => ({
      id: item.id,

      productId: item.productId,
      productSlug: item.productSlug,
      productName: item.productName,

      quantity: item.quantity,

      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
    })),
  }));

  // ================= RENDER =================

  return <OrdersManager orders={formattedOrders} />;
}
