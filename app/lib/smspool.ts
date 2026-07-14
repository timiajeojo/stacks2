// Server-only — never import this from a "use client" component.
// SMSPool's own docs are inconsistent about auth: some endpoints expect the
// key as a form field, others rely on the Authorization header. We send
// both on every request — harmless, and covers whichever each one checks.

const SMSPOOL_BASE_URL = "https://api.smspool.net";

export async function smspoolFetch(
  path: string,
  params: Record<string, string> = {},
  method: "GET" | "POST" = "POST"
) {
  const apiKey = process.env.SMSPOOL_API_KEY;
  if (!apiKey) {
    throw new Error("SMSPOOL_API_KEY is not set in environment variables");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
  };

  let url = `${SMSPOOL_BASE_URL}${path}`;
  let body: URLSearchParams | undefined;

  if (method === "GET") {
    const qs = new URLSearchParams(params);
    if ([...qs].length > 0) url += `?${qs.toString()}`;
  } else {
    body = new URLSearchParams({ ...params, key: apiKey });
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
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
