
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

export const dynamic = "force-dynamic";

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
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    }),

    prisma.category.findMany({
      orderBy: {
        nameAr: "asc",
      },
      select: {
        id: true,
        nameAr: true,
      },
    }),

    prisma.brand.findMany({
      orderBy: {
        nameAr: "asc",
      },
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

        // Basic information
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        slug: product.slug,
        sku: product.sku,

        // Descriptions
        descriptionAr: product.descriptionAr,
        descriptionEn: product.descriptionEn,

        // SEO
        metaTitleAr: product.metaTitleAr,
        metaTitleEn: product.metaTitleEn,
        metaDescriptionAr: product.metaDescriptionAr,
        metaDescriptionEn: product.metaDescriptionEn,

        // Pricing
        price: product.price.toString(),
        oldPrice: product.oldPrice?.toString() ?? null,
        stock: product.stock,

        // Category and brand
        categoryId: product.categoryId,
        brandId: product.brandId,

        // Display settings
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        isBestSeller: product.isBestSeller,

        // Images
        imageUrls: product.images.map(
          (image) => image.url
        ),
      }}
    />
  );
}
