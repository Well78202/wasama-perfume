
import SiteLayout from "./components/layout/SiteLayout";

import Hero from "./components/home/Hero";
import Categories from "./components/home/Categories";
import BestSellers from "./components/home/BestSellers";
import Collections from "./components/home/Collections";
import NewArrivals from "./components/home/NewArrivals";
import Features from "./components/home/Features";
import Contact from "./components/home/Contact";

export default function HomePage() {
  return (
    <SiteLayout locale="ar">
      <main>
        <Hero locale="ar" />
        <Categories locale="ar" />
        <BestSellers locale="ar" />
        <Collections locale="ar" />
        <NewArrivals locale="ar" />
        <Features locale="ar" />
        <Contact locale="ar" />
      </main>
    </SiteLayout>
  );
}
