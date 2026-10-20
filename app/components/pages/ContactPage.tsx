import { ArrowUpLeft, ArrowUpRight, MessageCircle, Phone, MapPin, HelpCircle, Sparkles } from "lucide-react";

import type { Locale } from "@/lib/translations";

type ContactPageProps = {
  locale: Locale;
};

export default function ContactPage({ locale }: ContactPageProps) {
  const ar = locale === "ar";
  const Arrow = ar ? ArrowUpLeft : ArrowUpRight;

  const phone = "01204791050";

  const message = encodeURIComponent(
    ar
      ? "أهلاً وسامة برفيوم، عندي استفسار بخصوص العطور أو الطلبات."
      : "Hello Wasama Perfume, I have a question about fragrances or orders.",
  );

  const whatsappUrl = `https://wa.me/201204791050?text=${message}`;

  const content = ar
    ? {
        eyebrow: "WASAMA PERFUME / CONTACT",
        title: "إحنا هنا",
        titleAccent: "علشانك.",
        description: "عندك سؤال عن عطر؟ محتاج مساعدة في طلبك؟ أو محتار تختار إيه؟ فريق وسامة جاهز يساعدك.",
        whatsappLabel: "تواصل عبر واتساب",
        whatsappTitle: "خلّينا نتكلم.",
        whatsappDescription: "أسرع طريقة للتواصل معانا والاستفسار عن العطور والطلبات.",
        whatsappButton: "ابدأ المحادثة",
        phoneLabel: "اتصل بنا",
        phoneTitle: "مكالمة مباشرة.",
        phoneDescription: "تقدر تتواصل معانا تليفونيًا لو محتاج مساعدة.",
        phoneButton: "اتصل الآن",
        location: "مصر",
        helpEyebrow: "HOW CAN WE HELP?",
        helpTitle: "محتاج مساعدة في إيه؟",
        topics: [
          {
            title: "اختيار العطر",
            description: "نساعدك تختار العطر المناسب لذوقك ومناسبتك.",
          },
          {
            title: "متابعة الطلب",
            description: "استفسر عن حالة طلبك أو تفاصيل الشحن.",
          },
          {
            title: "الدفع وتأكيد الطلب",
            description: "نساعدك في خطوات التحويل وإرسال إثبات الدفع.",
          },
        ],
        finalTitle: "عطرك المثالي ممكن يبدأ برسالة.",
        finalDescription: "ابعتلنا على واتساب، وخلّينا نساعدك تلاقي اللي بتدور عليه.",
        finalButton: "تواصل معنا",
      }
    : {
        eyebrow: "WASAMA PERFUME / CONTACT",
        title: "We're here",
        titleAccent: "for you.",
        description: "Have a question about a fragrance? Need help with your order? Our team is ready to assist.",
        whatsappLabel: "WHATSAPP",
        whatsappTitle: "Let's have a chat.",
        whatsappDescription: "The easiest way to ask about fragrances and orders.",
        whatsappButton: "Start a conversation",
        phoneLabel: "PHONE",
        phoneTitle: "Give us a call.",
        phoneDescription: "Reach out by phone whenever you need assistance.",
        phoneButton: "Call now",
        location: "Egypt",
        helpEyebrow: "HOW CAN WE HELP?",
        helpTitle: "What can we help you with?",
        topics: [
          {
            title: "Fragrance Advice",
            description: "Find a fragrance that matches your style and occasion.",
          },
          {
            title: "Order Support",
            description: "Ask about your order status or shipping details.",
          },
          {
            title: "Payment Assistance",
            description: "Get help with payment transfers and confirmation.",
          },
        ],
        finalTitle: "Your perfect fragrance may start with a message.",
        finalDescription: "Message us on WhatsApp and let us help you find what you're looking for.",
        finalButton: "Get in touch",
      };

  return (
    <main dir={ar ? "rtl" : "ltr"} className="w-full overflow-hidden bg-white text-[#1c1916]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#faf7f2] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="pointer-events-none absolute -top-40 left-[-100px] h-96 w-96 rounded-full bg-[#b8844f]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-[-100px] h-96 w-96 rounded-full bg-[#b8844f]/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-7 flex items-center justify-center gap-4">
            <span className="h-px w-9 bg-[#b8844f]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#b8844f]">{content.eyebrow}</span>
            <span className="h-px w-9 bg-[#b8844f]" />
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.4] sm:text-5xl lg:text-7xl">
            {content.title}
            <span className="block text-[#b8844f]">{content.titleAccent}</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-[#746d65] sm:text-base">{content.description}</p>

          <div className="mx-auto mt-10 flex items-center justify-center gap-2 text-[#b8844f]">
            <span className="h-px w-12 bg-[#b8844f]/50" />
            <Sparkles size={18} strokeWidth={1.3} />
            <span className="h-px w-12 bg-[#b8844f]/50" />
          </div>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {/* WhatsApp */}
          <div className="group relative flex flex-col overflow-hidden bg-[#1c1916] p-8 text-white sm:p-12">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border border-[#c9a470]/20" />
            <div className="pointer-events-none absolute -left-12 -top-12 h-56 w-56 rounded-full border border-[#c9a470]/20" />

            <div className="relative flex h-14 w-14 items-center justify-center border border-[#c9a470]/40 text-[#c9a470]">
              <MessageCircle size={27} strokeWidth={1.5} />
            </div>

            <p className="relative mt-10 text-xs font-bold tracking-[0.2em] text-[#c9a470]">{content.whatsappLabel}</p>

            <h2 className="relative mt-4 text-3xl font-extrabold sm:text-4xl">{content.whatsappTitle}</h2>

            <p className="relative mt-5 max-w-sm text-sm leading-8 text-[#b8b0a5]">{content.whatsappDescription}</p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-12 inline-flex min-h-14 w-fit items-center justify-center gap-3 bg-[#c9a470] px-7 py-4 text-sm font-bold text-[#1c1916] transition-colors hover:bg-[#e0bc89]"
            >
              {content.whatsappButton}
              <Arrow size={19} />
            </a>
          </div>

          {/* Phone */}
          <div className="flex flex-col border border-[#e9dfd2] bg-[#faf7f2] p-8 sm:p-12">
            <div className="flex h-14 w-14 items-center justify-center border border-[#d7bd99] text-[#b8844f]">
              <Phone size={26} strokeWidth={1.5} />
            </div>

            <p className="mt-10 text-xs font-bold tracking-[0.2em] text-[#b8844f]">{content.phoneLabel}</p>

            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">{content.phoneTitle}</h2>

            <p className="mt-5 max-w-sm text-sm leading-8 text-[#746d65]">{content.phoneDescription}</p>

            <a
              href="tel:+201204791050"
              className="mt-12 inline-flex min-h-14 w-fit items-center justify-center gap-3 border border-[#1c1916] px-7 py-4 text-sm font-bold text-[#1c1916] transition-colors hover:bg-[#1c1916] hover:text-white"
            >
              {content.phoneButton}
              <Arrow size={19} />
            </a>

            <p dir="ltr" className="mt-6 text-start text-sm font-semibold text-[#746d65]">
              {phone}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-center gap-2 text-sm text-[#746d65]">
          <MapPin size={17} className="text-[#b8844f]" />
          {content.location}
        </div>
      </section>

      {/* HELP TOPICS */}
      <section className="bg-[#faf7f2] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-[#b8844f]">{content.helpEyebrow}</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">{content.helpTitle}</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {content.topics.map((topic, index) => (
              <div
                key={topic.title}
                className="border border-[#e9dfd2] bg-white p-8 transition-colors hover:border-[#b8844f]/60"
              >
                <div className="mb-8 flex items-center justify-between">
                  <HelpCircle size={26} strokeWidth={1.5} className="text-[#b8844f]" />
                  <span className="text-xs font-bold text-[#cbb9a3]">0{index + 1}</span>
                </div>

                <h3 className="mb-4 text-lg font-bold">{topic.title}</h3>

                <p className="text-sm leading-8 text-[#746d65]">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-white px-5 py-20 text-center sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-xs font-bold tracking-[0.2em] text-[#b8844f]">WASAMA PERFUME</p>

          <h2 className="text-3xl font-extrabold leading-[1.5] sm:text-4xl lg:text-5xl">{content.finalTitle}</h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#746d65] sm:text-base">
            {content.finalDescription}
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex min-h-14 items-center justify-center gap-3 bg-[#1c1916] px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-[#b8844f]"
          >
            <MessageCircle size={19} />
            {content.finalButton}
            <Arrow size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
