import { NextResponse } from "next/server";
import { getSearchSuggestions } from "@/lib/search";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  return NextResponse.json(getSearchSuggestions(q));
}
