import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { user_id, group_id } = data;

  if (!user_id || !group_id) {
    return NextResponse.json(
      { error: "Missing user id or group id" },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  try {
    const { error: inviteError } = await supabase.from("group_members").insert({
      member_id: user_id,
      group_id: group_id,
      joined_at: Date.now(),
    });
    if (inviteError) {
      throw inviteError;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
