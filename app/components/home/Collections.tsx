import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { getMessages, type Locale } from "@/lib/translations";

type CollectionsProps = {
  locale: Locale;
};

export default function Collections({ locale }: CollectionsProps) {
  const t = getMessages(locale).Collections;

  const isArabic = locale === "ar";
  const prefix = isArabic ? "" : "/en";
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-[#fffaf3] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-360 px-5 lg:px-8">

        <div
          className="
            group relative
            min-h-135
            overflow-hidden
            rounded-[22px]
            bg-[#17120e]
            sm:min-h-150
            lg:min-h-155
          "
        >
          {/* ================= BACKGROUND ================= */}

          <div
            className={`
              absolute inset-0
              ${isArabic ? "-scale-x-100" : ""}
            `}
          >
            <Image
              src="/images/collections/oriental-collection.jpg"
              alt=""
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 95vw, 1440px"
              className="
                object-cover
                object-center
                transition-transform
                duration-[1200ms]
                ease-out
                group-hover:scale-[1.03]
              "
            />
          </div>

          {/* ================= OVERLAYS ================= */}

          <div className="absolute inset-0 bg-black/15" />

          {/* Desktop directional gradient */}
          <div
            className={`
              absolute inset-0 hidden sm:block
              ${
                isArabic
                  ? "bg-linear-to-l from-black/95 via-black/65 to-black/5"
                  : "bg-linear-to-r from-black/95 via-black/65 to-black/5"
              }
            `}
          />

          {/* Mobile gradient */}
          <div
            className="
              absolute inset-0
              bg-linear-to-t
              from-black/95
              via-black/55
              to-black/10
              sm:hidden
            "
          />

          {/* Bottom shadow */}
          <div
            className="
              absolute inset-x-0 bottom-0
              h-52
              bg-gradient-to-t
              from-black/60
              to-transparent
            "
          />

          {/* ================= FRAME ================= */}

          <div
            className="
              pointer-events-none
              absolute inset-4 z-10
              rounded-[14px]
              border border-white/15
              sm:inset-6
            "
          />

          {/* ================= CONTENT ================= */}

          <div
            className="
              relative z-20
              flex min-h-[540px]
              items-end
              px-8 py-14
              sm:min-h-[600px]
              sm:items-center
              sm:px-12
              sm:py-16
              lg:min-h-[620px]
              lg:px-16
            "
          >
            <div
              className={`
                max-w-[590px] text-white
                ${isArabic ? "text-right" : "text-left"}
              `}
            >
              {/* Eyebrow */}

              <div
                className={`
                  mb-5 flex items-center gap-3
                  ${isArabic ? "flex-row" : "flex-row"}
                `}
              >
                <span className="h-px w-9 shrink-0 bg-[#d5a86e]" />

                <p
                  className="
                    text-xs font-bold
                    tracking-[0.18em]
                    text-[#e1b77f]
                  "
                >
                  {t.eyebrow}
                </p>
              </div>

              {/* Title */}

              <h2
                className="
                  text-4xl font-extrabold
                  leading-[1.2]
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                {t.title}

                <span className="mt-2 block text-[#d5a86e]">
                  {t.highlight}
                </span>
              </h2>

              {/* Description */}

              <p
                className="
                  mt-6
                  max-w-[530px]
                  text-sm
                  leading-8
                  text-white/75
                  sm:text-base
                "
              >
                {t.description}
              </p>

              {/* CTA */}

              <Link
                href={`${prefix}/categories/oriental`}
                className="
                  group/button
                  mt-9 inline-flex
                  min-h-14
                  items-center
                  justify-center
                  gap-3
                  bg-[#d5a86e]
                  px-7
                  font-bold
                  text-[#17110b]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#ebc995]
                  hover:shadow-[0_12px_35px_rgba(213,168,110,0.25)]
                "
              >
                <span>{t.cta}</span>

                <ArrowIcon
                  size={18}
                  className={`
                    transition-transform duration-300
                    ${
                      isArabic
                        ? "group-hover/button:-translate-x-1"
                        : "group-hover/button:translate-x-1"
                    }
                  `}
                />
              </Link>
            </div>
          </div>

          {/* ================= SIGNATURE ================= */}

          <span
            className="
              absolute bottom-8 end-9 z-20
              hidden
              text-xs font-medium
              tracking-[0.3em]
              text-white/35
              sm:block
            "
          >
            01 / WASAMA
          </span>
        </div>
      </div>
    </section>
  );
}