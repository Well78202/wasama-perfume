
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export type ProductFormState = {
  error: string;
};

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!cloudName) return false;

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

const productSchema = z.object({
  nameAr: z.string().trim().min(2),
  nameEn: z.string().trim().min(2),

  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  sku: z.string().trim(),

  descriptionAr: z.string().trim(),
  descriptionEn: z.string().trim(),

  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  oldPrice: z.string(),

  stock: z.coerce.number().int().min(0),

  categoryId: z.string().min(1),
  brandId: z.string(),

  imageUrls: z
    .array(z.string().refine(isValidImageUrl))
    .max(10),

  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
});

function readProduct(formData: FormData) {
  const rawImages = String(
    formData.get("imageUrls") ?? ""
  )
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  return productSchema.safeParse({
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    slug: formData.get("slug"),
    sku: formData.get("sku") ?? "",
    descriptionAr:
      formData.get("descriptionAr") ?? "",
    descriptionEn:
      formData.get("descriptionEn") ?? "",
    price: formData.get("price"),
    oldPrice: formData.get("oldPrice") ?? "",
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId") ?? "",
    imageUrls: rawImages,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isBestSeller:
      formData.get("isBestSeller") === "on",
  });
}

function validatePrices(
  price: string,
  oldPrice: string
) {
  const p = Number(price);
  const old = oldPrice ? Number(oldPrice) : null;

  return (
    p > 0 &&
    p <= 99999999.99 &&
    (old === null ||
      (/^\d+(\.\d{1,2})?$/.test(oldPrice) &&
        old > p &&
        old <= 99999999.99))
  );
}

async function validateRelations(
  categoryId: string,
  brandId: string
) {
  const [category, brand] = await Promise.all([
    prisma.category.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },
      select: { id: true },
    }),

    brandId
      ? prisma.brand.findFirst({
          where: {
            id: brandId,
            isActive: true,
          },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  return !!category && (!brandId || !!brand);
}

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
      error: "الرابط أو كود المنتج مستخدم بالفعل.",
    };
  }

  console.error("Product save failed:", error);

  return {
    error: "حدث خطأ أثناء الحفظ. حاول مرة أخرى.",
  };
}

export async function createProduct(
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const result = readProduct(formData);

  if (!result.success) {
    return {
      error: "راجع بيانات المنتج والصور المدخلة.",
    };
  }

  const data = result.data;

  if (!validatePrices(data.price, data.oldPrice)) {
    return {
      error: "راجع السعر والسعر القديم.",
    };
  }

  if (
    !(await validateRelations(
      data.categoryId,
      data.brandId
    ))
  ) {
    return {
      error: "اختر تصنيفًا وبراندًا صالحين.",
    };
  }

  try {
    await prisma.product.create({
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        slug: data.slug,
        sku: data.sku || null,

        descriptionAr:
          data.descriptionAr || null,
        descriptionEn:
          data.descriptionEn || null,

        price: data.price,
        oldPrice: data.oldPrice || null,
        stock: data.stock,

        categoryId: data.categoryId,
        brandId: data.brandId || null,

        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isBestSeller: data.isBestSeller,

        images: {
          create: data.imageUrls.map(
            (url, index) => ({
              url,
              sortOrder: index,
            })
          ),
        },
      },
    });
  } catch (error) {
    return friendlyError(error);
  }

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const result = readProduct(formData);

  if (!result.success) {
    return {
      error: "راجع بيانات المنتج والصور المدخلة.",
    };
  }

  const data = result.data;

  if (!validatePrices(data.price, data.oldPrice)) {
    return {
      error: "راجع السعر والسعر القديم.",
    };
  }

  if (
    !(await validateRelations(
      data.categoryId,
      data.brandId
    ))
  ) {
    return {
      error: "اختر تصنيفًا وبراندًا صالحين.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existing =
        await tx.product.findUnique({
          where: { id },
          select: { id: true },
        });

      if (!existing) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      await tx.product.update({
        where: { id },
        data: {
          nameAr: data.nameAr,
          nameEn: data.nameEn,
          slug: data.slug,
          sku: data.sku || null,

          descriptionAr:
            data.descriptionAr || null,
          descriptionEn:
            data.descriptionEn || null,

          price: data.price,
          oldPrice: data.oldPrice || null,
          stock: data.stock,

          categoryId: data.categoryId,
          brandId: data.brandId || null,

          isActive: data.isActive,
          isFeatured: data.isFeatured,
          isBestSeller: data.isBestSeller,
        },
      });

      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      if (data.imageUrls.length > 0) {
        await tx.productImage.createMany({
          data: data.imageUrls.map(
            (url, index) => ({
              productId: id,
              url,
              sortOrder: index,
            })
          ),
        });
      }
    });
  } catch (error) {
    return friendlyError(error);
  }

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(
  productId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  if (!productId || typeof productId !== "string") {
    return {
      success: false,
      error: "معرّف المنتج غير صالح.",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
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

      // منع حذف منتج مرتبط بطلبات سابقة
      const orderItemsCount = await tx.orderItem.count({
        where: { productId },
      });

      if (orderItemsCount > 0) {
        return {
          success: false,
          error:
            "لا يمكن حذف المنتج نهائيًا لأنه مرتبط بطلبات سابقة.",
        };
      }

      // حذف سجلات صور المنتج أولًا
      await tx.productImage.deleteMany({
        where: { productId },
      });

      // حذف المنتج نفسه نهائيًا
      await tx.product.delete({
        where: { id: productId },
      });

      return { success: true };
    });

    if (result.success) {
      revalidatePath("/", "layout");
      revalidatePath("/admin/products");
    }

    return result;
  } catch (error) {
    console.error("Permanent product delete error:", error);

    return {
      success: false,
      error: "تعذر حذف المنتج نهائيًا. حاول مرة أخرى.",
    };
  }
}
