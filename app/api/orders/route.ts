
import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getGovernorate } from "@/lib/governorates";
import {
  getStoreSettings,
  isPaymentMethodAvailable,
  type StoreSettingsData,
} from "@/lib/store-settings";

export const runtime = "nodejs";

const phone = z.string().regex(/^01[0125]\d{8}$/);

const itemSchema = z
  .object({
    slug: z.string().trim().min(1).max(150),
    quantity: z.number().int().min(1).max(99),
  })
  .strict();

const bodySchema = z
  .object({
    checkoutKey: z.string().uuid(),
    customerName: z.string().trim().min(3).max(100),
    phone,
    alternatePhone: z.union([phone, z.literal("")]).optional(),
    governorate: z.string().min(1).max(60),
    city: z.string().trim().min(2).max(100),
    address: z.string().trim().min(10).max(500),
    notes: z.string().trim().max(1000).optional(),
    paymentMethod: z.enum(["VODAFONE_CASH", "INSTAPAY"]),
    items: z.array(itemSchema).min(1).max(99),
  })
  .strict()
  .refine(
    (data) =>
      new Set(data.items.map((item) => item.slug)).size ===
      data.items.length,
    {
      message: "Duplicate products",
      path: ["items"],
    },
  );

type Body = z.infer<typeof bodySchema>;

type StoredOrder = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

function fail(message: string, status = 400) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

// ============================================
// CHECKOUT PAYLOAD HASH
// ============================================

function hashPayload(data: Body) {
  const canonical = {
    customerName: data.customerName,
    phone: data.phone,
    alternatePhone: data.alternatePhone || "",
    governorate: data.governorate,
    city: data.city,
    address: data.address,
    notes: data.notes || "",
    paymentMethod: data.paymentMethod,
    items: [...data.items].sort((a, b) =>
      a.slug.localeCompare(b.slug),
    ),
  };

  return createHash("sha256")
    .update(JSON.stringify(canonical))
    .digest("hex");
}

// ============================================
// ORDER RESPONSE + WHATSAPP
// ============================================

function orderResponse(
  order: StoredOrder,
  settings: StoreSettingsData,
) {
  const governorate = getGovernorate(order.governorate);

  const destination =
    order.paymentMethod === "VODAFONE_CASH"
      ? settings.vodafoneCashNumber
      : settings.instapayAddress;

  const whatsapp = settings.whatsapp.replace(/\D/g, "");

  const message = [
    `طلب جديد - ${settings.storeNameAr}`,
    `رقم الطلب: ${order.orderNumber}`,
    `الاسم: ${order.customerName}`,
    `الهاتف: ${order.phone}`,
    `المحافظة: ${governorate?.[1] ?? order.governorate}`,
    `المدينة: ${order.city}`,
    `العنوان: ${order.address}`,
    "",
    "المنتجات:",
    ...order.items.map(
      (item) =>
        `- ${item.productName} × ${item.quantity} = ${item.total.toFixed(2)} ج.م`,
    ),
    "",
    `إجمالي المنتجات: ${order.subtotal.toFixed(2)} ج.م`,
    `الشحن: ${order.shippingFee.toFixed(2)} ج.م`,
    `الإجمالي: ${order.total.toFixed(2)} ج.م`,
    `طريقة الدفع: ${
      order.paymentMethod === "VODAFONE_CASH"
        ? "Vodafone Cash"
        : "InstaPay"
    }`,
    `حساب التحويل: ${
      destination || "يرجى التواصل مع المتجر"
    }`,
    ...(settings.paymentInstructions
      ? ["", settings.paymentInstructions]
      : []),
    "",
    "سأرفق صورة إثبات التحويل في هذه المحادثة.",
  ].join("\n");

  return NextResponse.json(
    {
      orderNumber: order.orderNumber,
      total: Number(order.total),
      whatsappUrl: whatsapp
        ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
        : null,
    },
    {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

// ============================================
// RATE LIMIT
// ============================================

async function checkRateLimit(request: Request) {
  // Trust proxy headers only if the hosting proxy
  // overwrites them with the real client IP.

  const ip =
    request.headers.get("x-real-ip") ||
    request.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim() ||
    "unknown";

  const secret = process.env.CHECKOUT_RATE_LIMIT_SECRET;

  if (!secret) {
    throw new Error("CHECKOUT_RATE_LIMIT_SECRET is missing");
  }

  const bucket = Math.floor(Date.now() / 3_600_000);

  const key = createHash("sha256")
    .update(`${secret}:${ip}:${bucket}`)
    .digest("hex");

  const counter = await prisma.checkoutRateLimit.upsert({
    where: { key },
    create: { key, count: 1 },
    update: {
      count: { increment: 1 },
    },
    select: { count: true },
  });

  return counter.count <= 10;
}

// ============================================
// CREATE ORDER
// ============================================

export async function POST(request: Request) {
  try {
    const length = Number(
      request.headers.get("content-length") || 0,
    );

    if (length > 20_000) {
      return fail("Request too large", 413);
    }

    let raw: unknown;

    try {
      raw = await request.json();
    } catch {
      return fail("Invalid JSON");
    }

    const parsed = bodySchema.safeParse(raw);

    if (!parsed.success) {
      return fail("Please enter valid customer and cart details");
    }

    const data = parsed.data;
    const payloadHash = hashPayload(data);

    // ========================================
    // IDEMPOTENCY
    // ========================================

    const existing = await prisma.order.findUnique({
      where: {
        checkoutKey: data.checkoutKey,
      },
      include: {
        items: true,
      },
    });

    if (existing) {
      if (existing.checkoutPayloadHash !== payloadHash) {
        return fail(
          "Checkout key already used for a different order",
          409,
        );
      }

      const settings = await getStoreSettings();

      return orderResponse(existing, settings);
    }

    // ========================================
    // RATE LIMIT + CUSTOMER VALIDATION
    // ========================================

    if (!(await checkRateLimit(request))) {
      return fail("Too many requests. Try again later.", 429);
    }

    if (!getGovernorate(data.governorate)) {
      return fail("Invalid governorate");
    }

    const settings = await getStoreSettings();

    if (
      !isPaymentMethodAvailable(
        settings,
        data.paymentMethod,
      )
    ) {
      return fail(
        "طريقة الدفع المحددة غير متاحة حاليًا.",
      );
    }

    if (!settings.whatsapp.replace(/\D/g, "")) {
      return fail(
        "خدمة تأكيد الطلبات غير متاحة حاليًا. يرجى التواصل مع المتجر.",
        503,
      );
    }

    // ========================================
    // SHIPPING
    // ========================================

    const shipping = await prisma.shippingRate.findUnique({
      where: {
        code: data.governorate,
      },
    });

    if (!shipping?.isActive) {
      return fail(
        "Shipping is not available for this governorate",
      );
    }

    // ========================================
    // PRODUCTS - NO STOCK SYSTEM
    // ========================================

    const products = await prisma.product.findMany({
      where: {
        slug: {
          in: data.items.map((item) => item.slug),
        },
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        nameAr: true,
        price: true,
      },
    });

    if (products.length !== data.items.length) {
      return fail("Some products are unavailable");
    }

    const productMap = new Map(
      products.map((product) => [
        product.slug,
        product,
      ]),
    );

    const orderItems: {
      productId: string;
      productSlug: string;
      productName: string;
      quantity: number;
      unitPrice: Prisma.Decimal;
      total: Prisma.Decimal;
    }[] = [];

    for (const item of data.items) {
      const product = productMap.get(item.slug);

      if (!product) {
        return fail("Some products are unavailable");
      }

      orderItems.push({
        productId: product.id,
        productSlug: product.slug,
        productName: product.nameAr,
        quantity: item.quantity,
        unitPrice: product.price,
        total: product.price.mul(item.quantity),
      });
    }

    // ========================================
    // CALCULATE TOTAL
    // ========================================

    const subtotal = orderItems.reduce(
      (sum, item) => sum.add(item.total),
      new Prisma.Decimal(0),
    );

    const total = subtotal.add(shipping.price);

    // ========================================
    // SAVE ORDER
    // ========================================

    const order = await prisma.order.create({
      data: {
        checkoutKey: data.checkoutKey,
        checkoutPayloadHash: payloadHash,

        orderNumber: `WS-${randomUUID()
          .replace(/-/g, "")
          .slice(0, 12)
          .toUpperCase()}`,

        customerName: data.customerName,
        phone: data.phone,
        alternatePhone: data.alternatePhone || null,
        governorate: data.governorate,
        city: data.city,
        address: data.address,
        notes: data.notes || null,

        paymentMethod: data.paymentMethod,

        subtotal,
        shippingFee: shipping.price,
        total,

        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return orderResponse(order, settings);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail(
        "Order already submitted. Please retry to retrieve the result.",
        409,
      );
    }

    console.error("Order creation failed:", {
      code:
        error instanceof Prisma.PrismaClientKnownRequestError
          ? error.code
          : "UNKNOWN",
      message:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return fail("Unable to create order", 500);
  }
}
