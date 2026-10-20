
"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { addToCart } from "@/lib/cart";
import type { Locale } from "@/lib/translations";

type Props = {
  slug: string;
  locale: Locale;
  disabled?: boolean;
  quantity?: number;
};

export default function AddToCartButton({
  slug,
  locale,
  disabled = false,
  quantity = 1,
}: Props) {
  const [added, setAdded] = useState(false);
  const isArabic = locale === "ar";

  function handleAdd() {
    if (disabled) return;

    addToCart(slug, quantity);
    setAdded(true);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      className="
        mt-4 flex min-h-13 w-full
        items-center justify-center gap-2.5
        rounded-lg bg-[#171717] px-5
        text-sm font-bold text-white
        transition-all duration-300
        hover:bg-[#a66d36]
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:bg-neutral-300
      "
    >
      {added ? <Check size={18} /> : <ShoppingBag size={18} />}

      {disabled
        ? isArabic
          ? "غير متوفر"
          : "Out of Stock"
        : added
          ? isArabic
            ? "تمت الإضافة للسلة"
            : "Added to Cart"
          : isArabic
            ? "أضف إلى السلة"
            : "Add to Cart"}
    </button>
  );
}
