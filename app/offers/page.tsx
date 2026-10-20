
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SiteLayout from "@/app/components/layout/SiteLayout";
import ProductCard from "@/app/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "العروض والخصومات",
  description:
    "اكتشف عروض وسامة برفيوم على مجموعة مميزة من العطور الرجالي والحريمي والشرقي.",
  alternates: {
    canonical: "/offers",
    languages: {
      "ar-EG": "/offers",
      en: "/en/offers",
      "x-default": "/offers",
    },
  },
};

export default async function OffersPage() {
  const category = await prisma.category.findUnique({
    where: {
      slug: "offers",
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
          brand: true,

          images: {
            orderBy: {
              sortOrder: "asc",
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  return (
    <SiteLayout locale="ar">
      <main className="min-h-screen bg-[#fffaf3]">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#171411]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#a66d36]/15 blur-3xl"
          />

          <div className="relative mx-auto max-w-360 px-5 py-16 text-center sm:py-20 lg:px-8 lg:py-24">
            <p className="mb-4 text-xs font-bold tracking-[0.25em] text-[#d5a86e]">
              وسامة برفيوم
            </p>

            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              {category.nameAr}
            </h1>

            {category.descriptionAr && (
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/60 sm:text-base">
                {category.descriptionAr}
              </p>
            )}
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-360 px-5 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-5 border-b border-black/10 pb-5">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-[#a66d36]">
                  المجموعة
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-[#171717] sm:text-3xl">
                  {category.nameAr}
                </h2>
              </div>

              <p className="shrink-0 text-sm text-neutral-500">
                <span className="font-bold text-[#171717]">
                  {category.products.length}
                </span>{" "}
                منتج
              </p>
            </div>

            {category.products.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    locale="ar"
                    product={{
                      name: product.nameAr,

                      brand: product.brand?.nameAr ?? "",

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
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-[#e5d8c8] bg-[#f8f0e6] px-6 text-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#171717]">
                    لا توجد عروض حاليًا
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    ترقب إضافة عروض ومنتجات جديدة قريبًا.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
