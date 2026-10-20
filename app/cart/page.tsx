import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import CartPageContent from "@/app/components/cart/CartPageContent";

export default function CartPage() {
  return (
    <>
      <Header locale="ar" />
      <CartPageContent locale="ar" />
      <Footer locale="ar" />
    </>
  );
}