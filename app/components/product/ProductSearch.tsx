
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Locale } from "@/lib/translations";

type ProductSearchProps = {
  locale: Locale;
  initialQuery?: string;
};

export default function ProductSearch({
  locale,
  initialQuery = "",
}: ProductSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);

  const isArabic = locale === "ar";

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (query.trim() === initialQuery.trim()) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(
        window.location.search
      );

      const value = query.trim();

      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }

      const search = params.toString();

      router.replace(
        search ? `${pathname}?${search}` : pathname,
        { scroll: false }
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [query, initialQuery, pathname, router]);

  return (
    <div className="relative w-full max-w-md">
      <Search
        size={19}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#a66d36] ${
          isArabic ? "right-4" : "left-4"
        }`}
      />

      <input
        type="search"
        value={query}
        onChange={(event) =>
          setQuery(event.target.value.slice(0, 100))
        }
        placeholder={
          isArabic
            ? "ابحث عن عطر أو براند..."
            : "Search perfumes or brands..."
        }
        aria-label={
          isArabic ? "البحث عن العطور" : "Search perfumes"
        }
        className={`h-12 w-full rounded-full border border-[#e4d7c6] bg-white text-sm text-[#171411] outline-none transition focus:border-[#a66d36] focus:ring-2 focus:ring-[#a66d36]/10 ${
          isArabic ? "pr-12 pl-11" : "pl-12 pr-11"
        }`}
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label={
            isArabic ? "مسح البحث" : "Clear search"
          }
          className={`absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-[#171411] ${
            isArabic ? "left-3" : "right-3"
          }`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
