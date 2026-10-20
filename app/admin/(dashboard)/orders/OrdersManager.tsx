"use client";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Eye,
  X,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  LoaderCircle,
  CheckCircle2,
  Clock3,
  Package,
  Printer,
} from "lucide-react";
import { updatePaymentStatus, updateOrderStatus, requestOrderRefund, completeOrderRefund } from "./actions";
type OrderItem = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};
type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  alternatePhone: string | null;
  governorate: string;
  city: string;
  address: string;
  notes: string | null;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  itemCount: number;
  refundStatus: "NONE" | "PENDING" | "COMPLETED";
  refundNote: string | null;
  stockDeductedAt: string | null;
  stockRestoredAt: string | null;
  items: OrderItem[];
};
type Props = {
  orders: Order[];
};
const paymentLabels: Record<string, string> = {
  PENDING: "في انتظار الدفع",
  UNDER_REVIEW: "تحت المراجعة",
  PAID: "تم استلام الدفع",
  REJECTED: "الدفع مرفوض",
};
const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "بانتظار الدفع",
  CONFIRMED: "تم التأكيد",
  PROCESSING: "جاري التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};
const paymentOptions = [
  { value: "PENDING", label: "في انتظار الدفع" },
  { value: "UNDER_REVIEW", label: "تحت المراجعة" },
  { value: "PAID", label: "تم استلام الدفع" },
  { value: "REJECTED", label: "الدفع مرفوض" },
] as const;
const orderOptions = [
  { value: "PENDING_PAYMENT", label: "بانتظار الدفع" },
  { value: "CONFIRMED", label: "تم التأكيد" },
  { value: "PROCESSING", label: "جاري التجهيز" },
  { value: "SHIPPED", label: "تم الشحن" },
  { value: "DELIVERED", label: "تم التسليم" },
  { value: "CANCELLED", label: "ملغي" },
] as const;
const money = (value: number) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(value);
const dateFormat = (value: string) =>
  new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
function StatusBadge({ value, payment = false }: { value: string; payment?: boolean }) {
  const positive = payment ? value === "PAID" : value === "DELIVERED" || value === "CONFIRMED";
  const negative = value === "REJECTED" || value === "CANCELLED";
  const className = positive
    ? "bg-green-50 text-green-700"
    : negative
      ? "bg-red-50 text-red-700"
      : "bg-amber-50 text-amber-800";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {payment ? (paymentLabels[value] ?? value) : (statusLabels[value] ?? value)}
    </span>
  );
}
function OrderDetails({ order, onClose }: { order: Order; onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [verified, setVerified] = useState(false);
  const [refundNote, setRefundNote] = useState(order.refundNote ?? "");
  const [moneyReturned, setMoneyReturned] = useState(false);
  const savePayment = () => {
    setError("");
    setMessage("");
    if (paymentStatus === "PAID" && order.paymentStatus !== "PAID" && !verified) {
      setError("لازم تؤكد إنك راجعت التحويل وتأكدت من وصول المبلغ كاملًا.");
      return;
    }
    startTransition(async () => {
      try {
        const result = await updatePaymentStatus(
          order.id,
          paymentStatus as "PENDING" | "UNDER_REVIEW" | "PAID" | "REJECTED",
        );
        if (!result.success) {
          setError(result.error ?? "تعذر حفظ الدفع.");
          return;
        }
        setMessage("تم تحديث حالة الدفع بنجاح.");
        router.refresh();
      } catch {
        setError("حصل خطأ أثناء حفظ الدفع.");
      }
    });
  };
  const saveOrder = () => {
    setError("");
    setMessage("");
    startTransition(async () => {
      try {
        const result = await updateOrderStatus(
          order.id,
          orderStatus as "PENDING_PAYMENT" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
        );
        if (!result.success) {
          setError(result.error ?? "تعذر حفظ الطلب.");
          return;
        }
        setMessage("تم تحديث حالة الطلب بنجاح.");
        router.refresh();
      } catch {
        setError("حصل خطأ أثناء تحديث الطلب.");
      }
    });
  };
  const requestRefund = () => {
    setError(""); setMessage("");
    if (!refundNote.trim()) { setError("اكتب سبب الاسترداد."); return; }
    startTransition(async () => {
      try {
        const result = await requestOrderRefund(order.id, refundNote);
        if (!result.success) { setError(result.error ?? "تعذر طلب الاسترداد."); return; }
        setMessage("تم تسجيل طلب الاسترداد. لا ترجع المخزون قبل رد المبلغ فعليًا."); router.refresh();
      } catch { setError("حصل خطأ أثناء تسجيل الاسترداد."); }
    });
  };

  const completeRefund = () => {
    setError(""); setMessage("");
    if (!moneyReturned) { setError("أكد أولًا إن المبلغ رجع للعميل بالفعل."); return; }
    startTransition(async () => {
      try {
        const result = await completeOrderRefund(order.id, moneyReturned);
        if (!result.success) { setError(result.error ?? "تعذر إتمام الاسترداد."); return; }
        setMessage("تم تسجيل الاسترداد وإرجاع المخزون وإلغاء الطلب."); router.refresh();
      } catch { setError("حصل خطأ أثناء تأكيد الاسترداد."); }
    });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-3 sm:p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`تفاصيل الطلب ${order.orderNumber}`}
        dir="rtl"
        className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">طلب #{order.orderNumber}</h2>
            <p className="mt-1 text-xs text-neutral-500">{dateFormat(order.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 hover:bg-neutral-100"
            aria-label="إغلاق التفاصيل"
          >
            <X size={21} />
          </button>
        </div>
        {/* Customer */}
        <section className="mt-6 rounded-xl bg-[#faf9f7] p-4">
          <h3 className="mb-4 font-extrabold">بيانات العميل</h3>
          <div className="space-y-3 text-sm">
            <p>
              <strong>الاسم:</strong> {order.customerName}
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <Phone size={15} />
              <strong>الهاتف:</strong>
              <span dir="ltr">{order.phone}</span>
            </p>
            {order.alternatePhone && (
              <p>
                <strong>هاتف إضافي:</strong> <span dir="ltr">{order.alternatePhone}</span>
              </p>
            )}
            <p className="flex items-start gap-2">
              <MapPin size={16} className="shrink-0" />
              {order.governorate} - {order.city} - {order.address}
            </p>
            {order.notes && (
              <p>
                <strong>ملاحظات:</strong> {order.notes}
              </p>
            )}
          </div>
        </section>
        {/* Ordered Products */}
        <section className="mt-4 rounded-xl border border-neutral-200 p-4">
          <h3 className="mb-4 flex items-center gap-2 font-extrabold">
            <Package size={18} />
            المنتجات المطلوبة
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-xl bg-[#faf9f7] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{item.productName}</p>
                    <p className="mt-1 text-xs text-neutral-500">كود المنتج: {item.productSlug}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-600">
                      <span>
                        الكمية: <strong>{item.quantity}</strong>
                      </span>
                      <span>
                        سعر القطعة: <strong>{money(item.unitPrice)}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-neutral-500">الإجمالي</p>
                    <p className="mt-1 font-extrabold text-[#a66d36]">{money(item.total)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Totals */}
        <section className="mt-4 rounded-xl border border-neutral-200 p-4">
          <h3 className="mb-4 font-extrabold">ملخص الفاتورة</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>عدد الأصناف</span>
              <strong>{order.itemCount}</strong>
            </div>
            <div className="flex justify-between">
              <span>قيمة المنتجات</span>
              <strong>{money(order.subtotal)}</strong>
            </div>
            <div className="flex justify-between">
              <span>الشحن</span>
              <strong>{money(order.shippingFee)}</strong>
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-extrabold">
              <span>الإجمالي</span>
              <span>{money(order.total)}</span>
            </div>
          </div>
        </section>
        {/* Printable invoice */}
        <Link
          href={`/admin/orders/${order.id}/invoice`}
          target="\_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#a66d36] bg-[#fffaf3] px-4 font-bold text-[#a66d36] transition hover:bg-[#f3e8d8]"
        >
          <Printer size={18} />
          عرض وطباعة فاتورة الطلب
        </Link>
        <Link
          href={`/admin/orders/${order.id}/shipping-label`}
          target="\_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#a66d36] px-4 text-sm font-extrabold text-white transition hover:bg-[#8c5729]"
        >
          <Truck size={18} />
          عرض بوليصة الشحن
        </Link>
        {/* Payment */}
        <section className="mt-4 rounded-xl border border-neutral-200 p-4">
          <h3 className="mb-4 flex items-center gap-2 font-extrabold">
            <CreditCard size={18} />
            إدارة الدفع
          </h3>
          <p className="mb-3 text-sm">
            <strong>طريقة الدفع:</strong>{" "}
            {order.paymentMethod === "VODAFONE_CASH"
              ? "Vodafone Cash"
              : order.paymentMethod === "INSTAPAY"
                ? "InstaPay"
                : order.paymentMethod}
          </p>
          <p className="mb-3">
            <StatusBadge value={order.paymentStatus} payment />
          </p>
          <label className="block text-sm font-bold">
            حالة الدفع
            <select
              value={paymentStatus}
              disabled={pending}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setVerified(false);
              }}
              className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3"
            >
              {paymentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {paymentStatus === "PAID" && order.paymentStatus !== "PAID" && (
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-900">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="mt-1 h-5 w-5 accent-[#a66d36]"
              />
              راجعت التحويل بنفسي وتأكدت إن المبلغ كاملًا شامل الشحن وصل بالفعل لحساب المتجر.
            </label>
          )}
          <button
            type="button"
            disabled={pending || paymentStatus === order.paymentStatus}
            onClick={savePayment}
            className="mt-4 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#171411] px-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending && <LoaderCircle size={16} className="animate-spin" />}
            حفظ حالة الدفع
          </button>
        </section>
        {/* Shipping and order */}
        <section className="mt-4 rounded-xl border border-neutral-200 p-4">
          <h3 className="mb-4 flex items-center gap-2 font-extrabold">
            <Truck size={18} />
            حالة الطلب والشحن
          </h3>
          <p className="mb-3">
            <StatusBadge value={order.status} />
          </p>
          <label className="block text-sm font-bold">
            حالة الطلب
            <select
              value={orderStatus}
              disabled={pending}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3"
            >
              {orderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-3 text-xs leading-6 text-neutral-500">
            التسلسل: انتظار الدفع ← تأكيد ← تجهيز ← شحن ← تسليم. لا يمكن تأكيد الطلب قبل استلام الدفع.
          </p>
          <button
            type="button"
            disabled={pending || orderStatus === order.status}
            onClick={saveOrder}
            className="mt-4 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#a66d36] px-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending && <LoaderCircle size={16} className="animate-spin" />}
            حفظ حالة الطلب
          </button>
        </section>

        {/* Refund management: only before shipping */}
        {order.paymentStatus === "PAID" && (
          <section className="mt-4 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
            <h3 className="mb-3 font-extrabold">إدارة الاسترداد والمخزون</h3>
            <p className="mb-3 text-sm">حالة الاسترداد: <strong>{order.refundStatus === "COMPLETED" ? "مكتمل" : order.refundStatus === "PENDING" ? "بانتظار إعادة المبلغ" : "لا يوجد استرداد"}</strong></p>
            {order.refundStatus === "COMPLETED" && <p className="text-sm text-green-800">تم تسجيل إعادة المبلغ وإرجاع المخزون مرة واحدة.</p>}
            {(!order.refundStatus || order.refundStatus === "NONE") && !["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.status) && (
              <>
                <label className="block text-sm font-bold">سبب الاسترداد
                  <textarea value={refundNote} onChange={(e) => setRefundNote(e.target.value)} maxLength={2000} rows={3} disabled={pending} className="mt-2 w-full rounded-xl border border-neutral-200 bg-white p-3" placeholder="اكتب سبب طلب الاسترداد..." />
                </label>
                <button type="button" disabled={pending || !refundNote.trim()} onClick={requestRefund} className="mt-3 min-h-11 w-full rounded-xl bg-amber-700 px-4 font-bold text-white disabled:opacity-50">طلب استرداد المبلغ</button>
              </>
            )}
            {order.refundStatus === "PENDING" && (
              <>
                <p className="mb-3 text-sm text-amber-900">سبب الاسترداد: {order.refundNote}</p>
                <label className="flex items-start gap-3 text-sm font-bold text-amber-950">
                  <input type="checkbox" checked={moneyReturned} onChange={(e) => setMoneyReturned(e.target.checked)} disabled={pending} className="mt-1 h-5 w-5" />
                  أؤكد أنني أعدت المبلغ كاملًا للعميل فعليًا خارج الموقع.
                </label>
                <button type="button" disabled={pending || !moneyReturned} onClick={completeRefund} className="mt-3 min-h-11 w-full rounded-xl bg-[#171411] px-4 font-bold text-white disabled:opacity-50">تأكيد الاسترداد وإرجاع المخزون وإلغاء الطلب</button>
              </>
            )}
            {order.stockDeductedAt == null && order.refundStatus !== "COMPLETED" && <p className="mt-3 text-xs text-red-700">لو ده طلب قديم، راجع سجل المخزون قبل الاسترداد.</p>}
          </section>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
export default function OrdersManager({ orders }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = orders.find((order) => order.id === selectedId);
  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const text = [order.orderNumber, order.customerName, order.phone, order.governorate].join(" ").toLowerCase();
      const matchesSearch = text.includes(search.trim().toLowerCase());
      const matchesFilter = filter === "ALL" || order.status === filter || order.paymentStatus === filter;
      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);
  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
  const pendingOrders = orders.filter(
    (order) => order.paymentStatus === "PENDING" || order.paymentStatus === "UNDER_REVIEW",
  );
  const revenue = paidOrders
    .filter((order) => order.status !== "CANCELLED" && order.refundStatus !== "COMPLETED")
    .reduce((sum, order) => sum + order.total, 0);
  const stats = [
    {
      title: "إجمالي الطلبات",
      value: String(orders.length),
      icon: ShoppingBag,
    },
    {
      title: "بانتظار الدفع أو المراجعة",
      value: String(pendingOrders.length),
      icon: Clock3,
    },
    {
      title: "الطلبات المدفوعة",
      value: String(paidOrders.length),
      icon: CheckCircle2,
    },
    {
      title: "قيمة الطلبات المدفوعة غير الملغاة",
      value: money(revenue),
      icon: Package,
    },
  ];
  return (
    <main dir="rtl" className="space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
          <ShoppingBag className="text-[#a66d36]" />
          إدارة الطلبات
        </h1>
        <p className="mt-2 text-sm text-neutral-500">متابعة الطلبات والتحويلات وحالات الشحن</p>
      </div>
      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="rounded-2xl border border-black/5 bg-white p-5">
              <Icon size={21} className="text-[#a66d36]" />
              <p className="mt-3 text-xs text-neutral-500">{stat.title}</p>
              <p className="mt-2 text-xl font-extrabold">{stat.value}</p>
            </div>
          );
        })}
      </div>
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={19} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="رقم الطلب، اسم العميل، الهاتف..."
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white pr-12 pl-4 outline-none focus:border-[#a66d36]"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none sm:min-w-52"
        >
          <option value="ALL">كل الطلبات</option>
          <option value="PENDING_PAYMENT">بانتظار الدفع</option>
          <option value="UNDER_REVIEW">مراجعة الدفع</option>
          <option value="PAID">مدفوع</option>
          <option value="CONFIRMED">مؤكد</option>
          <option value="PROCESSING">جاري التجهيز</option>
          <option value="SHIPPED">تم الشحن</option>
          <option value="DELIVERED">تم التسليم</option>
          <option value="CANCELLED">ملغي</option>
        </select>
      </div>
      {/* Orders */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <article key={order.id} className="rounded-2xl border border-black/5 bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-extrabold">طلب #{order.orderNumber}</h2>
                <p className="mt-1 text-sm text-neutral-600">{order.customerName}</p>
                <p className="mt-1 text-xs text-neutral-400">{dateFormat(order.createdAt)}</p>
              </div>
              <strong className="text-lg">{money(order.total)}</strong>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge value={order.paymentStatus} payment />
              <StatusBadge value={order.status} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
              <p className="text-xs text-neutral-500">
                {order.governorate} · {order.itemCount} صنف
              </p>
              <button
                type="button"
                onClick={() => setSelectedId(order.id)}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#171411] px-5 text-sm font-bold text-white transition hover:bg-[#352b23]"
              >
                <Eye size={17} />
                عرض التفاصيل
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center">
            <ShoppingBag size={32} className="mx-auto text-neutral-400" />
            <p className="mt-3 text-sm text-neutral-500">مفيش طلبات مطابقة للبحث.</p>
          </div>
        )}
      </div>
      {selected && (
        <OrderDetails
          key={`${selected.id}-${selected.paymentStatus}-${selected.status}-${selected.refundStatus ?? "NONE"}`}
          order={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
    </main>
  );
}
