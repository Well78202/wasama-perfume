
import type { Metadata } from "next";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import WishlistPageContent from "@/app/components/wishlist/WishlistPageContent";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "My Wishlist | Wasama Perfume",
  description: "Explore your saved fragrances at Wasama Perfume.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function EnglishWishlistPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      brand: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });

  const wishlistProducts = products.map((product) => ({
    id: product.id,
    nameAr: product.nameAr,
    nameEn: product.nameEn,
    slug: product.slug,
    price: Number(product.price),
    oldPrice:
      product.oldPrice !== null
        ? Number(product.oldPrice)
        : null,
    image:
      product.images[0]?.url ??
      "/images/products/placeholder.jpg",
    brandAr: product.brand?.nameAr ?? "",
    brandEn: product.brand?.nameEn ?? "",
    isBestSeller: product.isBestSeller,
  }));

  return (
    <div lang="en" dir="ltr" className="en-page">
      <Header locale="en" />

      <WishlistPageContent
        locale="en"
        products={wishlistProducts}
      />

      <Footer locale="en" />
    </div>
  );
}
