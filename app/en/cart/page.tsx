import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import CartPageContent from "@/app/components/cart/CartPageContent";

export default function EnglishCartPage() {
  return (
    <div lang="en" dir="ltr" className="en-page">
      <Header locale="en" />
      <CartPageContent locale="en" />
      <Footer locale="en" />
    </div>
  );
}