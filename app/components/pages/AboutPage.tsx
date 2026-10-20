
import Link from "next/link";
import {
  ArrowUpLeft,
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Sparkles,
  Gem,
} from "lucide-react";

import type { Locale } from "@/lib/translations";

type AboutPageProps = {
  locale: Locale;
};

export default function AboutPage({ locale }: AboutPageProps) {
  const ar = locale === "ar";
  const Arrow = ar ? ArrowUpLeft : ArrowUpRight;
  const prefix = ar ? "" : "/en";

  const content = ar
    ? {
        label: "من نحن",
        heroTitle: "العطر مش مجرد رائحة.",
        heroAccent: "العطر حكاية.",
        heroDescription:
          "في وسامة برفيوم، بنؤمن إن لكل شخص بصمته الخاصة، وإن العطر هو أحد أجمل الطرق للتعبير عنها.",
        storyLabel: "قصتنا",
        storyTitle: "شغفنا بالعطور هو البداية.",
        storyDescription:
          "وسامة برفيوم متجر متخصص في تقديم العطور لعشاق الروائح المميزة. هدفنا نساعد كل عميل يكتشف العطر اللي يناسب شخصيته وذوقه، من خلال تجربة تسوق بسيطة ومريحة.",
        valuesLabel: "ما يميزنا",
        valuesTitle: "تجربة تستحقها.",
        values: [
          {
            title: "اختيارات مميزة",
            description:
              "مجموعة متنوعة من العطور تناسب الأذواق والمناسبات المختلفة.",
          },
          {
            title: "اهتمام بالتفاصيل",
            description:
              "نهتم بتقديم معلومات واضحة تساعدك تختار العطر المناسب.",
          },
          {
            title: "تواصل مباشر",
            description:
              "موجودين علشان نساعدك في استفسارات العطور والطلبات.",
          },
        ],
        closingLabel: "WASAMA PERFUME",
        closingTitle: "اكتشف عطرك القادم.",
        closingDescription:
          "ابدأ رحلتك مع مجموعتنا، واختار العطر اللي يعبر عنك.",
        cta: "تسوق الآن",
      }
    : {
        label: "ABOUT US",
        heroTitle: "More than a fragrance.",
        heroAccent: "It's your story.",
        heroDescription:
          "At Wasama Perfume, we believe everyone has a unique signature, and fragrance is one of the most beautiful ways to express it.",
        storyLabel: "OUR STORY",
        storyTitle: "It begins with a passion for fragrance.",
        storyDescription:
          "Wasama Perfume is a fragrance store dedicated to those who appreciate distinctive scents. Our goal is to help every customer discover a fragrance that matches their personality and style through a simple, enjoyable shopping experience.",
        valuesLabel: "WHY WASAMA",
        valuesTitle: "An experience made for you.",
        values: [
          {
            title: "Curated Selection",
            description:
              "A diverse collection of fragrances for different tastes and occasions.",
          },
          {
            title: "Attention to Detail",
            description:
              "Clear product information to help you choose with confidence.",
          },
          {
            title: "Personal Support",
            description:
              "We're here to help with fragrance questions and orders.",
          },
        ],
        closingLabel: "WASAMA PERFUME",
        closingTitle: "Find your next fragrance.",
        closingDescription:
          "Explore our collection and discover a scent that feels like you.",
        cta: "Shop Now",
      };

  const icons = [Gem, Sparkles, Heart];

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="overflow-hidden bg-white text-[#1c1916]"
    >
      {/* HERO */}
      <section className="relative bg-[#faf7f2] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(184,132,79,0.10),transparent_60%)]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-[#b8844f]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#b8844f]">
              {content.label}
            </span>
            <span className="h-px w-10 bg-[#b8844f]" />
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.4] sm:text-5xl lg:text-7xl">
            {content.heroTitle}
            <span className="mt-2 block text-[#b8844f]">
              {content.heroAccent}
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-9 text-[#756e65] sm:text-lg">
            {content.heroDescription}
          </p>
          <Link
            href={`${prefix}/products`}
            className="mt-10 inline-flex min-h-14 items-center justify-center gap-3 bg-[#c9a470] px-9 py-4 text-sm font-bold text-[#1c1916] transition-colors hover:bg-[#e0bb85]"
          >
            {content.cta}
            <Arrow size={19} />
          </Link>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[#f4eee5] sm:min-h-[460px]">
            <div className="absolute h-72 w-72 rounded-full border border-[#c6a77d]/40 sm:h-96 sm:w-96" />
            <div className="absolute h-56 w-56 rounded-full border border-[#c6a77d]/30 sm:h-72 sm:w-72" />

            <div className="relative z-10 text-center">
              <Sparkles
                size={44}
                strokeWidth={1}
                className="mx-auto mb-6 text-[#b8844f]"
              />
              <p className="text-3xl font-bold tracking-[0.18em] text-[#1c1916] sm:text-4xl">
                WASAMA
              </p>
              <p className="mt-3 text-xs tracking-[0.5em] text-[#b8844f]">
                PERFUME
              </p>
            </div>

            <span className="absolute right-6 top-6 h-12 w-12 border-r border-t border-[#b8844f]/50" />
            <span className="absolute bottom-6 left-6 h-12 w-12 border-b border-l border-[#b8844f]/50" />
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#b8844f]" />
              <span className="text-xs font-bold tracking-widest text-[#b8844f]">
                {content.storyLabel}
              </span>
            </div>

            <h2 className="text-3xl font-extrabold leading-[1.5] sm:text-4xl lg:text-5xl">
              {content.storyTitle}
            </h2>

            <p className="mt-7 text-base leading-9 text-[#756e65]">
              {content.storyDescription}
            </p>

            <div className="mt-10 flex items-center gap-3 border-t border-[#eee7dd] pt-7">
              <ShieldCheck size={23} className="text-[#b8844f]" />
              <span className="text-sm font-semibold">
                WASAMA PERFUME
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#faf7f2] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-5 text-xs font-bold tracking-widest text-[#b8844f]">
              {content.valuesLabel}
            </p>

            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              {content.valuesTitle}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {content.values.map((item, index) => {
              const Icon = icons[index];

              return (
                <div
                  key={item.title}
                  className="group border border-[#e9dfd2] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#b8844f]/50 hover:shadow-xl hover:shadow-[#b8844f]/5 sm:p-10"
                >
                  <div className="mb-8 flex h-14 w-14 items-center justify-center bg-[#faf4eb] text-[#b8844f]">
                    <Icon size={26} strokeWidth={1.5} />
                  </div>

                  <h3 className="mb-4 text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-8 text-[#756e65]">
                    {item.description}
                  </p>

                  <div className="mt-9 h-px w-10 bg-[#b8844f] transition-all duration-300 group-hover:w-20" />
                </div>
              );
            })}
          </div>
        </div>
      </section>


    </main>
  );
}
