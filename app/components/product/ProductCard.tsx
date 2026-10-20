import AddToCartButton from "@/app/components/cart/AddToCartButton";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import WishlistButton from "@/app/components/product/WishlistButton";
import type { Locale } from "@/lib/translations";

type ProductCardProps = {
  locale: Locale;
  product: {
    name: string;
    brand: string;
    slug: string;
    image: string;
    price: number;
    oldPrice?: number;
    badge?: string;
  };
};

export default function ProductCard({ locale, product }: ProductCardProps) {
  const isArabic = locale === "ar";
  const prefix = isArabic ? "" : "/en";

  const productUrl = `${prefix}/products/${product.slug}`;

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const formatPrice = (price: number) => price.toLocaleString(isArabic ? "ar-EG" : "en-EG");

  return (
    <article
      className="
        group flex h-full flex-col
        overflow-hidden rounded-[18px]
        border border-[#eadfce]
        bg-[#fffdf9]
        shadow-[0_8px_35px_rgba(50,35,20,0.06)]
        transition-all duration-500
        hover:-translate-y-1
        hover:border-[#d5a86e]/60
        hover:shadow-[0_18px_50px_rgba(50,35,20,0.12)]
      "
    >
      {/* ================= PRODUCT IMAGE ================= */}

      <div className="relative aspect-[4/5] overflow-hidden bg-[#171717]">
        {/* Product Link */}
        <Link href={productUrl} aria-label={product.name} className="absolute inset-0 z-20" />

        {/* Image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="
            (max-width: 640px) 82vw,
            (max-width: 1024px) 47vw,
            25vw
          "
          className="
            object-cover
            object-center
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.05]
          "
        />

        {/* Top Gradient */}
        <div
          className="
            pointer-events-none
            absolute inset-x-0 top-0 z-10
            h-32
            bg-gradient-to-b
            from-black/45
            via-black/15
            to-transparent
          "
        />

        {/* Bottom Gradient */}
        <div
          className="
            pointer-events-none
            absolute inset-x-0 bottom-0 z-10
            h-32
            bg-gradient-to-t
            from-black/35
            via-black/10
            to-transparent
          "
        />

        {/* ================= TOP BADGES ================= */}

        <div
          className="
            pointer-events-none
            absolute inset-x-3 top-3 z-30
            flex items-start justify-between gap-2
            sm:inset-x-4 sm:top-4
          "
        >
          {/* Discount + Wishlist */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Discount */}
            {discount !== null && (
              <span
                className="
                  inline-flex min-h-9
                  items-center justify-center
                  rounded-full
                  border border-white/20
                  bg-[#a66d36]
                  px-3
                  text-[11px] font-bold
                  text-white
                  shadow-md
                  backdrop-blur-md
                  sm:min-h-10 sm:text-xs
                "
              >
                -{discount}%
              </span>
            )}

            {/* Wishlist */}
            <div className="pointer-events-auto relative z-40 flex shrink-0 items-center justify-center">
              <WishlistButton productId={product.slug} locale={locale} />
            </div>
          </div>

          {/* Best Seller Badge */}
          {product.badge && (
            <span
              className="
                max-w-[45%]
                rounded-full
                border border-white/20
                bg-[#171717]/85
                px-2.5 py-2
                text-center
                text-[9px] font-bold
                leading-tight
                text-white
                shadow-md
                backdrop-blur-md
                sm:px-3 sm:text-[10px]
              "
            >
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* ================= PRODUCT INFO ================= */}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Brand */}
        <p
          className="
            mb-2
            text-[10px] font-bold
            uppercase
            tracking-[0.22em]
            text-[#a66d36]
            sm:text-[11px]
          "
        >
          {product.brand}
        </p>

        {/* Product Name */}
        <h3
          className="
            min-h-[52px]
            text-base font-bold
            leading-7
            text-[#171717]
            transition-colors duration-300
            group-hover:text-[#9a6535]
            sm:text-lg
          "
        >
          <Link href={productUrl}>{product.name}</Link>
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={14} strokeWidth={1.5} className="fill-[#b8844f] text-[#b8844f]" />
          ))}

          <span className="ms-1 text-xs text-neutral-400">(5.0)</span>
        </div>

        <div className="flex-1" />

        {/* ================= PRICE ================= */}

        <div
          className="
            mt-5 flex min-h-14
            flex-wrap items-center
            gap-x-3 gap-y-1
          "
        >
          {/* Current Price */}
          <span className="text-lg font-extrabold text-[#171717] sm:text-xl">
            {formatPrice(product.price)}

            <span className="ms-1 text-sm font-bold">{isArabic ? "ج.م" : "EGP"}</span>
          </span>

          {/* Old Price */}
          {product.oldPrice !== undefined && product.oldPrice > product.price && (
            <span className="text-xs text-neutral-400 line-through sm:text-sm">
              {formatPrice(product.oldPrice)} {isArabic ? "ج.م" : "EGP"}
            </span>
          )}

          {/* Discount */}
          {discount !== null && (
            <span
              className="
                rounded-full
                bg-[#fbe5df]
                px-2.5 py-1
                text-xs font-bold
                text-[#a83224]
              "
            >
              -{discount}%
            </span>
          )}
        </div>

        {/* ================= ADD TO CART ================= */}

        <AddToCartButton slug={product.slug} locale={locale} />
      </div>
    </article>
  );
}
