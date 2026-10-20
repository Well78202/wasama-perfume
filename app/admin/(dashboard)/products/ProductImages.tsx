
"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  X,
  Star,
  LoaderCircle,
  ImagePlus,
} from "lucide-react";

type Props = {
  initialImages?: string[];
};

export default function ProductImages({
  initialImages = [],
}: Props) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length || uploading) return;

    setError("");

    const selected = Array.from(files);

    if (images.length + selected.length > 10) {
      setError("الحد الأقصى 10 صور للمنتج.");
      return;
    }

    setUploading(true);

    const uploadedUrls: string[] = [];

    try {
      for (const file of selected) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(
            file.type
          ) ||
          file.size > 5 * 1024 * 1024
        ) {
          throw new Error(
            "الصور لازم تكون JPG أو PNG أو WEBP وأقل من 5 ميجابايت."
          );
        }

        const data = new FormData();
        data.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: data,
        });

        const result = await response.json();

        if (!response.ok || !result.url) {
          throw new Error(result.error ?? "فشل رفع الصورة");
        }

        uploadedUrls.push(result.url);
        setImages((current) => [...current, result.url]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "فشل رفع الصور"
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((current) =>
      current.filter((item) => item !== url)
    );
  }

  function makeMain(url: string) {
    setImages((current) => [
      url,
      ...current.filter((item) => item !== url),
    ]);
  }

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-4 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold">
          صور المنتج
        </h2>

        <span className="text-xs text-neutral-500">
          {images.length} / 10
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={uploading || images.length >= 10}
        onChange={(event) => uploadFiles(event.target.files)}
        className="hidden"
        id="product-image-upload"
      />

      <button
        type="button"
        disabled={uploading || images.length >= 10}
        onClick={() => inputRef.current?.click()}
        className="flex min-h-36 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#d8c3a5] bg-[#fffaf3] p-5 text-center transition hover:bg-[#f8efdf] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? (
          <LoaderCircle
            size={30}
            className="animate-spin text-[#a66d36]"
          />
        ) : (
          <UploadCloud
            size={32}
            className="text-[#a66d36]"
          />
        )}

        <span className="font-extrabold">
          {uploading ? "جاري رفع الصور..." : "اختار صور المنتج"}
        </span>

        <span className="text-xs text-neutral-500">
          JPG / PNG / WEBP — حد أقصى 5 MB للصورة
        </span>
      </button>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative overflow-hidden rounded-xl border border-neutral-200 bg-[#faf9f7]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`صورة المنتج ${index + 1}`}
                className="aspect-square w-full object-contain"
              />

              <div className="flex items-center justify-between gap-1 border-t border-neutral-200 p-2">
                {index === 0 ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#a66d36]">
                    <Star size={13} fill="currentColor" />
                    الرئيسية
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeMain(url)}
                    disabled={uploading}
                    className="cursor-pointer text-xs font-bold text-neutral-600 hover:text-[#a66d36]"
                  >
                    تعيين رئيسية
                  </button>
                )}

                <button
                  type="button"
                  aria-label="حذف الصورة من المنتج"
                  disabled={uploading}
                  onClick={() => removeImage(url)}
                  className="cursor-pointer rounded-lg p-1 text-red-600 hover:bg-red-50"
                >
                  <X size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        type="hidden"
        name="imageUrls"
        value={images.join("\n")}
        readOnly
      />

      <p className="mt-4 flex items-center gap-2 text-xs leading-6 text-neutral-500">
        <ImagePlus size={16} />
        أول صورة هي الرئيسية. الحذف هنا يزيل الصورة من
        المنتج عند حفظ التعديلات.
      </p>
    </section>
  );
}
