
import type { Metadata } from "next";

import SiteLayout from "@/app/components/layout/SiteLayout";
import TermsPage from "@/app/components/pages/TermsPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read Wasama Perfume's terms for placing orders, advance payments, payment verification, shipping, and returns.",
  alternates: {
    canonical: "/en/terms",
    languages: {
      "ar-EG": "/terms",
      en: "/en/terms",
      "x-default": "/terms",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="en">
      <TermsPage locale="en" />
    </SiteLayout>
  );
}
