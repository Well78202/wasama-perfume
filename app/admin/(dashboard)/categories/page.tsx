
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import CategoriesManager from "./CategoriesManager";

export default async function CategoriesPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      slug: true,
      descriptionAr: true,
      descriptionEn: true,
      isActive: true,
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <CategoriesManager
      categories={categories.map((category) => ({
        id: category.id,
        nameAr: category.nameAr,
        nameEn: category.nameEn,
        slug: category.slug,
        descriptionAr: category.descriptionAr,
        descriptionEn: category.descriptionEn,
        isActive: category.isActive,
        productCount: category._count.products,
      }))}
    />
  );
}
