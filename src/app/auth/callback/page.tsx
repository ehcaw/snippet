"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    async function signinRoute() {
      try {
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) {
          throw new Error("Unable to sign in");
        }
        router.push("/groups");
      } catch (error: any) {
        router.push("/error");
      }
    }
    signinRoute();
  }, [router, supabase]);
}
