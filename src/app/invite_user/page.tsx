"use client";
import { Error } from "@/components/error";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useRef } from "react";
import { useRouter } from "next/navigation";

function InviteComp() {
  const searchParams = useSearchParams();
  let groupId = useRef("");
  //let groupId = searchParams.get("id");
  groupId.current = searchParams.get("group_id") || "";

  const router = useRouter();

  if (!groupId.current || groupId.current.length < 1) {
    router.push("/dashboard");
  }
  const supabase = createClient();

  useEffect(() => {
    async function invite() {
      const { data, error } = await supabase.auth.getUser();
      if (!data.user || error) {
        router.push("/login?redirect=/invite_user?group_id=" + groupId.current);
      }
      const response = await fetch("/api/confirm-invite", {
        method: "POST",
        body: JSON.stringify({
          user_id: data.user?.id,
          group_id: groupId.current,
        }),
      });
      if (!response.ok) {
        groupId.current = "";
        const data = await response.json();
        console.log(data);
        //router.push("/?error=invite_failed");
      } else {
        router.push("/dashboard");
      }
    }
    invite();
  }, [groupId, supabase.auth, router]);

  return <div>Processing invitation</div>;
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InviteComp />
    </Suspense>
  );
}
