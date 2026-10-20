import Image from "next/image";
import Link from "next/link";
import { PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { getMessages, type Locale } from "@/lib/translations";

type HeroProps = {
  locale: Locale;
};

export default function Hero({ locale }: HeroProps) {
  const t = getMessages(locale).Hero;
  const prefix = locale === "ar" ? "" : "/en";
  const isArabic = locale === "ar";

  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-[#0b0907] text-white">
      {/* Background Image */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className={`object-cover object-center ${isArabic ? "-scale-x-100" : "scale-x-100"}`}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-20 bg-black/35" />

      {/* Gradient behind content */}
      <div
        className={`absolute inset-0 -z-10 ${
          isArabic
            ? "bg-gradient-to-l from-black/85 via-black/55 to-black/5"
            : "bg-gradient-to-r from-black/85 via-black/55 to-black/5"
        }`}
      />

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Content */}
      <div className="mx-auto flex min-h-[680px] max-w-[1440px] items-center px-5 py-20 lg:px-8">
        <div className="relative z-10 max-w-[680px]">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#d5a86e]" />

            <p className="text-xs font-bold tracking-[0.18em] text-[#e0b87e] sm:text-sm">{t.eyebrow}</p>
          </div>

          {/* Heading */}
          <h1 className="text-[44px] font-extrabold leading-[1.15] sm:text-5xl md:text-6xl lg:text-[72px]">
            {t.title}

            <span className="mt-2 block text-[#d5a86e]">{t.highlight}</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-[580px] text-base leading-8 text-white/75 md:text-lg md:leading-9">
            {t.description}
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={`${prefix}/products`}
              className="inline-flex min-h-14 items-center justify-center bg-[#d5a86e] px-8 font-bold text-[#17110b] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ebc995]"
            >
              {t.shopNow}
            </Link>

            <Link
              href={`${prefix}/offers`}
              className="
    inline-flex min-h-14 items-center justify-center
    border border-white/40
    bg-transparent
    px-8
    font-bold text-white
    transition-all duration-300 ease-out
    hover:-translate-y-0.5
    hover:border-[#d5a86e]
    hover:bg-[#d5a86e]
    hover:text-[#17110b]
    hover:shadow-[0_10px_35px_rgba(213,168,110,0.25)]
  "
            >
              {t.offers}
            </Link>
          </div>

          {/* Features */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-7 text-sm text-white/75">
            <div className="flex items-center gap-2.5">
              <Truck size={18} strokeWidth={1.7} className="text-[#d5a86e]" />

              <span>{t.delivery}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} strokeWidth={1.7} className="text-[#d5a86e]" />

              <span>{t.selected}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <PackageCheck size={18} strokeWidth={1.7} className="text-[#d5a86e]" />

              <span>{t.packaging}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-1/2 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d5a86e]/40 to-transparent" />
    </section>
  );
}
