import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import ShippingManager from "./ShippingManager";

export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  await requireAdmin();
  const rates = await prisma.shippingRate.findMany({ orderBy: [{ nameAr: "asc" }] });
  return <ShippingManager rates={rates.map((rate) => ({
    id: rate.id,
    code: rate.code,
    nameAr: rate.nameAr,
    nameEn: rate.nameEn,
    price: Number(rate.price),
    isActive: rate.isActive,
  }))} />;
}
