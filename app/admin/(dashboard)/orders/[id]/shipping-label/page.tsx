
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import PrintShippingLabel from "./PrintShippingLabel";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

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
  CANCELLED: "ملغي",
};

export default async function ShippingLabelPage({
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
  const cancelled = order.status === "CANCELLED";

  const readyToShip =
    paid &&
    ["CONFIRMED", "PROCESSING", "SHIPPED"].includes(
      order.status
    );

  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const date = new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(order.createdAt);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-neutral-100 px-3 py-8 text-[#171411] print:min-h-0 print:bg-white print:p-0"
    >
      <div className="mx-auto w-full max-w-[760px]">
        <div className="mb-5 print:hidden">
          <PrintShippingLabel disabled={!readyToShip} />
          {!readyToShip && (
            <p className="mt-3 text-sm font-semibold text-red-700">
              الطباعة معطلة حتى يتم تأكيد استلام الدفع
              ووصول الطلب إلى حالة تسمح بتجهيزه للشحن.
            </p>
          )}
        </div>

        <article className="rounded-2xl border-2 border-black bg-white p-5 shadow-sm sm:p-8 print:rounded-none print:border-2 print:p-5 print:shadow-none">
          <header className="flex flex-wrap items-start justify-between gap-5 border-b-2 border-black pb-5">
            <div>
              <h1 className="text-3xl font-black">
                وسامة برفيوم
              </h1>
              <p className="mt-1 text-sm font-bold tracking-widest">
                WASAMA PERFUME
              </p>
              <p className="mt-3 text-xs text-neutral-600">
                بوليصة شحن داخلية
              </p>
            </div>

            <div className="text-left">
              <p className="text-xs text-neutral-500">
                رقم الطلب
              </p>
              <p
                dir="ltr"
                className="mt-1 text-xl font-black"
              >
                #{order.orderNumber}
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                {date}
              </p>
            </div>
          </header>

          <div
            className={`mt-5 border-2 p-4 text-center ${
              cancelled
                ? "border-red-700 bg-red-50"
                : readyToShip
                  ? "border-black bg-neutral-100"
                  : "border-red-700 bg-red-50"
            }`}
          >
            <p className="text-xl font-black">
              {cancelled
                ? "طلب ملغي - ممنوع الشحن"
                : readyToShip
                  ? "مدفوع بالكامل - لا تحصل أي مبلغ"
                  : "غير جاهز للشحن"}
            </p>

            <p className="mt-2 text-xs font-semibold">
              حالة الدفع:{" "}
              {paymentLabels[order.paymentStatus] ??
                order.paymentStatus}
            </p>

            <p className="mt-1 text-xs font-semibold">
              حالة الطلب:{" "}
              {statusLabels[order.status] ?? order.status}
            </p>
          </div>

          <section className="mt-6">
            <h2 className="border-b border-black pb-2 text-lg font-black">
              بيانات المستلم
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-neutral-500">
                  اسم المستلم
                </p>
                <p className="mt-1 text-xl font-black">
                  {order.customerName}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-neutral-500">
                    رقم الهاتف
                  </p>
                  <p
                    dir="ltr"
                    className="mt-1 text-right text-xl font-black"
                  >
                    {order.phone}
                  </p>
                </div>

                {order.alternatePhone && (
                  <div>
                    <p className="text-xs text-neutral-500">
                      هاتف إضافي
                    </p>
                    <p
                      dir="ltr"
                      className="mt-1 text-right text-lg font-bold"
                    >
                      {order.alternatePhone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="mt-6 border-t-2 border-black pt-5">
            <h2 className="text-lg font-black">
              عنوان التسليم
            </h2>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500">
                    المحافظة
                  </p>
                  <p className="mt-1 font-extrabold">
                    {order.governorate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    المدينة / المنطقة
                  </p>
                  <p className="mt-1 font-extrabold">
                    {order.city}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-neutral-500">
                  العنوان بالتفصيل
                </p>
                <p className="mt-2 text-lg font-black leading-8">
                  {order.address}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6 border-t-2 border-black pt-5">
            <div className="flex justify-between gap-3">
              <h2 className="text-lg font-black">
                محتويات الشحنة
              </h2>
              <p className="text-sm font-bold">
                {totalQuantity} قطعة
              </p>
            </div>

            <div className="mt-4 overflow-hidden border border-black">
              <table className="w-full border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-black bg-neutral-100">
                    <th className="p-3">المنتج</th>
                    <th className="w-20 p-3 text-center">
                      الكمية
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-neutral-300 last:border-0"
                    >
                      <td className="p-3">
                        <p className="font-bold">
                          {item.productName}
                        </p>
                        <p
                          dir="ltr"
                          className="mt-1 text-right text-xs text-neutral-500"
                        >
                          {item.productSlug}
                        </p>
                      </td>
                      <td className="p-3 text-center font-black">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {order.notes && (
            <section className="mt-6 border border-black p-4">
              <h2 className="font-black">
                ملاحظات العميل
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7">
                {order.notes}
              </p>
            </section>
          )}

          <section className="mt-6 border-t-2 border-black pt-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-500">
                  طريقة الدفع
                </p>
                <p className="mt-1 font-extrabold">
                  {order.paymentMethod === "VODAFONE_CASH"
                    ? "Vodafone Cash"
                    : "InstaPay"}
                </p>
              </div>

              <div className="text-left">
                <p className="text-xs text-neutral-500">
                  المبلغ المطلوب تحصيله عند التسليم
                </p>
                <p className="mt-1 text-2xl font-black">
                  {paid ? "0 ج.م" : "غير محدد - ممنوع الشحن"}
                </p>
              </div>
            </div>
          </section>

          <footer className="mt-8 border-t border-dashed border-black pt-4 text-center text-xs text-neutral-600">
            وسامة برفيوم - بوليصة تجهيز وشحن داخلية
            <p className="mt-2">
              لا تمثل رقم تتبع أو بوليصة رسمية صادرة من شركة شحن.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}
