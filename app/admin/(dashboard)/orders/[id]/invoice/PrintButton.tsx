
"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl bg-[#171411] px-6 font-bold text-white transition hover:bg-[#352b23]"
    >
      <Printer size={18} />
      طباعة الفاتورة
    </button>
  );
}
