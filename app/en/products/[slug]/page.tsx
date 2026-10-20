import type { Metadata } from "next";

import ProductDetailsPage from "@/app/components/product/ProductDetailsPage";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },

    select: {
      nameEn: true,
      descriptionEn: true,
      metaTitleEn: true,
      metaDescriptionEn: true,

      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
  });

  if (!product) {
    return {
      title: "Product Not Found | Wasama Perfume",
    };
  }

  return {
    title:
      product.metaTitleEn ??
      `${product.nameEn} | Wasama Perfume`,

    description:
      product.metaDescriptionEn ??
      product.descriptionEn ??
      undefined,

    alternates: {
      canonical: `/en/products/${slug}`,

      languages: {
        "ar-EG": `/products/${slug}`,
        en: `/en/products/${slug}`,
      },
    },

    openGraph: {
      title:
        product.metaTitleEn ??
        `${product.nameEn} | Wasama Perfume`,

      description:
        product.metaDescriptionEn ??
        product.descriptionEn ??
        undefined,

      images: product.images[0]?.url
        ? [product.images[0].url]
        : undefined,
    },
  };
}

export default async function Page({
  params,
}: PageProps) {
  const { slug } = await params;

  return (
    <ProductDetailsPage
      locale="en"
      slug={slug}
    />
  );
}