import AddToCartButton from "@/app/components/cart/AddToCartButton";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight, Eye } from "lucide-react";
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

  const ArrowIcon = isArabic ? ArrowUpLeft : ArrowUpRight;

  return (
    <article
      className="
        group mx-auto flex h-full w-full max-w-60
        flex-col overflow-hidden rounded-2xl
        border border-[#e9e3da] bg-white
        shadow-[0_4px_18px_rgba(0,0,0,0.045)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#c9a574]
        hover:shadow-[0_14px_35px_rgba(0,0,0,0.1)]
      "
    >
      {/* PRODUCT IMAGE */}
      <div className="relative aspect-4/5 overflow-hidden bg-[#f5f1eb]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="
            (max-width: 640px) 45vw,
            (max-width: 1024px) 30vw,
            240px
          "
          className="
            object-cover object-center
            transition-transform duration-700
            group-hover:scale-[1.045]
          "
        />

        {/* Subtle bottom gradient */}
        <div
          className="
            pointer-events-none absolute inset-x-0 bottom-0
            h-20 bg-linear-to-t
            from-black/15 to-transparent
          "
        />

        {/* BADGES */}
        <div
          className="
            pointer-events-none absolute inset-x-2 top-2 z-30
            flex items-start justify-between gap-1
            sm:inset-x-3 sm:top-3
          "
        >
          <div className="flex flex-col items-start gap-1.5">
            {discount !== null && (
              <span
                className="
                  rounded-md bg-[#a66d36] px-2 py-1
                  text-[10px] font-bold text-white
                  shadow-sm
                "
              >
                -{discount}%
              </span>
            )}

            {product.badge && (
              <span
                className="
                  max-w-27.5 rounded-md bg-[#171717]/90
                  px-2 py-1 text-[9px] font-semibold
                  leading-tight text-white
                "
              >
                {product.badge}
              </span>
            )}
          </div>

          <div className="pointer-events-auto shrink-0">
            <WishlistButton productId={product.slug} locale={locale} />
          </div>
        </div>

        {/* Image click area */}
        <Link href={productUrl} aria-label={product.name} className="absolute inset-0 z-10" />

        {/* Quick view indicator on desktop */}
        <div
          className="
            pointer-events-none absolute inset-x-3 bottom-3 z-20
            hidden translate-y-2 items-center justify-center
            gap-2 rounded-lg bg-white/95 px-3 py-2
            text-xs font-semibold text-[#222]
            opacity-0 shadow-md backdrop-blur-sm
            transition-all duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
            md:flex
          "
        >
          <Eye size={15} />
          {isArabic ? "اكتشف العطر" : "Discover Fragrance"}
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-3.5 sm:px-4 sm:pb-4">
        {/* Brand */}
        <p
          className="
            mb-1 truncate text-[10px] font-bold
            uppercase tracking-[0.12em]
            text-[#a77c4b]
          "
        >
          {product.brand}
        </p>

        {/* Product name */}
        <h3
          className="
            mb-2 min-h-10 line-clamp-2
            text-[13px] font-bold leading-5
            text-[#222] transition-colors
            group-hover:text-[#9a6535]
            sm:text-sm
          "
        >
          <Link href={productUrl}>{product.name}</Link>
        </h3>

        {/* PRICE */}
        <div className="mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[17px] font-extrabold text-[#171717]">
            {formatPrice(product.price)}
            <span className="ms-1 text-[11px] font-semibold">{isArabic ? "ج.م" : "EGP"}</span>
          </span>

          {product.oldPrice !== undefined && product.oldPrice > product.price && (
            <span className="text-[11px] text-[#999] line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        {/* BUTTONS */}
        <div className="mt-auto flex w-full items-center gap-2">
          {/* Add to Cart */}
          <div
            className="
      min-w-0 flex-1
      [&_button]:flex!
      [&_button]:h-10!
      [&_button]:min-h-0!
      [&_button]:w-full!
      [&_button]:items-center!
      [&_button]:justify-center!
      [&_button]:gap-1!
      [&_button]:rounded-lg!
      [&_button]:bg-[#171717]!
      [&_button]:px-2!
      [&_button]:py-0!
      [&_button]:text-[11px]!
      [&_button]:font-semibold!
      [&_button]:text-white!
      [&_button:hover]:bg-[#a77c4b]!
    "
          >
            <AddToCartButton slug={product.slug} locale={locale} />
          </div>

          {/* Details Icon Button */}
          <Link
            href={productUrl}
            aria-label={isArabic ? "عرض تفاصيل المنتج" : "View product details"}
            title={isArabic ? "عرض التفاصيل" : "View details"}
            className="
      flex h-10 w-10 shrink-0
      items-center justify-center
      rounded-lg
      border border-[#d8c3a6]
      bg-[#faf7f2]
      text-[#8c6239]
      transition-all duration-300
      hover:border-[#a77c4b]
      hover:bg-[#a77c4b]
      hover:text-white
    "
          >
            <Eye size={18} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </article>
  );
}
