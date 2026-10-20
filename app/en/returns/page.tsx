
import type { Metadata } from "next";
import SiteLayout from "@/app/components/layout/SiteLayout";
import ReturnsPage from "@/app/components/pages/ReturnsPage";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description:
    "Learn how to request a return or exchange from Wasama Perfume, contact customer support, and have your order reviewed.",
  alternates: {
    canonical: "/en/returns",
    languages: {
      "ar-EG": "/returns",
      en: "/en/returns",
      "x-default": "/returns",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="en">
      <ReturnsPage locale="en" />
    </SiteLayout>
  );
}
