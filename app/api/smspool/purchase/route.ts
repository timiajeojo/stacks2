import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebaseAdmin";
import { verifyRequestUser } from "../../../lib/verifyAuth";
import { smspoolFetch } from "../../../lib/smspool";
import { usdToNgn } from "../../../lib/pricing";
import { FieldValue } from "firebase-admin/firestore";

type RawPricing = {
  service: number;
  service_name: string;
  country: number;
  country_name: string;
  short_name: string;
  pool: number;
  price: string;
};

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export async function POST(req: NextRequest) {
  const uid = await verifyRequestUser(req);
  if (!uid) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { country, service } = await req.json();
  if (!country || !service) {
    return NextResponse.json(
      { error: "Country and service are required" },
      { status: 400 }
    );
  }

  try {
    // Re-fetch pricing server-side — never trust a price the client sends,
    // it could have been tampered with.
    const pricingRes = await smspoolFetch("/request/pricing", {
      country,
      service,
    });

    if (
      !pricingRes.ok ||
      !Array.isArray(pricingRes.data) ||
      pricingRes.data.length === 0
    ) {
      return NextResponse.json(
        { error: "No pricing available for this country/service" },
        { status: 404 }
      );
    }

    const cheapest = (pricingRes.data as RawPricing[]).reduce((min, p) =>
      Number(p.price) < Number(min.price) ? p : min
    );
    const costNaira = Math.ceil(usdToNgn(Number(cheapest.price)));

    // Check wallet balance before spending anything
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

    // Place the actual order with SMSPool
    const buyRes = await smspoolFetch("/purchase/sms", {
      country,
      service,
      pool: String(cheapest.pool),
      quantity: "1",
      activation_type: "SMS",
    });

    if (!buyRes.ok || !buyRes.data?.success) {
      const rawMessage = buyRes.data?.message || "Purchase failed";
      return NextResponse.json(
        { error: stripHtml(rawMessage) },
        { status: 422 }
      );
    }

    const order = buyRes.data;
    const orderId = String(order.order_id);
    const expiresInSeconds = Number(order.expires_in) || 1200;
    const expiresAtMs = Date.now() + expiresInSeconds * 1000;

    // Deduct wallet + create the rental record atomically
    const rentalRef = userRef.collection("rentals").doc(orderId);
    await adminDb.runTransaction(async (t) => {
      t.set(userRef, { walletBalance: FieldValue.increment(-costNaira) }, {
        merge: true,
      });
      t.set(rentalRef, {
        orderId,
        number: `+${order.cc}${order.phonenumber}`,
        country: order.country,
        countryCode: cheapest.short_name,
        service: order.service,
        pool: order.pool,
        costNaira,
        costUsd: Number(cheapest.price),
        status: "waiting",
        otpsReceived: 0,
        lastCode: null,
        lastSmsText: null,
        purchasedAt: FieldValue.serverTimestamp(),
        expiresAt: expiresAtMs,
      });
    });

    return NextResponse.json({
      success: true,
      rentalId: orderId,
      number: `+${order.cc}${order.phonenumber}`,
    });
  } catch (err: any) {
    console.error("SMSPool purchase error:", err);
    return NextResponse.json(
      { error: "Server error placing order" },
      { status: 500 }
    );
  }
}
