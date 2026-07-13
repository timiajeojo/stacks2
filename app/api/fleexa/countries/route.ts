import { NextRequest, NextResponse } from "next/server";
import { fleexaFetch } from "../../../lib/fleexa";

// Each server has its own separate country list/IDs — not shared.
const PORTAL_PATHS: Record<string, string> = {
  "1": "/sms/countries",
  "2": "/sms2/countries",
  "3": "/sms3/countries",
};

export type FleexaCountry = {
  id: number;
  name: string;
  code: string;
  prefix?: string;
};

type RawCountry = {
  id: number;
  title: string;
  code: string;
  prefix?: string;
};

export async function GET(req: NextRequest) {
  const portal = req.nextUrl.searchParams.get("portal") || "1";
  const path = PORTAL_PATHS[portal];

  if (!path) {
    return NextResponse.json(
      { error: "Invalid portal. Use 1, 2, or 3." },
      { status: 400 }
    );
  }

  try {
    const { ok, data } = await fleexaFetch(path);

    if (!ok || !data?.success) {
      return NextResponse.json(
        { error: data?.message || "Failed to fetch countries from Fleexa" },
        { status: 502 }
      );
    }

    // All 3 servers return countries as an object keyed by id
    // (e.g. { "1": { id, title, code }, "2": {...} }), not an array.
    const raw = (data.data || {}) as Record<string, RawCountry>;

    const countries: FleexaCountry[] = Object.values(raw)
      .map((c) => ({
        id: c.id,
        name: c.title,
        code: c.code,
        ...(c.prefix ? { prefix: c.prefix } : {}),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ countries });
  } catch (err: any) {
    console.error("Fleexa countries error:", err);
    return NextResponse.json(
      { error: "Server error fetching countries" },
      { status: 500 }
    );
  }
}
