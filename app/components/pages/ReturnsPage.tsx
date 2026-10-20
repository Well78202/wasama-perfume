
import Link from "next/link";
import {
  ArrowLeftRight,
  PackageCheck,
  MessageCircle,
  ClipboardList,
  ShieldCheck,
  SearchCheck,
  ArrowUpLeft,
  ArrowUpRight,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

import type { Locale } from "@/lib/translations";

type Props = {
  locale: Locale;
};

export default function ReturnsPage({ locale }: Props) {
  const ar = locale === "ar";
  const Arrow = ar ? ArrowUpLeft : ArrowUpRight;
  const prefix = ar ? "" : "/en";

  const whatsappUrl =
    "https://wa.me/201204791050?text=" +
    encodeURIComponent(
      ar
        ? "أهلاً وسامة برفيوم، عندي استفسار بخصوص استبدال أو استرجاع طلب."
        : "Hello Wasama Perfume, I have a question about an exchange or return."
    );

  const content = ar
    ? {
        eyebrow: "RETURNS & EXCHANGES",
        title: "رضاك يهمنا.",
        accent: "وإحنا هنا نساعدك.",
        description:
          "لو واجهتك مشكلة في طلبك أو محتاج تستفسر عن الاستبدال والاسترجاع، تقدر تتواصل مع فريق وسامة لمراجعة طلبك وتوضيح الخيارات المتاحة.",
        introLabel: "OUR APPROACH",
        introTitle: "تجربة شراء باهتمام حتى بعد الاستلام.",
        introDescription:
          "بنحرص على متابعة استفسارات العملاء المتعلقة بالطلبات، ومراجعة كل طلب استبدال أو استرجاع وفق السياسة المعتمدة والحقوق القانونية المطبقة.",
        stepsLabel: "HOW IT WORKS",
        stepsTitle: "إزاي تقدم طلب استبدال أو استرجاع؟",
        steps: [
          {
            title: "تواصل معانا",
            description:
              "ابعت رسالة على واتساب ووضح إنك محتاج تستفسر عن استبدال أو استرجاع.",
          },
          {
            title: "ابعت بيانات الطلب",
            description:
              "شارك رقم الطلب وتفاصيل المنتج والمشكلة، مع صور توضيحية لو متاحة.",
          },
          {
            title: "مراجعة الحالة",
            description:
              "فريق وسامة هيراجع التفاصيل ويوضحلك الإجراءات والخيارات المتاحة.",
          },
          {
            title: "استكمال الإجراءات",
            description:
              "لو الطلب مؤهل للاستبدال أو الاسترجاع، هنوضحلك خطوات التنفيذ والتنسيق اللازمة.",
          },
        ],
        infoLabel: "IMPORTANT INFORMATION",
        infoTitle: "معلومات مهمة قبل تقديم الطلب",
        info: [
          {
            title: "احتفظ ببيانات طلبك",
            description:
              "رقم الطلب وتفاصيل المنتج بيساعدونا نراجع طلبك بشكل أسرع.",
          },
          {
            title: "حالة المنتج والعبوة",
            description:
              "قد تؤثر حالة المنتج والعبوة على الخيارات المتاحة، وفق السياسة المعتمدة والقانون.",
          },
          {
            title: "المنتج غير المطابق أو التالف",
            description:
              "لو استلمت منتجًا تالفًا أو مختلفًا عن المطلوب، بلغنا بالتفاصيل والصور المتاحة.",
          },
          {
            title: "المدة والتكاليف",
            description:
              "المدد والتكاليف المطبقة على الاستبدال والاسترجاع يتم توضيحها وفق السياسة المعتمدة والحالة.",
          },
        ],
        noticeTitle: "ملاحظة مهمة",
        notice:
          "المعلومات المعروضة هنا توضح طريقة التواصل ومراجعة الطلبات، ولا تمثل سياسة نهائية تحدد مدد الاسترجاع أو رسومه أو الاستثناءات. يجب نشر الشروط التفصيلية المعتمدة بما يتوافق مع حقوق المستهلك.",
        faqLabel: "COMMON QUESTIONS",
        faqTitle: "أسئلة شائعة",
        faqs: [
          {
            question: "إزاي أطلب استبدال أو استرجاع؟",
            answer:
              "تواصل معانا على واتساب، وابعت رقم الطلب وسبب الطلب والتفاصيل المتاحة.",
          },
          {
            question: "لو المنتج وصل تالف أعمل إيه؟",
            answer:
              "تواصل معانا ووضح المشكلة، ويفضل إرسال صور للمنتج والعبوة للمساعدة في مراجعة الحالة.",
          },
          {
            question: "هل ممكن أسترجع عطر بعد فتحه؟",
            answer:
              "ده بيتحدد حسب حالة المنتج وسبب الاسترجاع والسياسة المعتمدة والحقوق القانونية المطبقة. تواصل معانا لمراجعة حالتك.",
          },
        ],
        ctaTitle: "محتاج مساعدة في طلبك؟",
        ctaDescription:
          "تواصل مع فريق وسامة على واتساب، وهنساعدك تعرف الخطوات المناسبة لحالتك.",
        ctaButton: "تواصل عبر واتساب",
        shopButton: "العودة للتسوق",
      }
    : {
        eyebrow: "RETURNS & EXCHANGES",
        title: "Your satisfaction matters.",
        accent: "We're here to help.",
        description:
          "If there's an issue with your order or you have questions about returns and exchanges, our team can review your request and explain the available options.",
        introLabel: "OUR APPROACH",
        introTitle: "Thoughtful service beyond delivery.",
        introDescription:
          "We review customer inquiries about orders and return or exchange requests in accordance with our approved policy and applicable consumer rights.",
        stepsLabel: "HOW IT WORKS",
        stepsTitle: "How to request a return or exchange",
        steps: [
          {
            title: "Contact our team",
            description:
              "Message us on WhatsApp and let us know you'd like to request a return or exchange.",
          },
          {
            title: "Share order details",
            description:
              "Provide your order number, product details, and the issue, along with photos if available.",
          },
          {
            title: "Request review",
            description:
              "Our team will review your information and explain the available options and procedures.",
          },
          {
            title: "Next steps",
            description:
              "If your request qualifies, we'll explain the process and coordinate the necessary arrangements.",
          },
        ],
        infoLabel: "IMPORTANT INFORMATION",
        infoTitle: "Before submitting a request",
        info: [
          {
            title: "Keep your order details",
            description:
              "Your order number and product information help us review your request.",
          },
          {
            title: "Product and packaging condition",
            description:
              "The condition of the product and packaging may affect available options under the approved policy and applicable law.",
          },
          {
            title: "Damaged or incorrect items",
            description:
              "If your item arrives damaged or incorrect, contact us with details and any available photos.",
          },
          {
            title: "Timeframes and costs",
            description:
              "Applicable return and exchange timeframes and costs depend on the approved policy and the circumstances.",
          },
        ],
        noticeTitle: "Important notice",
        notice:
          "This page explains how to contact us and request a review. It is not a finalized policy specifying return periods, fees, or exceptions. Detailed terms must be published in accordance with applicable consumer rights.",
        faqLabel: "COMMON QUESTIONS",
        faqTitle: "Frequently asked questions",
        faqs: [
          {
            question: "How do I request a return or exchange?",
            answer:
              "Contact us on WhatsApp with your order number, the reason for your request, and relevant details.",
          },
          {
            question: "What if my item arrives damaged?",
            answer:
              "Contact our team with a description of the issue and, if possible, photos of the item and packaging.",
          },
          {
            question: "Can I return an opened fragrance?",
            answer:
              "Eligibility depends on the product's condition, the reason for return, our approved policy, and applicable consumer rights. Contact us to review your case.",
          },
        ],
        ctaTitle: "Need help with your order?",
        ctaDescription:
          "Reach out to our team on WhatsApp and we'll help you understand the next steps.",
        ctaButton: "Chat on WhatsApp",
        shopButton: "Continue Shopping",
      };

  const stepIcons = [
    MessageCircle,
    ClipboardList,
    SearchCheck,
    PackageCheck,
  ];

  const infoIcons = [
    ClipboardList,
    PackageCheck,
    ShieldCheck,
    ArrowLeftRight,
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
            <ArrowLeftRight size={34} strokeWidth={1.4} />
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

      {/* PROCESS */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
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
                  className="border border-[#e9dfd2] bg-[#faf7f2] p-7 transition-all duration-300 hover:border-[#b8844f]/60 hover:bg-white hover:shadow-lg sm:p-8"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center bg-white text-[#b8844f]">
                      <Icon size={25} strokeWidth={1.5} />
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INFORMATION */}
      <section className="bg-[#faf7f2] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-[#b8844f]">
              {content.infoLabel}
            </p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              {content.infoTitle}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {content.info.map((item, index) => {
              const Icon = infoIcons[index];

              return (
                <div
                  key={item.title}
                  className="flex items-start gap-5 border border-[#e9dfd2] bg-white p-7 sm:p-9"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#faf4eb] text-[#b8844f]">
                    <Icon size={23} strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-bold">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-8 text-[#746d65]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-start gap-4 border-s-4 border-[#b8844f] bg-white p-7 sm:p-9">
            <AlertCircle
              size={26}
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

      {/* FAQ */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-[#b8844f]">
              {content.faqLabel}
            </p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              {content.faqTitle}
            </h2>
          </div>

          <div className="space-y-4">
            {content.faqs.map((faq) => (
              <div
                key={faq.question}
                className="border border-[#e9dfd2] bg-white p-6 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <HelpCircle
                    size={22}
                    className="mt-1 shrink-0 text-[#b8844f]"
                  />
                  <div>
                    <h3 className="mb-3 text-base font-bold sm:text-lg">
                      {faq.question}
                    </h3>
                    <p className="text-sm leading-8 text-[#746d65]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
