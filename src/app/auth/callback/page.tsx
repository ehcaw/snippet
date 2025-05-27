"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { sanitizeRedirect } from "@/lib/utils";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();

  const redirectLink = searchParams.get("redirect"); // if new users are being invited

  useEffect(() => {
    async function signinRoute() {
      try {
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) {
          throw new Error("Unable to sign in");
        }
        if (redirectLink) {
          let sanitizedRedirectLink = sanitizeRedirect(
            redirectLink,
            "/dashboard",
          );
          router.push(sanitizedRedirectLink);
          return;
        } else {
          router.push("/dashboard");
          return;
        }
      } catch (error: any) {
        router.push("/error");
      }
    }
    signinRoute();
  }, [router, supabase, redirectLink]);
}
