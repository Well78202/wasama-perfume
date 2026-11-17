
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ProductFormState = {
  error: string;
};

const moneyRegex = /^\d+(?:\.\d{1,2})?$/;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ============================================
// IMAGE VALIDATION
// ============================================

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value);

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      "cin4fdsx";

    return (
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

// ============================================
// PRODUCT VALIDATION SCHEMA
// ============================================

const productSchema = z.object({
  nameAr: z.string().trim().min(2),
  nameEn: z.string().trim().min(2),

  slug: z.string().trim().regex(slugRegex),
  sku: z.string().trim().max(100),

  descriptionAr: z.string().trim(),
  descriptionEn: z.string().trim(),

  metaTitleAr: z.string().trim().max(255),
  metaTitleEn: z.string().trim().max(255),

  metaDescriptionAr: z.string().trim().max(500),
  metaDescriptionEn: z.string().trim().max(500),

  price: z.string().regex(moneyRegex),
  oldPrice: z.string(),

  categoryId: z.string().min(1),

  imageUrls: z
    .array(
      z.string().refine(isValidImageUrl, {
        message: "رابط صورة غير صالح",
      })
    )
    .max(10),

  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
});

type ProductData = z.infer<typeof productSchema>;

function optionalText(value: string) {
  return value || null;
}

// ============================================
// READ PRODUCT FORM
// ============================================

function readProduct(formData: FormData) {
  const rawImages = String(
    formData.get("imageUrls") ?? ""
  )
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  const imageUrls = [...new Set(rawImages)];

  const field = (name: string) =>
    String(formData.get(name) ?? "");

  return productSchema.safeParse({
    nameAr: field("nameAr"),
    nameEn: field("nameEn"),

    slug: field("slug").toLowerCase(),
    sku: field("sku"),

    descriptionAr: field("descriptionAr"),
    descriptionEn: field("descriptionEn"),

    metaTitleAr: field("metaTitleAr"),
    metaTitleEn: field("metaTitleEn"),

    metaDescriptionAr: field("metaDescriptionAr"),
    metaDescriptionEn: field("metaDescriptionEn"),

    price: field("price"),
    oldPrice: field("oldPrice"),

    categoryId: field("categoryId"),

    imageUrls,

    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isBestSeller:
      formData.get("isBestSeller") === "on",
  });
}

// ============================================
// PRICE VALIDATION
// ============================================

function validatePrices(
  price: string,
  oldPrice: string
) {
  const p = Number(price);
  const old = oldPrice ? Number(oldPrice) : null;

  return (
    Number.isFinite(p) &&
    p > 0 &&
    p <= 99999999.99 &&
    (old === null ||
      (moneyRegex.test(oldPrice) &&
        old > p &&
        old <= 99999999.99))
  );
}

// ============================================
// CATEGORY VALIDATION
// ============================================

async function validateCategory(categoryId: string) {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  return Boolean(category);
}

// ============================================
// PRODUCT DATABASE FIELDS
// ============================================

function productFields(data: ProductData) {
  return {
    nameAr: data.nameAr,
    nameEn: data.nameEn,
    slug: data.slug,

    sku: optionalText(data.sku),

    descriptionAr: optionalText(data.descriptionAr),
    descriptionEn: optionalText(data.descriptionEn),

    metaTitleAr: optionalText(data.metaTitleAr),
    metaTitleEn: optionalText(data.metaTitleEn),

    metaDescriptionAr: optionalText(
      data.metaDescriptionAr
    ),
    metaDescriptionEn: optionalText(
      data.metaDescriptionEn
    ),

    price: data.price,
    oldPrice: optionalText(data.oldPrice),

    categoryId: data.categoryId,

    isActive: data.isActive,
    isFeatured: data.isFeatured,
    isBestSeller: data.isBestSeller,

    updatedAt: new Date(),
  };
}

// ============================================
// ERROR HANDLING
// ============================================

function friendlyError(
  error: unknown
): ProductFormState {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return {
      error: "رابط المنتج أو كود SKU مستخدم بالفعل.",
    };
  }

  if (
    error instanceof Error &&
    error.message === "PRODUCT_NOT_FOUND"
  ) {
    return {
      error: "المنتج غير موجود.",
    };
  }

  console.error("Product save failed:", error);

  return {
    error: "حدث خطأ أثناء حفظ المنتج. حاول مرة أخرى.",
  };
}

// ============================================
// VALIDATE PRODUCT
// ============================================

async function validateProduct(
  formData: FormData
): Promise<
  | { success: true; data: ProductData }
  | { success: false; error: string }
> {
  const result = readProduct(formData);

  if (!result.success) {
    return {
      success: false,
      error: "راجع البيانات المدخلة وروابط الصور.",
    };
  }

  const data = result.data;

  if (!validatePrices(data.price, data.oldPrice)) {
    return {
      success: false,
      error:
        "السعر يجب أن يكون أكبر من صفر، والسعر القديم أكبر من السعر الحالي.",
    };
  }

  if (!(await validateCategory(data.categoryId))) {
    return {
      success: false,
      error: "اختر تصنيفًا صالحًا.",
    };
  }

  return {
    success: true,
    data,
  };
}

// ============================================
// CREATE PRODUCT
// ============================================

export async function createProduct(
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const result = await validateProduct(formData);

  if (!result.success) {
    return { error: result.error };
  }

  const data = result.data;

  try {
    await prisma.product.create({
      data: {
        ...productFields(data),

        images: {
          create: data.imageUrls.map((url, index) => ({
            url,
            sortOrder: index,
            altAr: data.nameAr,
            altEn: data.nameEn,
          })),
        },
      },
    });
  } catch (error) {
    return friendlyError(error);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}

// ============================================
// UPDATE PRODUCT
// ============================================

export async function updateProduct(
  id: string,
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const result = await validateProduct(formData);

  if (!result.success) {
    return { error: result.error };
  }

  const data = result.data;

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.product.findUnique({
        where: { id },
        select: {
          id: true,
          images: {
            select: {
              id: true,
              url: true,
              sortOrder: true,
            },
          },
        },
      });

      if (!existing) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      await tx.product.update({
        where: { id },
        data: productFields(data),
      });

      const wantedUrls = new Set(data.imageUrls);

      // Remove only images deleted from the form.
      const removedIds = existing.images
        .filter((image) => !wantedUrls.has(image.url))
        .map((image) => image.id);

      if (removedIds.length > 0) {
        await tx.productImage.deleteMany({
          where: {
            productId: id,
            id: { in: removedIds },
          },
        });
      }

      const existingByUrl = new Map(
        existing.images.map((image) => [
          image.url,
          image,
        ])
      );

      // Preserve existing image IDs and alt text.
      for (const [index, url] of data.imageUrls.entries()) {
        const image = existingByUrl.get(url);

        if (image) {
          if (image.sortOrder !== index) {
            await tx.productImage.update({
              where: { id: image.id },
              data: { sortOrder: index },
            });
          }
        } else {
          await tx.productImage.create({
            data: {
              productId: id,
              url,
              sortOrder: index,
              altAr: data.nameAr,
              altEn: data.nameEn,
            },
          });
        }
      }
    });
  } catch (error) {
    return friendlyError(error);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}

// ============================================
// DELETE PRODUCT
// ============================================

export async function deleteProduct(
  productId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  await requireAdmin();

  if (!productId || typeof productId !== "string") {
    return {
      success: false,
      error: "معرّف المنتج غير صالح.",
    };
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const product = await tx.product.findUnique({
          where: { id: productId },
          select: { id: true },
        });

        if (!product) {
          return {
            success: false,
            error: "المنتج غير موجود.",
          };
        }

        const orderItemsCount =
          await tx.orderItem.count({
            where: { productId },
          });

        if (orderItemsCount > 0) {
          return {
            success: false,
            error:
              "لا يمكن حذف المنتج لأنه مرتبط بطلبات سابقة.",
          };
        }

        await tx.productImage.deleteMany({
          where: { productId },
        });

        await tx.product.delete({
          where: { id: productId },
        });

        return { success: true };
      }
    );

    if (result.success) {
      revalidatePath("/", "layout");
      revalidatePath("/admin/products");
    }

    return result;
  } catch (error) {
    console.error("Product delete failed:", error);

    return {
      success: false,
      error: "تعذر حذف المنتج.",
    };
  }
}
