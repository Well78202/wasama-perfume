
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

const money = (value: number) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(value);

const paymentLabels: Record<string, string> = {
  PENDING: "في انتظار الدفع",
  UNDER_REVIEW: "الدفع تحت المراجعة",
  PAID: "تم استلام الدفع",
  REJECTED: "الدفع مرفوض",
};

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "بانتظار الدفع",
  CONFIRMED: "تم تأكيد الطلب",
  PROCESSING: "جاري التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التسليم",
  CANCELLED: "طلب ملغي",
};

export default async function InvoicePage({
  params,
}: Props) {
  await requireAdmin();

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { id: "asc" },
      },
    },
  });

  if (!order) notFound();

  const paid = order.paymentStatus === "PAID";

  const date = new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(order.createdAt);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-neutral-100 px-3 py-8 text-[#171411] print:min-h-0 print:bg-white print:p-0"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex justify-end print:hidden">
          <PrintButton />
        </div>

        <article className="rounded-2xl bg-white p-5 shadow-sm sm:p-10 print:rounded-none print:p-0 print:shadow-none">
          {/* Header */}
          <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-[#a66d36] pb-7">
            <div>
              <p className="text-3xl font-black text-[#a66d36]">
                وسامة برفيوم
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                WASAMA PERFUME
              </p>
              <p className="mt-4 text-xs text-neutral-500">
                فاتورة طلب
              </p>
            </div>

            <div className="text-left">
              <h1 className="text-2xl font-extrabold">
                فاتورة #{order.orderNumber}
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                {date}
              </p>
            </div>
          </header>

          {/* Customer */}
          <section className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-3 font-extrabold text-[#a66d36]">
                بيانات العميل
              </h2>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>الاسم:</strong>{" "}
                  {order.customerName}
                </p>

                <p>
                  <strong>الهاتف:</strong>{" "}
                  <span dir="ltr">{order.phone}</span>
                </p>

                {order.alternatePhone && (
                  <p>
                    <strong>هاتف إضافي:</strong>{" "}
                    <span dir="ltr">
                      {order.alternatePhone}
                    </span>
                  </p>
                )}

                <p>
                  <strong>العنوان:</strong>{" "}
                  {order.governorate}، {order.city}،{" "}
                  {order.address}
                </p>

                {order.notes && (
                  <p>
                    <strong>ملاحظات:</strong>{" "}
                    {order.notes}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-extrabold text-[#a66d36]">
                معلومات الطلب
              </h2>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>طريقة الدفع:</strong>{" "}
                  {order.paymentMethod === "VODAFONE_CASH"
                    ? "Vodafone Cash"
                    : "InstaPay"}
                </p>

                <p>
                  <strong>حالة الدفع:</strong>{" "}
                  {paymentLabels[order.paymentStatus]}
                </p>

                <p>
                  <strong>حالة الطلب:</strong>{" "}
                  {statusLabels[order.status]}
                </p>
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="mt-9">
            <h2 className="mb-4 text-lg font-extrabold">
              تفاصيل المنتجات
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-right text-sm">
                <thead>
                  <tr className="bg-[#f3e8d8]">
                    <th className="p-3">المنتج</th>
                    <th className="p-3">الكمية</th>
                    <th className="p-3">سعر الوحدة</th>
                    <th className="p-3">الإجمالي</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-neutral-200"
                    >
                      <td className="p-3">
                        <p className="font-bold">
                          {item.productName}
                        </p>
                        <p
                          dir="ltr"
                          className="mt-1 text-right text-xs text-neutral-400"
                        >
                          {item.productSlug}
                        </p>
                      </td>

                      <td className="p-3">
                        {item.quantity}
                      </td>

                      <td className="p-3">
                        {money(Number(item.unitPrice))}
                      </td>

                      <td className="p-3 font-bold">
                        {money(Number(item.total))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Totals */}
          <section className="mt-8 flex justify-end">
            <div className="w-full max-w-sm space-y-3 text-sm">
              <div className="flex justify-between">
                <span>إجمالي المنتجات</span>
                <strong>
                  {money(Number(order.subtotal))}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>الشحن</span>
                <strong>
                  {money(Number(order.shippingFee))}
                </strong>
              </div>

              <div className="flex justify-between border-t-2 border-[#a66d36] pt-4 text-xl font-extrabold">
                <span>الإجمالي النهائي</span>
                <span>
                  {money(Number(order.total))}
                </span>
              </div>
            </div>
          </section>

          {/* Payment Notice */}
          <section
            className={`mt-8 rounded-xl border p-4 text-center text-sm font-bold print:break-inside-avoid ${
              paid
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {paid
              ? "تم تسجيل استلام قيمة الطلب بالكامل."
              : "لم يتم تأكيد استلام الدفع. هذه الفاتورة لا تعتبر إيصال سداد."}
          </section>

          <footer className="mt-12 border-t border-neutral-200 pt-5 text-center text-xs text-neutral-500">
            شكرًا لتسوقك من وسامة برفيوم
          </footer>
        </article>
      </div>
    </main>
  );
}
