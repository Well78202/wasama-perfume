
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  const session = await auth();
  const adminId = session?.user?.id;

  if (!adminId) {
    return NextResponse.json(
      { error: "غير مصرح" },
      { status: 401 }
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true },
  });

  if (!admin) {
    return NextResponse.json(
      { error: "غير مصرح" },
      { status: 401 }
    );
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "إعدادات تخزين الصور غير مكتملة" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "اختار صورة صحيحة" },
        { status: 400 }
      );
    }

    if (
      !allowedTypes.has(file.type) ||
      file.size > MAX_SIZE ||
      file.size === 0
    ) {
      return NextResponse.json(
        { error: "مسموح JPG وPNG وWEBP حتى 5 ميجابايت" },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    // Validate file signature, not just the browser MIME type.
    const isJpeg =
      file.type === "image/jpeg" &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff;

    const isPng =
      file.type === "image/png" &&
      bytes.subarray(0, 8).equals(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
      );

    const isWebp =
      file.type === "image/webp" &&
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP";

    if (!isJpeg && !isPng && !isWebp) {
      return NextResponse.json(
        { error: "ملف الصورة غير صالح" },
        { status: 400 }
      );
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const uploaded = await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "wasama-perfume/products",
          resource_type: "image",
          overwrite: false,
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Upload failed"));
            return;
          }

          resolve(result);
        }
      );

      stream.end(bytes);
    });

    return NextResponse.json({
      url: uploaded.secure_url,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { error: "فشل رفع الصورة" },
      { status: 500 }
    );
  }
}
