
import type { Metadata } from "next";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import WishlistPageContent from "@/app/components/wishlist/WishlistPageContent";
import { prisma } from "@/lib/prisma";

/* ================= METADATA ================= */

export const metadata: Metadata = {
  title: "المفضلة | وسامة برفيوم",

  description:
    "تصفح قائمة عطورك المفضلة في وسامة برفيوم.",

  robots: {
    index: false,
    follow: true,
  },
};

/* ================= WISHLIST PAGE ================= */

export default async function WishlistPage() {
  // ================= FETCH ACTIVE PRODUCTS =================

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },

    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
  });

  // ================= FORMAT PRODUCTS =================

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

    isBestSeller: product.isBestSeller,
  }));

  return (
    <>
      <Header locale="ar" />

      <WishlistPageContent
        locale="ar"
        products={wishlistProducts}
      />

      <Footer locale="ar" />
    </>
  );
}
