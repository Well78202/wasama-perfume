import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Wallet,
  Clock3,
  ArrowUpLeft,
  Plus,
  Inbox,
  Truck,
  PackageCheck,
  AlertTriangle,
  CreditCard,
  Tags,
  ChartNoAxesCombined,
  ArrowLeft,
} from "lucide-react";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "../LogoutButton";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "بانتظار الدفع",
  CONFIRMED: "تم التأكيد",
  PROCESSING: "جاري التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

const paymentLabels: Record<string, string> = {
  PENDING: "بانتظار الدفع",
  UNDER_REVIEW: "قيد المراجعة",
  PAID: "مدفوع",
  REJECTED: "مرفوض",
};

const money = (value: number) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(value);

const dateTime = (date: Date) =>
  new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Cairo",
  }).format(date);

function StatePill({
  value,
  kind,
}: {
  value: string;
  kind: "payment" | "order";
}) {
  const success = ["PAID", "DELIVERED", "CONFIRMED"].includes(value);
  const danger = ["REJECTED", "CANCELLED"].includes(value);
  const label = kind === "payment" ? paymentLabels[value] : statusLabels[value];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        success
          ? "bg-emerald-50 text-emerald-700"
          : danger
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700"
      }`}
    >
      {label ?? value}
    </span>
  );
}

export default async function AdminPage() {
  const admin = await requireAdmin();

  const [
    productCount,
    activeProductCount,
    orderCount,
    pendingCount,
    underReviewCount,
    processingCount,
    shippedCount,
    lowStockCount,
    outOfStockCount,
    paidOrders,
    recentOrders,
    bestSelling,
    lowStockProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({
      where: {
        paymentStatus: { in: ["PENDING", "UNDER_REVIEW"] },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.order.count({
      where: {
        paymentStatus: "UNDER_REVIEW",
        status: { not: "CANCELLED" },
      },
    }),
    prisma.order.count({ where: { status: "PROCESSING" } }),
    prisma.order.count({ where: { status: "SHIPPED" } }),
    prisma.product.count({
      where: { isActive: true, stock: { gt: 0, lte: 5 } },
    }),
    prisma.product.count({
      where: { isActive: true, stock: { lte: 0 } },
    }),
    prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
      _count: { id: true },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      where: {
        order: {
          paymentStatus: "PAID",
          status: { not: "CANCELLED" },
        },
      },
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: 5 } },
      select: { id: true, nameAr: true, stock: true },
      orderBy: { stock: "asc" },
      take: 5,
    }),
  ]);

  const stats = [
    {
      label: "إجمالي المنتجات",
      value: productCount.toLocaleString("ar-EG"),
      icon: Package,
      description: `${activeProductCount.toLocaleString("ar-EG")} منتج نشط`,
    },
    {
      label: "إجمالي الطلبات",
      value: orderCount.toLocaleString("ar-EG"),
      icon: ShoppingBag,
      description: "كل الطلبات المسجلة",
    },
    {
      label: "بانتظار الدفع أو المراجعة",
      value: pendingCount.toLocaleString("ar-EG"),
      icon: Clock3,
      description: `${underReviewCount.toLocaleString("ar-EG")} تحويل تحت المراجعة`,
    },
    {
      label: "المبيعات المحصّلة",
      value: money(Number(paidOrders._sum.total ?? 0)),
      icon: Wallet,
      description: `${paidOrders._count.id.toLocaleString("ar-EG")} طلب مدفوع غير ملغي`,
    },
  ];

  const operations = [
    { label: "تحويلات للمراجعة", value: underReviewCount, icon: CreditCard, href: "/admin/orders" },
    { label: "جاري التجهيز", value: processingCount, icon: PackageCheck, href: "/admin/orders" },
    { label: "تم الشحن", value: shippedCount, icon: Truck, href: "/admin/orders" },
    { label: "مخزون منخفض", value: lowStockCount, icon: AlertTriangle, href: "/admin/products" },
  ];

  return (
    <main dir="rtl" className="mx-auto max-w-[1400px] space-y-7 pb-12 sm:space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#a66d36]">WASAMA PERFUME</p>
          <h1 className="mt-2 text-2xl font-extrabold text-[#171411] sm:text-3xl">
            أهلاً بيك في لوحة التحكم
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            تابع المبيعات والطلبات والمخزون من مكان واحد.
          </p>
          <p dir="ltr" className="mt-2 text-right text-xs text-neutral-400">
            {admin.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      <section aria-label="إحصائيات المتجر" className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7efe4] text-[#a66d36]">
                <Icon size={20} />
              </div>
              <p className="mt-5 text-xs leading-5 text-neutral-500 sm:text-sm">{stat.label}</p>
              <p className="mt-2 break-words text-lg font-extrabold text-[#171411] sm:text-2xl">{stat.value}</p>
              <p className="mt-2 text-xs text-neutral-400">{stat.description}</p>
            </div>
          );
        })}
      </section>

      <section aria-label="متابعة التشغيل" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {operations.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="flex min-w-0 items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 transition hover:border-[#d8b78e] hover:shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff6eb] text-[#a66d36]">
                <Icon size={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-xl font-extrabold text-[#171411]">{item.value.toLocaleString("ar-EG")}</span>
                <span className="block text-xs leading-5 text-neutral-500">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </section>

      {(outOfStockCount > 0 || lowStockCount > 0) && (
        <Link href="/admin/products" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 transition hover:bg-amber-100">
          <div className="flex items-center gap-3">
            <AlertTriangle className="shrink-0 text-amber-700" size={22} />
            <div>
              <p className="font-extrabold text-amber-950">تنبيه المخزون</p>
              <p className="mt-1 text-sm text-amber-800">
                {outOfStockCount.toLocaleString("ar-EG")} منتج نفد من المخزون، و{lowStockCount.toLocaleString("ar-EG")} منتج متبقي منه 1 إلى 5 قطع.
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-sm font-bold text-amber-900">
            إدارة المنتجات <ArrowUpLeft size={17} />
          </span>
        </Link>
      )}

      <section className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-[#171411]">إجراءات سريعة</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link href="/admin/products/new" className="flex min-h-14 items-center justify-between rounded-xl bg-[#171411] px-4 font-bold text-white transition hover:bg-[#352b23]">
            <span className="flex items-center gap-2"><Plus size={19} className="text-[#d5a86e]" />إضافة منتج</span>
            <ArrowUpLeft size={17} />
          </Link>
          <Link href="/admin/orders" className="flex min-h-14 items-center justify-between rounded-xl border border-[#e5d8c8] bg-[#fffaf3] px-4 font-bold transition hover:bg-[#f7efe4]">
            <span className="flex items-center gap-2"><ShoppingBag size={19} className="text-[#a66d36]" />إدارة الطلبات</span>
            <ArrowUpLeft size={17} />
          </Link>
          <Link href="/admin/shipping" className="flex min-h-14 items-center justify-between rounded-xl border border-[#e5d8c8] bg-[#fffaf3] px-4 font-bold transition hover:bg-[#f7efe4]">
            <span className="flex items-center gap-2"><Truck size={19} className="text-[#a66d36]" />أسعار الشحن</span>
            <ArrowUpLeft size={17} />
          </Link>
          <Link href="/admin/categories" className="flex min-h-14 items-center justify-between rounded-xl border border-[#e5d8c8] bg-[#fffaf3] px-4 font-bold transition hover:bg-[#f7efe4]">
            <span className="flex items-center gap-2"><Tags size={19} className="text-[#a66d36]" />التصنيفات</span>
            <ArrowUpLeft size={17} />
          </Link>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-black/5 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-black/5 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-extrabold">أحدث الطلبات</h2>
              <p className="mt-1 text-xs text-neutral-500">آخر 6 طلبات مسجلة</p>
            </div>
            <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-bold text-[#a66d36] hover:underline">
              عرض الكل <ArrowLeft size={16} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <Inbox size={32} className="text-[#a66d36]" />
              <p className="mt-4 font-bold">لا توجد طلبات حاليًا</p>
              <p className="mt-2 text-sm text-neutral-500">الطلبات الجديدة هتظهر هنا تلقائيًا.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-right text-sm">
                <thead className="bg-[#fcfaf7] text-xs text-neutral-500">
                  <tr>
                    <th className="px-5 py-3 font-bold">رقم الطلب</th>
                    <th className="px-5 py-3 font-bold">العميل</th>
                    <th className="px-5 py-3 font-bold">الإجمالي</th>
                    <th className="px-5 py-3 font-bold">الدفع</th>
                    <th className="px-5 py-3 font-bold">الطلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-[#fffaf3]">
                      <td className="px-5 py-4">
                        <p dir="ltr" className="text-right font-extrabold">#{order.orderNumber}</p>
                        <p className="mt-1 whitespace-nowrap text-xs text-neutral-400">{dateTime(order.createdAt)}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold">{order.customerName}</td>
                      <td className="whitespace-nowrap px-5 py-4 font-bold">{money(Number(order.total))}</td>
                      <td className="px-5 py-4"><StatePill value={order.paymentStatus} kind="payment" /></td>
                      <td className="px-5 py-4"><StatePill value={order.status} kind="order" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-black/5 px-5 py-3 text-xs text-neutral-500">
                لإدارة أي طلب افتح <Link href="/admin/orders" className="font-bold text-[#a66d36] underline">صفحة الطلبات</Link>.
              </div>
            </div>
          )}
        </section>

        <div className="min-w-0 space-y-5">
          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white">
            <div className="flex items-center gap-2 border-b border-black/5 p-5">
              <ChartNoAxesCombined size={19} className="text-[#a66d36]" />
              <div>
                <h2 className="text-lg font-extrabold">الأكثر مبيعًا</h2>
                <p className="mt-1 text-xs text-neutral-500">حسب كميات الطلبات المدفوعة غير الملغاة</p>
              </div>
            </div>
            {bestSelling.length === 0 ? (
              <p className="p-8 text-center text-sm text-neutral-500">لا توجد مبيعات مدفوعة حتى الآن.</p>
            ) : (
              <div className="divide-y divide-black/5">
                {bestSelling.map((item, index) => (
                  <div key={`${item.productId}-${item.productName}`} className="flex items-center gap-3 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f7efe4] font-extrabold text-[#a66d36]">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{item.productName}</p>
                      <p className="mt-1 text-xs text-neutral-500">{money(Number(item._sum.total ?? 0))}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold">{(item._sum.quantity ?? 0).toLocaleString("ar-EG")}</p>
                      <p className="text-xs text-neutral-500">قطعة</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white">
            <div className="flex items-center justify-between border-b border-black/5 p-5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={19} className="text-[#a66d36]" />
                <h2 className="text-lg font-extrabold">منتجات تحتاج مخزون</h2>
              </div>
              <Link href="/admin/products" className="text-xs font-bold text-[#a66d36] hover:underline">المنتجات</Link>
            </div>
            {lowStockProducts.length === 0 ? (
              <p className="p-7 text-center text-sm text-neutral-500">لا توجد منتجات نشطة بمخزون منخفض.</p>
            ) : (
              <div className="divide-y divide-black/5">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <p className="min-w-0 truncate text-sm font-bold">{product.nameAr}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${product.stock <= 0 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                      {product.stock <= 0 ? "نفد" : `${product.stock.toLocaleString("ar-EG")} متبقي`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
