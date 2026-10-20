import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Perfume Categories | Wasama Perfume",
  description:
    "Explore perfume categories at Wasama Perfume and shop men's, women's and oriental fragrances.",
};

export default async function EnglishCategoriesPage() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },

    orderBy: {
      createdAt: "asc",
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
      <Header locale="en" />

      <main
        dir="ltr"
        className="min-h-screen bg-[#fffaf3] text-left"
      >
        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden border-b border-black/10">
          {/* Background decoration */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute left-1/2 top-[-180px]
              h-[500px] w-[500px]
              -translate-x-1/2
              rounded-full
              bg-[#c99358]/10
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute bottom-0 start-[10%]
              h-40 w-40
              rounded-full
              bg-[#a66d36]/5
              blur-3xl
            "
          />

          <div className="relative mx-auto max-w-360 px-5 py-16 text-center sm:py-20 lg:px-8 lg:py-24">
            {/* Small Title */}

            <div className="mb-5 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-[#c69560]" />

              <Sparkles
                size={14}
                className="text-[#a66d36]"
              />

              <p className="text-xs font-bold tracking-[0.22em] text-[#a66d36]">
                WASAMA PERFUME
              </p>

              <span className="h-px w-8 bg-[#c69560]" />
            </div>

            {/* Title */}

            <h1 className="text-4xl font-extrabold leading-tight text-[#171411] sm:text-5xl lg:text-6xl">
              Discover the World of Fragrance
            </h1>

            {/* Description */}

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-neutral-600 sm:text-base">
              Explore our carefully selected collections of
              men&apos;s, women&apos;s and oriental fragrances
              and find the scent that suits your style.
            </p>
          </div>
        </section>

        {/* ================= CATEGORIES ================= */}

        <section className="py-14 sm:py-18 lg:py-24">
          <div className="mx-auto max-w-360 px-5 lg:px-8">
            {/* Section Header */}

            <div className="mb-10 flex items-end justify-between gap-5 sm:mb-12">
              <div>
                <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#a66d36]">
                  SHOP BY CATEGORY
                </p>

                <h2 className="text-2xl font-extrabold text-[#171411] sm:text-3xl">
                  Our Collections
                </h2>
              </div>

              <p className="hidden text-sm text-neutral-500 sm:block">
                {categories.length}{" "}
                {categories.length === 1
                  ? "Category"
                  : "Categories"}
              </p>
            </div>

            {/* ================= CATEGORY CARDS ================= */}

            {categories.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => {
                  const image =
                    category.image ??
                    "/images/categories/placeholder.jpg";

                  return (
                    <Link
                      key={category.id}
                      href={`/en/categories/${category.slug}`}
                      className="
                        group
                        relative
                        block
                        overflow-hidden
                        rounded-[28px]
                        bg-[#171411]
                      "
                    >
                      {/* Image */}

                      <div className="relative h-[440px] sm:h-[500px] lg:h-[540px]">
                        <Image
                          src={image}
                          alt={category.nameEn}
                          fill
                          sizes="
                            (max-width: 768px) 100vw,
                            (max-width: 1024px) 50vw,
                            33vw
                          "
                          className="
                            object-cover
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-[1.05]
                          "
                        />

                        {/* Overlay */}

                        <div
                          className="
                            absolute inset-0
                            bg-gradient-to-t
                            from-black/85
                            via-black/15
                            to-black/5
                          "
                        />

                        {/* Number */}

                        <div className="absolute start-6 top-6">
                          <span
                            className="
                              flex h-10 w-10
                              items-center justify-center
                              rounded-full
                              border border-white/25
                              bg-black/10
                              text-xs font-bold
                              text-white
                              backdrop-blur-md
                            "
                          >
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>
                        </div>

                        {/* Content */}

                        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                          {/* Product Count */}

                          <p className="mb-3 text-xs font-semibold text-[#e2bd8d]">
                            {category._count.products}{" "}
                            {category._count.products === 1
                              ? "Product"
                              : "Products"}
                          </p>

                          {/* Category Name */}

                          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            {category.nameEn}
                          </h2>

                          {/* Description */}

                          {category.descriptionEn && (
                            <p
                              className="
                                mt-3
                                line-clamp-2
                                max-w-sm
                                text-sm
                                leading-7
                                text-white/65
                              "
                            >
                              {category.descriptionEn}
                            </p>
                          )}

                          {/* Explore */}

                          <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
                            <span className="text-sm font-bold text-white">
                              Explore Collection
                            </span>

                            <span
                              className="
                                flex h-11 w-11
                                items-center justify-center
                                rounded-full
                                bg-white
                                text-[#171411]
                                transition-all
                                duration-300
                                group-hover:bg-[#a66d36]
                                group-hover:text-white
                              "
                            >
                              <ArrowRight
                                size={18}
                                className="
                                  transition-transform
                                  duration-300
                                  group-hover:translate-x-1
                                "
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* ================= EMPTY STATE ================= */

              <div className="flex min-h-80 items-center justify-center rounded-[24px] border border-[#e5d8c8] bg-[#f7eee3] px-6 text-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#171411]">
                    No categories available
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    New fragrance categories will be added soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}

        <section className="px-5 pb-16 sm:pb-20 lg:px-8 lg:pb-24">
          <div
            className="
              relative
              mx-auto max-w-360
              overflow-hidden
              rounded-[30px]
              bg-[#171411]
              px-6 py-12
              text-center
              sm:px-10 sm:py-16
            "
          >
            {/* Decoration */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute left-1/2 top-1/2
                h-72 w-72
                -translate-x-1/2 -translate-y-1/2
                rounded-full
                bg-[#a66d36]/20
                blur-3xl
              "
            />

            <div className="relative">
              <p className="text-xs font-bold tracking-[0.2em] text-[#d5a86e]">
                WASAMA PERFUME
              </p>

              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                Not Sure What to Choose?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60">
                Browse our complete fragrance collection and
                discover the perfect scent for your style.
              </p>

              <Link
                href="/en/products"
                className="
                  mt-7
                  inline-flex min-h-12
                  items-center justify-center gap-2
                  rounded-full
                  bg-[#fffaf3]
                  px-7
                  text-sm font-bold
                  text-[#171411]
                  transition-all
                  hover:bg-[#d5a86e]
                "
              >
                View All Perfumes

                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale="en" />
    </>
  );
}