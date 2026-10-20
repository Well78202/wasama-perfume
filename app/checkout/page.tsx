
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import CheckoutPageContent from "@/app/components/checkout/CheckoutPageContent";

export const metadata = {
  title: "إتمام الطلب | وسامة برفيوم",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <Header locale="ar" />
      <CheckoutPageContent locale="ar" />
      <Footer locale="ar" />
    </>
  );
}
