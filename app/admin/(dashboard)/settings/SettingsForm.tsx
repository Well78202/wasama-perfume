"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CreditCard, Save, Settings2, Store, MessageCircle } from "lucide-react";
import { saveStoreSettings, type SettingsActionState } from "./actions";

type Settings = {
  storeNameAr: string;
  storeNameEn: string;
  whatsapp: string;
  vodafoneCashNumber: string;
  instapayAddress: string;
  vodafoneCashEnabled: boolean;
  instapayEnabled: boolean;
  paymentInstructions: string;
};

const inputClass = "mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#a66d36] focus:ring-2 focus:ring-[#a66d36]/10";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#171411] px-7 text-sm font-bold text-white hover:bg-[#352b23] disabled:cursor-wait disabled:opacity-50">
      <Save size={18} /> {pending ? "جاري الحفظ..." : "حفظ الإعدادات"}
    </button>
  );
}

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [state, action] = useActionState<SettingsActionState, FormData>(
    saveStoreSettings,
    { success: false }
  );
  return (
    <main dir="rtl" className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-[#f7efe4] p-3 text-[#a66d36]"><Settings2 size={24} /></span>
        <div>
          <h1 className="text-2xl font-extrabold">إعدادات المتجر</h1>
          <p className="mt-1 text-sm text-neutral-500">بيانات المتجر والتواصل وطرق الدفع الإلكتروني</p>
        </div>
      </div>

      <form action={action} className="space-y-6">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><Store size={19} className="text-[#a66d36]" /> بيانات المتجر</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-bold">اسم المتجر بالعربي
              <input className={inputClass} name="storeNameAr" required minLength={2} maxLength={100} defaultValue={initial.storeNameAr} />
            </label>
            <label className="text-sm font-bold">اسم المتجر بالإنجليزي
              <input dir="ltr" className={inputClass} name="storeNameEn" required minLength={2} maxLength={100} defaultValue={initial.storeNameEn} />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><MessageCircle size={19} className="text-[#a66d36]" /> خدمة العملاء</h2>
          <label className="mt-5 block text-sm font-bold">رقم واتساب (مع كود الدولة، مثال: +201xxxxxxxxx)
            <input dir="ltr" className={inputClass} name="whatsapp" type="tel" maxLength={30} defaultValue={initial.whatsapp} placeholder="+20..." />
          </label>
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><CreditCard size={19} className="text-[#a66d36]" /> وسائل الدفع</h2>
          <p className="mt-2 text-sm text-neutral-500">الدفع مقدمًا بكامل قيمة الطلب والشحن. يتم تأكيد التحويل يدويًا قبل تجهيز الطلب.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 p-4">
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="vodafoneCashEnabled" defaultChecked={initial.vodafoneCashEnabled} className="accent-[#a66d36]" /> تفعيل Vodafone Cash</label>
              <label className="mt-4 block text-sm font-bold">رقم استقبال التحويل
                <input dir="ltr" className={inputClass} name="vodafoneCashNumber" type="tel" maxLength={30} defaultValue={initial.vodafoneCashNumber} placeholder="01..." />
              </label>
            </div>
            <div className="rounded-xl border border-neutral-200 p-4">
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="instapayEnabled" defaultChecked={initial.instapayEnabled} className="accent-[#a66d36]" /> تفعيل InstaPay</label>
              <label className="mt-4 block text-sm font-bold">عنوان InstaPay أو بيانات التحويل
                <input dir="ltr" className={inputClass} name="instapayAddress" maxLength={150} defaultValue={initial.instapayAddress} placeholder="username@instapay" />
              </label>
            </div>
          </div>
          <label className="mt-5 block text-sm font-bold">تعليمات الدفع للعميل
            <textarea className={`${inputClass} min-h-28 resize-y`} name="paymentInstructions" maxLength={2000} defaultValue={initial.paymentInstructions} placeholder="حوّل قيمة الطلب بالكامل شامل الشحن، ثم أرسل صورة التحويل عبر واتساب..." />
          </label>
        </section>

        {state.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{state.error}</p>}
        {state.success && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">تم حفظ الإعدادات بنجاح.</p>}
        <div className="flex justify-end"><SaveButton /></div>
      </form>
    </main>
  );
}
