
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { Locale } from "@/lib/translations";

type FilterOption = {
  slug: string;
  nameAr: string;
  nameEn: string;
};

type ProductFiltersProps = {
  locale: Locale;
  brands: FilterOption[];
  categories: FilterOption[];
  selectedBrand?: string;
  selectedCategory?: string;
  selectedSort?: string;
};

export default function ProductFilters({
  locale,
  brands,
  categories,
  selectedBrand = "",
  selectedCategory = "",
  selectedSort = "newest",
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isArabic = locale === "ar";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value && !(key === "sort" && value === "newest")) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const search = params.toString();

    router.replace(
      search ? `${pathname}?${search}` : pathname,
      { scroll: false }
    );
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("brand");
    params.delete("category");
    params.delete("sort");

    const search = params.toString();

    router.replace(
      search ? `${pathname}?${search}` : pathname,
      { scroll: false }
    );
  }

  const selectClass =
    "h-11 w-full rounded-xl border border-[#e4d7c6] bg-white px-4 text-sm text-[#171411] outline-none transition focus:border-[#a66d36] sm:w-auto sm:min-w-40";

  return (
    <div className="mb-8 rounded-2xl border border-[#e9ddce] bg-[#f8f0e6] p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-[#a66d36]" />
        <h2 className="text-sm font-extrabold text-[#171411]">
          {isArabic ? "تصفية وترتيب المنتجات" : "Filter & Sort Products"}
        </h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          aria-label={isArabic ? "اختر القسم" : "Select category"}
          value={selectedCategory}
          onChange={(e) => updateFilter("category", e.target.value)}
          className={selectClass}
        >
          <option value="">
            {isArabic ? "كل الأقسام" : "All Categories"}
          </option>

          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {isArabic ? category.nameAr : category.nameEn}
            </option>
          ))}
        </select>

        <select
          aria-label={isArabic ? "اختر البراند" : "Select brand"}
          value={selectedBrand}
          onChange={(e) => updateFilter("brand", e.target.value)}
          className={selectClass}
        >
          <option value="">
            {isArabic ? "كل البراندات" : "All Brands"}
          </option>

          {brands.map((brand) => (
            <option key={brand.slug} value={brand.slug}>
              {isArabic ? brand.nameAr : brand.nameEn}
            </option>
          ))}
        </select>

        <select
          aria-label={isArabic ? "ترتيب المنتجات" : "Sort products"}
          value={selectedSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className={selectClass}
        >
          <option value="newest">
            {isArabic ? "الأحدث" : "Newest"}
          </option>
          <option value="price-asc">
            {isArabic ? "السعر: الأقل أولًا" : "Price: Low to High"}
          </option>
          <option value="price-desc">
            {isArabic ? "السعر: الأعلى أولًا" : "Price: High to Low"}
          </option>
        </select>

        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d9c7b2] px-4 text-sm font-bold text-[#80664c] transition-colors hover:bg-white"
        >
          <RotateCcw size={15} />
          {isArabic ? "مسح الفلاتر" : "Clear Filters"}
        </button>
      </div>
    </div>
  );
}
