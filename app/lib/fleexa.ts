// Server-only — never import this from a "use client" component.
// Uses FLEEXA_API_KEY, which must stay out of the browser entirely.

const FLEEXA_BASE_URL = "https://fleexa.com.ng/developer";

export async function fleexaFetch(path: string, init?: RequestInit) {
  const apiKey = process.env.FLEEXA_API_KEY;
  if (!apiKey) {
    throw new Error("FLEEXA_API_KEY is not set in environment variables");
  }

  const res = await fetch(`${FLEEXA_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response — leave data as null, caller checks res.ok
  }

  return { ok: res.ok, status: res.status, data };
}
