import { NextResponse } from "next/server";
import { smspoolFetch } from "../../../lib/smspool";

export type Country = {
  id: number;
  name: string;
  code: string;
  region: string;
};

type RawCountry = {
  ID: number;
  name: string;
  short_name: string;
  region: string;
};

export async function GET() {
  try {
    const { ok, data } = await smspoolFetch(
      "/country/retrieve_all",
      {},
      "GET"
    );

    if (!ok || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Failed to fetch countries from SMSPool" },
        { status: 502 }
      );
    }

    const countries: Country[] = (data as RawCountry[])
      .map((c) => ({
        id: c.ID,
        name: c.name,
        code: c.short_name,
        region: c.region,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ countries });
  } catch (err: any) {
    console.error("SMSPool countries error:", err);
    return NextResponse.json(
      { error: "Server error fetching countries" },
      { status: 500 }
    );
  }
}
