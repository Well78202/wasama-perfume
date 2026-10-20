import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/store-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json(
      {
        whatsapp: settings.whatsapp,
        vodafoneCashNumber: settings.vodafoneCashNumber,
        instapayAddress: settings.instapayAddress,
        vodafoneCashEnabled: settings.vodafoneCashEnabled,
        instapayEnabled: settings.instapayEnabled,
        paymentInstructions: settings.paymentInstructions,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load payment settings" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
