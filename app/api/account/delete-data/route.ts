import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebaseAdmin";
import { verifyRequestUser } from "../../../lib/verifyAuth";

export async function POST(req: NextRequest) {
  const uid = await verifyRequestUser(req);
  if (!uid) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    // Removes the user doc AND every subcollection underneath it
    // (transactions, rentals) — the client SDK can't do this in one call.
    await adminDb.recursiveDelete(adminDb.collection("users").doc(uid));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Account data deletion error:", err);
    return NextResponse.json(
      { error: "Server error deleting account data" },
      { status: 500 }
    );
  }
}
