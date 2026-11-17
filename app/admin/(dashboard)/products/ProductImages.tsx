
"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  X,
  Star,
  LoaderCircle,
  ImagePlus,
  Link2,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";

type Props = {
  initialImages?: string[];
};

const MAX_IMAGES = 10;
const MAX_SIZE = 5 * 1024 * 1024;

function isCloudinaryUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      url.pathname.startsWith(
        "/cin4fdsx/image/upload/"
      )
    );
  } catch {
    return false;
  }
}

export default function ProductImages({
  initialImages = [],
}: Props) {
  const [images, setImages] = useState<string[]>(
    () => [...new Set(initialImages)]
  );

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length || uploading) return;

    setError("");

    const selected = Array.from(files);

    if (images.length + selected.length > MAX_IMAGES) {
      setError("الحد الأقصى 10 صور للمنتج.");
      return;
    }

    for (const file of selected) {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(
          file.type
        ) ||
        file.size > MAX_SIZE
      ) {
        setError(
          "الصور لازم تكون JPG أو PNG أو WEBP وأقل من 5 ميجابايت."
        );
        return;
      }
    }

    setUploading(true);

    try {
      for (const file of selected) {
        const data = new FormData();
        data.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: data,
        });

        const result = await response.json();

        if (!response.ok || !result.url) {
          throw new Error(
            result.error ?? "فشل رفع الصورة"
          );
        }

        if (!isCloudinaryUrl(result.url)) {
          throw new Error(
            "رابط الصورة المرفوعة غير صالح."
          );
        }

        setImages((current) =>
          current.includes(result.url)
            ? current
            : [...current, result.url]
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء رفع الصور."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function addImageUrl() {
    const url = imageUrl.trim();

    setError("");

    if (!isCloudinaryUrl(url)) {
      setError("أدخل رابط صورة صحيح من Cloudinary.");
      return;
    }

    if (images.includes(url)) {
      setError("الصورة موجودة بالفعل.");
      return;
    }

    if (images.length >= MAX_IMAGES) {
      setError("وصلت للحد الأقصى للصور.");
      return;
    }

    setImages((current) => [...current, url]);
    setImageUrl("");
  }

  function removeImage(url: string) {
    if (uploading) return;

    setImages((current) =>
      current.filter((item) => item !== url)
    );
  }

  function makeMain(url: string) {
    if (uploading) return;

    setImages((current) => [
      url,
      ...current.filter((item) => item !== url),
    ]);
  }

  function moveImage(index: number, direction: -1 | 1) {
    if (uploading) return;

    setImages((current) => {
      const target = index + direction;

      if (target < 0 || target >= current.length) {
        return current;
      }

      const next = [...current];

      [next[index], next[target]] = [
        next[target],
        next[index],
      ];

      return next;
    });
  }

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-4 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">
            صور المنتج
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            ارفع الصور أو أضف روابط Cloudinary
          </p>
        </div>

        <span className="rounded-lg bg-[#f3e8d8] px-3 py-1 text-xs font-bold text-[#a66d36]">
          {images.length} / {MAX_IMAGES}
        </span>
      </div>

      {/* Upload images */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={uploading || images.length >= MAX_IMAGES}
        onChange={(event) =>
          void uploadFiles(event.target.files)
        }
        className="hidden"
      />

      <button
        type="button"
        disabled={uploading || images.length >= MAX_IMAGES}
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
          {uploading
            ? "جاري رفع الصور..."
            : "اختار صور المنتج"}
        </span>

        <span className="text-xs text-neutral-500">
          JPG / PNG / WEBP — بحد أقصى 5 MB للصورة
        </span>
      </button>

      {/* Cloudinary URL */}
      <div className="mt-5 rounded-xl border border-neutral-200 bg-[#faf9f7] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Link2 size={18} className="text-[#a66d36]" />

          <h3 className="text-sm font-bold">
            إضافة صورة من Cloudinary
          </h3>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            dir="ltr"
            value={imageUrl}
            onChange={(event) =>
              setImageUrl(event.target.value)
            }
            placeholder="https://res.cloudinary.com/..."
            className="h-12 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-[#a66d36]"
          />

          <button
            type="button"
            disabled={uploading || !imageUrl.trim()}
            onClick={addImageUrl}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#171411] px-5 text-sm font-bold text-white disabled:opacity-50"
          >
            <Plus size={17} />
            إضافة
          </button>
        </div>
      </div>

      {/* Errors */}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700"
        >
          {error}
        </p>
      )}

      {/* Images grid */}
      {images.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-[#faf9f7]"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`صورة المنتج ${index + 1}`}
                  className="aspect-4/5 w-full object-contain"
                />

                {index === 0 && (
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-[#171411] px-2 py-1 text-[10px] font-bold text-white">
                    <Star size={12} fill="currentColor" />
                    الرئيسية
                  </span>
                )}

                <button
                  type="button"
                  aria-label="حذف الصورة"
                  disabled={uploading}
                  onClick={() => removeImage(url)}
                  className="absolute left-2 top-2 rounded-lg bg-white p-1.5 text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-1 border-t border-neutral-200 p-2">
                <button
                  type="button"
                  disabled={uploading || index === 0}
                  onClick={() => moveImage(index, -1)}
                  aria-label="تحريك الصورة للأمام"
                  className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>

                {index !== 0 ? (
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => makeMain(url)}
                    className="text-[11px] font-bold text-[#a66d36]"
                  >
                    تعيين رئيسية
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-neutral-500">
                    صورة {index + 1}
                  </span>
                )}

                <button
                  type="button"
                  disabled={
                    uploading || index === images.length - 1
                  }
                  onClick={() => moveImage(index, 1)}
                  aria-label="تحريك الصورة للخلف"
                  className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ArrowDown size={16} />
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
        أول صورة هي الرئيسية. حذف الصورة من هنا
        لا يحذفها من Cloudinary.
      </p>
    </section>
  );
}
