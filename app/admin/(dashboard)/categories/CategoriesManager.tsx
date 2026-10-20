
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
  Tags,
  Search,
  X,
  Save,
  LoaderCircle,
} from "lucide-react";

import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryFormState,
} from "./actions";

type Category = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  isActive: boolean;
  productCount: number;
};

type Props = {
  categories: Category[];
};

const initialState: CategoryFormState = {
  error: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-neutral-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none focus:border-[#a66d36]";

function CategoryForm({
  category,
  onDone,
}: {
  category?: Category;
  onDone: () => void;
}) {
  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;

  const [state, formAction, pending] = useActionState(
    action,
    initialState
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onDone();
    }
  }, [state.success, router, onDone]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-bold">
          اسم التصنيف بالعربي *
        </label>
        <input
          name="nameAr"
          required
          minLength={2}
          defaultValue={category?.nameAr ?? ""}
          className={inputClass}
          placeholder="عطور رجالي"
        />
      </div>

      <div>
        <label className="text-sm font-bold">
          اسم التصنيف بالإنجليزي *
        </label>
        <input
          name="nameEn"
          required
          minLength={2}
          dir="ltr"
          defaultValue={category?.nameEn ?? ""}
          className={inputClass}
          placeholder="Men Perfumes"
        />
      </div>

      <div>
        <label className="text-sm font-bold">
          رابط التصنيف (Slug) *
        </label>
        <input
          name="slug"
          required
          dir="ltr"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={category?.slug ?? ""}
          className={inputClass}
          placeholder="men"
        />
      </div>

      <div>
        <label className="text-sm font-bold">
          الوصف بالعربي
        </label>
        <textarea
          name="descriptionAr"
          rows={3}
          defaultValue={category?.descriptionAr ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm font-bold">
          الوصف بالإنجليزي
        </label>
        <textarea
          name="descriptionEn"
          rows={3}
          dir="ltr"
          defaultValue={category?.descriptionEn ?? ""}
          className={inputClass}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm font-bold">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={category?.isActive ?? true}
          className="h-5 w-5 accent-[#a66d36]"
        />
        التصنيف نشط ويظهر في المتجر
      </label>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#171411] px-5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <LoaderCircle
            size={18}
            className="animate-spin"
          />
        ) : (
          <Save size={18} />
        )}
        {pending
          ? "جاري الحفظ..."
          : category
            ? "حفظ التعديلات"
            : "إضافة التصنيف"}
      </button>
    </form>
  );
}

export default function CategoriesManager({
  categories,
}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<
    Category | null | "new"
  >(null);

  const [deleting, setDeleting] =
    useState<Category | null>(null);

  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = categories.filter((category) =>
    [
      category.nameAr,
      category.nameEn,
      category.slug,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  function handleDelete() {
    if (!deleting) return;

    setError("");

    startTransition(async () => {
      try {
        const result = await deleteCategory(deleting.id);

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
            <Tags className="text-[#a66d36]" />
            إدارة التصنيفات
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            إضافة وتعديل وتنظيم تصنيفات العطور
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing("new")}
          className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#171411] px-5 font-bold text-white"
        >
          <Plus size={18} />
          إضافة تصنيف
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-5">
          <p className="text-sm text-neutral-500">
            إجمالي التصنيفات
          </p>
          <p className="mt-2 text-3xl font-extrabold">
            {categories.length}
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5">
          <p className="text-sm text-neutral-500">
            تصنيفات نشطة
          </p>
          <p className="mt-2 text-3xl font-extrabold">
            {categories.filter((c) => c.isActive).length}
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5">
          <p className="text-sm text-neutral-500">
            تصنيفات مخفية
          </p>
          <p className="mt-2 text-3xl font-extrabold">
            {categories.filter((c) => !c.isActive).length}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search
          size={19}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن تصنيف..."
          className="h-12 w-full rounded-xl border border-neutral-200 bg-white pr-12 pl-4 outline-none focus:border-[#a66d36]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-black/5 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8d8] text-[#a66d36]">
                <Tags size={23} />
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  category.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {category.isActive ? "نشط" : "مخفي"}
              </span>
            </div>

            <h2 className="mt-4 text-lg font-extrabold">
              {category.nameAr}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {category.nameEn}
            </p>

            <p
              dir="ltr"
              className="mt-2 text-right text-xs text-neutral-400"
            >
              /{category.slug}
            </p>

            <div className="mt-4 rounded-xl bg-[#faf9f7] p-3 text-sm">
              عدد المنتجات:{" "}
              <strong>{category.productCount}</strong>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEditing(category)}
                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 text-sm font-bold hover:bg-neutral-50"
              >
                <Pencil size={16} />
                تعديل
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setDeleting(category);
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
          مفيش تصنيفات مطابقة للبحث.
        </div>
      )}

      {editing !== null && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="نموذج التصنيف"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">
                {editing === "new"
                  ? "إضافة تصنيف جديد"
                  : "تعديل التصنيف"}
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

            <CategoryForm
              key={editing === "new" ? "new" : editing.id}
              category={
                editing === "new" ? undefined : editing
              }
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
            aria-labelledby="delete-category-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2
              id="delete-category-title"
              className="text-xl font-extrabold"
            >
              حذف التصنيف نهائيًا؟
            </h2>

            <p className="mt-3 text-sm leading-7 text-neutral-600">
              هل تريد حذف تصنيف{" "}
              <strong>{deleting.nameAr}</strong>؟
              لا يمكن التراجع عن الحذف.
            </p>

            {deleting.productCount > 0 && (
              <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                التصنيف مرتبط بـ
                {" "}{deleting.productCount}{" "}
                منتج، ولا يمكن حذفه قبل نقل المنتجات.
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
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
                disabled={
                  pending || deleting.productCount > 0
                }
                onClick={handleDelete}
                className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
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
