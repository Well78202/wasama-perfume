
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getMessages, type Locale } from "@/lib/translations";
import BestSellersSlider from "./BestSellersSlider";

type BestSellersProps = {
  locale: Locale;
};

export default async function BestSellers({
  locale,
}: BestSellersProps) {
  const t = getMessages(locale).BestSellers;

  const isArabic = locale === "ar";
  const prefix = isArabic ? "" : "/en";
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  // Fetch products from database
  const dbProducts = await prisma.product.findMany({
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
    take: 12,
  });

  // Convert database products to ProductCard format
  const products = dbProducts.map((product) => ({
    name: isArabic ? product.nameAr : product.nameEn,

    brand: isArabic
      ? (product.brand?.nameAr ?? "")
      : (product.brand?.nameEn ?? ""),

    slug: product.slug,

    image:
      product.images[0]?.url ??
      "/images/products/placeholder.jpg",

    price: Number(product.price),

    oldPrice:
      product.oldPrice !== null
        ? Number(product.oldPrice)
        : undefined,

    badge: isArabic
      ? "الأكثر مبيعًا"
      : "BEST SELLER",
  }));

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-8">

        {/* Section Heading */}
        <div className="mb-10 flex items-end justify-between gap-6 lg:mb-12">
          <div className="max-w-2xl">

            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#a66d36]">
              {t.eyebrow}
            </p>

            <h2 className="text-3xl font-extrabold text-[#171717] sm:text-4xl lg:text-5xl">
              {t.title}
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-neutral-600">
              {t.description}
            </p>
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
                isArabic
                  ? "group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
              }`}
            />
          </Link>
        </div>

        {/* Products Slider */}
        {products.length > 0 ? (
          <BestSellersSlider
            locale={locale}
            products={products}
          />
        ) : (
          <div className="flex min-h-60 items-center justify-center border border-neutral-200 bg-[#fffaf3] px-6 text-center">
            <p className="text-sm text-neutral-500 sm:text-base">
              {isArabic
                ? "لا توجد منتجات في الأكثر مبيعًا حاليًا."
                : "No best-selling products are available yet."}
            </p>
          </div>
        )}

        {/* Mobile View All */}
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

            <ArrowIcon size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
