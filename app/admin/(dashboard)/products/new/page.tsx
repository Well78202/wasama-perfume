
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import ProductForm from "../ProductForm";

export const metadata: Metadata = {
  title: "إضافة منتج | وسامة برفيوم",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewProductPage() {
  await requireAdmin();

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { nameAr: "asc" },
      select: {
        id: true,
        nameAr: true,
      },
    }),

    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { nameAr: "asc" },
      select: {
        id: true,
        nameAr: true,
      },
    }),
  ]);

  return (
    <ProductForm
      categories={categories}
      brands={brands}
    />
  );
}
