
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      !("slugs" in body) ||
      !Array.isArray(body.slugs)
    ) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const slugs = body.slugs.filter(
      (slug): slug is string =>
        typeof slug === "string" && slug.length <= 150
    );

    if (slugs.length > 99) {
      return NextResponse.json(
        { error: "Too many products" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        slug: { in: slugs },
        isActive: true,
      },
      select: {
        slug: true,
        nameAr: true,
        nameEn: true,
        price: true,
        stock: true,
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    });

    return NextResponse.json(
      {
        products: products.map((product) => ({
          slug: product.slug,
          nameAr: product.nameAr,
          nameEn: product.nameEn,
          price: Number(product.price),
          stock: product.stock,
          image:
            product.images[0]?.url ??
            "/images/products/placeholder.jpg",
        })),
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load cart" },
      { status: 500 }
    );
  }
}
