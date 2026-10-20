import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ProductCard from "@/app/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* ================= METADATA ================= */

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: {
      slug,
    },

    select: {
      nameEn: true,
      descriptionEn: true,
      isActive: true,
    },
  });

  if (!category || !category.isActive) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: category.nameEn,

    description:
      category.descriptionEn ??
      `Shop ${category.nameEn} at Wasama Perfume.`,

    alternates: {
      canonical: `/en/categories/${slug}`,

      languages: {
        "ar-EG": `/categories/${slug}`,
        "en": `/en/categories/${slug}`,
      },
    },
  };
}

/* ================= PAGE ================= */

export default async function EnglishCategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
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
    <>
      <Header locale="en" />

      <main
        dir="ltr"
        className="min-h-screen bg-[#fffaf3] text-left"
      >
        {/* ================= BREADCRUMB ================= */}

        <div className="border-b border-black/10">
          <div className="mx-auto flex max-w-360 items-center gap-2 px-5 py-4 text-xs text-neutral-500 lg:px-8">
            <Link
              href="/en"
              className="transition-colors hover:text-[#a66d36]"
            >
              Home
            </Link>

            <ChevronRight size={13} />

            <Link
              href="/en/categories"
              className="transition-colors hover:text-[#a66d36]"
            >
              Categories
            </Link>

            <ChevronRight size={13} />

            <span className="truncate font-semibold text-[#171717]">
              {category.nameEn}
            </span>
          </div>
        </div>

        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden bg-[#171411]">
          {/* Glow */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute left-1/2 top-[-200px]
              h-[500px] w-[500px]
              -translate-x-1/2
              rounded-full
              bg-[#a66d36]/20
              blur-3xl
            "
          />

          <div className="relative mx-auto max-w-360 px-5 py-16 text-center sm:py-20 lg:px-8 lg:py-24">
            {/* Small Title */}

            <p className="mb-4 text-xs font-bold tracking-[0.25em] text-[#d5a86e]">
              WASAMA PERFUME
            </p>

            {/* Category Name */}

            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              {category.nameEn}
            </h1>

            {/* Description */}

            {category.descriptionEn && (
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/60 sm:text-base">
                {category.descriptionEn}
              </p>
            )}
          </div>
        </section>

        {/* ================= PRODUCTS ================= */}

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-360 px-5 lg:px-8">
            {/* Top Bar */}

            <div className="mb-10 flex items-end justify-between gap-5 border-b border-black/10 pb-5">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-[#a66d36]">
                  COLLECTION
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-[#171717] sm:text-3xl">
                  {category.nameEn}
                </h2>
              </div>

              <p className="shrink-0 text-sm text-neutral-500">
                <span className="font-bold text-[#171717]">
                  {category.products.length}
                </span>{" "}
                {category.products.length === 1
                  ? "Product"
                  : "Products"}
              </p>
            </div>

            {/* ================= PRODUCT GRID ================= */}

            {category.products.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    locale="en"
                    product={{
                      name: product.nameEn,

                      brand:
                        product.brand?.nameEn ?? "",

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
                        ? "BEST SELLER"
                        : product.isFeatured
                          ? "FEATURED"
                          : undefined,
                    }}
                  />
                ))}
              </div>
            ) : (
              /* ================= EMPTY STATE ================= */

              <div className="flex min-h-80 items-center justify-center rounded-[24px] border border-[#e5d8c8] bg-[#f7eee3] px-6 text-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#171717]">
                    No Products Available
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    New products will be added to this collection
                    soon.
                  </p>

                  <Link
                    href="/en/products"
                    className="
                      mt-6
                      inline-flex min-h-11
                      items-center justify-center
                      rounded-full
                      bg-[#171717]
                      px-6
                      text-sm font-bold
                      text-white
                      transition-colors
                      hover:bg-[#a66d36]
                    "
                  >
                    View All Perfumes
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= BOTTOM LINK ================= */}

        {category.products.length > 0 && (
          <section className="px-5 pb-16 sm:pb-20 lg:px-8 lg:pb-24">
            <div className="mx-auto max-w-360 border-t border-black/10 pt-10 text-center">
              <p className="text-sm text-neutral-500">
                Looking for something different?
              </p>

              <Link
                href="/en/categories"
                className="
                  mt-4
                  inline-flex items-center gap-2
                  text-sm font-bold
                  text-[#a66d36]
                  transition-colors
                  hover:text-[#171717]
                "
              >
                Explore All Categories

                <ChevronRight size={16} />
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer locale="en" />
    </>
  );
}