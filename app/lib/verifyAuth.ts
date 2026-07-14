import { NextRequest } from "next/server";
import { adminAuth } from "./firebaseAdmin";

// Verifies the caller is who they claim to be, server-side — never trust a
// uid sent directly in a request body for anything that spends wallet
// balance or touches another user's data.
export async function verifyRequestUser(
  req: NextRequest
): Promise<string | null> {
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    return decoded.uid;
  } catch {
    return null;
  }
}
