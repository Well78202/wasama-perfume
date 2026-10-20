"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/translations";

type LanguageSwitcherProps = {
  locale: Locale;
};

export default function LanguageSwitcher({
  locale,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  const isArabic = locale === "ar";

  let targetPath: string;

  if (isArabic) {
    // Arabic → English
    targetPath =
      pathname === "/"
        ? "/en"
        : `/en${pathname}`;
  } else {
    // English → Arabic
    targetPath =
      pathname === "/en"
        ? "/"
        : pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  }

  return (
    <Link
      href={targetPath}
      className="text-sm font-bold transition-colors hover:text-[#a66d36]"
      aria-label={
        isArabic
          ? "Switch to English"
          : "التبديل إلى العربية"
      }
    >
      {isArabic ? "EN" : "AR"}
    </Link>
  );
}