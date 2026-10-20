
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight, ArrowLeft } from "lucide-react";

import ProductCard from "@/app/components/product/ProductCard";
import type { Locale } from "@/lib/translations";
import { getWishlist } from "@/lib/wishlist";

type WishlistProduct = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  image: string;
  brandAr: string;
  brandEn: string;
  isBestSeller: boolean;
};

type Props = {
  locale: Locale;
  products: WishlistProduct[];
};

export default function WishlistPageContent({
  locale,
  products,
}: Props) {
  const isArabic = locale === "ar";
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setSavedSlugs(getWishlist());

    sync();
    setMounted(true);

    window.addEventListener("wishlist-updated", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("wishlist-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const savedProducts = products.filter((product) =>
    savedSlugs.includes(product.slug)
  );

  const productsUrl = isArabic ? "/products" : "/en/products";

  return (
    <main className="min-h-screen bg-[#fffaf3]">
      {/* Header */}
      <section className="bg-[#171411] px-5 py-16 text-center text-white sm:py-20">
        <Heart
          size={28}
          className="mx-auto mb-5 text-[#d5a86e]"
        />

        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#d5a86e]">
          WASAMA PERFUME
        </p>

        <h1 className="text-4xl font-extrabold sm:text-5xl">
          {isArabic ? "المفضلة" : "My Wishlist"}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60">
          {isArabic
            ? "احتفظ بعطورك المفضلة في مكان واحد وارجع لها في أي وقت."
            : "Save your favorite fragrances and discover them again anytime."}
        </p>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-360 px-5 py-16 lg:px-8 lg:py-20">
        {!mounted ? (
          <div className="min-h-60" />
        ) : savedProducts.length > 0 ? (
          <>
            <div className="mb-10 flex items-center justify-between border-b border-black/10 pb-5">
              <h2 className="text-2xl font-extrabold text-[#171411]">
                {isArabic ? "عطوري المفضلة" : "Favorite Perfumes"}
              </h2>

              <span className="text-sm text-neutral-500">
                {savedProducts.length}{" "}
                {isArabic ? "منتج" : "Products"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
              {savedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  locale={locale}
                  product={{
                    name: isArabic
                      ? product.nameAr
                      : product.nameEn,
                    brand: isArabic
                      ? product.brandAr
                      : product.brandEn,
                    slug: product.slug,
                    image: product.image,
                    price: product.price,
                    oldPrice: product.oldPrice ?? undefined,
                    badge: product.isBestSeller
                      ? isArabic
                        ? "الأكثر مبيعًا"
                        : "BEST SELLER"
                      : undefined,
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-[#e5d8c8] bg-[#f7eee3] px-6 py-20 text-center">
            <Heart
              size={42}
              className="mx-auto text-[#a66d36]"
            />

            <h2 className="mt-6 text-2xl font-extrabold text-[#171411]">
              {isArabic
                ? "المفضلة فاضية حاليًا"
                : "Your Wishlist Is Empty"}
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-neutral-500">
              {isArabic
                ? "ابدأ بتصفح العطور واضغط على علامة القلب لإضافة المنتجات اللي عجبتك."
                : "Explore our fragrances and tap the heart icon to save your favorites."}
            </p>

            <Link
              href={productsUrl}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#171411] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#a66d36]"
            >
              {isArabic ? "تصفح العطور" : "Explore Perfumes"}

              {isArabic ? (
                <ArrowLeft size={17} />
              ) : (
                <ArrowRight size={17} />
              )}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
