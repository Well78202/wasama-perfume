"use client";

import Link from "next/link";

import { useEffect, useState, type FormEvent } from "react";

import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  ExternalLink,
  Loader2,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";

import { getCart, clearCart, type CartItem } from "@/lib/cart";

import { formatEGP } from "@/lib/checkout-config";

import { GOVERNORATES } from "@/lib/governorates";

import type { Locale } from "@/lib/translations";

type CartProduct = {
  slug: string;

  nameAr: string;

  nameEn: string;

  price: number;

  stock: number;

  image: string;
};

type ShippingRate = {
  code: string;

  nameAr: string;

  nameEn: string;

  price: number;
};

type PublicPaymentSettings = {
  whatsapp: string;
  vodafoneCashNumber: string;
  instapayAddress: string;
  vodafoneCashEnabled: boolean;
  instapayEnabled: boolean;
  paymentInstructions: string;
};

const emptyPaymentSettings: PublicPaymentSettings = {
  whatsapp: "",
  vodafoneCashNumber: "",
  instapayAddress: "",
  vodafoneCashEnabled: false,
  instapayEnabled: false,
  paymentInstructions: "",
};

type CheckoutForm = {
  customerName: string;

  phone: string;

  alternatePhone: string;

  governorate: string;

  city: string;

  address: string;

  notes: string;

  paymentMethod: "VODAFONE_CASH" | "INSTAPAY";
};

type CreatedOrder = {
  orderNumber: string;

  total: number;

  whatsappUrl: string;
};

const initialForm: CheckoutForm = {
  customerName: "",
  phone: "",
  alternatePhone: "",
  governorate: "",

  city: "",
  address: "",
  notes: "",
  paymentMethod: "VODAFONE_CASH",
};

const inputClass =
  "w-full min-h-12 rounded-xl border border-[#e7d9c8] bg-white px-4 py-3 text-sm text-[#171411] outline-none transition placeholder:text-neutral-400 focus:border-[#a66d36] focus:ring-2 focus:ring-[#a66d36]/15 disabled:opacity-60";

const labelClass = "mb-2 block text-sm font-semibold text-[#33291f]";

const CHECKOUT_SESSION_KEY = "wasama-checkout-attempt";

const cardClass = "rounded-2xl border border-[#e7d9c8] bg-white p-5 shadow-sm sm:p-7";

export default function CheckoutPageContent({ locale }: { locale: Locale }) {
  const ar = locale === "ar";

  const prefix = ar ? "" : "/en";

  const [items, setItems] = useState<CartItem[]>([]);

  const [products, setProducts] = useState<CartProduct[]>([]);

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PublicPaymentSettings>(emptyPaymentSettings);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);

  const [form, setForm] = useState<CheckoutForm>(initialForm);

  const [accepted, setAccepted] = useState(false);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cart = getCart();

        if (!cart.length) {
          if (!cancelled) {
            setItems([]);
            setLoading(false);
          }

          return;
        }

        const [productsResponse, shippingResponse, settingsResponse] = await Promise.all([
          fetch("/api/cart/products", {
            method: "POST",

            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({ slugs: cart.map((item) => item.slug) }),

            cache: "no-store",
          }),

          fetch("/api/shipping", { cache: "no-store" }),
          fetch("/api/store-settings", { cache: "no-store" }),
        ]);

        if (!productsResponse.ok || !shippingResponse.ok || !settingsResponse.ok) throw new Error("load");

        const productData: { products: CartProduct[] } = await productsResponse.json();

        const shippingData: { rates: ShippingRate[] } = await shippingResponse.json();
        const settingsData: PublicPaymentSettings = await settingsResponse.json();

        if (!cancelled) {
          setItems(cart);

          setProducts(productData.products);

          setRates(shippingData.rates);
          setPaymentSettings(settingsData);
          const firstMethod =
            settingsData.vodafoneCashEnabled && settingsData.vodafoneCashNumber
              ? "VODAFONE_CASH"
              : settingsData.instapayEnabled && settingsData.instapayAddress
                ? "INSTAPAY"
                : null;
          if (firstMethod) setForm((previous) => ({ ...previous, paymentMethod: firstMethod }));
        }
      } catch {
        if (!cancelled)
          setError(
            ar
              ? "تعذر تحميل بيانات المنتجات أو الشحن. حدّث الصفحة وحاول مرة أخرى."
              : "Could not load products or shipping. Refresh and try again.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [ar]);

  function update<K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));

    if (error) setError("");
  }

  const rows = items.map((item) => ({
    ...item,

    product: products.find((product) => product.slug === item.slug),
  }));

  const subtotal = rows.reduce((sum, row) => sum + (row.product?.price ?? 0) * row.quantity, 0);

  const selectedRate = rates.find((rate) => rate.code === form.governorate);

  const shipping = selectedRate?.price ?? 0;

  const total = subtotal + shipping;

  const cartValid =
    rows.length > 0 && rows.every((row) => row.product && row.quantity > 0 && row.product.stock >= row.quantity);

  const availableMethods: CheckoutForm["paymentMethod"][] = [
    ...(paymentSettings.vodafoneCashEnabled && paymentSettings.vodafoneCashNumber.trim()
      ? (["VODAFONE_CASH"] as const)
      : []),
    ...(paymentSettings.instapayEnabled && paymentSettings.instapayAddress.trim() ? (["INSTAPAY"] as const) : []),
  ];

  const paymentDestination =
    form.paymentMethod === "VODAFONE_CASH" ? paymentSettings.vodafoneCashNumber : paymentSettings.instapayAddress;

  const paymentAvailable =
    form.paymentMethod === "VODAFONE_CASH"
      ? paymentSettings.vodafoneCashEnabled && Boolean(paymentSettings.vodafoneCashNumber.trim())
      : paymentSettings.instapayEnabled && Boolean(paymentSettings.instapayAddress.trim());

  const mobilePattern = /^01[0125][0-9]{8}$/;

  const phoneValid =
    mobilePattern.test(form.phone.trim()) &&
    (!form.alternatePhone.trim() || mobilePattern.test(form.alternatePhone.trim()));

  const detailsValid =
    form.customerName.trim().length >= 3 && form.city.trim().length >= 2 && form.address.trim().length >= 10;

  const canSubmit =
    !submitting &&
    cartValid &&
    Boolean(selectedRate) &&
    phoneValid &&
    detailsValid &&
    accepted &&
    paymentAvailable &&
    Boolean(paymentSettings.whatsapp.trim());

  async function copyPayment() {
    try {
      await navigator.clipboard.writeText(paymentDestination);

      setCopied(true);
    } catch {
      setError(
        ar
          ? "تعذر النسخ تلقائيًا. انسخ بيانات التحويل يدويًا."
          : "Could not copy. Please copy the payment details manually.",
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || createdOrder) return;

    if (!cartValid || !selectedRate) {
      setError(
        ar ? "راجع المنتجات واختر محافظة متاح لها شحن." : "Review your cart and select a supported governorate.",
      );

      return;
    }

    if (!paymentAvailable || !paymentSettings.whatsapp.trim()) {
      setError(
        ar
          ? "لا توجد طريقة دفع متاحة حاليًا. تواصل مع خدمة العملاء."
          : "Payment is currently unavailable. Please contact support.",
      );
      return;
    }
    if (!phoneValid || !detailsValid || !accepted) {
      setError(
        ar
          ? "راجع الاسم وأرقام الهاتف والعنوان، ووافق على شروط تسجيل الطلب."
          : "Check your name, phone numbers, address and order consent.",
      );

      return;
    }

    setSubmitting(true);

    setError("");

    try {
      const payload = {
        ...form,

        customerName: form.customerName.trim(),

        phone: form.phone.trim(),

        alternatePhone: form.alternatePhone.trim(),

        city: form.city.trim(),

        address: form.address.trim(),

        notes: form.notes.trim(),

        items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })),
      };

      const fingerprint = JSON.stringify(payload);

      let attempt: { key: string; fingerprint: string } | null = null;

      try {
        const saved = sessionStorage.getItem(CHECKOUT_SESSION_KEY);

        if (saved) attempt = JSON.parse(saved);
      } catch {
        /* Ignore invalid or unavailable session storage. */
      }

      if (!attempt || attempt.fingerprint !== fingerprint || !/^[0-9a-f-]{36}$/i.test(attempt.key)) {
        attempt = { key: crypto.randomUUID(), fingerprint };

        try {
          sessionStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(attempt));
        } catch {
          /* Session storage optional. */
        }
      }

      const response = await fetch("/api/orders", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ ...payload, checkoutKey: attempt.key }),
      });

      const result: Partial<CreatedOrder> & { error?: string } = await response.json();

      if (!response.ok) throw new Error(result.error || "order_failed");

      if (!result.orderNumber || typeof result.total !== "number" || !result.whatsappUrl) {
        throw new Error("invalid_response");
      }

      setCreatedOrder({
        orderNumber: result.orderNumber,

        total: result.total,

        whatsappUrl: result.whatsappUrl,
      });

      try {
        sessionStorage.removeItem(CHECKOUT_SESSION_KEY);
      } catch {
        /* Ignore. */
      }

      clearCart();

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(
        ar
          ? "تعذر تأكيد نتيجة تسجيل الطلب. قبل المحاولة مرة ثانية، راجع رسائلك أو تواصل معنا لتجنب تكرار الطلب."
          : "We could not confirm whether your order was created. Please contact us before retrying to avoid duplicate orders.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <main className="min-h-[60vh] bg-[#fffaf3] px-5 py-24 text-center" aria-busy="true">
        <Loader2 className="mx-auto animate-spin text-[#a66d36]" />

        <p className="mt-4">{ar ? "جاري تجهيز الطلب..." : "Preparing checkout..."}</p>
      </main>
    );

  if (createdOrder)
    return (
      <main className="min-h-[70vh] bg-[#fffaf3] px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#e7d9c8] bg-white p-6 text-center shadow-sm sm:p-10">
          <ClipboardCheck size={54} className="mx-auto mb-5 text-[#a66d36]" />

          <h1 className="text-2xl font-extrabold text-[#171411]">
            {ar ? "تم تسجيل الطلب — في انتظار الدفع" : "Order created — awaiting payment"}
          </h1>

          <p className="mt-3 text-sm leading-7 text-neutral-600">
            {ar
              ? "تم تسجيل بيانات طلبك، لكنه غير مؤكد للشحن. حوّل المبلغ بالكامل ثم أرسل صورة التحويل على واتساب. الإدارة هتراجع وصول المبلغ قبل تأكيد الطلب."
              : "Your order has been recorded but is not confirmed for shipping. Transfer the full amount, then send your payment screenshot on WhatsApp. Our team will verify the transfer."}
          </p>

          <div className="my-7 rounded-2xl bg-[#fffaf3] p-5">
            <p className="text-xs text-neutral-500">{ar ? "رقم الطلب" : "Order number"}</p>

            <p className="mt-1 break-all text-xl font-extrabold tracking-wide text-[#171411]">
              {createdOrder.orderNumber}
            </p>

            <p className="mt-5 text-xs text-neutral-500">
              {ar ? "المبلغ المطلوب تحويله شامل الشحن" : "Total to transfer including shipping"}
            </p>

            <p className="mt-1 text-2xl font-extrabold text-[#a66d36]">{formatEGP(createdOrder.total, locale)}</p>

            <p className="mt-4 text-sm font-bold text-[#171411]">
              {form.paymentMethod === "VODAFONE_CASH" ? "Vodafone Cash" : "InstaPay"}
            </p>

            <p dir="ltr" className="mt-1 break-all text-base font-semibold text-[#171411]">
              {paymentDestination}
            </p>

            <button
              type="button"
              onClick={() => void copyPayment()}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#a66d36]"
            >
              {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}

              {copied ? (ar ? "تم النسخ" : "Copied") : ar ? "نسخ بيانات التحويل" : "Copy payment details"}
            </button>
          </div>

          {error && (
            <p role="alert" className="mb-4 text-sm text-red-700">
              {error}
            </p>
          )}

          <a
            href={createdOrder.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#171411] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a66d36]"
          >
            <ExternalLink size={18} />

            {ar ? "إرسال إثبات التحويل على واتساب" : "Send payment proof on WhatsApp"}
          </a>

          <p className="mt-4 text-xs leading-6 text-neutral-500">
            {ar
              ? "واتساب هيفتح برسالة فيها بيانات الطلب. أرفق صورة إيصال التحويل بنفسك؛ فتح الرابط وحده مش إثبات دفع."
              : "WhatsApp opens with a prepared order message. Attach your screenshot manually; opening the link is not proof of payment."}
          </p>

          <Link href={prefix || "/"} className="mt-7 inline-block text-sm font-semibold text-[#a66d36] underline">
            {ar ? "العودة للرئيسية" : "Back to home"}
          </Link>
        </div>
      </main>
    );

  if (items.length === 0 && !error)
    return (
      <main className="min-h-[60vh] bg-[#fffaf3] px-5 py-24 text-center">
        <h1 className="text-2xl font-bold">{ar ? "سلة التسوق فارغة" : "Your cart is empty"}</h1>

        <Link
          href={`${prefix}/products`}
          className="mt-6 inline-block rounded-xl bg-[#171411] px-7 py-3 font-semibold text-white"
        >
          {ar ? "تصفح العطور" : "Shop perfumes"}
        </Link>
      </main>
    );

  return (
    <main className="min-h-[75vh] bg-[#fffaf3] py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <div className="mb-9">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e7d9c8] bg-white px-4 py-2 text-xs font-semibold text-[#80603e]">
            <LockKeyhole size={15} /> {ar ? "إتمام الطلب بوضوح وخصوصية" : "Clear, privacy-conscious checkout"}
          </div>

          <h1 className="text-3xl font-extrabold text-[#171411] sm:text-4xl">{ar ? "إتمام الطلب" : "Checkout"}</h1>

          <p className="mt-3 text-sm leading-7 text-neutral-600">
            {ar
              ? "أدخل بيانات التوصيل، راجع الإجمالي شامل الشحن، وسجّل الطلب قبل تحويل المبلغ. لا يوجد دفع تلقائي على الموقع."
              : "Enter delivery details, review the full total, and create your order before transferring payment. No automatic charge occurs here."}
          </p>
        </div>

        <div className="mb-7 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: MapPin,
              arTitle: "1. بيانات التوصيل",
              enTitle: "1. Delivery details",
              arText: "لضمان وصول الطلب للعنوان الصحيح",
              enText: "For accurate delivery",
            },

            {
              icon: Wallet,
              arTitle: "2. تحويل المبلغ",
              enTitle: "2. Transfer payment",
              arText: "بعد تسجيل الطلب وبالقيمة النهائية",
              enText: "After order creation, for the final total",
            },

            {
              icon: ShieldCheck,
              arTitle: "3. مراجعة الدفع",
              enTitle: "3. Payment verification",
              arText: "تأكيد الطلب بعد مراجعة التحويل",
              enText: "Order confirmed after manual verification",
            },
          ].map((step) => (
            <div key={step.enTitle} className="flex items-start gap-3 rounded-2xl border border-[#e7d9c8] bg-white p-4">
              <step.icon size={21} className="mt-0.5 shrink-0 text-[#a66d36]" />

              <div>
                <p className="text-sm font-bold text-[#171411]">{ar ? step.arTitle : step.enTitle}</p>

                <p className="mt-1 text-xs leading-6 text-neutral-500">{ar ? step.arText : step.enText}</p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700"
          >
            <AlertCircle size={19} className="mt-1 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-7">
            <section className={cardClass} aria-labelledby="delivery-heading">
              <div className="mb-6 flex items-center gap-3">
                <Truck size={22} className="text-[#a66d36]" />

                <h2 id="delivery-heading" className="text-xl font-extrabold">
                  {ar ? "بيانات التوصيل" : "Delivery information"}
                </h2>
              </div>

              <p className="mb-6 text-xs leading-6 text-neutral-500">
                {ar
                  ? "الحقول المعلّمة بنجمة (*) مطلوبة. استخدم رقم موبايل متاح للتواصل مع شركة الشحن."
                  : "Fields marked (*) are required. Use a phone number that the courier can reach."}
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="customerName" className={labelClass}>
                    {ar ? "الاسم بالكامل" : "Full name"} *
                  </label>

                  <input
                    id="customerName"
                    name="customerName"
                    autoComplete="name"
                    required
                    minLength={3}
                    maxLength={100}
                    className={inputClass}
                    value={form.customerName}
                    onChange={(e) => update("customerName", e.target.value)}
                    placeholder={ar ? "الاسم الأول واسم العائلة" : "First and last name"}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    {ar ? "رقم الموبايل" : "Mobile number"} *
                  </label>

                  <input
                    id="phone"
                    name="tel"
                    autoComplete="tel-national"
                    required
                    type="tel"
                    dir="ltr"
                    inputMode="numeric"
                    pattern="01[0125][0-9]{8}"
                    maxLength={11}
                    placeholder="01xxxxxxxxx"
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />

                  <p className="mt-1 text-xs text-neutral-500">
                    {ar ? "11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015" : "11 digits starting with 010, 011, 012 or 015"}
                  </p>
                </div>

                <div>
                  <label htmlFor="alternatePhone" className={labelClass}>
                    {ar ? "رقم بديل (اختياري)" : "Alternative phone (optional)"}
                  </label>

                  <input
                    id="alternatePhone"
                    name="alternatePhone"
                    type="tel"
                    dir="ltr"
                    inputMode="numeric"
                    pattern="01[0125][0-9]{8}"
                    maxLength={11}
                    placeholder="01xxxxxxxxx"
                    className={inputClass}
                    value={form.alternatePhone}
                    onChange={(e) => update("alternatePhone", e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="governorate" className={labelClass}>
                    {ar ? "المحافظة" : "Governorate"} *
                  </label>

                  <select
                    id="governorate"
                    name="governorate"
                    required
                    className={inputClass}
                    value={form.governorate}
                    onChange={(e) => update("governorate", e.target.value)}
                  >
                    <option value="">{ar ? "اختر المحافظة" : "Select governorate"}</option>

                    {GOVERNORATES.map(([code, nameAr, nameEn]) => {
                      const available = rates.some((rate) => rate.code === code);

                      return (
                        <option key={code} value={code} disabled={!available}>
                          {ar ? nameAr : nameEn}
                          {available ? "" : ar ? " - غير متاح حاليًا" : " - Unavailable"}
                        </option>
                      );
                    })}
                  </select>

                  <p className="mt-1 text-xs text-neutral-500">
                    {ar ? "الشحن بيتحسب تلقائيًا حسب المحافظة" : "Shipping is calculated based on your governorate"}
                  </p>
                </div>

                <div>
                  <label htmlFor="city" className={labelClass}>
                    {ar ? "المدينة / المنطقة" : "City / Area"} *
                  </label>

                  <input
                    id="city"
                    name="address-level2"
                    autoComplete="address-level2"
                    required
                    minLength={2}
                    maxLength={100}
                    className={inputClass}
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    {ar ? "العنوان بالتفصيل" : "Full address"} *
                  </label>

                  <textarea
                    id="address"
                    name="street-address"
                    autoComplete="street-address"
                    required
                    minLength={10}
                    rows={3}
                    maxLength={500}
                    className={inputClass}
                    placeholder={
                      ar
                        ? "الشارع، رقم العمارة، الدور، الشقة، علامة مميزة..."
                        : "Street, building, floor, apartment, landmark..."
                    }
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="notes" className={labelClass}>
                    {ar ? "ملاحظات التوصيل (اختياري)" : "Delivery notes (optional)"}
                  </label>

                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    maxLength={1000}
                    className={inputClass}
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className={cardClass} aria-labelledby="payment-heading">
              <div className="mb-5 flex items-center gap-3">
                <Wallet size={22} className="text-[#a66d36]" />

                <h2 id="payment-heading" className="text-xl font-extrabold">
                  {ar ? "طريقة الدفع" : "Payment method"}
                </h2>
              </div>

              <div className="mb-5 rounded-xl border border-[#ead7bb] bg-[#fffaf3] p-4 text-sm leading-7 text-[#5f4934]">
                <strong>{ar ? "مهم قبل الدفع:" : "Before you pay:"}</strong>{" "}
                {ar
                  ? "الدفع مقدمًا بالكامل (ثمن المنتجات + الشحن)، ومفيش دفع عند الاستلام. سجّل الطلب الأول، وبعدها حوّل المبلغ النهائي اللي هيظهر مع رقم الطلب."
                  : "Full prepayment is required (products + shipping). Cash on delivery is not available. Create your order first, then transfer the exact total shown with your order number."}
              </div>

              {availableMethods.length === 0 && (
                <p
                  role="alert"
                  className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
                >
                  {ar ? "طرق الدفع غير متاحة حاليًا." : "Payment methods are currently unavailable."}
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["VODAFONE_CASH", "Vodafone Cash"],
                    ["INSTAPAY", "InstaPay"],
                  ] as const
                )
                  .filter(([value]) => availableMethods.includes(value))
                  .map(([value, label]) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${form.paymentMethod === value ? "border-[#a66d36] bg-[#fffaf3]" : "border-[#e7d9c8]"}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={value}
                        checked={form.paymentMethod === value}
                        onChange={() => {
                          update("paymentMethod", value);
                          setCopied(false);
                        }}
                        className="accent-[#a66d36]"
                      />

                      <span className="font-bold">{label}</span>
                    </label>
                  ))}
              </div>

              {paymentAvailable && (
                <div className="mt-5 rounded-xl bg-[#fffaf3] p-5">
                  <p className="mb-2 text-sm text-neutral-600">
                    {ar ? "بيانات التحويل للطريقة المختارة" : "Transfer destination"}
                  </p>

                  <p dir="ltr" className="break-all text-lg font-extrabold text-[#171411]">
                    {paymentDestination}
                  </p>

                  <button
                    type="button"
                    onClick={() => void copyPayment()}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#a66d36]"
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}

                    {copied ? (ar ? "تم النسخ" : "Copied") : ar ? "نسخ بيانات التحويل" : "Copy"}
                  </button>
                </div>
              )}
              {paymentSettings.paymentInstructions && (
                <p className="mt-4 whitespace-pre-wrap rounded-xl border border-[#ead7bb] bg-[#fffaf3] p-4 text-sm leading-7 text-[#5f4934]">
                  {paymentSettings.paymentInstructions}
                </p>
              )}

              <div className="mt-5 flex items-start gap-3 text-sm leading-7 text-neutral-600">
                <ShieldCheck size={20} className="mt-1 shrink-0 text-[#a66d36]" />

                <p>
                  {ar
                    ? "بعد التحويل افتح رابط واتساب من صفحة تأكيد تسجيل الطلب، وابعت صورة إيصال التحويل مع رقم الطلب. لا يتم تأكيد الدفع إلا بعد مراجعته يدويًا. لا تشارك رمز OTP أو الرقم السري لمحفظتك مع أي شخص."
                    : "After transferring, use the WhatsApp link on the order page and attach your payment screenshot with the order number. Payment is manually verified. Never share your wallet PIN or OTP."}
                </p>
              </div>
            </section>

            <section className={cardClass} aria-labelledby="privacy-heading">
              <div className="mb-3 flex items-center gap-3">
                <LockKeyhole size={21} className="text-[#a66d36]" />

                <h2 id="privacy-heading" className="text-lg font-extrabold">
                  {ar ? "الخصوصية ومراجعة البيانات" : "Privacy and review"}
                </h2>
              </div>

              <p className="mb-4 text-sm leading-7 text-neutral-600">
                {ar
                  ? "هنستخدم الاسم ورقم الهاتف والعنوان لمعالجة الطلب والتواصل بشأن التوصيل. الدفع بيتم خارج الموقع، ومش بنطلب بيانات بطاقة بنكية أو كلمة مرور."
                  : "We use your name, phone number and address to process your order and arrange delivery. Payment happens outside the website; we do not request card details or passwords."}
              </p>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e7d9c8] bg-[#fffaf3] p-4 text-sm leading-7">
                <input
                  type="checkbox"
                  required
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1.5 h-4 w-4 shrink-0 accent-[#a66d36]"
                />

                <span>
                  {ar
                    ? "راجعت بيانات التوصيل والإجمالي، وفاهم إن الطلب هيتسجل في انتظار دفع المبلغ كاملًا ومراجعته قبل التأكيد."
                    : "I have reviewed my delivery details and total, and understand that my order will await full payment and verification before confirmation."}
                </span>
              </label>
            </section>
          </div>

          <aside className="self-start rounded-2xl border border-[#e7d9c8] bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <h2 className="mb-6 text-xl font-extrabold">{ar ? "ملخص الطلب" : "Order summary"}</h2>

            <div className="space-y-4">
              {rows.map((row) => (
                <div key={row.slug} className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0 flex-1">
                    {row.product ? (ar ? row.product.nameAr : row.product.nameEn) : row.slug}

                    <span className="ms-1 text-neutral-500">× {row.quantity}</span>
                  </span>

                  <strong className="shrink-0">{formatEGP((row.product?.price ?? 0) * row.quantity, locale)}</strong>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-[#eadfce]" />

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-3">
                <span>{ar ? "المنتجات" : "Subtotal"}</span>
                <strong>{formatEGP(subtotal, locale)}</strong>
              </div>

              <div className="flex justify-between gap-3">
                <span>{ar ? "الشحن" : "Shipping"}</span>

                <strong>
                  {selectedRate ? formatEGP(shipping, locale) : ar ? "اختر المحافظة" : "Select governorate"}
                </strong>
              </div>
            </div>

            <div className="my-5 border-t border-[#eadfce]" />

            <div className="flex items-center justify-between gap-3">
              <strong>{ar ? "الإجمالي شامل الشحن" : "Total incl. shipping"}</strong>

              <span className="text-xl font-extrabold text-[#a66d36]">
                {selectedRate ? formatEGP(total, locale) : "—"}
              </span>
            </div>

            {!cartValid && (
              <p className="mt-4 text-xs leading-6 text-red-600">
                {ar
                  ? "بعض المنتجات غير متاحة بالكمية المطلوبة. راجع السلة."
                  : "Some products are unavailable in the requested quantities."}
              </p>
            )}

            <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#fffaf3] p-3 text-xs leading-6 text-neutral-600">
              <ShieldCheck size={18} className="mt-1 shrink-0 text-[#a66d36]" />

              <span>
                {ar
                  ? "الأسعار والشحن بيتراجعوا على السيرفر عند تسجيل الطلب. الطلب لا يعني تأكيد الدفع أو الشحن."
                  : "Prices and shipping are checked by the server when the order is created. An order does not mean payment or shipping is confirmed."}
              </span>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#171411] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a66d36] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <ClipboardCheck size={18} />}

              {submitting
                ? ar
                  ? "جاري تسجيل الطلب..."
                  : "Creating order..."
                : ar
                  ? "تسجيل الطلب والمتابعة للدفع"
                  : "Create order and proceed to payment"}
            </button>

            {!accepted && (
              <p className="mt-2 text-center text-xs text-neutral-500">
                {ar ? "وافق على مراجعة البيانات لتفعيل الزر" : "Accept the review statement to continue"}
              </p>
            )}

            <p className="mt-3 text-center text-xs leading-6 text-neutral-500">
              {ar
                ? "الزر يسجّل طلبًا بانتظار الدفع؛ مش بيخصم أي مبلغ تلقائيًا."
                : "This creates a pending order; no money is charged automatically."}
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
