
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import type { Locale } from "@/lib/translations";

export default function WishlistHeaderButton({
  locale,
}: {
  locale: Locale;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function updateWishlistCount() {
      try {
        const stored = localStorage.getItem("wasama-wishlist");

        if (!stored) {
          setCount(0);
          return;
        }

        const wishlist: unknown = JSON.parse(stored);

        setCount(
          Array.isArray(wishlist) ? wishlist.length : 0
        );
      } catch {
        setCount(0);
      }
    }

    updateWishlistCount();

    window.addEventListener(
      "wishlist-updated",
      updateWishlistCount
    );

    window.addEventListener(
      "storage",
      updateWishlistCount
    );

    return () => {
      window.removeEventListener(
        "wishlist-updated",
        updateWishlistCount
      );

      window.removeEventListener(
        "storage",
        updateWishlistCount
      );
    };
  }, []);

  const ar = locale === "ar";
  const href = ar ? "/wishlist" : "/en/wishlist";

  return (
    <Link
      href={href}
      aria-label={
        ar
          ? `المفضلة - ${count} منتجات`
          : `Wishlist - ${count} items`
      }
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#171411] transition hover:bg-[#f4e9da]"
    >
      <Heart size={21} strokeWidth={1.8} />

      {count > 0 && (
        <span className="absolute -end-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#a66d36] px-1 text-[9px] font-bold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
