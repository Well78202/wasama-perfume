
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getMessages, type Locale } from "@/lib/translations";
import NewArrivalsSlider from "./NewArrivalsSlider";

type NewArrivalsProps = {
  locale: Locale;
};

export default async function NewArrivals({
  locale,
}: NewArrivalsProps) {
  const t = getMessages(locale).NewArrivals;

  const isArabic = locale === "ar";
  const prefix = isArabic ? "" : "/en";
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  // ================= FETCH NEWEST PRODUCTS =================

  const dbProducts = await prisma.product.findMany({
    where: {
      isActive: true,
    },

    include: {
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

    take: 20,
  });

  // ================= FORMAT PRODUCTS =================

  const products = dbProducts.map((product) => ({
    name: isArabic
      ? product.nameAr
      : product.nameEn,

    slug: product.slug,

    image:
      product.images[0]?.url ??
      "/images/products/placeholder.jpg",

    price: Number(product.price),

    oldPrice:
      product.oldPrice !== null
        ? Number(product.oldPrice)
        : undefined,

    badge: isArabic ? "وصل حديثًا" : "NEW",
  }));

  return (
    <section className="overflow-hidden bg-[#fffaf3] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-360 px-5 lg:px-8">

        {/* ================= HEADING ================= */}

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

          {/* DESKTOP VIEW ALL */}

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

        {/* ================= NEW ARRIVALS SLIDER ================= */}

        {products.length > 0 ? (
          <NewArrivalsSlider
            locale={locale}
            products={products}
          />
        ) : (
          <div className="flex min-h-60 items-center justify-center border border-[#eadfce] bg-white px-6 text-center">
            <p className="text-sm text-neutral-500 sm:text-base">
              {isArabic
                ? "لا توجد منتجات متاحة حاليًا."
                : "No products are available yet."}
            </p>
          </div>
        )}

        {/* ================= MOBILE VIEW ALL ================= */}

        {products.length > 0 && (
          <div className="mt-10 text-center sm:hidden">
            <Link
              href={`${prefix}/products`}
              className="
                group inline-flex min-h-12 items-center
                justify-center gap-2
                border border-[#171717]
                px-7 text-sm font-bold text-[#171717]
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
        )}
      </div>
    </section>
  );
}
