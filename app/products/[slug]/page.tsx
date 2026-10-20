import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailsPage from "@/app/components/product/ProductDetailsPage";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const STORE_NAME = "وسامة برفيوم";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },

    select: {
      nameAr: true,
      descriptionAr: true,
      metaTitleAr: true,
      metaDescriptionAr: true,
      isActive: true,

      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { url: true },
      },
    },
  });

  if (!product || !product.isActive) {
    return {
      title: `المنتج غير موجود | ${STORE_NAME}`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    product.metaTitleAr?.trim() ||
    `${product.nameAr} | ${STORE_NAME}`;

  const description =
    product.metaDescriptionAr?.trim() ||
    product.descriptionAr?.trim() ||
    `اكتشف عطر ${product.nameAr} من وسامة برفيوم وتسوق مجموعتنا من العطور.`;

  const productPath = `/products/${encodeURIComponent(slug)}`;

  const image = product.images[0]?.url;

  return {
    title,
    description,

    alternates: {
      canonical: productPath,
      languages: {
        "ar-EG": productPath,
        en: `/en${productPath}`,
        "x-default": productPath,
      },
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      locale: "ar_EG",
      siteName: STORE_NAME,
      title,
      description,
      url: productPath,
      images: image
        ? [
            {
              url: image,
              alt: product.nameAr,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({
  params,
}: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      isActive: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <ProductDetailsPage
      locale="ar"
      slug={slug}
    />
  );
}