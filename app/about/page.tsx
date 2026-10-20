
import type { Metadata } from "next";
import AboutPage from "@/app/components/pages/AboutPage";
import SiteLayout from "../components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "من نحن | وسامة برفيوم",
  description:
    "تعرف على وسامة برفيوم، متجر العطور الذي يساعدك على اكتشاف العطر المناسب لشخصيتك وذوقك.",
  alternates: {
    canonical: "/about",
    languages: {
      "ar-EG": "/about",
      en: "/en/about",
    },
  },
};

export default function Page() {
  return (
    <SiteLayout locale="ar">
      <AboutPage locale="ar" />
    </SiteLayout>
  );
}