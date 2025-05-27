import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/utils/supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeRedirect(
  redirect: string | null | undefined,
  fallback: string = "/dashboard",
) {
  if (
    typeof redirect === "string" &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//") && // Prevent protocol-relative URLs
    !redirect.includes("://") // Prevent full URLs
  ) {
    return redirect;
  }
  return fallback;
}

export async function checkClientAuth() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return false;
  }
  return true;
}
