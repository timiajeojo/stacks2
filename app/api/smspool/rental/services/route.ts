import { NextRequest, NextResponse } from "next/server";
import { smspoolFetch } from "../../../../lib/smspool";

type RawService = { ID: number; name: string; pool: number };

export async function GET(req: NextRequest) {
  const rental = req.nextUrl.searchParams.get("rental");
  if (!rental) {
    return NextResponse.json({ error: "rental is required" }, { status: 400 });
  }

  try {
    const { ok, data } = await smspoolFetch("/rental/retrieve_services", {
      rental,
    });

    if (!ok || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Failed to fetch rental services" },
        { status: 502 }
      );
    }

    const services = (data as RawService[])
      .map((s) => ({ id: s.ID, name: s.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ services });
  } catch (err: any) {
    console.error("SMSPool rental services error:", err);
    return NextResponse.json(
      { error: "Server error fetching services" },
      { status: 500 }
    );
  }
}
