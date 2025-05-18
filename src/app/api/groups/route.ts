import { createClient } from "@/utils/supabase/server";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("user_id");
  if (!userId) {
    return new NextResponse("No user id provided");
  }
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("group_members")
      .select(
        `member_id, group_id, joined_at, groups(id, name, created_by, description)`,
      )
      .eq("member_id", userId);
    if (error) {
      throw error;
    }
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "error fetching groups" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const { name, description, userEmail, userId } = await req.json();
  const supabase = await createClient();

  const uuid = uuidv4();
  try {
    const { data, error } = await supabase
      .from("groups")
      .insert({
        id: uuid,
        name: name,
        description: description,
        created_by: userEmail,
      })
      .select();

    const { error: userLinkError } = await supabase
      .from("group_members")
      .insert({
        member_id: userId,
        group_id: uuid,
      });
    if (error) {
      throw error;
    }
    if (userLinkError) {
      throw userLinkError;
    }
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
