
import type { Metadata } from "next";
import SiteLayout from "@/app/components/layout/SiteLayout";
import ContactPage from "@/app/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Wasama Perfume for fragrance recommendations, order assistance, payment questions, and shipping inquiries.",
  alternates: {
    canonical: "/en/contact",
    languages: {
      "ar-EG": "/contact",
      en: "/en/contact",
      "x-default": "/contact",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="en">
      <ContactPage locale="en" />
    </SiteLayout>
  );
}
