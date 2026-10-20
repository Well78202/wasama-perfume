
"use client";

import { Printer } from "lucide-react";

type Props = {
  disabled: boolean;
};

export default function PrintShippingLabel({
  disabled,
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => window.print()}
      className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#171411] px-6 font-bold text-white transition hover:bg-[#352b23] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      <Printer size={18} />
      طباعة بوليصة الشحن
    </button>
  );
}
