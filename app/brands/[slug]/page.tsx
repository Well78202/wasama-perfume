import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Crown,
} from "lucide-react";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ProductCard from "@/app/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

type BrandPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* ================= METADATA ================= */

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: {
      slug,
    },

    select: {
      nameAr: true,
      nameEn: true,
      isActive: true,
    },
  });

  if (!brand || !brand.isActive) {
    return {
      title: "الماركة غير موجودة",
    };
  }

  return {
    title: `عطور ${brand.nameAr}`,

    description: `تسوق عطور ${brand.nameAr} من وسامة برفيوم واكتشف مجموعة مختارة من عطور ${brand.nameEn}.`,

    alternates: {
      canonical: `/brands/${slug}`,

      languages: {
        "ar-EG": `/brands/${slug}`,
        en: `/en/brands/${slug}`,
      },
    },
  };
}

/* ================= PAGE ================= */

export default async function BrandPage({
  params,
}: BrandPageProps) {
  const { slug } = await params;

  /* ================= BRAND ================= */

  const brand = await prisma.brand.findUnique({
    where: {
      slug,
    },

    include: {
      products: {
        where: {
          isActive: true,
        },

        orderBy: [
          {
            isFeatured: "desc",
          },
          {
            isBestSeller: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },

            take: 1,
          },

          category: true,
        },
      },
    },
  });

  if (!brand || !brand.isActive) {
    notFound();
  }

  return (
    <>
      <Header locale="ar" />

      <main className="min-h-screen bg-[#fffaf3]">
        {/* ================= BREADCRUMB ================= */}

        <div className="border-b border-black/10">
          <div className="mx-auto flex max-w-360 items-center gap-2 px-5 py-4 text-xs text-neutral-500 lg:px-8">
            <Link
              href="/"
              className="transition-colors hover:text-[#a66d36]"
            >
              الرئيسية
            </Link>

            <ChevronLeft size={13} />

            <Link
              href="/brands"
              className="transition-colors hover:text-[#a66d36]"
            >
              الماركات
            </Link>

            <ChevronLeft size={13} />

            <span className="truncate font-semibold text-[#171717]">
              {brand.nameAr}
            </span>
          </div>
        </div>

        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden bg-[#171411]">
          {/* Decorative glow */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute left-1/2 -top-60
              h-150 w-150
              -translate-x-1/2
              rounded-full
              bg-[#a66d36]/20
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -bottom-25 inset-s-[10%]
              h-64 w-64
              rounded-full
              bg-[#d5a86e]/5
              blur-3xl
            "
          />

          <div className="relative mx-auto max-w-360 px-5 py-16 text-center sm:py-20 lg:px-8 lg:py-24">
            {/* Icon */}

            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5">
              <Crown
                size={20}
                className="text-[#d5a86e]"
              />
            </div>

            {/* Label */}

            <p className="mb-4 text-xs font-bold tracking-[0.25em] text-[#d5a86e]">
              بيت العطور
            </p>

            {/* English Brand Name */}

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
              {brand.nameEn}
            </p>

            {/* Arabic Brand Name */}

            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              {brand.nameAr}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
              اكتشف مجموعة عطور {brand.nameAr} المتاحة لدى
              وسامة برفيوم واختر العطر المناسب لذوقك.
            </p>

            {/* Count */}

            <div className="mt-7 flex justify-center">
              <span className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold text-white/70 backdrop-blur-sm">
                {brand.products.length}{" "}
                {brand.products.length === 1
                  ? "منتج"
                  : "منتجات"}
              </span>
            </div>
          </div>
        </section>

        {/* ================= PRODUCTS ================= */}

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-360 px-5 lg:px-8">
            {/* Heading */}

            <div className="mb-10 flex items-end justify-between gap-5 border-b border-black/10 pb-5 sm:mb-12">
              <div>
                <p className="mb-2 text-xs font-bold tracking-[0.16em] text-[#a66d36]">
                  مجموعة {brand.nameAr}
                </p>

                <h2 className="text-2xl font-extrabold text-[#171411] sm:text-3xl">
                  عطور {brand.nameAr}
                </h2>
              </div>

              <p className="shrink-0 text-sm text-neutral-500">
                <span className="font-bold text-[#171411]">
                  {brand.products.length}
                </span>{" "}
                {brand.products.length === 1
                  ? "منتج"
                  : "منتجات"}
              </p>
            </div>

            {/* ================= PRODUCT GRID ================= */}

            {brand.products.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
                {brand.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    locale="ar"
                    product={{
                      name: product.nameAr,

                      brand: brand.nameAr,

                      slug: product.slug,

                      image:
                        product.images[0]?.url ??
                        "/images/products/placeholder.jpg",

                      price: Number(product.price),

                      oldPrice:
                        product.oldPrice !== null
                          ? Number(product.oldPrice)
                          : undefined,

                      badge: product.isBestSeller
                        ? "الأكثر مبيعًا"
                        : product.isFeatured
                          ? "مميز"
                          : undefined,
                    }}
                  />
                ))}
              </div>
            ) : (
              /* ================= EMPTY ================= */

              <div className="flex min-h-80 items-center justify-center rounded-3xl border border-[#e5d8c8] bg-[#f7eee3] px-6 text-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#171411]">
                    لا توجد منتجات حاليًا
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    سيتم إضافة عطور جديدة من {brand.nameAr} قريبًا.
                  </p>

                  <Link
                    href="/brands"
                    className="
                      mt-6
                      inline-flex min-h-11
                      items-center justify-center gap-2
                      rounded-full
                      bg-[#e2ddd8]
                      px-6
                      text-sm font-bold
                      transition-colors
                      hover:bg-[#a66d36]
                    "
                  >
                    تصفح الماركات

                    <ChevronLeft size={15} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= FOOT CTA ================= */}

        {brand.products.length > 0 && (
          <section className="px-5 pb-16 sm:pb-20 lg:px-8 lg:pb-24">
            <div className="mx-auto max-w-360 border-t border-black/10 pt-10">
              <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-start">
                <div>
                  <p className="text-sm text-neutral-500">
                    اكتشف المزيد من بيوت العطور
                  </p>

                  <h3 className="mt-1 text-xl font-extrabold text-[#171411]">
                    تصفح جميع الماركات
                  </h3>
                </div>

                <Link
                  href="/brands"
                  className="
                    inline-flex min-h-11
                    items-center justify-center gap-2
                    rounded-full
                    border border-[#d8c8b4]
                    px-6
                    text-sm font-bold
                    text-[#171411]
                    transition-all
                    hover:border-[#a66d36]
                    hover:text-[#a66d36]
                  "
                >
                  جميع الماركات

                  <ChevronLeft size={16} />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer locale="ar" />
    </>
  );
}