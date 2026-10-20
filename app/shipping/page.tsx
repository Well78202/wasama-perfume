
import type { Metadata } from "next";
import SiteLayout from "@/app/components/layout/SiteLayout";
import ShippingPage from "@/app/components/pages/ShippingPage";

export const metadata: Metadata = {
  title: "الشحن والتوصيل",
  description:
    "تعرف على خطوات الشحن والتوصيل في وسامة برفيوم، وطريقة الدفع وتأكيد الطلب ومتابعة الشحنة.",
  alternates: {
    canonical: "/shipping",
    languages: {
      "ar-EG": "/shipping",
      en: "/en/shipping",
      "x-default": "/shipping",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="ar">
      <ShippingPage locale="ar" />
    </SiteLayout>
  );
}
