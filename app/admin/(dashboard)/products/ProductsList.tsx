"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Package, Pencil, Eye, SlidersHorizontal } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";
type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  image: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
};

type Filter = "all" | "active" | "inactive" | "out-of-stock";

export default function ProductsList({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && product.isActive) ||
        (filter === "inactive" && !product.isActive) ||
        (filter === "out-of-stock" && product.stock <= 0);

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  const money = (value: number) =>
    new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(value);

  return (
    <main className="mx-auto max-w-350 space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#a66d36]">إدارة المتجر</p>

          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">المنتجات</h1>

          <p className="mt-2 text-sm text-neutral-500">إجمالي المنتجات: {products.length}</p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#171411] px-5 text-sm font-bold text-white transition hover:bg-[#352b23]"
        >
          <Plus size={18} className="text-[#d5a86e]" />
          إضافة منتج
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="grid gap-3 rounded-2xl border border-black/5 bg-white p-4 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search size={19} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث باسم المنتج أو التصنيف أو البراند..."
            className="h-12 w-full rounded-xl border border-neutral-200 bg-[#faf9f7] pr-12 pl-4 text-sm outline-none focus:border-[#a66d36]"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal
            size={17}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as Filter)}
            className="h-12 w-full min-w-44 rounded-xl border border-neutral-200 bg-[#faf9f7] pr-10 pl-4 text-sm outline-none focus:border-[#a66d36]"
          >
            <option value="all">كل المنتجات</option>
            <option value="active">المنتجات النشطة</option>
            <option value="inactive">المنتجات المخفية</option>
            <option value="out-of-stock">نفد المخزون</option>
          </select>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-24 w-22 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f7f0e7] sm:h-30 sm:w-28">
                  {product.image ? (
                    // Images can come from external storage.
                    // Use a normal img until remote image hosts
                    // are configured in next.config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                  ) : (
                    <Package size={28} className="text-[#a66d36]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        product.isActive ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {product.isActive ? "نشط" : "مخفي"}
                    </span>

                    {product.isFeatured && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        مميز
                      </span>
                    )}

                    {product.isBestSeller && (
                      <span className="rounded-full bg-[#f7efe4] px-2.5 py-1 text-[11px] font-bold text-[#a66d36]">
                        الأكثر مبيعًا
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 line-clamp-2 text-base font-extrabold">{product.name}</h2>

                  <p className="mt-2 text-xs text-neutral-500">
                    {product.category} • {product.brand}
                  </p>

                  <p className="mt-3 text-lg font-extrabold text-[#a66d36]">{money(product.price)}</p>

                  <p className={`mt-1 text-xs font-bold ${product.stock <= 0 ? "text-red-600" : "text-neutral-500"}`}>
                    المخزون: {product.stock}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-black/5 pt-4">
                {" "}
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#171411] text-sm font-bold text-white transition hover:bg-[#352b23]"
                >
                  <Pencil size={16} />
                  تعديل
                </Link>
                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 text-sm font-bold transition hover:bg-neutral-50"
                >
                  <Eye size={16} />
                  عرض
                </Link>
                <DeleteProductButton productId={product.id} productName={product.name} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[#dfd3c5] bg-white p-6 text-center">
          <Package size={34} className="text-[#a66d36]" />

          <h2 className="mt-4 text-lg font-extrabold">لا توجد منتجات مطابقة</h2>

          <p className="mt-2 text-sm text-neutral-500">جرّب تغيير البحث أو الفلتر.</p>
        </div>
      )}
    </main>
  );
}
