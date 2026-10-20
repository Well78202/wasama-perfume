
import type { Metadata } from "next";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ProductsPageContent from "@/app/components/product/ProductsPageContent";

export const metadata: Metadata = {
  title: "كل العطور | وسامة برفيوم",
  description:
    "تسوق مجموعة مختارة من العطور الرجالية والحريمية والشرقية من وسامة برفيوم.",
  alternates: {
    canonical: "/products",
    languages: {
      "ar-EG": "/products",
      en: "/en/products",
    },
  },
};

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    brand?: string | string[];
    category?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const query =
    typeof params.q === "string" ? params.q : "";

  const brand =
    typeof params.brand === "string" ? params.brand : "";

  const category =
    typeof params.category === "string"
      ? params.category
      : "";

  const sort =
    typeof params.sort === "string"
      ? params.sort
      : "newest";

  return (
    <>
      <Header locale="ar" />

      <ProductsPageContent
        locale="ar"
        query={query}
        brand={brand}
        category={category}
        sort={sort}
      />

      <Footer locale="ar" />
    </>
  );
}
