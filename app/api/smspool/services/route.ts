import { NextRequest, NextResponse } from "next/server";
import { smspoolFetch } from "../../../lib/smspool";

export type Service = {
  id: number;
  name: string;
};

type RawService = {
  ID: number;
  name: string;
  favourite: number;
};

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country");

  try {
    const { ok, data } = await smspoolFetch(
      "/service/retrieve_all",
      country ? { country } : {},
      "GET"
    );

    if (!ok || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Failed to fetch services from SMSPool" },
        { status: 502 }
      );
    }

    const services: Service[] = (data as RawService[])
      .map((s) => ({ id: s.ID, name: s.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ services });
  } catch (err: any) {
    console.error("SMSPool services error:", err);
    return NextResponse.json(
      { error: "Server error fetching services" },
      { status: 500 }
    );
  }
}
