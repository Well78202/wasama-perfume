
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Crown } from "lucide-react";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ProductCard from "@/app/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug },
    select: {
      nameEn: true,
      isActive: true,
    },
  });

  if (!brand || !brand.isActive) {
    return { title: "Brand Not Found" };
  }

  return {
    title: `${brand.nameEn} Perfumes`,
    description: `Explore and shop ${brand.nameEn} fragrances at Wasama Perfume.`,
    alternates: {
      canonical: `/en/brands/${slug}`,
      languages: {
        "ar-EG": `/brands/${slug}`,
        en: `/en/brands/${slug}`,
      },
    },
  };
}

export default async function EnglishBrandPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: [
          { isFeatured: "desc" },
          { isBestSeller: "desc" },
          { createdAt: "desc" },
        ],
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!brand || !brand.isActive) {
    notFound();
  }

  return (
    <div lang="en" dir="ltr" className="en-page">
      <Header locale="en" />

      <main className="min-h-screen bg-[#fffaf3]">
        {/* Breadcrumb */}
        <div className="border-b border-black/10">
          <div className="mx-auto flex max-w-360 items-center gap-2 px-5 py-4 text-xs text-neutral-500 lg:px-8">
            <Link href="/en" className="hover:text-[#a66d36]">
              Home
            </Link>

            <ChevronRight size={13} />

            <Link
              href="/en/brands"
              className="hover:text-[#a66d36]"
            >
              Brands
            </Link>

            <ChevronRight size={13} />

            <span className="font-semibold text-[#171411]">
              {brand.nameEn}
            </span>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden bg-[#171411]">
          <div className="pointer-events-none absolute left-1/2 -top-40 h-130 w-130 -translate-x-1/2 rounded-full bg-[#a66d36]/20 blur-3xl" />

          <div className="relative mx-auto max-w-360 px-5 py-16 text-center sm:py-20 lg:px-8">
            <Crown
              size={28}
              className="mx-auto mb-5 text-[#d5a86e]"
            />

            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-[#d5a86e]">
              FRAGRANCE HOUSE
            </p>

            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              {brand.nameEn}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-white/65">
              Discover our selection of {brand.nameEn}
              fragrances at Wasama Perfume.
            </p>

            <span className="mt-7 inline-flex rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold text-white/75">
              {brand.products.length}{" "}
              {brand.products.length === 1
                ? "Product"
                : "Products"}
            </span>
          </div>
        </section>

        {/* Products */}
        <section className="mx-auto max-w-360 px-5 py-16 lg:px-8 lg:py-20">
          <div className="mb-10 flex items-end justify-between gap-4 border-b border-black/10 pb-5">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.15em] text-[#a66d36]">
                {brand.nameEn.toUpperCase()} COLLECTION
              </p>

              <h2 className="text-2xl font-extrabold text-[#171411] sm:text-3xl">
                {brand.nameEn} Perfumes
              </h2>
            </div>

            <p className="text-sm text-neutral-500">
              {brand.products.length} Products
            </p>
          </div>

          {brand.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
              {brand.products.map((product) => (
                <ProductCard
                  key={product.id}
                  locale="en"
                  product={{
                    name: product.nameEn,
                    brand: brand.nameEn,
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
            <div className="rounded-3xl border border-[#e5d8c8] bg-[#f7eee3] px-6 py-20 text-center">
              <h3 className="text-xl font-extrabold text-[#171411]">
                No Products Available
              </h3>

              <p className="mt-3 text-sm text-neutral-500">
                New fragrances from {brand.nameEn} will be
                available soon.
              </p>

              <Link
                href="/en/brands"
                className="mt-6 inline-flex rounded-full bg-[#171411] px-6 py-3 text-sm font-bold text-white hover:bg-[#a66d36]"
              >
                Browse Brands
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer locale="en" />
    </div>
  );
}
