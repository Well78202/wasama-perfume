"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  storeNameAr: z.string().trim().min(2, "اسم المتجر بالعربي مطلوب").max(100),
  storeNameEn: z.string().trim().min(2, "اسم المتجر بالإنجليزي مطلوب").max(100),
  whatsapp: z.string().trim().max(30).regex(/^\+?[0-9\s-]*$/, "رقم واتساب غير صحيح"),
  vodafoneCashNumber: z.string().trim().max(30).regex(/^\+?[0-9\s-]*$/, "رقم فودافون كاش غير صحيح"),
  instapayAddress: z.string().trim().max(150),
  vodafoneCashEnabled: z.boolean(),
  instapayEnabled: z.boolean(),
  paymentInstructions: z.string().trim().max(2000),
}).superRefine((value, ctx) => {
  if (value.vodafoneCashEnabled && !value.vodafoneCashNumber) {
    ctx.addIssue({ code: "custom", path: ["vodafoneCashNumber"], message: "أدخل رقم فودافون كاش قبل تفعيل الطريقة" });
  }
  if (value.instapayEnabled && !value.instapayAddress) {
    ctx.addIssue({ code: "custom", path: ["instapayAddress"], message: "أدخل عنوان أو بيانات إنستاباي قبل التفعيل" });
  }
});

export type SettingsActionState = { success: boolean; error?: string };

export async function saveStoreSettings(
  _previous: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    storeNameAr: formData.get("storeNameAr"),
    storeNameEn: formData.get("storeNameEn"),
    whatsapp: formData.get("whatsapp") ?? "",
    vodafoneCashNumber: formData.get("vodafoneCashNumber") ?? "",
    instapayAddress: formData.get("instapayAddress") ?? "",
    vodafoneCashEnabled: formData.get("vodafoneCashEnabled") === "on",
    instapayEnabled: formData.get("instapayEnabled") === "on",
    paymentInstructions: formData.get("paymentInstructions") ?? "",
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  }
  try {
    await prisma.storeSettings.upsert({
      where: { id: "main" },
      create: { id: "main", ...parsed.data },
      update: parsed.data,
    });
    revalidatePath("/admin/settings");
    revalidatePath("/checkout");
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "تعذر حفظ الإعدادات. حاول مرة أخرى." };
  }
}
