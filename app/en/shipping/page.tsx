
import type { Metadata } from "next";
import SiteLayout from "@/app/components/layout/SiteLayout";
import ShippingPage from "@/app/components/pages/ShippingPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "Learn about Wasama Perfume's shipping process, advance payment, order confirmation, and delivery information.",
  alternates: {
    canonical: "/en/shipping",
    languages: {
      "ar-EG": "/shipping",
      en: "/en/shipping",
      "x-default": "/shipping",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="en">
      <ShippingPage locale="en" />
    </SiteLayout>
  );
}
