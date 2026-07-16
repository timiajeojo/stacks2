import { NextRequest, NextResponse } from "next/server";
import { smspoolFetch } from "../../../../lib/smspool";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const days = req.nextUrl.searchParams.get("days");
  if (!id || !days) {
    return NextResponse.json(
      { error: "id and days are required" },
      { status: 400 }
    );
  }

  try {
    const { ok, data } = await smspoolFetch("/rental/stock", { id, days });

    if (!ok || data?.success !== 1) {
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: data.count ?? 0 });
  } catch (err: any) {
    console.error("SMSPool rental stock error:", err);
    return NextResponse.json({ count: 0 });
  }
}
