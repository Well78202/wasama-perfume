
"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useSyncExternalStore } from "react";

import { getCart, CART_KEY } from "@/lib/cart";
import type { Locale } from "@/lib/translations";

// Listen for cart changes
function subscribe(callback: () => void) {
  window.addEventListener("cart-updated", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("cart-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

// Cache prevents unnecessary renders
let cachedRaw: string | null = null;
let cachedCount = 0;

function getSnapshot(): number {
  const raw = localStorage.getItem(CART_KEY);

  if (raw !== cachedRaw) {
    cachedRaw = raw;

    cachedCount = getCart().reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  return cachedCount;
}

// Avoid hydration mismatch in Next.js
function getServerSnapshot(): number {
  return 0;
}

type CartHeaderButtonProps = {
  locale: Locale;
};

export default function CartHeaderButton({
  locale,
}: CartHeaderButtonProps) {
  const count = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const isArabic = locale === "ar";
  const href = isArabic ? "/cart" : "/en/cart";

  return (
    <Link
      href={href}
      aria-label={
        isArabic
          ? `سلة التسوق، ${count} قطع`
          : `Shopping cart, ${count} items`
      }
      className="
        relative
        inline-flex
        h-9 w-9
        shrink-0
        items-center
        justify-center
        rounded-full
        text-[#171717]
        transition-all
        duration-300
        hover:bg-[#f1e5d7]
        hover:text-[#a66d36]
        sm:h-10
        sm:w-10
      "
    >
      <ShoppingBag
        size={21}
        strokeWidth={1.8}
        className="shrink-0"
      />

      {count > 0 && (
        <span
          className="
            absolute
            -end-1
            -top-1
            flex
            h-[17px]
            min-w-[17px]
            items-center
            justify-center
            rounded-full
            bg-[#a66d36]
            px-1
            text-[9px]
            font-bold
            leading-none
            text-white
            shadow-sm
            sm:h-5
            sm:min-w-5
            sm:text-[10px]
          "
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
