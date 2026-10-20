
import type { Metadata } from "next";

import SiteLayout from "@/app/components/layout/SiteLayout";
import PrivacyPage from "@/app/components/pages/PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Wasama Perfume handles customer information, orders, payment confirmation, and privacy inquiries.",
  alternates: {
    canonical: "/en/privacy-policy",
    languages: {
      "ar-EG": "/privacy-policy",
      en: "/en/privacy-policy",
      "x-default": "/privacy-policy",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="en">
      <PrivacyPage locale="en" />
    </SiteLayout>
  );
}
