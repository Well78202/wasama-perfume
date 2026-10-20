import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

function localizedEntry(
  path: string,
  lastModified: Date,
  changeFrequency: "daily" | "weekly" | "monthly" = "weekly",
  priority = 0.7
): MetadataRoute.Sitemap {
  const arUrl = `${SITE_URL}${path}`;
  const enUrl = `${SITE_URL}/en${path}`;

  const common = {
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        "ar-EG": arUrl,
        en: enUrl,
        "x-default": arUrl,
      },
    },
  };

  return [
    { url: arUrl, ...common },
    { url: enUrl, ...common },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),

    prisma.category.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),

    prisma.brand.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    ...localizedEntry("/", now, "daily", 1),
    ...localizedEntry("/products", now, "daily", 0.9),
  ];

  const productPages = products.flatMap((product) =>
    localizedEntry(
      `/products/${encodeURIComponent(product.slug)}`,
      product.updatedAt,
      "weekly",
      0.8
    )
  );

  const categoryPages = categories.flatMap((category) =>
    localizedEntry(
      `/categories/${encodeURIComponent(category.slug)}`,
      category.updatedAt,
      "weekly",
      0.8
    )
  );

  const brandPages = brands.flatMap((brand) =>
    localizedEntry(
      `/brands/${encodeURIComponent(brand.slug)}`,
      brand.updatedAt,
      "weekly",
      0.7
    )
  );

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...brandPages,
  ];
}