
import type { Metadata } from "next";

import SiteLayout from "@/app/components/layout/SiteLayout";
import PrivacyPage from "@/app/components/pages/PrivacyPage";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description:
    "تعرف على كيفية التعامل مع بيانات العملاء والطلبات والمدفوعات في متجر وسامة برفيوم.",
  alternates: {
    canonical: "/privacy-policy",
    languages: {
      "ar-EG": "/privacy-policy",
      en: "/en/privacy-policy",
      "x-default": "/privacy-policy",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="ar">
      <PrivacyPage locale="ar" />
    </SiteLayout>
  );
}
