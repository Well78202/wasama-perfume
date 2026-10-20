
import type { ReactNode } from "react";
import type { Locale } from "@/lib/translations";

import Header from "./Header";
import Footer from "./Footer";

type SiteLayoutProps = {
  locale: Locale;
  children: ReactNode;
};

export default function SiteLayout({
  locale,
  children,
}: SiteLayoutProps) {
  return (
    <>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </>
  );
}
