
import type { Metadata } from "next";
import SiteLayout from "@/app/components/layout/SiteLayout";
import ContactPage from "@/app/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description:
    "تواصل مع وسامة برفيوم للاستفسار عن العطور والطلبات والدفع والشحن عبر واتساب أو الهاتف.",
  alternates: {
    canonical: "/contact",
    languages: {
      "ar-EG": "/contact",
      en: "/en/contact",
      "x-default": "/contact",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="ar">
      <ContactPage locale="ar" />
    </SiteLayout>
  );
}
