
"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  Save,
  ArrowRight,
  PackagePlus,
} from "lucide-react";

import {
  createProduct,
  updateProduct,
  type ProductFormState,
} from "./actions";

import ProductImages from "./ProductImages";

type Option = {
  id: string;
  nameAr: string;
};

export type EditableProduct = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  sku: string | null;
  descriptionAr: string | null;
  descriptionEn: string | null;
  price: string;
  oldPrice: string | null;
  stock: number;
  categoryId: string;
  brandId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  imageUrls: string[];
};

type Props = {
  categories: Option[];
  brands: Option[];
  product?: EditableProduct;
};

const initialState: ProductFormState = {
  error: "",
};

const inputClass =
  "mt-2 h-12 w-full min-w-0 rounded-xl border border-neutral-200 bg-[#faf9f7] px-4 text-sm outline-none transition focus:border-[#a66d36]";

const labelClass =
  "block min-w-0 text-sm font-bold text-[#171411]";

export default function ProductForm({
  categories,
  brands,
  product,
}: Props) {
  const action = product
    ? updateProduct.bind(null, product.id)
    : createProduct;

  const [state, formAction, pending] = useActionState(
    action,
    initialState
  );

  return (
    <main
      dir="rtl"
      className="mx-auto max-w-4xl pb-24 sm:pb-8"
    >
      {/* Page Header */}
      <div className="mb-7">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 transition hover:text-[#a66d36]"
        >
          <ArrowRight size={17} />
          رجوع للمنتجات
        </Link>

        <div className="mt-5 flex items-center gap-3">
          <div className="rounded-xl bg-[#f3e8d8] p-3 text-[#a66d36]">
            <PackagePlus size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              {product
                ? "تعديل المنتج"
                : "إضافة منتج جديد"}
            </h1>

            <p className="mt-1 text-xs text-neutral-500">
              أدخل بيانات المنتج بالعربي والإنجليزي
            </p>
          </div>
        </div>
      </div>

      <form
        action={formAction}
        className="space-y-5"
      >
        {/* Basic Information */}
        <section className="rounded-2xl border border-black/5 bg-white p-4 sm:p-7">
          <h2 className="mb-6 text-lg font-extrabold">
            المعلومات الأساسية
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              اسم المنتج بالعربي *
              <input
                name="nameAr"
                required
                minLength={2}
                defaultValue={product?.nameAr}
                className={inputClass}
                placeholder="مثال: عطر وسامة"
              />
            </label>

            <label className={labelClass}>
              اسم المنتج بالإنجليزي *
              <input
                name="nameEn"
                required
                minLength={2}
                dir="ltr"
                defaultValue={product?.nameEn}
                className={inputClass}
                placeholder="Wasama Perfume"
              />
            </label>

            <label className={labelClass}>
              رابط المنتج (Slug) *
              <input
                name="slug"
                required
                dir="ltr"
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                defaultValue={product?.slug}
                className={inputClass}
                placeholder="wasama-perfume"
              />
            </label>

            <label className={labelClass}>
              كود المنتج (SKU)
              <input
                name="sku"
                dir="ltr"
                defaultValue={product?.sku ?? ""}
                className={inputClass}
                placeholder="WS-001"
              />
            </label>

            <label className={labelClass}>
              الوصف بالعربي
              <textarea
                name="descriptionAr"
                rows={4}
                defaultValue={
                  product?.descriptionAr ?? ""
                }
                className={`${inputClass} h-auto min-h-28 py-3`}
                placeholder="اكتب وصف المنتج بالعربي..."
              />
            </label>

            <label className={labelClass}>
              الوصف بالإنجليزي
              <textarea
                name="descriptionEn"
                rows={4}
                dir="ltr"
                defaultValue={
                  product?.descriptionEn ?? ""
                }
                className={`${inputClass} h-auto min-h-28 py-3`}
                placeholder="Product description..."
              />
            </label>
          </div>
        </section>

        {/* Price and Stock */}
        <section className="rounded-2xl border border-black/5 bg-white p-4 sm:p-7">
          <h2 className="mb-6 text-lg font-extrabold">
            السعر والمخزون
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className={labelClass}>
              السعر بالجنيه *
              <input
                name="price"
                type="number"
                min="0.01"
                max="99999999.99"
                step="0.01"
                required
                dir="ltr"
                defaultValue={product?.price}
                className={inputClass}
                placeholder="500"
              />
            </label>

            <label className={labelClass}>
              السعر قبل الخصم
              <input
                name="oldPrice"
                type="number"
                min="0.01"
                max="99999999.99"
                step="0.01"
                dir="ltr"
                defaultValue={
                  product?.oldPrice ?? ""
                }
                className={inputClass}
                placeholder="650"
              />
            </label>

            <label className={labelClass}>
              الكمية في المخزون *
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                required
                dir="ltr"
                defaultValue={product?.stock ?? 0}
                className={inputClass}
              />
            </label>
          </div>
        </section>

        {/* Category and Brand */}
        <section className="rounded-2xl border border-black/5 bg-white p-4 sm:p-7">
          <h2 className="mb-6 text-lg font-extrabold">
            التصنيف والبراند
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              التصنيف *
              <select
                name="categoryId"
                required
                defaultValue={
                  product?.categoryId ?? ""
                }
                className={inputClass}
              >
                <option value="">
                  اختر التصنيف
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.nameAr}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              البراند
              <select
                name="brandId"
                defaultValue={
                  product?.brandId ?? ""
                }
                className={inputClass}
              >
                <option value="">
                  بدون براند
                </option>

                {brands.map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.nameAr}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* Product Images */}
        <ProductImages
          initialImages={
            product?.imageUrls ?? []
          }
        />

        {/* Display Settings */}
        <section className="rounded-2xl border border-black/5 bg-white p-4 sm:p-7">
          <h2 className="mb-5 text-lg font-extrabold">
            إعدادات العرض
          </h2>

          <div className="space-y-5">
            {[
              {
                name: "isActive",
                label:
                  "المنتج نشط ويظهر في المتجر",
                checked:
                  product?.isActive ?? true,
              },
              {
                name: "isFeatured",
                label: "منتج مميز",
                checked:
                  product?.isFeatured ?? false,
              },
              {
                name: "isBestSeller",
                label: "الأكثر مبيعًا",
                checked:
                  product?.isBestSeller ?? false,
              },
            ].map((item) => (
              <label
                key={item.name}
                className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-bold"
              >
                <input
                  type="checkbox"
                  name={item.name}
                  defaultChecked={item.checked}
                  className="h-5 w-5 accent-[#a66d36]"
                />

                {item.label}
              </label>
            ))}
          </div>
        </section>

        {/* Errors */}
        {state.error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700"
          >
            {state.error}
          </p>
        )}

        {/* Save Button */}
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-black/10 bg-[#f7f5f1]/95 px-4 py-3 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <button
            type="submit"
            disabled={
              pending ||
              categories.length === 0
            }
            className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#171411] px-6 font-bold text-white transition hover:bg-[#352b23] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Save
              size={19}
              className="text-[#d5a86e]"
            />

            {pending
              ? "جاري الحفظ..."
              : product
                ? "حفظ التعديلات"
                : "إضافة المنتج"}
          </button>
        </div>
      </form>
    </main>
  );
}
