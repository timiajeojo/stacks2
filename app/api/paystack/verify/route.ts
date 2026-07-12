import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../../../lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { reference, uid } = await req.json();

    if (!reference || !uid) {
      return NextResponse.json(
        { error: "Missing reference or uid" },
        { status: 400 }
      );
    }

    // Source of truth: verify directly with Paystack using the secret key.
    // The client's "payment successful" callback is never trusted alone —
    // it only tells us to check; this is what actually confirms it.
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || verifyData?.data?.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Paystack amounts are in kobo (lowest currency unit)
    const amountNaira = verifyData.data.amount / 100;

    const userRef = adminDb.collection("users").doc(uid);
    const txRef = userRef.collection("transactions").doc(reference);

    // Idempotency guard: use the Paystack reference as the doc ID, so if
    // this route is ever called twice for the same payment (retry, double
    // click, etc.) the wallet only gets credited once.
    await adminDb.runTransaction(async (t) => {
      const existing = await t.get(txRef);
      if (existing.exists) return;

      t.set(txRef, {
        kind: "credit",
        status: "ok",
        method: "Paystack",
        amount: amountNaira,
        reference,
        completed: true,
        createdAt: FieldValue.serverTimestamp(),
      });

      t.set(
        userRef,
        { walletBalance: FieldValue.increment(amountNaira) },
        { merge: true }
      );
    });

    return NextResponse.json({ success: true, amount: amountNaira });
  } catch (err) {
    console.error("Paystack verify error:", err);
    return NextResponse.json(
      { error: "Something went wrong verifying the payment" },
      { status: 500 }
    );
  }
}
