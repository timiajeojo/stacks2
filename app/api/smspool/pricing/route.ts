import { NextRequest, NextResponse } from "next/server";
import { smspoolFetch } from "../../../lib/smspool";
import { usdToNgn } from "../../../lib/pricing";

type RawPricing = {
  service: number;
  service_name: string;
  country: number;
  country_name: string;
  short_name: string;
  pool: number;
  price: string;
};

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country");
  const service = req.nextUrl.searchParams.get("service");

  if (!country || !service) {
    return NextResponse.json(
      { error: "Both country and service are required" },
      { status: 400 }
    );
  }

  try {
    const { ok, data } = await smspoolFetch("/request/pricing", {
      country,
      service,
    });

    if (!ok || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "No pricing available for this country/service" },
        { status: 404 }
      );
    }

    // Auto-pick the cheapest pool — matches dropping the manual
    // portal/tier selector in favor of a single clean price.
    const cheapest = (data as RawPricing[]).reduce((min, p) =>
      Number(p.price) < Number(min.price) ? p : min
    );

    const usdPrice = Number(cheapest.price);
    const ngnPrice = usdToNgn(usdPrice);

    return NextResponse.json({
      pool: cheapest.pool,
      priceNaira: Math.ceil(ngnPrice), // round up to whole Naira
    });
  } catch (err: any) {
    console.error("SMSPool pricing error:", err);
    return NextResponse.json(
      { error: "Server error fetching pricing" },
      { status: 500 }
    );
  }
}
