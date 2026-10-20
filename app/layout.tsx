import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/app/components/layout/WhatsAppButton";
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wasamaperfume.com"),

  title: {
    default: "وسامة برفيوم | متجر العطور",
    template: "%s | وسامة برفيوم",
  },

  description:
    "وسامة برفيوم متجر متخصص في بيع العطور الرجالي والحريمي بالجملة والقطاعي.",

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${inter.variable}`}
    >
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}