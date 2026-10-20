import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Prisma } from "@prisma/client";

import ProductCard from "@/app/components/product/ProductCard";
import { prisma } from "@/lib/prisma";
import { getMessages, type Locale } from "@/lib/translations";

type BestSellersProps = {
  locale: Locale;
};

type BestSellerProduct = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    images: true;
  };
}>;

type ProductCardData = {
  name: string;
  brand: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number;
  badge: string;
};

export default async function BestSellers({ locale }: BestSellersProps) {
  const t = getMessages(locale).BestSellers;

  const isArabic = locale === "ar";
  const prefix = isArabic ? "" : "/en";
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const dbProducts: BestSellerProduct[] = await prisma.product.findMany({
    where: {
      isActive: true,
      isBestSeller: true,
    },

    include: {
      brand: true,

      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 4,
  });

  const products: ProductCardData[] = dbProducts.map((product: BestSellerProduct) => ({
    name: isArabic ? product.nameAr : product.nameEn,

    brand: isArabic ? (product.brand?.nameAr ?? "") : (product.brand?.nameEn ?? ""),

    slug: product.slug,

    image: product.images[0]?.url ?? "/images/products/placeholder.jpg",

    price: Number(product.price),

    oldPrice: product.oldPrice !== null ? Number(product.oldPrice) : undefined,

    badge: isArabic ? "الأكثر مبيعًا" : "BEST SELLER",
  }));

  return (
    <section className="overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-360 px-5 lg:px-8">
        {/* Heading */}
        <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#a66d36]">{t.eyebrow}</p>

            <h2 className="text-3xl font-extrabold text-[#171717] sm:text-4xl lg:text-5xl">{t.title}</h2>

            <p className="mt-4 max-w-xl leading-7 text-neutral-600">{t.description}</p>
          </div>

          {/* Desktop View All */}
          <Link
            href={`${prefix}/products`}
            className="
              group hidden shrink-0 items-center gap-2
              border-b border-[#171717] pb-1
              text-sm font-bold text-[#171717]
              transition-colors duration-300
              hover:border-[#a66d36]
              hover:text-[#a66d36]
              sm:flex
            "
          >
            <span>{t.viewAll}</span>

            <ArrowIcon
              size={17}
              className={`transition-transform duration-300 ${
                isArabic ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
              }`}
            />
          </Link>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div
            className="
      grid grid-cols-2 gap-x-3 gap-y-6
      sm:grid-cols-2 sm:gap-5
      lg:grid-cols-4 lg:gap-6
    "
          >
            {products.map((product: ProductCardData) => (
              <div key={product.slug} className="min-w-0 w-full">
                <ProductCard locale={locale} product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-60 items-center justify-center border border-neutral-200 bg-[#fffaf3] px-6 text-center">
            <p className="text-sm text-neutral-500 sm:text-base">
              {isArabic ? "لا توجد منتجات في الأكثر مبيعًا حاليًا." : "No best-selling products are available yet."}
            </p>
          </div>
        )}

        {/* Mobile View All */}
        {products.length > 0 && (
          <div className="mt-10 text-center sm:hidden">
            <Link
              href={`${prefix}/products`}
              className="
                group inline-flex min-h-12
                items-center justify-center gap-2
                border border-[#171717]
                px-7 text-sm font-bold
                text-[#171717]
                transition-all duration-300
                hover:border-[#a66d36]
                hover:bg-[#a66d36]
                hover:text-white
              "
            >
              <span>{t.viewAll}</span>

              <ArrowIcon
                size={17}
                className={`transition-transform duration-300 ${
                  isArabic ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
                }`}
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
