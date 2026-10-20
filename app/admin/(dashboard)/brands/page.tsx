
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import BrandsManager from "./BrandsManager";

export default async function BrandsPage() {
  await requireAdmin();

  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      slug: true,
      logo: true,
      isActive: true,
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <BrandsManager
      brands={brands.map((brand) => ({
        id: brand.id,
        nameAr: brand.nameAr,
        nameEn: brand.nameEn,
        slug: brand.slug,
        logo: brand.logo,
        isActive: brand.isActive,
        productCount: brand._count.products,
      }))}
    />
  );
}
