import { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  const w = req.nextUrl.searchParams.get("w");
  const h = req.nextUrl.searchParams.get("h");
  const d = req.nextUrl.searchParams.get("d");
  console.log("VH_PING", JSON.stringify({ w, h, doc: d }));
  return new Response(null, { status: 204 });
}
