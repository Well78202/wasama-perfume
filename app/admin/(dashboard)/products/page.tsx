import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import ProductsList from "./ProductsList";

export const metadata: Metadata = {
  title: "إدارة المنتجات | وسامة برفيوم",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      slug: true,
      price: true,
      oldPrice: true,
      stock: true,
      isActive: true,
      isFeatured: true,
      isBestSeller: true,
      metaTitleAr: true,
      metaTitleEn: true,
      metaDescriptionAr: true,
      metaDescriptionEn: true,
      category: {
        select: {
          nameAr: true,
        },
      },

      brand: {
        select: {
          nameAr: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
        select: {
          url: true,
        },
      },
    },
  });

  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.nameAr,
    nameEn: product.nameEn,
    slug: product.slug,
    hasSeo: Boolean(
      product.metaTitleAr?.trim() &&
      product.metaTitleEn?.trim() &&
      product.metaDescriptionAr?.trim() &&
      product.metaDescriptionEn?.trim(),
    ),
    category: product.category.nameAr,
    brand: product.brand?.nameAr ?? "بدون براند",

    image: product.images[0]?.url ?? null,

    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,

    stock: product.stock,

    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
  }));

  return <ProductsList products={formattedProducts} />;
}
