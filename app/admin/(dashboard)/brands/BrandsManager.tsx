
"use client";

import {
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  LoaderCircle,
  ImagePlus,
  Award,
} from "lucide-react";

import {
  createBrand,
  updateBrand,
  deleteBrand,
  type BrandFormState,
} from "./actions";

type Brand = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  logo: string | null;
  isActive: boolean;
  productCount: number;
};

type Props = {
  brands: Brand[];
};

const initialState: BrandFormState = { error: "" };

const inputClass =
  "mt-2 w-full rounded-xl border border-neutral-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none focus:border-[#a66d36]";

function BrandForm({
  brand,
  onDone,
}: {
  brand?: Brand;
  onDone: () => void;
}) {
  const router = useRouter();

  const action = brand
    ? updateBrand.bind(null, brand.id)
    : createBrand;

  const [state, formAction, pending] = useActionState(
    action,
    initialState
  );

  const [logo, setLogo] = useState(brand?.logo ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onDone();
    }
  }, [state.success, router, onDone]);

  async function uploadLogo(file: File) {
    setUploadError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("اختار صورة JPG أو PNG أو WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("حجم الصورة لازم يكون أقل من 5 ميجابايت.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "فشل رفع الصورة.");
      }

      setLogo(data.url);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "تعذر رفع الصورة."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-bold">
          اسم البراند بالعربي *
        </label>
        <input
          name="nameAr"
          required
          minLength={2}
          defaultValue={brand?.nameAr ?? ""}
          className={inputClass}
          placeholder="شانيل"
        />
      </div>

      <div>
        <label className="text-sm font-bold">
          اسم البراند بالإنجليزي *
        </label>
        <input
          name="nameEn"
          required
          minLength={2}
          dir="ltr"
          defaultValue={brand?.nameEn ?? ""}
          className={inputClass}
          placeholder="Chanel"
        />
      </div>

      <div>
        <label className="text-sm font-bold">
          رابط البراند (Slug) *
        </label>
        <input
          name="slug"
          required
          dir="ltr"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={brand?.slug ?? ""}
          className={inputClass}
          placeholder="chanel"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-bold">
          لوجو البراند
        </p>

        <input
          type="hidden"
          name="logo"
          value={logo}
          readOnly
        />

        <div className="rounded-xl border border-dashed border-neutral-300 bg-[#faf9f7] p-4">
          {logo ? (
            <div className="space-y-3">
              <div className="flex h-36 items-center justify-center rounded-xl bg-white p-4">
                <img
                  src={logo}
                  alt="معاينة لوجو البراند"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <button
                type="button"
                disabled={uploading}
                onClick={() => setLogo("")}
                className="flex cursor-pointer items-center gap-2 text-sm font-bold text-red-600 disabled:opacity-50"
              >
                <Trash2 size={15} />
                إزالة اللوجو
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4 text-neutral-500">
              <ImagePlus size={30} />
              <p className="text-sm">اختار صورة اللوجو</p>
            </div>
          )}

          <label className="mt-4 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#171411] px-4 text-sm font-bold text-white">
            <ImagePlus size={17} />
            {uploading ? "جاري الرفع..." : "اختيار صورة"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadLogo(file);
                event.target.value = "";
              }}
            />
          </label>
        </div>

        {uploadError && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {uploadError}
          </p>
        )}
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm font-bold">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={brand?.isActive ?? true}
          className="h-5 w-5 accent-[#a66d36]"
        />
        البراند نشط ويظهر في المتجر
      </label>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || uploading}
        className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#171411] px-5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending || uploading ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : (
          <Save size={18} />
        )}
        {pending
          ? "جاري الحفظ..."
          : uploading
            ? "انتظر رفع الصورة..."
            : brand
              ? "حفظ التعديلات"
              : "إضافة البراند"}
      </button>
    </form>
  );
}

export default function BrandsManager({ brands }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Brand | "new" | null>(null);
  const [deleting, setDeleting] = useState<Brand | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = brands.filter((brand) =>
    [brand.nameAr, brand.nameEn, brand.slug]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  function handleDelete() {
    if (!deleting) return;

    setError("");

    startTransition(async () => {
      try {
        const result = await deleteBrand(deleting.id);

        if (result.error) {
          setError(result.error);
          return;
        }

        setDeleting(null);
        router.refresh();
      } catch {
        setError("حصل خطأ أثناء الحذف.");
      }
    });
  }

  return (
    <main dir="rtl" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
            <Award className="text-[#a66d36]" />
            إدارة البراندات
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            إضافة وتعديل وتنظيم ماركات العطور
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing("new")}
          className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#171411] px-5 font-bold text-white"
        >
          <Plus size={18} />
          إضافة براند
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "إجمالي البراندات", value: brands.length },
          { label: "براندات نشطة", value: brands.filter((b) => b.isActive).length },
          { label: "براندات مخفية", value: brands.filter((b) => !b.isActive).length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-black/5 bg-white p-5"
          >
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search
          size={19}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن براند..."
          className="h-12 w-full rounded-xl border border-neutral-200 bg-white pr-12 pl-4 outline-none focus:border-[#a66d36]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((brand) => (
          <article
            key={brand.id}
            className="rounded-2xl border border-black/5 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-16 w-20 items-center justify-center overflow-hidden rounded-xl bg-[#faf9f7] p-2">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.nameAr}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Award size={28} className="text-[#a66d36]" />
                )}
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  brand.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {brand.isActive ? "نشط" : "مخفي"}
              </span>
            </div>

            <h2 className="mt-4 text-lg font-extrabold">
              {brand.nameAr}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {brand.nameEn}
            </p>

            <p dir="ltr" className="mt-2 text-right text-xs text-neutral-400">
              /{brand.slug}
            </p>

            <div className="mt-4 rounded-xl bg-[#faf9f7] p-3 text-sm">
              عدد المنتجات: <strong>{brand.productCount}</strong>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEditing(brand)}
                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 text-sm font-bold hover:bg-neutral-50"
              >
                <Pencil size={16} />
                تعديل
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setDeleting(brand);
                }}
                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-bold text-red-700 hover:bg-red-100"
              >
                <Trash2 size={16} />
                حذف
              </button>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl bg-white p-12 text-center text-neutral-500">
          مفيش براندات مطابقة للبحث.
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="نموذج البراند"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">
                {editing === "new" ? "إضافة براند جديد" : "تعديل البراند"}
              </h2>

              <button
                type="button"
                onClick={() => setEditing(null)}
                className="cursor-pointer rounded-lg p-2 hover:bg-neutral-100"
                aria-label="إغلاق"
              >
                <X size={21} />
              </button>
            </div>

            <BrandForm
              key={editing === "new" ? "new" : editing.id}
              brand={editing === "new" ? undefined : editing}
              onDone={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-brand-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 id="delete-brand-title" className="text-xl font-extrabold">
              حذف البراند نهائيًا؟
            </h2>

            <p className="mt-3 text-sm leading-7 text-neutral-600">
              هل تريد حذف براند <strong>{deleting.nameAr}</strong>؟
              لا يمكن التراجع عن الحذف.
            </p>

            {deleting.productCount > 0 && (
              <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                البراند مرتبط بـ {deleting.productCount} منتج،
                ولا يمكن حذفه قبل إزالة ارتباط المنتجات.
              </p>
            )}

            {error && (
              <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={() => setDeleting(null)}
                className="min-h-12 cursor-pointer rounded-xl border border-neutral-200 font-bold disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                type="button"
                disabled={pending || deleting.productCount > 0}
                onClick={handleDelete}
                className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
