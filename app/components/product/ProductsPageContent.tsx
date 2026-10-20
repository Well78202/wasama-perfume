
import ProductFilters from "@/app/components/product/ProductFilters";
import ProductCard from "@/app/components/product/ProductCard";
import ProductSearch from "@/app/components/product/ProductSearch";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/translations";

type ProductsPageContentProps = {
  locale: Locale;
  query?: string;
  brand?: string;
  category?: string;
  sort?: string;
};

export default async function ProductsPageContent({
  locale,
  query = "",
  brand = "",
  category = "",
  sort = "newest",
}: ProductsPageContentProps) {
  const isArabic = locale === "ar";
  const searchQuery = query.trim().slice(0, 100);

  const selectedSort = [
    "newest",
    "price-asc",
    "price-desc",
  ].includes(sort)
    ? sort
    : "newest";

  const [brands, categories, products] = await Promise.all([
    prisma.brand.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
        nameAr: true,
        nameEn: true,
      },
      orderBy: {
        nameEn: "asc",
      },
    }),

    prisma.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
        nameAr: true,
        nameEn: true,
      },
      orderBy: {
        nameEn: "asc",
      },
    }),

    prisma.product.findMany({
      where: {
        isActive: true,

        ...(brand
          ? {
              brand: {
                is: {
                  slug: brand,
                },
              },
            }
          : {}),

        ...(category
          ? {
              category: {
                slug: category,
              },
            }
          : {}),

        ...(searchQuery
          ? {
              OR: [
                {
                  nameAr: {
                    contains: searchQuery,
                    mode: "insensitive" as const,
                  },
                },
                {
                  nameEn: {
                    contains: searchQuery,
                    mode: "insensitive" as const,
                  },
                },
                {
                  brand: {
                    is: {
                      nameAr: {
                        contains: searchQuery,
                        mode: "insensitive" as const,
                      },
                    },
                  },
                },
                {
                  brand: {
                    is: {
                      nameEn: {
                        contains: searchQuery,
                        mode: "insensitive" as const,
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },

      orderBy:
        selectedSort === "price-asc"
          ? { price: "asc" }
          : selectedSort === "price-desc"
            ? { price: "desc" }
            : { createdAt: "desc" },

      include: {
        brand: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
          take: 1,
        },
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#fffaf3]">
      {/* PAGE HEADER */}
      <section className="border-b border-black/10 bg-[#171411]">
        <div className="mx-auto max-w-360 px-5 py-16 text-center text-white sm:py-20 lg:px-8 lg:py-24">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#d5a86e]">
            {isArabic ? "وسامة برفيوم" : "WASAMA PERFUME"}
          </p>

          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            {isArabic ? "كل العطور" : "All Perfumes"}
          </h1>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/60">
            {isArabic
              ? "اكتشف مجموعتنا المختارة من العطور الرجالية والحريمية والشرقية."
              : "Discover our curated collection of men's, women's and oriental fragrances."}
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-360 px-5 lg:px-8">
          {/* SEARCH */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ProductSearch
              locale={locale}
              initialQuery={searchQuery}
            />

            <p className="shrink-0 text-sm text-neutral-500">
              {isArabic ? "عدد المنتجات:" : "Products:"}{" "}
              <span className="font-bold text-[#171411]">
                {products.length}
              </span>
            </p>
          </div>

          {/* FILTERS */}
          <ProductFilters
            locale={locale}
            brands={brands}
            categories={categories}
            selectedBrand={brand}
            selectedCategory={category}
            selectedSort={selectedSort}
          />

          {/* SEARCH RESULTS SUMMARY */}
          {searchQuery && (
            <div className="mb-8 border-b border-black/10 pb-5">
              <p className="text-sm text-neutral-600">
                {isArabic
                  ? "نتائج البحث عن:"
                  : "Search results for:"}{" "}
                <span className="font-bold text-[#171411]">
                  {searchQuery}
                </span>
              </p>
            </div>
          )}

          {/* PRODUCT GRID */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  locale={locale}
                  product={{
                    name: isArabic
                      ? product.nameAr
                      : product.nameEn,

                    brand: isArabic
                      ? product.brand?.nameAr ?? ""
                      : product.brand?.nameEn ?? "",

                    slug: product.slug,

                    image:
                      product.images[0]?.url ??
                      "/images/products/placeholder.jpg",

                    price: Number(product.price),

                    oldPrice:
                      product.oldPrice !== null
                        ? Number(product.oldPrice)
                        : undefined,

                    badge: product.isBestSeller
                      ? isArabic
                        ? "الأكثر مبيعًا"
                        : "BEST SELLER"
                      : undefined,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-96 items-center justify-center rounded-2xl border border-[#eadfce] bg-white px-6 text-center">
              <div>
                <h2 className="text-xl font-bold text-[#171717]">
                  {searchQuery || brand || category
                    ? isArabic
                      ? "لا توجد منتجات مطابقة"
                      : "No matching products found"
                    : isArabic
                      ? "لا توجد منتجات حاليًا"
                      : "No products available"}
                </h2>

                <p className="mt-2 text-sm text-neutral-500">
                  {searchQuery || brand || category
                    ? isArabic
                      ? "جرّب تغيير البحث أو الفلاتر."
                      : "Try changing your search or filters."
                    : isArabic
                      ? "سيتم إضافة منتجات جديدة قريبًا."
                      : "New products will be added soon."}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
