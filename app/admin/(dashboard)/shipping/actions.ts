"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

export type ShippingActionState = { success: boolean; error?: string };

const schema = z.object({
  code: z.string().trim().min(2).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "الكود لازم يكون حروف إنجليزية صغيرة وأرقام وشرطات فقط"),
  nameAr: z.string().trim().min(2).max(100),
  nameEn: z.string().trim().min(2).max(100),
  price: z.coerce.number().finite().min(0).max(999999),
  isActive: z.boolean(),
});

function parseForm(formData: FormData) {
  return schema.safeParse({
    code: String(formData.get("code") ?? "").trim().toLowerCase(),
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    price: formData.get("price"),
    isActive: formData.get("isActive") === "true",
  });
}

export async function saveShippingRate(
  _prev: ShippingActionState,
  formData: FormData
): Promise<ShippingActionState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  const id = String(formData.get("id") ?? "").trim();
  try {
    if (id) {
      const exists = await prisma.shippingRate.findUnique({ where: { id }, select: { id: true } });
      if (!exists) return { success: false, error: "المحافظة غير موجودة" };
      await prisma.shippingRate.update({ where: { id }, data: parsed.data });
    } else {
      await prisma.shippingRate.create({ data: parsed.data });
    }
    revalidatePath("/admin/shipping");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return { success: false, error: "كود المحافظة مستخدم بالفعل" };
    }
    return { success: false, error: "تعذر حفظ المحافظة. حاول مرة أخرى." };
  }
}

export async function toggleShippingRate(id: string, isActive: boolean): Promise<ShippingActionState> {
  await requireAdmin();
  if (!id || typeof isActive !== "boolean") return { success: false, error: "طلب غير صحيح" };
  try {
    await prisma.shippingRate.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/shipping");
    revalidatePath("/checkout");
    return { success: true };
  } catch {
    return { success: false, error: "تعذر تغيير حالة المحافظة" };
  }
}
