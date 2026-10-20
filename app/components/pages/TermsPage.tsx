
import Link from "next/link";
import {
  ScrollText,
  ShoppingBag,
  CreditCard,
  BadgeCheck,
  Truck,
  ArrowLeftRight,
  ShieldCheck,
  UserRound,
  FilePenLine,
  MessageCircle,
  ArrowUpLeft,
  ArrowUpRight,
  Info,
} from "lucide-react";

import type { Locale } from "@/lib/translations";

type Props = {
  locale: Locale;
};

const icons = [
  ShoppingBag,
  CreditCard,
  BadgeCheck,
  Truck,
  ArrowLeftRight,
  UserRound,
  ShieldCheck,
  FilePenLine,
];

export default function TermsPage({ locale }: Props) {
  const ar = locale === "ar";
  const Arrow = ar ? ArrowUpLeft : ArrowUpRight;
  const prefix = ar ? "" : "/en";

  const whatsappUrl =
    "https://wa.me/201204791050?text=" +
    encodeURIComponent(
      ar
        ? "أهلاً وسامة برفيوم، عندي استفسار بخصوص الشروط والأحكام."
        : "Hello Wasama Perfume, I have a question about your terms and conditions."
    );

  const content = ar
    ? {
        eyebrow: "TERMS & CONDITIONS",
        title: "الشروط",
        accent: "والأحكام.",
        description:
          "تعرف على المعلومات الأساسية المتعلقة باستخدام متجر وسامة برفيوم، وإتمام الطلبات، وطرق الدفع والتوصيل.",
        introLabel: "SHOP WITH CONFIDENCE",
        introTitle: "تجربة تسوق واضحة من البداية.",
        introDescription:
          "بنوضحلك أهم الإجراءات المتعلقة بالشراء من متجر وسامة برفيوم، علشان تكون عارف خطوات الطلب والدفع والتأكيد قبل إتمام عملية الشراء.",
        sectionsLabel: "STORE TERMS",
        sectionsTitle: "الشروط الأساسية للمتجر",
        sections: [
          {
            title: "استخدام المتجر",
            description:
              "يوفر متجر وسامة برفيوم إمكانية تصفح العطور وطلب المنتجات المعروضة للبيع بالتجزئة. يُرجى تقديم معلومات صحيحة عند إتمام الطلب، واستخدام الموقع بطريقة مشروعة.",
          },
          {
            title: "الأسعار والطلبات",
            description:
              "تظهر أسعار المنتجات عند عرضها على المتجر، ويُعرض إجمالي الطلب بما يشمل تكلفة الشحن قبل إتمام الدفع. قد تتغير الأسعار أو يتغير توفر المنتجات، ويجب توضيح أي تغيير يؤثر على الطلب للعميل قبل اعتماده.",
          },
          {
            title: "طرق الدفع",
            description:
              "يتم دفع قيمة الطلب بالكامل مقدمًا، بما يشمل تكلفة الشحن، باستخدام فودافون كاش أو إنستاباي. بعد التحويل، يرسل العميل صورة إثبات الدفع عبر واتساب للمراجعة.",
          },
          {
            title: "تأكيد الطلب",
            description:
              "إرسال إثبات التحويل لا يعني تأكيد الطلب تلقائيًا. لا يتم تأكيد الطلب إلا بعد التحقق من التحويل والتأكد من استلام المبلغ بالفعل.",
          },
          {
            title: "الشحن والتوصيل",
            description:
              "يبدأ تجهيز الطلب بعد تأكيد الدفع. تختلف تفاصيل التوصيل حسب عنوان العميل وخدمات الشحن المتاحة. يمكنك مراجعة صفحة الشحن والتوصيل لمعرفة المزيد.",
          },
          {
            title: "الاستبدال والاسترجاع",
            description:
              "تُراجع طلبات الاستبدال والاسترجاع وفق السياسة المعتمدة والحقوق القانونية المطبقة. يمكن للعميل التواصل مع خدمة العملاء لتقديم طلب ومراجعة حالته.",
          },
          {
            title: "بيانات العملاء والخصوصية",
            description:
              "تُستخدم البيانات اللازمة لمعالجة الطلبات والتواصل والتوصيل وفق سياسة الخصوصية المعتمدة. يُرجى مراجعة صفحة سياسة الخصوصية للاطلاع على مزيد من المعلومات.",
          },
          {
            title: "تحديث الشروط",
            description:
              "قد تحتاج شروط المتجر إلى تحديث عند تغيير خدماته أو إجراءات التشغيل. يجب توضيح تاريخ سريان النسخة المعتمدة، ولا تؤثر التحديثات على الحقوق القانونية أو الالتزامات السابقة خلافًا لما يسمح به القانون.",
          },
        ],
        noticeTitle: "تنبيه بخصوص اعتماد الشروط",
        notice:
          "هذه مسودة توضيحية تحتاج إلى اعتماد بيانات النشاط التجاري، وسياسة الإلغاء، ومدد الاسترجاع، والإجراءات الخاصة بالطلبات غير المتاحة، وأي تفاصيل قانونية لازمة قبل نشرها كشروط ملزمة للعملاء.",
        linksTitle: "صفحات مهمة",
        shippingLink: "الشحن والتوصيل",
        returnsLink: "الاستبدال والاسترجاع",
        privacyLink: "سياسة الخصوصية",
        ctaTitle: "عندك استفسار قبل الطلب؟",
        ctaDescription:
          "تواصل مع فريق وسامة برفيوم، وهنساعدك تفهم خطوات الشراء والدفع والتوصيل.",
        ctaButton: "تواصل معنا",
        shopButton: "تسوق العطور",
      }
    : {
        eyebrow: "TERMS & CONDITIONS",
        title: "Terms",
        accent: "& Conditions.",
        description:
          "Learn about the essential terms for using Wasama Perfume, placing orders, making payments, and receiving deliveries.",
        introLabel: "SHOP WITH CONFIDENCE",
        introTitle: "A clear shopping experience from the start.",
        introDescription:
          "We explain the key steps involved in shopping with Wasama Perfume so you can understand the order, payment, and confirmation process before making a purchase.",
        sectionsLabel: "STORE TERMS",
        sectionsTitle: "Our store terms",
        sections: [
          {
            title: "Using our store",
            description:
              "Wasama Perfume allows customers to browse and order fragrances for retail purchase. Please provide accurate information during checkout and use the website lawfully.",
          },
          {
            title: "Prices and orders",
            description:
              "Product prices are displayed on the website, and the order total, including shipping charges, is shown before payment. Prices and availability may change, and any change affecting an order should be communicated before acceptance.",
          },
          {
            title: "Payment methods",
            description:
              "The full order amount, including shipping, must be paid in advance via Vodafone Cash or InstaPay. After transferring the amount, customers send a payment screenshot through WhatsApp for review.",
          },
          {
            title: "Order confirmation",
            description:
              "Submitting a payment screenshot does not automatically confirm an order. An order is confirmed only after the transfer has been verified and the funds have been received.",
          },
          {
            title: "Shipping and delivery",
            description:
              "Order preparation begins after payment confirmation. Delivery arrangements depend on the customer's address and available shipping services. See our Shipping & Delivery page for further information.",
          },
          {
            title: "Returns and exchanges",
            description:
              "Return and exchange requests are reviewed in accordance with the approved policy and applicable consumer rights. Customers can contact support to submit a request for review.",
          },
          {
            title: "Customer information and privacy",
            description:
              "Information necessary for order processing, communication, and delivery is handled in accordance with the approved Privacy Policy. Please review that page for additional information.",
          },
          {
            title: "Changes to these terms",
            description:
              "These terms may need updating when store services or operations change. The effective date of the approved version should be stated. Updates do not override existing legal rights or obligations except as permitted by law.",
          },
        ],
        noticeTitle: "Before these terms are finalized",
        notice:
          "This draft requires confirmation of the business's legal details, cancellation procedures, return periods, unavailable-item handling, and other necessary legal provisions before publication as binding customer terms.",
        linksTitle: "Helpful pages",
        shippingLink: "Shipping & Delivery",
        returnsLink: "Returns & Exchanges",
        privacyLink: "Privacy Policy",
        ctaTitle: "Questions before ordering?",
        ctaDescription:
          "Contact Wasama Perfume for help understanding our ordering, payment, and delivery process.",
        ctaButton: "Contact us",
        shopButton: "Shop Fragrances",
      };

  const relatedLinks = [
    {
      label: content.shippingLink,
      href: `${prefix}/shipping`,
    },
    {
      label: content.returnsLink,
      href: `${prefix}/returns`,
    },
    {
      label: content.privacyLink,
      href: `${prefix}/privacy-policy`,
    },
  ];

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
            <ScrollText size={34} strokeWidth={1.4} />
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

      {/* INTRO */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 border-b border-[#eee7dd] pb-16 md:grid-cols-2 md:gap-16">
          <div>
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-[#b8844f]">
              {content.introLabel}
            </p>

            <h2 className="text-3xl font-extrabold leading-[1.5] sm:text-4xl">
              {content.introTitle}
            </h2>
          </div>

          <p className="text-base leading-9 text-[#746d65]">
            {content.introDescription}
          </p>
        </div>
      </section>

      {/* TERMS */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-[#b8844f]">
              {content.sectionsLabel}
            </p>

            <h2 className="text-3xl font-extrabold sm:text-4xl">
              {content.sectionsTitle}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {content.sections.map((section, index) => {
              const Icon = icons[index];

              return (
                <article
                  key={section.title}
                  className="group border border-[#e9dfd2] bg-white p-7 transition-all duration-300 hover:border-[#b8844f]/60 hover:shadow-lg sm:p-9"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center bg-[#faf4eb] text-[#b8844f]">
                      <Icon size={26} strokeWidth={1.5} />
                    </div>

                    <span className="text-xs font-bold text-[#c9b69e]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mb-4 text-xl font-bold">
                    {section.title}
                  </h3>

                  <p className="text-sm leading-8 text-[#746d65]">
                    {section.description}
                  </p>

                  <div className="mt-8 h-px w-10 bg-[#b8844f] transition-all duration-300 group-hover:w-20" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* NOTICE */}
      <section className="bg-[#faf7f2] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start gap-5 border-s-4 border-[#b8844f] bg-white p-7 sm:p-10">
            <Info
              size={28}
              className="shrink-0 text-[#b8844f]"
            />

            <div>
              <h2 className="mb-4 text-xl font-extrabold">
                {content.noticeTitle}
              </h2>

              <p className="text-sm leading-8 text-[#746d65]">
                {content.notice}
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="mb-6 text-xl font-extrabold">
              {content.linksTitle}
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {relatedLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between gap-4 border border-[#e9dfd2] bg-white p-6 text-sm font-bold transition-colors hover:border-[#b8844f] hover:text-[#b8844f]"
                >
                  {item.label}
                  <Arrow size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
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
