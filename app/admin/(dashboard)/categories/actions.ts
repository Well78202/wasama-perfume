
"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type CategoryFormState = {
  error: string;
  success?: string;
};

const categorySchema = z.object({
  nameAr: z.string().trim().min(2, "الاسم العربي قصير"),
  nameEn: z.string().trim().min(2, "الاسم الإنجليزي قصير"),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "الرابط لازم يكون حروف إنجليزية صغيرة وأرقام وشرطات"
    ),
  descriptionAr: z.string().trim(),
  descriptionEn: z.string().trim(),
  isActive: z.boolean(),
});

function parseCategory(formData: FormData) {
  return categorySchema.safeParse({
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    slug: formData.get("slug"),
    descriptionAr: formData.get("descriptionAr") ?? "",
    descriptionEn: formData.get("descriptionEn") ?? "",
    isActive: formData.get("isActive") === "on",
  });
}

function refreshCategories() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
}

function getError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return "رابط التصنيف مستخدم بالفعل.";
  }

  console.error("Category error:", error);
  return "حصل خطأ أثناء حفظ التصنيف.";
}

export async function createCategory(
  _state: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const result = parseCategory(formData);

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ??
        "راجع بيانات التصنيف.",
    };
  }

  const data = result.data;

  try {
    await prisma.category.create({
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        slug: data.slug,
        descriptionAr: data.descriptionAr || null,
        descriptionEn: data.descriptionEn || null,
        isActive: data.isActive,
      },
    });

    refreshCategories();

    return {
      error: "",
      success: "تمت إضافة التصنيف بنجاح.",
    };
  } catch (error) {
    return { error: getError(error) };
  }
}

export async function updateCategory(
  id: string,
  _state: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const result = parseCategory(formData);

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ??
        "راجع بيانات التصنيف.",
    };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        nameAr: result.data.nameAr,
        nameEn: result.data.nameEn,
        slug: result.data.slug,
        descriptionAr:
          result.data.descriptionAr || null,
        descriptionEn:
          result.data.descriptionEn || null,
        isActive: result.data.isActive,
      },
    });

    refreshCategories();

    return {
      error: "",
      success: "تم حفظ التعديلات بنجاح.",
    };
  } catch (error) {
    return { error: getError(error) };
  }
}

export async function deleteCategory(
  id: string
): Promise<CategoryFormState> {
  await requireAdmin();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id },
        select: {
          id: true,
          _count: {
            select: { products: true },
          },
        },
      });

      if (!category) {
        return { error: "التصنيف غير موجود." };
      }

      if (category._count.products > 0) {
        return {
          error:
            "مينفعش تحذف التصنيف لأنه مرتبط بمنتجات. انقل المنتجات لتصنيف تاني الأول.",
        };
      }

      await tx.category.delete({
        where: { id },
      });

      return {
        error: "",
        success: "تم حذف التصنيف نهائيًا.",
      };
    });

    if (!result.error) refreshCategories();

    return result;
  } catch (error) {
    return { error: getError(error) };
  }
}
