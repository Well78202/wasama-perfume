
import type { Metadata } from "next";
import AboutPage from "@/app/components/pages/AboutPage";
import SiteLayout from "@/app/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "About Us | Wasama Perfume",
  description:
    "Discover Wasama Perfume, a fragrance store dedicated to helping you find a scent that reflects your personality.",
  alternates: {
    canonical: "/en/about",
    languages: {
      "ar-EG": "/about",
      en: "/en/about",
    },
  },
};

export default function Page() {
  return (
    <div className="en-page" dir="ltr" lang="en">
      <SiteLayout locale="en">
        <AboutPage locale="en" />
      </SiteLayout>
    </div>
  );
}