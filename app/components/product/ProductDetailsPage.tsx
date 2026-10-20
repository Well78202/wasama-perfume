import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, PackageCheck, ShieldCheck, Truck } from "lucide-react";
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
    where: {
      slug,
    },

    include: {
      brand: true,
      category: true,

      images: {
        orderBy: {
          sortOrder: "asc",
        },
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

      id: {
        not: product.id,
      },
    },

    orderBy: [
      {
        isBestSeller: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: 4,

    include: {
      brand: true,

      images: {
        orderBy: {
          sortOrder: "asc",
        },

        take: 1,
      },
    },
  });

  // ================= LOCALIZED DATA =================

  const name = isArabic ? product.nameAr : product.nameEn;

  const description = isArabic ? product.descriptionAr : product.descriptionEn;

  const brandName = product.brand ? (isArabic ? product.brand.nameAr : product.brand.nameEn) : "";

  const categoryName = product.category ? (isArabic ? product.category.nameAr : product.category.nameEn) : "";

  // ================= PRICE =================

  const price = Number(product.price);

  const oldPrice = product.oldPrice !== null ? Number(product.oldPrice) : undefined;

  const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  // ================= HELPERS =================

  const formatPrice = (value: number) => value.toLocaleString(isArabic ? "ar-EG" : "en-EG");

  const ArrowIcon = isArabic ? ChevronLeft : ChevronRight;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const productPath = `${prefix}/products/${encodeURIComponent(product.slug)}`;

  const productUrl = siteUrl ? new URL(productPath, siteUrl).toString() : undefined;

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

        brand: brandName
          ? {
              "@type": "Brand",
              name: brandName,
            }
          : undefined,

        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "EGP",
          price: price.toFixed(2),
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
      <main className="bg-[#fffaf3]">
        {/* ================= BREADCRUMB ================= */}

        <div className="border-b border-black/10">
          <div className="mx-auto flex max-w-360 items-center gap-2 px-5 py-4 text-xs text-neutral-500 lg:px-8">
            <Link href={isArabic ? "/" : "/en"} className="transition hover:text-[#a66d36]">
              {isArabic ? "الرئيسية" : "Home"}
            </Link>

            <ArrowIcon size={13} />

            <Link href={`${prefix}/products`} className="transition hover:text-[#a66d36]">
              {isArabic ? "العطور" : "Perfumes"}
            </Link>

            <ArrowIcon size={13} />

            <span className="truncate font-semibold text-[#171717]">{name}</span>
          </div>
        </div>

        {/* ================= PRODUCT ================= */}

        <section className="py-10 sm:py-14 lg:py-20">
          <div className="mx-auto max-w-360 px-5 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
              {" "}
              {/* ================= INFO ================= */}
              <div className="flex flex-col justify-center">
                {/* Brand */}

                {brandName && (
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#a66d36]">{brandName}</p>
                )}

                {/* Name */}

                <h1 className="text-4xl font-extrabold leading-tight text-[#171717] sm:text-5xl lg:text-6xl">{name}</h1>

                {/* Category */}

                {product.category && (
                  <Link
                    href={`${prefix}/categories/${product.category.slug}`}
                    className="mt-3 inline-flex w-fit items-center gap-2 text-sm text-neutral-500 transition hover:text-[#a66d36]"
                  >
                    {categoryName}

                    <ArrowIcon size={14} />
                  </Link>
                )}

                {/* Price */}

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <span className="text-3xl font-extrabold text-[#171717]">
                    {formatPrice(price)}

                    <span className="ms-2 text-base">{isArabic ? "ج.م" : "EGP"}</span>
                  </span>

                  {oldPrice && (
                    <span className="text-lg text-neutral-400 line-through">
                      {formatPrice(oldPrice)} {isArabic ? "ج.م" : "EGP"}
                    </span>
                  )}

                  {discount && (
                    <span className="rounded-full bg-[#f3e5d5] px-3 py-1.5 text-xs font-bold text-[#9b6738]">
                      {isArabic ? `خصم ${discount}%` : `${discount}% OFF`}
                    </span>
                  )}
                </div>

                {/* Stock */}

                <div className="mt-5 flex items-center gap-2 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${product.stock > 0 ? "bg-green-600" : "bg-red-500"}`} />

                  <span className={product.stock > 0 ? "font-semibold text-green-700" : "font-semibold text-red-600"}>
                    {product.stock > 0
                      ? isArabic
                        ? `متوفر في المخزون (${product.stock})`
                        : `In Stock (${product.stock})`
                      : isArabic
                        ? "غير متوفر حاليًا"
                        : "Out of Stock"}
                  </span>
                </div>

                {/* Description */}

                {description && <p className="mt-7 max-w-xl text-base leading-8 text-neutral-600">{description}</p>}

                {/* Actions */}

                <div className="mt-9 flex gap-3">
                  <AddToCartButton slug={product.slug} locale={locale} disabled={product.stock <= 0} />
                </div>

                {/* Features */}

                <div className="mt-10 grid gap-3 border-t border-black/10 pt-8 sm:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <Truck size={22} className="shrink-0 text-[#a66d36]" />

                    <span className="text-xs font-semibold leading-5 text-neutral-600">
                      {isArabic ? "توصيل سريع" : "Fast Delivery"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck size={22} className="shrink-0 text-[#a66d36]" />

                    <span className="text-xs font-semibold leading-5 text-neutral-600">
                      {isArabic ? "تسوق آمن" : "Secure Shopping"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <PackageCheck size={22} className="shrink-0 text-[#a66d36]" />

                    <span className="text-xs font-semibold leading-5 text-neutral-600">
                      {isArabic ? "منتجات مختارة" : "Curated Products"}
                    </span>
                  </div>
                </div>
              </div>
              {/* ================= IMAGE GALLERY ================= */}
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
        </section>

        {/* ================= RELATED PRODUCTS ================= */}

        {relatedProducts.length > 0 && (
          <section className="border-t border-black/10 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-360 px-5 lg:px-8">
              {/* Heading */}

              <div className="mb-10 sm:mb-12">
                <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#a66d36]">
                  {isArabic ? "قد يعجبك أيضًا" : "YOU MAY ALSO LIKE"}
                </p>

                <div className="flex items-end justify-between gap-5">
                  <h2 className="text-3xl font-extrabold text-[#171717] sm:text-4xl">
                    {isArabic ? "عطور مشابهة" : "Related Products"}
                  </h2>

                  {product.category && (
                    <Link
                      href={`${prefix}/categories/${product.category.slug}`}
                      className="
                        hidden
                        items-center gap-2
                        text-sm font-bold
                        text-[#a66d36]
                        transition-colors
                        hover:text-[#171717]
                        sm:flex
                      "
                    >
                      <span>{isArabic ? "عرض المجموعة" : "View Collection"}</span>

                      <ArrowIcon size={16} />
                    </Link>
                  )}
                </div>
              </div>

              {/* Related Products Grid */}

              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    locale={locale}
                    product={{
                      name: isArabic ? relatedProduct.nameAr : relatedProduct.nameEn,

                      brand: relatedProduct.brand
                        ? isArabic
                          ? relatedProduct.brand.nameAr
                          : relatedProduct.brand.nameEn
                        : "",

                      slug: relatedProduct.slug,

                      image: relatedProduct.images[0]?.url ?? "/images/products/placeholder.jpg",

                      price: Number(relatedProduct.price),

                      oldPrice: relatedProduct.oldPrice !== null ? Number(relatedProduct.oldPrice) : undefined,

                      badge: relatedProduct.isBestSeller ? (isArabic ? "الأكثر مبيعًا" : "BEST SELLER") : undefined,
                    }}
                  />
                ))}
              </div>

              {/* Mobile View Collection */}

              {product.category && (
                <div className="mt-10 flex justify-center sm:hidden">
                  <Link
                    href={`${prefix}/categories/${product.category.slug}`}
                    className="
                      inline-flex min-h-12
                      items-center justify-center gap-2
                      border border-[#d9cbb9]
                      bg-white
                      px-6
                      text-sm font-bold
                      text-[#171717]
                      transition-all
                      hover:border-[#a66d36]
                      hover:text-[#a66d36]
                    "
                  >
                    <span>{isArabic ? "عرض المجموعة" : "View Collection"}</span>

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
