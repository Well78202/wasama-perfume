
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Perfume Brands",
  description:
    "Explore luxury perfume brands at Wasama Perfume. Shop fragrances from Dior, Chanel, Armani and more.",
  alternates: {
    canonical: "/en/brands",
    languages: {
      "ar-EG": "/brands",
      en: "/en/brands",
    },
  },
};

export default async function EnglishBrandsPage() {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { nameEn: "asc" },
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true },
          },
        },
      },
    },
  });

  return (
    <div lang="en" dir="ltr" className="en-page">
      <Header locale="en" />

      <main className="min-h-screen bg-[#fffaf3] text-left">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-black/10">
          <div className="pointer-events-none absolute left-1/2 -top-50 h-130 w-130 -translate-x-1/2 rounded-full bg-[#c99358]/10 blur-3xl" />

          <div className="relative mx-auto max-w-360 px-5 py-16 text-center sm:py-20 lg:px-8 lg:py-24">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#c69560]" />
              <Crown size={15} className="text-[#a66d36]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#a66d36]">
                WASAMA PERFUME
              </span>
              <span className="h-px w-8 bg-[#c69560]" />
            </div>

            <h1 className="text-4xl font-extrabold text-[#171411] sm:text-5xl lg:text-6xl">
              Perfume Brands
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-neutral-600 sm:text-base">
              Explore our selection of fragrance houses and
              discover perfumes from your favorite brands.
            </p>
          </div>
        </section>

        {/* BRANDS */}
        <section className="py-14 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-360 px-5 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-5 border-b border-black/10 pb-5 sm:mb-12">
              <div>
                <p className="mb-2 text-xs font-bold tracking-[0.16em] text-[#a66d36]">
                  SHOP BY BRAND
                </p>
                <h2 className="text-2xl font-extrabold text-[#171411] sm:text-3xl">
                  All Brands
                </h2>
              </div>

              <p className="text-sm text-neutral-500">
                <span className="font-bold text-[#171411]">
                  {brands.length}
                </span>{" "}
                {brands.length === 1 ? "Brand" : "Brands"}
              </p>
            </div>

            {brands.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                {brands.map((brand, index) => (
                  <Link
                    key={brand.id}
                    href={`/en/brands/${brand.slug}`}
                    className="group relative flex min-h-65 flex-col justify-between overflow-hidden rounded-[22px] border border-[#e4d7c6] bg-[#f8f0e6] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c99a62] hover:shadow-lg sm:p-6"
                  >
                    <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#c99358]/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />

                    {/* Count */}
                    <div className="relative flex items-start justify-between">
                      <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="rounded-full border border-[#dfd0bd] px-3 py-1 text-[10px] font-semibold text-[#80664c]">
                        {brand._count.products}{" "}
                        {brand._count.products === 1
                          ? "Product"
                          : "Products"}
                      </span>
                    </div>

                    {/* Logo & Name */}
                    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 py-7 text-center">
                      {brand.logo ? (
                        <div className="relative flex h-24 w-full max-w-44 items-center justify-center sm:h-28">
                          <Image
                            src={brand.logo}
                            alt={`${brand.nameEn} logo`}
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
                          {brand.nameEn}
                        </h3>

                        <p className="mt-1 text-xs text-neutral-500">
                          {brand.nameAr}
                        </p>
                      </div>
                    </div>

                    {/* Link */}
                    <div className="relative flex items-center justify-between border-t border-[#ded0bd] pt-4">
                      <span className="text-xs font-bold text-[#171411]">
                        Explore Fragrances
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171411] text-white transition-colors group-hover:bg-[#a66d36]">
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#e5d8c8] bg-[#f7eee3] px-6 py-20 text-center">
                <h2 className="text-xl font-bold">
                  No Brands Available
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  New brands will be added soon.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-16 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-360">
            <div className="relative overflow-hidden rounded-[30px] bg-[#171411] px-6 py-12 text-center sm:px-10 sm:py-16">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a66d36]/20 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-bold tracking-[0.2em] text-[#d5a86e]">
                  ALL FRAGRANCES
                </p>

                <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                  Discover Our Full Collection
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60">
                  Browse all available perfumes from different
                  brands and collections in one place.
                </p>

                <Link
                  href="/en/products"
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#fffaf3] px-7 text-sm font-bold text-[#171411] transition-colors hover:bg-[#d5a86e]"
                >
                  View All Perfumes
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale="en" />
    </div>
  );
}
