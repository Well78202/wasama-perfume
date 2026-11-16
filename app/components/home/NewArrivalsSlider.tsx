
"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import ProductCard from "@/app/components/product/ProductCard";
import type { Locale } from "@/lib/translations";

import "swiper/css";

type ProductCardData = {
  name: string;
  brand: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number;
  badge: string;
};

type NewArrivalsSliderProps = {
  locale: Locale;
  products: ProductCardData[];
};

export default function NewArrivalsSlider({
  locale,
  products,
}: NewArrivalsSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isArabic = locale === "ar";

  const safeProducts = Array.isArray(products)
    ? products
    : [];

  const totalProducts = safeProducts.length;

  const PrevIcon = isArabic ? ArrowRight : ArrowLeft;
  const NextIcon = isArabic ? ArrowLeft : ArrowRight;

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  if (totalProducts === 0) {
    return null;
  }

  return (
    <div className="relative w-full min-w-0">

      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-7 bg-[#a77c4b]" />

          <span className="text-[11px] font-bold tracking-[0.12em] text-[#a77c4b] sm:text-xs">
            {isArabic
              ? "اكتشف الجديد"
              : "DISCOVER WHAT'S NEW"}
          </span>
        </div>

        {/* Navigation */}
        <div className="flex shrink-0 items-center gap-2">

          <button
            type="button"
            onClick={handlePrev}
            aria-label={
              isArabic ? "المنتج السابق" : "Previous product"
            }
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full border border-[#e8dfd4]
              bg-white text-[#222]
              transition-all duration-300
              hover:border-[#a77c4b]
              hover:bg-[#a77c4b]
              hover:text-white
              active:scale-95
              sm:h-11 sm:w-11
            "
          >
            <PrevIcon size={18} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label={
              isArabic ? "المنتج التالي" : "Next product"
            }
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full border border-[#e8dfd4]
              bg-white text-[#222]
              transition-all duration-300
              hover:border-[#a77c4b]
              hover:bg-[#a77c4b]
              hover:text-white
              active:scale-95
              sm:h-11 sm:w-11
            "
          >
            <NextIcon size={18} />
          </button>
        </div>
      </div>

      {/* Products Slider */}
      <Swiper
        key={locale}
        dir={isArabic ? "rtl" : "ltr"}
        modules={[Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        slidesPerView={1.4}
        spaceBetween={12}
        speed={650}
        grabCursor={true}
        watchOverflow={true}
        loop={totalProducts >= 8}
        autoplay={
          totalProducts > 1
            ? {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        breakpoints={{
          480: {
            slidesPerView: 2,
            spaceBetween: 14,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 24,
          },
        }}
        className="!overflow-hidden"
      >
        {safeProducts.map((product) => (
          <SwiperSlide
            key={product.slug}
            className="!h-auto"
          >
            <div className="h-full w-full min-w-0 pb-2">
              <ProductCard
                locale={locale}
                product={product}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress Indicator */}
      {totalProducts > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">

          <span className="text-xs font-bold text-[#a77c4b]">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>

          <div className="h-[2px] w-24 overflow-hidden rounded-full bg-[#e8dfd4]">
            <div
              className="h-full bg-[#a77c4b] transition-all duration-500"
              style={{
                width: `${
                  ((activeIndex + 1) / totalProducts) * 100
                }%`,
              }}
            />
          </div>

          <span className="text-xs text-neutral-400">
            {String(totalProducts).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
