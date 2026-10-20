
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers3,
  Tags,
  Truck,
  Settings,
  Menu,
  X,
  ChevronLeft,
  Sparkles,
  Store,
} from "lucide-react";

const links = [
  { label: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },
  { label: "المنتجات", href: "/admin/products", icon: Package },
  { label: "الطلبات", href: "/admin/orders", icon: ShoppingBag },
  { label: "التصنيفات", href: "/admin/categories", icon: Layers3 },
  { label: "البراندات", href: "/admin/brands", icon: Tags },
  { label: "الشحن", href: "/admin/shipping", icon: Truck },
  { label: "الإعدادات", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const currentPage =
    [...links]
      .sort((a, b) => b.href.length - a.href.length)
      .find(
        (link) =>
          pathname === link.href ||
          (link.href !== "/admin" &&
            pathname.startsWith(link.href + "/"))
      )?.label ?? "لوحة التحكم";

  const navigation = (
    <>
      <div className="border-b border-white/10 px-6 py-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d5a86e]/15">
            <Sparkles size={23} className="text-[#d5a86e]" />
          </div>

          <div>
            <p className="text-lg font-extrabold text-white">
              وسامة برفيوم
            </p>
            <p className="text-xs text-[#d5a86e]">
              ADMIN PANEL
            </p>
          </div>
        </div>
      </div>

      <nav
        aria-label="القائمة الرئيسية للإدارة"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-6"
      >
        {links.map((link) => {
          const Icon = link.icon;

          const active =
            pathname === link.href ||
            (link.href !== "/admin" &&
              pathname.startsWith(link.href + "/"));

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-bold transition ${
                active
                  ? "bg-[#d5a86e] text-[#171411]"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={19} />

              <span className="flex-1">{link.label}</span>

              {active && <ChevronLeft size={16} />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 text-sm font-bold text-white/75 transition hover:bg-white/10"
        >
          <Store size={17} />
          عرض المتجر
        </Link>
      </div>
    </>
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f7f5f1] text-[#171411]"
    >
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-68 flex-col bg-[#171411] lg:flex">
        {navigation}
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        id="admin-mobile-menu"
        aria-label="قائمة الإدارة"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(85vw,320px)] flex-col bg-[#171411] shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() => setOpen(false)}
          className="absolute top-7 left-4 rounded-lg p-2 text-white"
        >
          <X size={21} />
        </button>

        {navigation}
      </aside>

      {/* Main Area */}
      <div className="min-w-0 lg:mr-68">
        <header className="sticky top-0 z-30 flex h-17 items-center justify-between border-b border-black/5 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:h-20 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="فتح القائمة"
              aria-expanded={open}
              aria-controls="admin-mobile-menu"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-base font-extrabold sm:text-lg">
                {currentPage}
              </p>
              <p className="hidden text-xs text-neutral-400 sm:block">
                إدارة متجر وسامة برفيوم
              </p>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171411] text-sm font-bold text-[#d5a86e]">
            W
          </div>
        </header>

        <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          {children}
        </div>
      </div>
    </div>
  );
}
