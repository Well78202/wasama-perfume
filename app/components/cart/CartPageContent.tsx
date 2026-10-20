
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  type CartItem,
} from "@/lib/cart";
import type { Locale } from "@/lib/translations";

type Product = {
  slug: string;
  nameAr: string;
  nameEn: string;
  price: number;
  stock: number;
  image: string;
};

export default function CartPageContent({
  locale,
}: {
  locale: Locale;
}) {
  const ar = locale === "ar";
  const prefix = ar ? "" : "/en";

  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const cart = getCart();
    setItems(cart);

    if (!cart.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/cart/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slugs: cart.map((item) => item.slug),
        }),
      });

      if (!response.ok) throw new Error("Failed");

      const data: { products: Product[] } =
        await response.json();

      setProducts(data.products);
      setError("");
    } catch {
      setError(
        ar
          ? "تعذر تحميل المنتجات. حاول مرة أخرى."
          : "Could not load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [ar]);

  useEffect(() => {
    void refresh();

    window.addEventListener("cart-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("cart-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const rows = items.map((item) => ({
    ...item,
    product: products.find((p) => p.slug === item.slug),
  }));

  const subtotal = rows.reduce(
    (sum, row) =>
      sum + (row.product?.price ?? 0) * row.quantity,
    0
  );

  const canCheckout =
    !loading &&
    !error &&
    rows.length > 0 &&
    rows.every(
      (row) =>
        row.product &&
        row.product.stock >= row.quantity
    );

  const formatPrice = (value: number) =>
    value.toLocaleString(ar ? "ar-EG" : "en-EG");

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#fffaf3] px-5 py-20 text-center">
        {ar ? "جاري تحميل السلة..." : "Loading cart..."}
      </main>
    );
  }

  return (
    <main className="min-h-[65vh] bg-[#fffaf3] py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h1 className="mb-10 text-3xl font-extrabold text-[#171717] sm:text-4xl">
          {ar ? "سلة التسوق" : "Shopping Cart"}
        </h1>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
            <button
              onClick={() => void refresh()}
              className="ms-3 underline"
            >
              {ar ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-[#eadfce] bg-white px-6 py-20 text-center">
            <ShoppingBag
              size={45}
              className="mx-auto mb-5 text-[#a66d36]"
            />
            <h2 className="mb-6 text-xl font-bold">
              {ar ? "السلة فارغة حاليًا" : "Your cart is empty"}
            </h2>
            <Link
              href={`${prefix}/products`}
              className="inline-flex rounded-xl bg-[#171717] px-7 py-3 text-sm font-bold text-white"
            >
              {ar ? "تصفح العطور" : "Shop Perfumes"}
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {rows.map(({ slug, quantity, product }) => {
                const name = product
                  ? ar
                    ? product.nameAr
                    : product.nameEn
                  : slug;

                return (
                  <div
                    key={slug}
                    className="flex gap-4 rounded-2xl border border-[#eadfce] bg-white p-4 sm:p-5"
                  >
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f3eadf] sm:h-36 sm:w-28">
                      {product && (
                        <Image
                          src={product.image}
                          alt={name}
                          fill
                          sizes="112px"
                          className="object-contain"
                        />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <Link
                        href={`${prefix}/products/${slug}`}
                        className="font-bold text-[#171717] hover:text-[#a66d36]"
                      >
                        {name}
                      </Link>

                      {product ? (
                        <p className="font-bold text-[#a66d36]">
                          {formatPrice(product.price)}{" "}
                          {ar ? "ج.م" : "EGP"}
                        </p>
                      ) : (
                        <p className="text-sm text-red-600">
                          {ar
                            ? "المنتج غير متاح"
                            : "Product unavailable"}
                        </p>
                      )}

                      {product && product.stock < quantity && (
                        <p className="text-xs text-red-600">
                          {ar
                            ? `المتاح في المخزون: ${product.stock}`
                            : `Available stock: ${product.stock}`}
                        </p>
                      )}

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center overflow-hidden rounded-lg border border-[#eadfce]">
                          <button
                            type="button"
                            aria-label={ar ? "تقليل الكمية" : "Decrease quantity"}
                            onClick={() =>
                              updateCartQuantity(slug, quantity - 1)
                            }
                            className="p-2 hover:bg-[#f3eadf]"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-9 text-center text-sm font-bold">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={ar ? "زيادة الكمية" : "Increase quantity"}
                            disabled={
                              quantity >= 99 ||
                              (product !== undefined &&
                                quantity >= product.stock)
                            }
                            onClick={() =>
                              updateCartQuantity(slug, quantity + 1)
                            }
                            className="p-2 hover:bg-[#f3eadf] disabled:opacity-40"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(slug)}
                          aria-label={ar ? "حذف المنتج" : "Remove product"}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="rounded-2xl border border-[#eadfce] bg-white p-6">
              <h2 className="mb-6 text-xl font-extrabold">
                {ar ? "ملخص الطلب" : "Order Summary"}
              </h2>

              <div className="flex justify-between gap-3 text-sm">
                <span>{ar ? "إجمالي المنتجات" : "Subtotal"}</span>
                <strong>
                  {formatPrice(subtotal)}{" "}
                  {ar ? "ج.م" : "EGP"}
                </strong>
              </div>

              <div className="mt-4 flex justify-between gap-3 text-sm">
                <span>{ar ? "مصاريف الشحن" : "Shipping"}</span>
                <span className="text-[#a66d36]">
                  {ar
                    ? "تُحدد حسب المحافظة"
                    : "Calculated at checkout"}
                </span>
              </div>

              <div className="my-6 border-t border-[#eadfce]" />

              <p className="mb-5 text-xs leading-6 text-neutral-500">
                {ar
                  ? "يتم دفع قيمة الطلب كاملة مع مصاريف الشحن مقدمًا عبر فودافون كاش أو إنستا باي."
                  : "Full payment including shipping is required via Vodafone Cash or InstaPay."}
              </p>

              {canCheckout ? (
                <Link
                  href={`${prefix}/checkout`}
                  className="flex min-h-12 items-center justify-center rounded-xl bg-[#171717] px-5 text-sm font-bold text-white hover:bg-[#a66d36]"
                >
                  {ar ? "إتمام الطلب" : "Checkout"}
                </Link>
              ) : (
                <button
                  disabled
                  className="flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-300 px-5 text-sm font-bold text-white"
                >
                  {ar ? "إتمام الطلب" : "Checkout"}
                </button>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
