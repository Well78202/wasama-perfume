
export const PAYMENT_CONFIG = {
  vodafoneCash: "01204791050",
  instaPay: "karrem7@instapay",
  whatsapp: "201204791050",
} as const;

export function formatEGP(amount: number, locale: "ar" | "en") {
  return `${amount.toLocaleString(
    locale === "ar" ? "ar-EG" : "en-EG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )} ${locale === "ar" ? "ج.م" : "EGP"}`;
}
