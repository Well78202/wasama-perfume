import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await prisma.storeSettings.findUnique({ where: { id: "main" } });
  return (
    <SettingsForm
      initial={{
        storeNameAr: settings?.storeNameAr ?? "وسامة برفيوم",
        storeNameEn: settings?.storeNameEn ?? "Wasama Perfume",
        whatsapp: settings?.whatsapp ?? "",
        vodafoneCashNumber: settings?.vodafoneCashNumber ?? "",
        instapayAddress: settings?.instapayAddress ?? "",
        vodafoneCashEnabled: settings?.vodafoneCashEnabled ?? false,
        instapayEnabled: settings?.instapayEnabled ?? false,
        paymentInstructions: settings?.paymentInstructions ?? "",
      }}
    />
  );
}
