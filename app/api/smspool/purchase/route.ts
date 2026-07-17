import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../../../lib/firebaseAdmin";
import { verifyRequestUser } from "../../../lib/verifyAuth";
import { smspoolFetch } from "../../../lib/smspool";
import { usdToNgn } from "../../../lib/pricing";

export async function POST(req: NextRequest) {
  const uid = await verifyRequestUser(req);
  if (!uid) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { rentalId, days, countryName } = await req.json();
  if (!rentalId || !days) {
    return NextResponse.json(
      { error: "rentalId and days are required" },
      { status: 400 }
    );
  }

  try {
    // Re-derive the authoritative price server-side rather than trusting
    // whatever the client displayed.
    const { ok: countriesOk, data: countriesData } = await smspoolFetch(
      "/rental/retrieve_all",
      { type: "1" }
    );
    const entry = countriesOk && countriesData?.data
      ? countriesData.data.find((r: any) => String(r.ID) === String(rentalId))
      : null;

    const usdPrice = entry?.pricing?.[String(days)];
    if (!usdPrice) {
      return NextResponse.json(
        { error: "Invalid rental/duration combination" },
        { status: 400 }
      );
    }
    const costNaira = Math.ceil(usdToNgn(Number(usdPrice)));

    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const walletBalance = userSnap.exists
      ? Number(userSnap.data()?.walletBalance || 0)
      : 0;

    if (walletBalance < costNaira) {
      return NextResponse.json(
        { error: "Insufficient wallet balance" },
        { status: 400 }
      );
    }

    const buyRes = await smspoolFetch("/purchase/rental", {
      id: String(rentalId),
      days: String(days),
      create_token: "0",
    });

    if (!buyRes.ok || !buyRes.data?.success) {
      return NextResponse.json(
        { error: buyRes.data?.message || "Rental purchase failed" },
        { status: 422 }
      );
    }

    const order = buyRes.data;
    const rentalCode = String(order.rental_code);

    const rentalRef = userRef.collection("longTermRentals").doc(rentalCode);
    await adminDb.runTransaction(async (t) => {
      t.set(userRef, { walletBalance: FieldValue.increment(-costNaira) }, {
        merge: true,
      });
      t.set(rentalRef, {
        rentalCode,
        number: order.phonenumber,
        country: countryName || "",
        days: order.days,
        costNaira,
        expiresAt: Number(order.expiry) * 1000,
        status: "pending", // takes up to 24-48h to activate per SMSPool
        purchasedAt: FieldValue.serverTimestamp(),
      });
    });

    return NextResponse.json({ success: true, rentalCode });
  } catch (err: any) {
    console.error("SMSPool rental purchase error:", err);
    return NextResponse.json(
      { error: "Server error placing rental order" },
      { status: 500 }
    );
  }
}
