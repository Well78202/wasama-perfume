
import Link from "next/link";
import {
  ShieldCheck,
  Database,
  ShoppingBag,
  CreditCard,
  Share2,
  LockKeyhole,
  Cookie,
  UserRoundCheck,
  MessageCircle,
  FileText,
  ArrowUpLeft,
  ArrowUpRight,
} from "lucide-react";

import type { Locale } from "@/lib/translations";

type Props = {
  locale: Locale;
};

export default function PrivacyPage({ locale }: Props) {
  const ar = locale === "ar";
  const Arrow = ar ? ArrowUpLeft : ArrowUpRight;
  const prefix = ar ? "" : "/en";

  const whatsappUrl =
    "https://wa.me/201204791050?text=" +
    encodeURIComponent(
      ar
        ? "أهلاً وسامة برفيوم، عندي استفسار عن سياسة الخصوصية وبياناتي."
        : "Hello Wasama Perfume, I have a privacy-related question."
    );

  const content = ar
    ? {
        eyebrow: "PRIVACY POLICY",
        title: "خصوصيتك",
        accent: "مهمة عندنا.",
        description:
          "بنوضحلك هنا إيه البيانات اللي ممكن نجمعها أثناء استخدام المتجر، وليه بنحتاجها، وإزاي تقدر تتواصل معانا بخصوصها.",
        introLabel: "YOUR PRIVACY MATTERS",
        introTitle: "الوضوح والثقة جزء من تجربة وسامة.",
        introDescription:
          "المعلومات التالية بتشرح الممارسات المقترحة للتعامل مع بيانات العملاء أثناء تصفح المتجر وإتمام الطلبات. لازم تتراجع مع طريقة التشغيل الفعلية قبل اعتمادها كسياسة نهائية.",
        sectionsLabel: "OUR PRIVACY PRACTICES",
        sectionsTitle: "كيف نتعامل مع بياناتك؟",
        sections: [
          {
            title: "البيانات التي نجمعها",
            description:
              "عند إتمام طلب، قد نطلب الاسم ورقم الهاتف وعنوان التوصيل وتفاصيل المنتجات المطلوبة. وقد تُجمع بيانات تقنية محدودة لازمة لتشغيل الموقع وحمايته.",
            icon: "database",
          },
          {
            title: "استخدام البيانات",
            description:
              "نستخدم بيانات الطلبات لمعالجة المشتريات، والتواصل بشأن حالة الطلب، وتنسيق الشحن والتوصيل، والرد على استفسارات خدمة العملاء.",
            icon: "shopping",
          },
          {
            title: "بيانات الدفع",
            description:
              "يتم الدفع مقدمًا عبر فودافون كاش أو إنستاباي، ويُرسل العميل إثبات التحويل عبر واتساب. تتم مراجعة التحويل قبل تأكيد الطلب. لا تطلب عملية الدفع هذه إدخال بيانات البطاقة البنكية داخل المتجر.",
            icon: "payment",
          },
          {
            title: "مشاركة البيانات",
            description:
              "قد نحتاج لمشاركة بيانات التوصيل الضرورية مع شركة الشحن أو مزودي الخدمات المشاركين في تنفيذ الطلب. ويجب تحديد الجهات الفعلية وأغراض المشاركة قبل نشر السياسة.",
            icon: "share",
          },
          {
            title: "حماية المعلومات",
            description:
              "نسعى لتطبيق تدابير تقنية وتنظيمية مناسبة للحد من الوصول غير المصرح به إلى بيانات العملاء. لا يمكن ضمان أمان أي نظام إلكتروني بصورة مطلقة.",
            icon: "security",
          },
          {
            title: "ملفات تعريف الارتباط",
            description:
              "قد يستخدم الموقع ملفات تعريف الارتباط أو وسائل تخزين مشابهة لتشغيل الوظائف الأساسية. يجب الإفصاح عن أي أدوات تحليلات أو تسويق تُستخدم فعليًا، مع توفير خيارات الموافقة عند لزومها.",
            icon: "cookies",
          },
          {
            title: "حقوقك وطلباتك",
            description:
              "يمكنك التواصل معنا للاستفسار عن بياناتك أو طلب تصحيحها أو حذفها، وفق الالتزامات القانونية ومتطلبات الاحتفاظ اللازمة للمعاملات.",
            icon: "rights",
          },
          {
            title: "تحديث السياسة",
            description:
              "قد تتغير هذه السياسة عند تحديث خدمات المتجر أو طرق معالجة البيانات. يجب توضيح تاريخ آخر تحديث عند اعتماد النسخة النهائية.",
            icon: "document",
          },
        ],
        noticeTitle: "ملاحظة قبل اعتماد السياسة",
        notice:
          "لازم نحدد بصورة نهائية مدة الاحتفاظ ببيانات العملاء، خدمات الاستضافة والتحليلات المستخدمة، الجهات التي تستقبل البيانات، وطريقة التعامل مع طلبات الحذف والتصحيح. كما يجب مراجعة النص وفق القوانين المصرية المطبقة.",
        contactTitle: "عندك سؤال عن بياناتك؟",
        contactDescription:
          "تقدر تتواصل مع وسامة برفيوم للاستفسار عن الخصوصية أو طلب مراجعة بياناتك.",
        contactButton: "تواصل عبر واتساب",
        termsButton: "الشروط والأحكام",
      }
    : {
        eyebrow: "PRIVACY POLICY",
        title: "Your privacy",
        accent: "matters to us.",
        description:
          "Learn what information may be collected when you use our store, why it is needed, and how to contact us about your data.",
        introLabel: "YOUR PRIVACY MATTERS",
        introTitle: "Transparency and trust are part of Wasama.",
        introDescription:
          "The information below outlines proposed practices for handling customer information while browsing and placing orders. These practices must be checked against actual operations before publication as a final policy.",
        sectionsLabel: "OUR PRIVACY PRACTICES",
        sectionsTitle: "How we handle your information",
        sections: [
          {
            title: "Information we collect",
            description:
              "When you place an order, we may collect your name, phone number, delivery address, and order details. Limited technical information may also be processed to operate and protect the website.",
            icon: "database",
          },
          {
            title: "How we use information",
            description:
              "Order information is used to process purchases, communicate order updates, arrange delivery, and respond to customer support inquiries.",
            icon: "shopping",
          },
          {
            title: "Payment information",
            description:
              "Customers pay in advance via Vodafone Cash or InstaPay and send transfer proof through WhatsApp. Payments are verified before orders are confirmed. This payment process does not require entering bank card details on our website.",
            icon: "payment",
          },
          {
            title: "Information sharing",
            description:
              "Necessary delivery information may be shared with shipping companies or service providers involved in fulfilling orders. Actual recipients and purposes must be confirmed before this policy is published.",
            icon: "share",
          },
          {
            title: "Information security",
            description:
              "We aim to apply appropriate technical and organizational safeguards to reduce unauthorized access to customer data. No electronic system can be guaranteed completely secure.",
            icon: "security",
          },
          {
            title: "Cookies and similar technologies",
            description:
              "The website may use cookies or similar storage for essential functionality. Any analytics or marketing technologies actually deployed must be disclosed, with consent options where required.",
            icon: "cookies",
          },
          {
            title: "Your data rights",
            description:
              "You may contact us to ask about your personal information or request correction or deletion, subject to applicable law and necessary transaction-record retention.",
            icon: "rights",
          },
          {
            title: "Policy updates",
            description:
              "This policy may change as our services or data practices evolve. The final published policy should clearly state its last updated date.",
            icon: "document",
          },
        ],
        noticeTitle: "Before this policy is finalized",
        notice:
          "We must confirm customer data retention periods, hosting and analytics providers, actual data recipients, and procedures for correction and deletion requests. The text also requires review against applicable Egyptian laws.",
        contactTitle: "Questions about your data?",
        contactDescription:
          "Contact Wasama Perfume with privacy inquiries or requests relating to your information.",
        contactButton: "Chat on WhatsApp",
        termsButton: "Terms & Conditions",
      };

  const icons = {
    database: Database,
    shopping: ShoppingBag,
    payment: CreditCard,
    share: Share2,
    security: LockKeyhole,
    cookies: Cookie,
    rights: UserRoundCheck,
    document: FileText,
  };

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
            <ShieldCheck size={34} strokeWidth={1.4} />
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

      {/* PRIVACY SECTIONS */}
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
              const Icon =
                icons[section.icon as keyof typeof icons];

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
        <div className="mx-auto flex max-w-5xl items-start gap-5 border-s-4 border-[#b8844f] bg-white p-7 sm:p-10">
          <ShieldCheck
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
      </section>

      {/* CTA */}
      <section className="bg-[#1c1916] px-5 py-20 text-center text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-xs font-bold tracking-[0.25em] text-[#c9a470]">
            WASAMA PERFUME
          </p>

          <h2 className="text-3xl font-extrabold leading-[1.5] sm:text-4xl">
            {content.contactTitle}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-[#b9b1a6] sm:text-base">
            {content.contactDescription}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[#c9a470] px-7 py-4 text-sm font-bold text-[#1c1916] transition-colors hover:bg-[#e0bc89] sm:w-auto"
            >
              <MessageCircle size={19} />
              {content.contactButton}
              <Arrow size={18} />
            </a>

            <Link
              href={`${prefix}/terms`}
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 border border-white/30 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              {content.termsButton}
              <Arrow size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
