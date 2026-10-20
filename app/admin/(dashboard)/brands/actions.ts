
"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type BrandFormState = {
  error: string;
  success?: string;
};

const brandSchema = z.object({
  nameAr: z.string().trim().min(2, "اسم البراند بالعربي قصير"),
  nameEn: z.string().trim().min(2, "اسم البراند بالإنجليزي قصير"),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "الرابط لازم يكون حروف إنجليزية صغيرة وأرقام وشرطات"
    ),
  logo: z.string().trim(),
  isActive: z.boolean(),
});

function parseBrand(formData: FormData) {
  return brandSchema.safeParse({
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    slug: formData.get("slug"),
    logo: formData.get("logo") ?? "",
    isActive: formData.get("isActive") === "on",
  });
}

function validateLogo(logo: string) {
  if (!logo) return true;

  try {
    const url = new URL(logo);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    return (
      !!cloudName &&
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      url.pathname.startsWith(
        `/${cloudName}/image/upload/`
      )
    );
  } catch {
    return false;
  }
}

function refreshBrands() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/brands");
  revalidatePath("/admin/products");
}

function getError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    if (error.code === "P2002") {
      return "رابط البراند مستخدم بالفعل.";
    }

    if (error.code === "P2025") {
      return "البراند غير موجود.";
    }
  }

  console.error("Brand operation failed:", error);
  return "حصل خطأ أثناء تنفيذ العملية.";
}

export async function createBrand(
  _state: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  await requireAdmin();

  const result = parseBrand(formData);

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ??
        "راجع بيانات البراند.",
    };
  }

  if (!validateLogo(result.data.logo)) {
    return { error: "صورة البراند غير صالحة." };
  }

  try {
    await prisma.brand.create({
      data: {
        nameAr: result.data.nameAr,
        nameEn: result.data.nameEn,
        slug: result.data.slug,
        logo: result.data.logo || null,
        isActive: result.data.isActive,
      },
    });

    refreshBrands();

    return {
      error: "",
      success: "تمت إضافة البراند بنجاح.",
    };
  } catch (error) {
    return { error: getError(error) };
  }
}

export async function updateBrand(
  id: string,
  _state: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  await requireAdmin();

  const result = parseBrand(formData);

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ??
        "راجع بيانات البراند.",
    };
  }

  if (!validateLogo(result.data.logo)) {
    return { error: "صورة البراند غير صالحة." };
  }

  try {
    await prisma.brand.update({
      where: { id },
      data: {
        nameAr: result.data.nameAr,
        nameEn: result.data.nameEn,
        slug: result.data.slug,
        logo: result.data.logo || null,
        isActive: result.data.isActive,
      },
    });

    refreshBrands();

    return {
      error: "",
      success: "تم حفظ التعديلات بنجاح.",
    };
  } catch (error) {
    return { error: getError(error) };
  }
}

export async function deleteBrand(
  id: string
): Promise<BrandFormState> {
  await requireAdmin();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const brand = await tx.brand.findUnique({
        where: { id },
        select: {
          id: true,
          _count: {
            select: { products: true },
          },
        },
      });

      if (!brand) {
        return { error: "البراند غير موجود." };
      }

      if (brand._count.products > 0) {
        return {
          error:
            "البراند مرتبط بمنتجات. لازم تنقل المنتجات لبراند تاني أو تلغي ربطها الأول.",
        };
      }

      await tx.brand.delete({
        where: { id },
      });

      return {
        error: "",
        success: "تم حذف البراند نهائيًا.",
      };
    });

    if (!result.error) refreshBrands();

    return result;
  } catch (error) {
    return { error: getError(error) };
  }
}
