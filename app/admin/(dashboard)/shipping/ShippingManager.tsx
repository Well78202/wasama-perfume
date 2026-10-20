"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Search, Pencil, X, Truck, LoaderCircle } from "lucide-react";
import { saveShippingRate, toggleShippingRate, type ShippingActionState } from "./actions";

type Rate = { id: string; code: string; nameAr: string; nameEn: string; price: number; isActive: boolean };
const initialState: ShippingActionState = { success: false };
const money = (n: number) => new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP" }).format(n);

function RateForm({ rate, close }: { rate: Rate | null; close: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveShippingRate, initialState);
  const [active, setActive] = useState(rate?.isActive ?? true);
  useEffect(() => {
    if (state.success) {
      close();
      router.refresh();
    }
  }, [state.success, close, router]);

  const input = "mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 outline-none focus:border-[#a66d36]";
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-3" role="presentation">
      <div role="dialog" aria-modal="true" aria-label={rate ? "تعديل محافظة" : "إضافة محافظة"} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">{rate ? "تعديل محافظة الشحن" : "إضافة محافظة للشحن"}</h2>
          <button type="button" onClick={close} disabled={pending} aria-label="إغلاق" className="rounded-lg p-2 hover:bg-neutral-100"><X size={20}/></button>
        </div>
        <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={rate?.id ?? ""} />
          <input type="hidden" name="isActive" value={String(active)} />
          <label className="block text-sm font-bold">اسم المحافظة بالعربي *<input required minLength={2} maxLength={100} name="nameAr" defaultValue={rate?.nameAr ?? ""} placeholder="القاهرة" className={input}/></label>
          <label className="block text-sm font-bold">اسم المحافظة بالإنجليزي *<input required minLength={2} maxLength={100} name="nameEn" defaultValue={rate?.nameEn ?? ""} placeholder="Cairo" dir="ltr" className={input}/></label>
          <label className="block text-sm font-bold">كود المحافظة *<input required name="code" defaultValue={rate?.code ?? ""} placeholder="cairo" dir="ltr" pattern="[a-z0-9]+(-[a-z0-9]+)*" className={input}/><span className="mt-1 block text-xs font-normal text-neutral-500">الكود بيتحفظ في الطلبات؛ يفضل ما تغيّروش بعد استخدامه.</span></label>
          <label className="block text-sm font-bold">سعر الشحن بالجنيه *<input required type="number" min="0" max="999999" step="0.01" name="price" defaultValue={rate?.price ?? 0} dir="ltr" className={input}/></label>
          <label className="flex items-center gap-3 rounded-xl bg-[#faf9f7] p-4 text-sm font-bold"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-5 w-5 accent-[#a66d36]"/>الشحن متاح لهذه المحافظة</label>
          {state.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{state.error}</p>}
          <button disabled={pending} type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#a66d36] px-5 font-bold text-white disabled:opacity-50">{pending && <LoaderCircle size={17} className="animate-spin"/>}{rate ? "حفظ التعديلات" : "إضافة المحافظة"}</button>
        </form>
      </div>
    </div>
  );
}

export default function ShippingManager({ rates }: { rates: Rate[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<Rate | null | undefined>(undefined);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();
  const close = () => setEditing(undefined);
  const filtered = useMemo(() => rates.filter((r) => {
    const matches = [r.nameAr, r.nameEn, r.code].join(" ").toLowerCase().includes(query.trim().toLowerCase());
    return matches && (filter === "all" || (filter === "active" ? r.isActive : !r.isActive));
  }), [rates, query, filter]);
  const activeCount = rates.filter((r) => r.isActive).length;
  const changeStatus = (rate: Rate) => {
    setError("");
    setBusyId(rate.id);
    startTransition(async () => {
      try {
        const result = await toggleShippingRate(rate.id, !rate.isActive);
        if (!result.success) setError(result.error ?? "تعذر تحديث المحافظة");
        else router.refresh();
      } catch { setError("تعذر الاتصال بالخادم"); }
      finally { setBusyId(null); }
    });
  };
  return (
    <main dir="rtl" className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="flex items-center gap-2 text-2xl font-extrabold sm:text-3xl"><Truck className="text-[#a66d36]"/>محافظات وأسعار الشحن</h1><p className="mt-2 text-sm text-neutral-500">تحكم في المحافظات المتاحة وتكلفة الشحن لكل محافظة.</p></div>
        <button type="button" onClick={() => setEditing(null)} className="flex min-h-11 items-center gap-2 rounded-xl bg-[#a66d36] px-5 font-bold text-white"><Plus size={18}/>إضافة محافظة</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[{ title: "إجمالي المحافظات", value: rates.length }, { title: "محافظات متاحة", value: activeCount }, { title: "محافظات موقوفة", value: rates.length - activeCount }].map((s) => <div key={s.title} className="rounded-2xl border border-black/5 bg-white p-5"><p className="text-xs text-neutral-500">{s.title}</p><p className="mt-2 text-2xl font-extrabold">{s.value}</p></div>)}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث باسم المحافظة أو الكود..." className="h-12 w-full rounded-xl border border-neutral-200 bg-white pr-11 pl-4 outline-none focus:border-[#a66d36]"/></div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-12 rounded-xl border border-neutral-200 bg-white px-4"><option value="all">كل المحافظات</option><option value="active">المتاحة</option><option value="inactive">الموقوفة</option></select>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((rate) => <article key={rate.id} className="rounded-2xl border border-black/5 bg-white p-5">
          <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><div className="rounded-xl bg-[#f3e8d8] p-3 text-[#a66d36]"><MapPin size={20}/></div><div><h2 className="text-lg font-extrabold">{rate.nameAr}</h2><p className="text-sm text-neutral-500">{rate.nameEn} · {rate.code}</p></div></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${rate.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{rate.isActive ? "متاحة" : "موقوفة"}</span></div>
          <div className="my-5 rounded-xl bg-[#faf9f7] p-4"><p className="text-xs text-neutral-500">سعر الشحن</p><p className="mt-1 text-2xl font-extrabold text-[#a66d36]">{money(rate.price)}</p></div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setEditing(rate)} className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-bold"><Pencil size={16}/>تعديل</button><button type="button" disabled={busyId === rate.id} onClick={() => changeStatus(rate)} className="min-h-10 flex-1 rounded-xl bg-[#171411] px-4 text-sm font-bold text-white disabled:opacity-50">{busyId === rate.id ? "جاري الحفظ..." : rate.isActive ? "إيقاف الشحن" : "تفعيل الشحن"}</button></div>
        </article>)}
      </div>
      {filtered.length === 0 && <div className="rounded-2xl bg-white p-10 text-center text-neutral-500">لا توجد محافظات مطابقة.</div>}
      {editing !== undefined && <RateForm key={editing?.id ?? "new"} rate={editing} close={close}/>}
    </main>
  );
}
