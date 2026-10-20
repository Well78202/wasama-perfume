
import Link from "next/link";
import {
  Truck,
  PackageCheck,
  CreditCard,
  ClipboardCheck,
  MapPin,
  MessageCircle,
  ArrowUpLeft,
  ArrowUpRight,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import type { Locale } from "@/lib/translations";

type Props = {
  locale: Locale;
};

export default function ShippingPage({ locale }: Props) {
  const ar = locale === "ar";
  const Arrow = ar ? ArrowUpLeft : ArrowUpRight;
  const prefix = ar ? "" : "/en";

  const whatsappUrl =
    "https://wa.me/201204791050?text=" +
    encodeURIComponent(
      ar
        ? "أهلاً وسامة برفيوم، عايز أستفسر عن الشحن والتوصيل."
        : "Hello Wasama Perfume, I have a shipping question."
    );

  const content = ar
    ? {
        eyebrow: "SHIPPING & DELIVERY",
        title: "طلبك في الطريق",
        accent: "إليك بكل اهتمام.",
        description:
          "من لحظة إتمام طلبك لحد ما عطرك يوصل، بنوضحلك خطوات تجهيز الطلب والشحن والتوصيل.",
        stepsLabel: "ORDER JOURNEY",
        stepsTitle: "رحلة طلبك",
        steps: [
          {
            title: "إتمام الطلب",
            description:
              "اختار عطورك وأدخل بيانات التوصيل وراجع إجمالي الطلب شامل الشحن.",
          },
          {
            title: "الدفع مقدمًا",
            description:
              "حوّل قيمة الطلب بالكامل، شاملة الشحن، عبر فودافون كاش أو إنستاباي.",
          },
          {
            title: "تأكيد الدفع",
            description:
              "ابعت صورة إثبات التحويل على واتساب. يتم تأكيد الطلب بعد مراجعة التحويل والتأكد من استلام المبلغ.",
          },
          {
            title: "تجهيز وشحن الطلب",
            description:
              "بعد تأكيد الدفع، يبدأ تجهيز الطلب للشحن إلى عنوان التوصيل المسجل.",
          },
        ],
        detailsLabel: "DELIVERY INFORMATION",
        detailsTitle: "معلومات مهمة عن التوصيل",
        details: [
          {
            title: "مناطق التوصيل",
            description:
              "تقدر تستفسر عن إمكانية التوصيل لمنطقتك من خلال خدمة العملاء.",
          },
          {
            title: "مدة التوصيل",
            description:
              "تختلف مدة التوصيل حسب المحافظة والمنطقة. تواصل معانا لمعرفة التفاصيل الخاصة بعنوانك.",
          },
          {
            title: "تكلفة الشحن",
            description:
              "بتظهر تكلفة الشحن ضمن إجمالي الطلب قبل الدفع، حسب إعدادات الشحن المتاحة.",
          },
          {
            title: "متابعة الطلب",
            description:
              "لو محتاج تستفسر عن حالة طلبك، تواصل معانا على واتساب مع بيانات الطلب.",
          },
        ],
        noticeTitle: "متى يتم تأكيد الطلب؟",
        notice:
          "إرسال صورة التحويل وحده لا يعني تأكيد الطلب. يتم تأكيد الطلب بعد مراجعة الدفع والتأكد من وصول المبلغ بالفعل.",
        ctaTitle: "عندك سؤال عن الشحن؟",
        ctaDescription:
          "فريق وسامة جاهز يساعدك في الاستفسارات المتعلقة بالتوصيل ومتابعة الطلبات.",
        ctaButton: "تواصل معنا على واتساب",
        shopButton: "تسوق العطور",
      }
    : {
        eyebrow: "SHIPPING & DELIVERY",
        title: "Your order is on",
        accent: "its way to you.",
        description:
          "From checkout to delivery, here's how we prepare, confirm, and ship your fragrance order.",
        stepsLabel: "ORDER JOURNEY",
        stepsTitle: "Your order journey",
        steps: [
          {
            title: "Place your order",
            description:
              "Choose your fragrances, enter your delivery details, and review the total including shipping.",
          },
          {
            title: "Pay in advance",
            description:
              "Transfer the full order amount, including shipping, via Vodafone Cash or InstaPay.",
          },
          {
            title: "Payment verification",
            description:
              "Send your transfer screenshot via WhatsApp. Your order is confirmed only after we verify receipt of payment.",
          },
          {
            title: "Preparation & shipping",
            description:
              "Once payment is confirmed, we begin preparing your order for shipment to your delivery address.",
          },
        ],
        detailsLabel: "DELIVERY INFORMATION",
        detailsTitle: "Important delivery information",
        details: [
          {
            title: "Delivery areas",
            description:
              "Contact our team to check delivery availability in your area.",
          },
          {
            title: "Delivery times",
            description:
              "Delivery times vary by governorate and location. Contact us for details about your address.",
          },
          {
            title: "Shipping fees",
            description:
              "Shipping charges are included in the checkout total before payment, based on available shipping settings.",
          },
          {
            title: "Order tracking",
            description:
              "For updates on your order, contact us on WhatsApp with your order details.",
          },
        ],
        noticeTitle: "When is my order confirmed?",
        notice:
          "Sending a transfer screenshot does not automatically confirm your order. Confirmation happens only after payment has been reviewed and received.",
        ctaTitle: "Questions about delivery?",
        ctaDescription:
          "Our team is here to help with shipping questions and order updates.",
        ctaButton: "Chat on WhatsApp",
        shopButton: "Shop Fragrances",
      };

  const stepIcons = [
    ClipboardCheck,
    CreditCard,
    ShieldCheck,
    PackageCheck,
  ];

  const detailIcons = [MapPin, Clock3, Truck, MessageCircle];

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="overflow-hidden bg-white text-[#1c1916]"
    >
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#faf7f2] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="pointer-events-none absolute -top-32 left-0 h-80 w-80 rounded-full bg-[#b8844f]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#b8844f]/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-7 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-[#b8844f]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#b8844f]">
              {content.eyebrow}
            </span>
            <span className="h-px w-10 bg-[#b8844f]" />
          </div>

          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#d9bf9e] bg-white text-[#b8844f]">
            <Truck size={34} strokeWidth={1.4} />
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.4] sm:text-5xl lg:text-6xl">
            {content.title}
            <span className="block text-[#b8844f]">
              {content.accent}
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-[#746d65] sm:text-base">
            {content.description}
          </p>
        </div>
      </section>

      {/* ORDER JOURNEY */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-[#b8844f]">
              {content.stepsLabel}
            </p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              {content.stepsTitle}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {content.steps.map((step, index) => {
              const Icon = stepIcons[index];

              return (
                <div
                  key={step.title}
                  className="relative border border-[#e9dfd2] bg-white p-7 transition-all duration-300 hover:border-[#b8844f]/60 hover:shadow-lg sm:p-8"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center bg-[#faf4eb] text-[#b8844f]">
                      <Icon size={26} strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-bold text-[#c9b69e]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mb-4 text-lg font-bold">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-8 text-[#746d65]">
                    {step.description}
                  </p>

                  <div className="mt-8 h-px w-10 bg-[#b8844f]" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DELIVERY DETAILS */}
      <section className="bg-[#faf7f2] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-[#b8844f]">
              {content.detailsLabel}
            </p>
            <h2 className="text-3xl font-extrabold leading-[1.4] sm:text-4xl">
              {content.detailsTitle}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {content.details.map((detail, index) => {
              const Icon = detailIcons[index];

              return (
                <div
                  key={detail.title}
                  className="flex items-start gap-5 border border-[#e9dfd2] bg-white p-7 sm:p-9"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#faf4eb] text-[#b8844f]">
                    <Icon size={23} strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-bold">
                      {detail.title}
                    </h3>
                    <p className="text-sm leading-8 text-[#746d65]">
                      {detail.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* IMPORTANT NOTICE */}
          <div className="mt-8 flex items-start gap-4 border-s-4 border-[#b8844f] bg-white p-7 sm:p-9">
            <ShieldCheck
              size={27}
              className="shrink-0 text-[#b8844f]"
            />
            <div>
              <h3 className="mb-3 text-lg font-bold">
                {content.noticeTitle}
              </h3>
              <p className="text-sm leading-8 text-[#746d65]">
                {content.notice}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-[#1c1916] px-5 py-20 text-center text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-xs font-bold tracking-[0.25em] text-[#c9a470]">
            WASAMA PERFUME
          </p>

          <h2 className="text-3xl font-extrabold leading-[1.5] sm:text-4xl">
            {content.ctaTitle}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-[#b9b1a6] sm:text-base">
            {content.ctaDescription}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[#c9a470] px-7 py-4 text-sm font-bold text-[#1c1916] transition-colors hover:bg-[#e0bc89] sm:w-auto"
            >
              <MessageCircle size={19} />
              {content.ctaButton}
              <Arrow size={18} />
            </a>

            <Link
              href={`${prefix}/products`}
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 border border-white/30 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              {content.shopButton}
              <Arrow size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
