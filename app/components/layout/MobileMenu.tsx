"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

type NavigationItem = {
  name: string;
  href: string;
};

type MobileMenuProps = {
  navigation: NavigationItem[];
  isArabic: boolean;
};

export default function MobileMenu({ navigation, isArabic }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Menu Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={isArabic ? "فتح القائمة" : "Open menu"}
        aria-expanded={open}
        className="
          flex h-10 w-10
          shrink-0
          items-center justify-center
          rounded-full
          transition-colors
          hover:bg-[#f1e5d7]
          lg:hidden
        "
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 z-[90]
          bg-black/45
          backdrop-blur-[2px]
          transition-opacity duration-300
          lg:hidden
          ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      {/* Drawer */}
      <aside
        dir={isArabic ? "rtl" : "ltr"}
        className={`
          fixed top-0 z-[100]
          h-dvh w-[85%] max-w-[360px]
          bg-[#fffaf3]
          shadow-2xl
          transition-transform duration-300
          ease-out
          lg:hidden

          ${isArabic ? "right-0" : "left-0"}

          ${open ? "translate-x-0" : isArabic ? "translate-x-full" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex h-[82px] items-center justify-between border-b border-black/10 px-5">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-[#a66d36]">
              {isArabic ? "وسامة برفيوم" : "WASAMA PERFUME"}
            </p>

            <p className="mt-1 text-sm font-semibold text-[#171717]">{isArabic ? "القائمة الرئيسية" : "Main Menu"}</p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-full
              border border-black/10
              bg-white
              transition-colors
              hover:border-[#a66d36]
              hover:text-[#a66d36]
            "
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="overflow-y-auto px-5 py-5">
          {navigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="
                group
                flex min-h-[58px]
                items-center justify-between
                border-b border-black/10
                text-base font-bold
                text-[#171717]
                transition-colors
                hover:text-[#a66d36]
              "
            >
              <span>{item.name}</span>

              <span className="text-[10px] font-semibold text-neutral-400">{String(index + 1).padStart(2, "0")}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="absolute inset-x-0 bottom-0 border-t border-black/10 bg-[#f7eee3] p-5">
          <Link
            href={isArabic ? "/products" : "/en/products"}
            onClick={() => setOpen(false)}
            className="
              flex min-h-12
              items-center justify-center
              rounded-full
              bg-[#a66d36]
              px-5
              text-sm font-bold
              transition-colors
              hover:bg-[#fbfbfb]
            "
          >
            {isArabic ? "تسوق جميع العطور" : "Shop All Perfumes"}
          </Link>
        </div>
      </aside>
    </>
  );
}
