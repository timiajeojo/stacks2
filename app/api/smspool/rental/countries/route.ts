import { NextRequest, NextResponse } from "next/server";
import { smspoolFetch } from "../../../../lib/smspool";
import { usdToNgn } from "../../../../lib/pricing";

type RawRentalEntry = {
  ID: number;
  name: string;
  tag: string;
  region: string;
  pricing: Record<string, number>; // days -> USD price
  pool: number;
};

export type RentalOption = {
  id: number;
  name: string;
  tag: string;
  pool: number;
  pricingNaira: Record<string, number>; // days -> Naira price
};

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "1";

  try {
    const { ok, data } = await smspoolFetch("/rental/retrieve_all", { type });

    if (!ok || !data?.success || !Array.isArray(data.data)) {
      // "No rentals found" is a valid, non-error state for this portal
      return NextResponse.json({ options: [] });
    }

    const options: RentalOption[] = (data.data as RawRentalEntry[]).map(
      (r) => {
        const pricingNaira: Record<string, number> = {};
        for (const [days, usd] of Object.entries(r.pricing || {})) {
          pricingNaira[days] = Math.ceil(usdToNgn(Number(usd)));
        }
        return {
          id: r.ID,
          name: r.name,
          tag: r.tag,
          pool: r.pool,
          pricingNaira,
        };
      }
    );

    return NextResponse.json({ options });
  } catch (err: any) {
    console.error("SMSPool rental countries error:", err);
    return NextResponse.json(
      { error: "Server error fetching rental countries" },
      { status: 500 }
    );
  }
}
