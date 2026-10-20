
"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import type { Locale } from "@/lib/translations";
import {
  isInWishlist,
  toggleWishlist,
} from "@/lib/wishlist";

type Props = {
  productId: string;
  locale: Locale;
};

export default function WishlistButton({
  productId,
  locale,
}: Props) {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setActive(isInWishlist(productId));
    setMounted(true);

    const sync = () => setActive(isInWishlist(productId));

    window.addEventListener("wishlist-updated", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("wishlist-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [productId]);

  function handleToggle() {
    const added = toggleWishlist(productId);
    setActive(added);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={!mounted}
      aria-pressed={active}
      aria-label={
        active
          ? locale === "ar"
            ? "إزالة من المفضلة"
            : "Remove from wishlist"
          : locale === "ar"
            ? "إضافة للمفضلة"
            : "Add to wishlist"
      }
      title={
        active
          ? locale === "ar"
            ? "إزالة من المفضلة"
            : "Remove from wishlist"
          : locale === "ar"
            ? "إضافة للمفضلة"
            : "Add to wishlist"
      }
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5d8c8] bg-white text-[#171411] shadow-sm transition-all hover:border-[#a66d36] hover:text-red-600 disabled:opacity-60"
    >
      <Heart
        size={19}
        className={
          active ? "fill-red-500 text-red-500" : ""
        }
      />
    </button>
  );
}
