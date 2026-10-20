
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import ProductForm from "../../ProductForm";
export const metadata: Metadata = {
  title: "تعديل منتج | وسامة برفيوم",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  await requireAdmin();

  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    }),

    prisma.category.findMany({
      orderBy: { nameAr: "asc" },
      select: {
        id: true,
        nameAr: true,
      },
    }),

    prisma.brand.findMany({
      orderBy: { nameAr: "asc" },
      select: {
        id: true,
        nameAr: true,
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      categories={categories}
      brands={brands}
      product={{
        id: product.id,
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        slug: product.slug,
        sku: product.sku,
        descriptionAr: product.descriptionAr,
        descriptionEn: product.descriptionEn,
        price: product.price.toString(),
        oldPrice: product.oldPrice?.toString() ?? null,
        stock: product.stock,
        categoryId: product.categoryId,
        brandId: product.brandId,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        isBestSeller: product.isBestSeller,
        imageUrls: product.images.map((image) => image.url),
      }}
    />
  );
}
