"use client";
import { Error } from "@/components/error";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("id");
  const supabase = createClient();

  useEffect(() => {
    async function invite() {
      const { data, error } = await supabase.auth.getUser();
      if (!data.user || error) {
        redirect("/404?message=Error getting user");
      }
      const response = await fetch("/api/confirm-invite");
    }
  }, [groupId]);
  if (!groupId) {
    return <Error message="Invalid invite link" />;
  }

  return <div>Hello</div>;
}
