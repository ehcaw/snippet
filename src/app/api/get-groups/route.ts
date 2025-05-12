import { createClient } from "@/utils/supabase/server";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("user_id");
  if (!userId) {
    return new NextResponse("No user id provided");
  }
  const supabase = await createClient();
}
