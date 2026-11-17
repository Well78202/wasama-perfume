"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const galleryImages =
    images.length > 0
      ? images
      : [
          {
            id: "placeholder",
            url: "/images/products/placeholder.jpg",
            altAr: name,
            altEn: name,
          },
        ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentIndex = selectedIndex < galleryImages.length ? selectedIndex : 0;

  const selectedImage = galleryImages[currentIndex];

  const selectedAlt = (isArabic ? selectedImage.altAr : selectedImage.altEn) || name;

  const locale: Locale = isArabic ? "ar" : "en";
  const multiple = galleryImages.length > 1;

  const changeImage = (direction: number) => {
    setSelectedIndex((current) => (current + direction + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="mx-auto w-full max-w-[290px] min-w-0 sm:max-w-[380px] lg:max-w-[520px] xl:max-w-[600px]">
      {/* MAIN PHOTO */}
      <div className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-[#f5efe7] ring-1 ring-[#e9dfd2]">
          <Image
            key={selectedImage.id}
            src={selectedImage.url}
            alt={selectedAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-cover object-center"
          />
        </div>

        {/* TOP LABELS */}
        <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-2 sm:inset-x-5 sm:top-5">
          <div className="pointer-events-auto flex items-center gap-2">
            <WishlistButton productId={productSlug} locale={locale} />

            {discount !== null && discount > 0 && (
              <span className="rounded-md bg-[#9b7045] px-3 py-2 text-xs font-bold text-white">-{discount}%</span>
            )}
          </div>

          {isBestSeller && (
            <span className="rounded-md bg-[#29231d]/90 px-3 py-2 text-[10px] font-bold text-white">
              {isArabic ? "الأكثر مبيعًا" : "BEST SELLER"}
            </span>
          )}
        </div>

        {/* NAVIGATION */}
        {multiple && (
          <>
            <button
              type="button"
              onClick={() => changeImage(-1)}
              aria-label={isArabic ? "الصورة السابقة" : "Previous image"}
              className="absolute start-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#30271e] shadow-sm transition hover:bg-white sm:start-5"
            >
              {isArabic ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
            </button>

            <button
              type="button"
              onClick={() => changeImage(1)}
              aria-label={isArabic ? "الصورة التالية" : "Next image"}
              className="absolute end-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#30271e] shadow-sm transition hover:bg-white sm:end-5"
            >
              {isArabic ? <ChevronLeft size={19} /> : <ChevronRight size={19} />}
            </button>
          </>
        )}
      </div>
      {/* THUMBNAILS */}
      {multiple && (
        <div className="mt-4 flex max-w-full justify-start gap-2.5 overflow-x-auto px-0.5 py-1 sm:gap-3">
          {galleryImages.map((image, index) => {
            const active = index === currentIndex;

            const alt = (isArabic ? image.altAr : image.altEn) || name;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-pressed={active}
                aria-label={isArabic ? `عرض الصورة ${index + 1}` : `View image ${index + 1}`}
                className={`relative aspect-[4/5] w-[65px] shrink-0 overflow-hidden rounded-md transition-all duration-200 sm:w-[76px] ${
                  active
                    ? "ring-2 ring-[#a77b4d] ring-offset-2 ring-offset-[#fcf9f5]"
                    : "opacity-65 ring-1 ring-[#e4d9cb] hover:opacity-100"
                }`}
              >
                <Image src={image.url} alt={alt} fill sizes="76px" className="object-cover object-center" />
              </button>
            );
          })}
        </div>
      )}
      {multiple && (
        <p className="mt-3 text-center text-xs tracking-widest text-[#a59a8e]">
          {currentIndex + 1} / {galleryImages.length}
        </p>
      )}
    </div>
  );
}
