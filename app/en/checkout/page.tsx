
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import CheckoutPageContent from "@/app/components/checkout/CheckoutPageContent";

export const metadata = {
  title: "Checkout | Wasama Perfume",
  robots: { index: false, follow: false },
};

export default function EnglishCheckoutPage() {
  return (
    <div lang="en" dir="ltr" className="en-page">
      <Header locale="en" />
      <CheckoutPageContent locale="en" />
      <Footer locale="en" />
    </div>
  );
}

