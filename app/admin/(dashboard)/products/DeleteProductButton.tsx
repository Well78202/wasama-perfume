"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, LoaderCircle } from "lucide-react";
import { deleteProduct } from "./actions";

type Props = {
  productId: string;
  productName: string;
};

export default function DeleteProductButton({ productId, productName }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  function handleDelete() {
    setError("");

    startTransition(async () => {
      try {
        const result = await deleteProduct(productId);

        if (!result.success) {
          setError(result.error ?? "تعذر حذف المنتج.");
          return;
        }

        setOpen(false);
        router.refresh();
      } catch {
        setError("حدث خطأ. حاول مرة أخرى.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-700 transition hover:bg-red-100 cursor-pointer"
      >
        <Trash2 size={16} />
        حذف
      </button>

      {open && (
        <div role="presentation" className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            dir="rtl"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={23} />
            </div>

            <h2 id="delete-product-title" className="text-xl font-extrabold">
              حذف المنتج؟
            </h2>

            <p className="mt-3 text-sm leading-7 text-neutral-600">
              هل أنت متأكد إنك عايز تحذف المنتج نهائيًا؟ <strong>{productName}</strong> من المتجر؟
            </p>

            <p className="mt-2 text-xs text-neutral-500">
              سيتم حذف المنتج وصوره من قاعدة البيانات نهائيًا، ولا يمكن استرجاعه من لوحة التحكم. إذا كان مرتبطًا بطلبات
              سابقة، سيتم منع الحذف.{" "}
            </p>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={() => setOpen(false)}
                className="min-h-12 rounded-xl border border-neutral-200 font-bold disabled:opacity-50 cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                disabled={pending}
                onClick={handleDelete}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 font-bold text-white transition hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {pending ? <LoaderCircle size={18} className="animate-spin" /> : <Trash2 size={18} />}
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
