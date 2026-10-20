
import type { Metadata } from "next";
import SiteLayout from "@/app/components/layout/SiteLayout";
import ReturnsPage from "@/app/components/pages/ReturnsPage";

export const metadata: Metadata = {
  title: "الاستبدال والاسترجاع",
  description:
    "تعرف على طريقة تقديم طلب استبدال أو استرجاع لدى وسامة برفيوم، وكيفية التواصل مع خدمة العملاء ومراجعة الطلب.",
  alternates: {
    canonical: "/returns",
    languages: {
      "ar-EG": "/returns",
      en: "/en/returns",
      "x-default": "/returns",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="ar">
      <ReturnsPage locale="ar" />
    </SiteLayout>
  );
}
