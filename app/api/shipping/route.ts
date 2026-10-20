
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rates = await prisma.shippingRate.findMany({
      where: { isActive: true },
      select: {
        code: true,
        nameAr: true,
        nameEn: true,
        price: true,
      },
      orderBy: { nameEn: "asc" },
    });

    return NextResponse.json(
      {
        rates: rates.map((rate) => ({
          code: rate.code,
          nameAr: rate.nameAr,
          nameEn: rate.nameEn,
          price: Number(rate.price),
        })),
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load shipping rates" },
      { status: 500 }
    );
  }
}
