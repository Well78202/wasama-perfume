import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

export type Locale = "ar" | "en";

const messages = {
  ar,
  en,
};

export function getMessages(locale: Locale) {
  return messages[locale];
}