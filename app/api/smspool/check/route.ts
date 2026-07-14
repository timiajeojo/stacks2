import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebaseAdmin";
import { verifyRequestUser } from "../../../lib/verifyAuth";
import { smspoolFetch } from "../../../lib/smspool";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  const uid = await verifyRequestUser(req);
  if (!uid) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const rentalId = req.nextUrl.searchParams.get("rentalId");
  if (!rentalId) {
    return NextResponse.json({ error: "rentalId is required" }, { status: 400 });
  }

  const rentalRef = adminDb
    .collection("users")
    .doc(uid)
    .collection("rentals")
    .doc(rentalId);

  try {
    const snap = await rentalRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 });
    }
    const rental = snap.data()!;

    // Already in a terminal state — no need to poll SMSPool again
    if (rental.status === "received" || rental.status === "refunded") {
      return NextResponse.json({ status: rental.status });
    }

    // Locally expired — no point polling further
    if (rental.expiresAt && Date.now() > rental.expiresAt) {
      await rentalRef.set({ status: "expired" }, { merge: true });
      return NextResponse.json({ status: "expired" });
    }

    const { ok, data } = await smspoolFetch("/sms/check", {
      orderid: rentalId,
    });

    if (!ok || data === null) {
      return NextResponse.json({ status: rental.status }); // no change, try again later
    }

    if (data.status === 3) {
      await rentalRef.set(
        {
          status: "received",
          lastCode: data.sms || null,
          lastSmsText: data.full_sms || null,
          otpsReceived: FieldValue.increment(1),
        },
        { merge: true }
      );
      return NextResponse.json({ status: "received", code: data.sms });
    }

    if (data.status === 6) {
      // SMSPool refunded on their end — mirror that in the user's NGN wallet
      const userRef = adminDb.collection("users").doc(uid);
      await adminDb.runTransaction(async (t) => {
        t.set(
          userRef,
          { walletBalance: FieldValue.increment(rental.costNaira || 0) },
          { merge: true }
        );
        t.set(rentalRef, { status: "refunded" }, { merge: true });
      });
      return NextResponse.json({ status: "refunded" });
    }

    // status === 1, still waiting
    return NextResponse.json({ status: "waiting" });
  } catch (err: any) {
    console.error("SMSPool check error:", err);
    return NextResponse.json(
      { error: "Server error checking status" },
      { status: 500 }
    );
  }
}
