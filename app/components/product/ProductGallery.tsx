
"use client";

import Image from "next/image";
import { useState } from "react";
import WishlistButton from "@/app/components/product/WishlistButton";
import type { Locale } from "@/lib/translations";

type GalleryImage = {
  id: string;
  url: string;
  altAr: string | null;
  altEn: string | null;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  name: string;
  isArabic: boolean;
  isBestSeller: boolean;
  discount: number | null;
  productSlug: string;
};

export default function ProductGallery({
  images,
  name,
  isArabic,
  isBestSeller,
  discount,
  productSlug,
}: ProductGalleryProps) {
  const fallbackImage = "/images/products/placeholder.jpg";

  const galleryImages =
    images.length > 0
      ? images
      : [
          {
            id: "placeholder",
            url: fallbackImage,
            altAr: name,
            altEn: name,
          },
        ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage =
    galleryImages[selectedIndex] ?? galleryImages[0];

  const selectedAlt = isArabic
    ? selectedImage.altAr ?? name
    : selectedImage.altEn ?? name;

  const locale: Locale = isArabic ? "ar" : "en";

  return (
    <div className="mx-auto w-full max-w-[520px]">
      {/* MAIN IMAGE */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-[#e6d8c6] bg-[#f3eadf]">
        <Image
          key={selectedImage.url}
          src={selectedImage.url}
          alt={selectedAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-contain p-5 sm:p-7"
        />

        {/* TOP BADGES AND WISHLIST */}
        <div className="pointer-events-none absolute inset-x-4 top-4 z-20 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
          {/* DISCOUNT + WISHLIST */}
          <div className="pointer-events-auto flex shrink-0 items-center gap-2">
            {discount !== null && (
              <span className="inline-flex h-10 items-center justify-center rounded-full bg-[#a66d36] px-3 text-xs font-bold text-white shadow-sm">
                -{discount}%
              </span>
            )}

            <WishlistButton
              productId={productSlug}
              locale={locale}
            />
          </div>

          {/* BEST SELLER */}
          {isBestSeller && (
            <span className="rounded-full bg-[#171717] px-3 py-3 text-[10px] font-bold tracking-[0.04em] text-white shadow-sm sm:px-4">
              {isArabic ? "الأكثر مبيعًا" : "BEST SELLER"}
            </span>
          )}
        </div>

        {/* IMAGE COUNTER */}
        {galleryImages.length > 1 && (
          <span className="absolute bottom-5 end-5 z-10 rounded-full bg-[#171717]/75 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm">
            {selectedIndex + 1} / {galleryImages.length}
          </span>
        )}
      </div>

      {/* THUMBNAILS */}
      {galleryImages.length > 1 && (
        <div className="mt-4 flex justify-center gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => {
            const active = index === selectedIndex;

            const alt = isArabic
              ? image.altAr ?? name
              : image.altEn ?? name;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-pressed={active}
                aria-label={
                  isArabic
                    ? `عرض الصورة ${index + 1}`
                    : `View image ${index + 1}`
                }
                className={`relative h-[90px] w-[72px] shrink-0 overflow-hidden rounded-[14px] bg-[#f3eadf] transition-all duration-300 ${
                  active
                    ? "border-2 border-[#a66d36]"
                    : "border border-[#dfd1bf] hover:border-[#b98a58]"
                }`}
              >
                <Image
                  src={image.url}
                  alt={alt}
                  fill
                  sizes="72px"
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
