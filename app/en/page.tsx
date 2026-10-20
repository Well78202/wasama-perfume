
import type { Metadata } from "next";

import SiteLayout from "../components/layout/SiteLayout";

import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import BestSellers from "../components/home/BestSellers";
import Collections from "../components/home/Collections";
import NewArrivals from "../components/home/NewArrivals";
import Features from "../components/home/Features";
import Contact from "../components/home/Contact";

export const metadata: Metadata = {
  title: "Luxury Perfume Store",

  description:
    "Discover Wasama Perfume's curated collection of men's and women's fragrances.",

  alternates: {
    canonical: "/en",
    languages: {
      "ar-EG": "/",
      en: "/en",
      "x-default": "/",
    },
  },
};

export default function EnglishHomePage() {
  return (
    <SiteLayout locale="en">
      <main>
        <Hero locale="en" />
        <Categories locale="en" />
        <BestSellers locale="en" />
        <Collections locale="en" />
        <NewArrivals locale="en" />
        <Features locale="en" />
        <Contact locale="en" />
      </main>
    </SiteLayout>
  );
}
