import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
} from "lucide-react";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
export const metadata: Metadata = {
  title: "ماركات العطور",
  description:
    "اكتشف أشهر ماركات العطور في وسامة برفيوم وتسوق مجموعات مختارة من العطور الرجالية والحريمية والشرقية.",
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    where: {
      isActive: true,
    },

    orderBy: {
      nameEn: "asc",
    },

    include: {
      _count: {
        select: {
          products: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
  });

  return (
    <>
      <Header locale="ar" />

      <main className="min-h-screen bg-[#fffaf3]">
        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden border-b border-black/10">
          {/* Glow */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute left-1/2 -top-50
              h-130 w-130
              -translate-x-1/2
              rounded-full
              bg-[#c99358]/10
              blur-3xl
            "
          />

          <div className="relative mx-auto max-w-360 px-5 py-16 text-center sm:py-20 lg:px-8 lg:py-24">
            {/* Eyebrow */}
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#c69560]" />

              <Crown
                size={15}
                className="text-[#a66d36]"
              />

              <span className="text-xs font-bold tracking-[0.2em] text-[#a66d36]">
                وسامة برفيوم
              </span>

              <span className="h-px w-8 bg-[#c69560]" />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-[#171411] sm:text-5xl lg:text-6xl">
              ماركات العطور
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-neutral-600 sm:text-base">
              اكتشف مجموعة من أشهر بيوت وماركات العطور واختر
              عطرك المفضل من مجموعاتنا المختارة.
            </p>
          </div>
        </section>

        {/* ================= BRANDS ================= */}

        <section className="py-14 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-360 px-5 lg:px-8">
            {/* Heading */}

            <div className="mb-10 flex items-end justify-between gap-5 border-b border-black/10 pb-5 sm:mb-12">
              <div>
                <p className="mb-2 text-xs font-bold tracking-[0.16em] text-[#a66d36]">
                  تسوق حسب الماركة
                </p>

                <h2 className="text-2xl font-extrabold text-[#171411] sm:text-3xl">
                  جميع الماركات
                </h2>
              </div>

              <p className="text-sm text-neutral-500">
                <span className="font-bold text-[#171411]">
                  {brands.length}
                </span>{" "}
                ماركة
              </p>
            </div>

            {/* ================= BRAND GRID ================= */}

            {brands.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                {brands.map((brand, index) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.slug}`}
                    className="
                      group
                      relative
                      flex min-h-52.5
                      flex-col
                      justify-between
                      overflow-hidden
                      rounded-[22px]
                      border border-[#e4d7c6]
                      bg-[#f8f0e6]
                      p-5
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-[#c99a62]
                      hover:shadow-[0_18px_45px_rgba(74,48,24,0.10)]
                      sm:min-h-60
                      sm:p-6
                    "
                  >
                    {/* Decorative glow */}

                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute -inset-e-14 -top-14
                        h-36 w-36
                        rounded-full
                        bg-[#c99358]/10
                        blur-2xl
                        transition-transform
                        duration-500
                        group-hover:scale-150
                      "
                    />

                    {/* Top */}

                    <div className="relative flex items-start justify-between">
                      <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-400">
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span
                        className="
                          rounded-full
                          border border-[#dfd0bd]
                          px-3 py-1
                          text-[10px] font-semibold
                          text-[#80664c]
                        "
                      >
                        {brand._count.products}{" "}
                        {brand._count.products === 1
                          ? "منتج"
                          : "منتجات"}
                      </span>
                    </div>

                    {/* Brand */}
{/* Brand Logo & Name */}

<div className="relative flex flex-1 flex-col items-center justify-center gap-4 py-7 text-center">
  {brand.logo ? (
    <div className="relative flex h-24 w-full max-w-44 items-center justify-center sm:h-28">
      <Image
        src={brand.logo}
        alt={`شعار ${brand.nameAr}`}
        fill
        sizes="(max-width: 640px) 160px, 176px"
        className="object-contain transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  ) : (
    <div className="flex h-24 items-center justify-center sm:h-28">
      <Crown
        size={34}
        strokeWidth={1.2}
        className="text-[#b98b58]/60"
      />
    </div>
  )}

  <div>
    <h3 className="text-lg font-extrabold text-[#171411] transition-colors group-hover:text-[#a66d36] sm:text-xl">
      {brand.nameAr}
    </h3>

    <p
      dir="ltr"
      className="mt-1 text-xs font-semibold tracking-wide text-neutral-500"
    >
      {brand.nameEn}
    </p>
  </div>
</div>
                    {/* Bottom */}

                    <div className="relative flex items-center justify-between border-t border-[#ded0bd] pt-4">
                      <span className="text-xs font-bold text-[#171411]">
                        اكتشف العطور
                      </span>

                      <span
                        className="
                          flex h-9 w-9
                          items-center justify-center
                          rounded-full
                          bg-[#171411]
                          text-white
                          transition-all duration-300
                          group-hover:bg-[#a66d36]
                        "
                      >
                        <ArrowLeft
                          size={15}
                          className="transition-transform duration-300 group-hover:-translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex min-h-80 items-center justify-center rounded-3xl border border-[#e5d8c8] bg-[#f7eee3] px-6 text-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#171411]">
                    لا توجد ماركات حاليًا
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    سيتم إضافة ماركات جديدة قريبًا.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= ALL PRODUCTS CTA ================= */}

        <section className="px-5 pb-16 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-360">
            <div className="relative overflow-hidden rounded-[30px] bg-[#171411] px-6 py-12 text-center sm:px-10 sm:py-16">
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute left-1/2 top-1/2
                  h-80 w-80
                  -translate-x-1/2 -translate-y-1/2
                  rounded-full
                  bg-[#a66d36]/20
                  blur-3xl
                "
              />

              <div className="relative">
                <p className="text-xs font-bold tracking-[0.2em] text-[#d5a86e]">
                  جميع العطور
                </p>

                <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                  اكتشف مجموعتنا الكاملة
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60">
                  تصفح جميع العطور المتاحة من مختلف الماركات
                  والمجموعات في مكان واحد.
                </p>

                <Link
                  href="/products"
                  className="
                    mt-7
                    inline-flex min-h-12
                    items-center justify-center gap-2
                    rounded-full
                    bg-[#fffaf3]
                    px-7
                    text-sm font-bold
                    text-[#171411]
                    transition-colors
                    hover:bg-[#d5a86e]
                  "
                >
                  عرض كل العطور

                  <ArrowLeft size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale="ar" />
    </>
  );
}