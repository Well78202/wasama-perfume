import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, PackageCheck } from "lucide-react";

import ProductGallery from "@/app/components/product/ProductGallery";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ProductCard from "@/app/components/product/ProductCard";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/translations";
import AddToCartButton from "../cart/AddToCartButton";

type ProductDetailsPageProps = {
  locale: Locale;
  slug: string;
};

export default async function ProductDetailsPage({ locale, slug }: ProductDetailsPageProps) {
  const isArabic = locale === "ar";
  const prefix = isArabic ? "" : "/en";

  // ================= PRODUCT =================

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // ================= RELATED PRODUCTS =================

  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    orderBy: [{ isBestSeller: "desc" }, { createdAt: "desc" }],
    take: 4,
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });

  // ================= LOCALIZED DATA =================

  const name = isArabic ? product.nameAr : product.nameEn;

  const description = isArabic ? product.descriptionAr : product.descriptionEn;

  const categoryName = product.category ? (isArabic ? product.category.nameAr : product.category.nameEn) : "";

  // ================= PRICE =================

  const price = Number(product.price);

  const oldPrice = product.oldPrice !== null ? Number(product.oldPrice) : undefined;

  const hasDiscount = oldPrice !== undefined && oldPrice > price;

  const discount = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  const formatPrice = (value: number) => value.toLocaleString(isArabic ? "ar-EG" : "en-EG");

  const currency = isArabic ? "ج.م" : "EGP";

  const ArrowIcon = isArabic ? ChevronLeft : ChevronRight;

  // ================= SEO SCHEMA =================

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const productPath = `${prefix}/products/${encodeURIComponent(product.slug)}`;

  let productUrl: string | undefined;

  try {
    if (siteUrl) {
      productUrl = new URL(productPath, siteUrl).toString();
    }
  } catch {
    productUrl = undefined;
  }

  const productSchema = productUrl
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description: description || name,
        sku: product.sku || undefined,
        image: product.images
          .map((image) => {
            try {
              return new URL(image.url, siteUrl).toString();
            } catch {
              return null;
            }
          })
          .filter((url): url is string => url !== null),

        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "EGP",
          price: price.toFixed(2),
          itemCondition: "https://schema.org/NewCondition",
        },
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <Header locale={locale} />

      <main className="min-h-screen bg-[#fcf9f5]">
        {/* ================= BREADCRUMB ================= */}

        <nav className="border-b border-[#eee6dc]">
          <div className="mx-auto flex max-w-330 items-center gap-2 overflow-hidden px-4 py-4 text-xs text-[#94877a] sm:px-6 lg:px-8">
            <Link href={isArabic ? "/" : "/en"} className="shrink-0 transition hover:text-[#9b7045]">
              {isArabic ? "الرئيسية" : "Home"}
            </Link>

            <ArrowIcon size={13} className="shrink-0" />

            <Link href={`${prefix}/products`} className="shrink-0 transition hover:text-[#9b7045]">
              {isArabic ? "العطور" : "Perfumes"}
            </Link>

            <ArrowIcon size={13} className="shrink-0" />

            <span className="truncate font-semibold text-[#40352a]">{name}</span>
          </div>
        </nav>

        {/* ================= PRODUCT DETAILS ================= */}

        <section className="py-7 sm:py-12 lg:py-16">
          <div className="mx-auto max-w-330 px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 xl:gap-20">
              {/* ================= PRODUCT INFO ================= */}

              <div className="order-2 min-w-0 lg:order-1 lg:pt-5">
                {/* Product Name */}
                <h1 className="max-w-155 text-[30px] font-extrabold leading-[1.35] tracking-tight text-[#29221c] sm:text-[38px] xl:text-[44px]">
                  {name}
                </h1>

                {/* Category */}
                {product.category && (
                  <Link
                    href={`${prefix}/categories/${product.category.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#8d8072] transition hover:text-[#a57a4c]"
                  >
                    {categoryName}
                    <ArrowIcon size={14} />
                  </Link>
                )}

                {/* Price */}
                <div className="mt-8">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[34px] font-extrabold tracking-tight text-[#29221c] sm:text-[40px]">
                        {formatPrice(price)}
                      </span>

                      <span className="text-sm font-bold text-[#9b7045]">{currency}</span>
                    </div>

                    {hasDiscount && (
                      <span className="text-lg text-[#a9a098] line-through">
                        {formatPrice(oldPrice)} {currency}
                      </span>
                    )}
                  </div>

                  {discount !== null && discount > 0 && (
                    <div className="mt-3">
                      <span className="inline-flex rounded-md bg-[#f2e6d7] px-3 py-1.5 text-xs font-bold text-[#936637]">
                        {isArabic ? `خصم ${discount}%` : `${discount}% OFF`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Available for ordering */}
                <div className="mt-6 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#438567]" />
                  <span className="text-sm font-semibold text-[#438567]">
                    {isArabic ? "متاح للطلب" : "Available to order"}
                  </span>
                </div>

                {/* Add To Cart */}
                <div className="mt-8 max-w-130">
                  <AddToCartButton slug={product.slug} locale={locale} />
                </div>

                {/* Benefits */}
                <div className="mt-9 grid grid-cols-3 gap-3 border-y border-[#eae0d5] py-6">
                  <div className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:text-start">
                    <Truck size={23} strokeWidth={1.5} className="shrink-0 text-[#a57a4c]" />
                    <span className="text-[11px] font-semibold leading-5 text-[#63594e] sm:text-xs">
                      {isArabic ? "توصيل سريع" : "Fast Delivery"}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:text-start">
                    <ShieldCheck size={23} strokeWidth={1.5} className="shrink-0 text-[#a57a4c]" />
                    <span className="text-[11px] font-semibold leading-5 text-[#63594e] sm:text-xs">
                      {isArabic ? "تسوق آمن" : "Secure Shopping"}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:text-start">
                    <PackageCheck size={23} strokeWidth={1.5} className="shrink-0 text-[#a57a4c]" />
                    <span className="text-[11px] font-semibold leading-5 text-[#63594e] sm:text-xs">
                      {isArabic ? "منتجات مختارة" : "Curated Products"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {description && (
                  <div className="mt-9">
                    <h2 className="text-lg font-extrabold text-[#30271e]">
                      {isArabic ? "تفاصيل العطر" : "Fragrance Details"}
                    </h2>

                    <div className="mt-3 h-px w-12 bg-[#b58c60]" />

                    <p className="mt-5 max-w-155 whitespace-pre-line text-[14px] leading-[2.1] text-[#70665c] sm:text-[15px]">
                      {description}
                    </p>
                  </div>
                )}
              </div>

              {/* ================= GALLERY ================= */}

              <div className="order-1 min-w-0 lg:order-2">
                <ProductGallery
                  images={product.images}
                  name={name}
                  isArabic={isArabic}
                  isBestSeller={product.isBestSeller}
                  discount={discount}
                  productSlug={product.slug}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= RELATED PRODUCTS ================= */}

        {relatedProducts.length > 0 && (
          <section className="border-t border-[#eae1d7] bg-[#f8f3ed] py-14 sm:py-20">
            <div className="mx-auto max-w-330 px-4 sm:px-6 lg:px-8">
              <div className="mb-9 flex items-end justify-between gap-4 sm:mb-12">
                <div>
                  <p className="mb-3 text-xs font-bold tracking-[0.16em] text-[#a57a4c]">
                    {isArabic ? "اكتشف المزيد" : "DISCOVER MORE"}
                  </p>

                  <h2 className="text-[26px] font-extrabold text-[#29221c] sm:text-3xl">
                    {isArabic ? "عطور قد تعجبك" : "You May Also Like"}
                  </h2>
                </div>

                {product.category && (
                  <Link
                    href={`${prefix}/categories/${product.category.slug}`}
                    className="hidden items-center gap-2 text-sm font-bold text-[#987046] transition hover:text-[#29221c] sm:inline-flex"
                  >
                    {isArabic ? "عرض المجموعة" : "View Collection"}
                    <ArrowIcon size={16} />
                  </Link>
                )}
              </div>

              {/* Products */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    locale={locale}
                    product={{
                      name: isArabic ? relatedProduct.nameAr : relatedProduct.nameEn,

                      slug: relatedProduct.slug,

                      image: relatedProduct.images[0]?.url ?? "/images/products/placeholder.jpg",

                      price: Number(relatedProduct.price),

                      oldPrice: relatedProduct.oldPrice !== null ? Number(relatedProduct.oldPrice) : undefined,

                      badge: relatedProduct.isBestSeller ? (isArabic ? "الأكثر مبيعًا" : "BEST SELLER") : undefined,
                    }}
                  />
                ))}
              </div>

              {/* Mobile Collection Link */}
              {product.category && (
                <div className="mt-10 flex justify-center sm:hidden">
                  <Link
                    href={`${prefix}/categories/${product.category.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 border-b border-[#a57a4c] px-2 text-sm font-bold text-[#987046]"
                  >
                    {isArabic ? "عرض المجموعة" : "View Collection"}
                    <ArrowIcon size={16} />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer locale={locale} />
    </>
  );
}
