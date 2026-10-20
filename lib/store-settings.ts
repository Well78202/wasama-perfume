
import "server-only";
import { prisma } from "@/lib/prisma";

export async function getStoreSettings() {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: "main" },
  });

  return {
    storeNameAr: settings?.storeNameAr ?? "وسامة برفيوم",
    storeNameEn: settings?.storeNameEn ?? "Wasama Perfume",
    whatsapp: settings?.whatsapp ?? "",
    vodafoneCashNumber: settings?.vodafoneCashNumber ?? "",
    instapayAddress: settings?.instapayAddress ?? "",
    vodafoneCashEnabled:
      settings?.vodafoneCashEnabled ?? false,
    instapayEnabled: settings?.instapayEnabled ?? false,
    paymentInstructions: settings?.paymentInstructions ?? "",
  };
}

export type StoreSettingsData = Awaited<
  ReturnType<typeof getStoreSettings>
>;

export function isPaymentMethodAvailable(
  settings: StoreSettingsData,
  method: string
) {
  if (method === "VODAFONE_CASH") {
    return (
      settings.vodafoneCashEnabled &&
      settings.vodafoneCashNumber.trim().length > 0
    );
  }

  if (method === "INSTAPAY") {
    return (
      settings.instapayEnabled &&
      settings.instapayAddress.trim().length > 0
    );
  }

  return false;
}
