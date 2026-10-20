"use client";

import { useActionState, useState } from "react";
import { adminLogin } from "../actions";
import { LockKeyhole, Mail, LogIn, Eye, EyeOff } from "lucide-react";
const initialState = { error: "" };

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#100e0c] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c79b62]/30 bg-[#c79b62]/10">
            <LockKeyhole size={28} className="text-[#d5a86e]" />
          </div>

          <p className="text-xs font-bold tracking-[0.2em] text-[#d5a86e]">WASAMA PERFUME</p>

          <h1 className="mt-4 text-3xl font-extrabold text-white">لوحة الإدارة</h1>

          <p className="mt-3 text-sm text-white/50">سجل الدخول لإدارة متجر وسامة برفيوم</p>
        </div>

        <form
          action={formAction}
          className="space-y-6 rounded-3xl border border-white/10 bg-[#1b1815] p-7 shadow-2xl sm:p-9"
        >
          <div>
            <label htmlFor="email" className="mb-3 block text-sm font-bold text-white/80">
              البريد الإلكتروني
            </label>

            <div className="relative">
              <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d5a86e]" />

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                dir="ltr"
                placeholder="admin@example.com"
                className="h-13 w-full rounded-xl border border-white/10 bg-[#100e0c] pr-12 pl-4 text-left text-sm text-white outline-none transition focus:border-[#d5a86e]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-3 block text-sm font-bold text-white/80">
              كلمة المرور
            </label>

            <div className="relative">
              <LockKeyhole size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d5a86e]" />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="أدخل كلمة المرور"
                className="h-13 w-full rounded-xl border border-white/10 bg-[#100e0c] pr-12 pl-12 text-sm text-white outline-none transition focus:border-[#d5a86e]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/50 transition hover:text-[#d5a86e]"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {state.error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-300"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="flex h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#d5a86e] font-extrabold text-[#171411] transition hover:bg-[#e5bb85] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={19} />
            {pending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/30">© وسامة برفيوم — لوحة الإدارة</p>
      </div>
    </main>
  );
}
