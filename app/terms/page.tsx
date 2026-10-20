
import type { Metadata } from "next";

import SiteLayout from "@/app/components/layout/SiteLayout";
import TermsPage from "@/app/components/pages/TermsPage";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description:
    "تعرف على شروط وأحكام متجر وسامة برفيوم، وطرق الدفع وتأكيد الطلبات والشحن والاستبدال والاسترجاع.",
  alternates: {
    canonical: "/terms",
    languages: {
      "ar-EG": "/terms",
      en: "/en/terms",
      "x-default": "/terms",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="ar">
      <TermsPage locale="ar" />
    </SiteLayout>
  );
}
