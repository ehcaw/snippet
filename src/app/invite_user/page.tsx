"use client";
import { Error } from "@/components/error";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import { useEffect, Suspense, useRef } from "react";

function InviteComp() {
  const searchParams = useSearchParams();
  let groupId = useRef("");
  //let groupId = searchParams.get("id");
  groupId.current = searchParams.get("id") || "";
  const supabase = createClient();

  useEffect(() => {
    async function invite() {
      const { data, error } = await supabase.auth.getUser();
      if (!data.user || error) {
        redirect("/404?message=Error getting user");
      }
      const response = await fetch("/api/confirm-invite");
      if (!response.ok) {
        groupId.current = "";
      } else {
        redirect("/dashboard");
      }
    }
  }, [groupId, supabase.auth]);
  if (!groupId.current || groupId.current.length == 0) {
    return <Error message="Invalid invite link" />;
  }

  return <div>Hello</div>;
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InviteComp />
    </Suspense>
  );
}
