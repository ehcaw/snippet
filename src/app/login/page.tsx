"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function Login() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || "An error occurred during sign in");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2 text-white">
              <Music className="h-6 w-6" />
              <span className="font-bold">Snipit</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center bg-black">
        <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-2 text-center tracking-tighter text-white">
            Sign in to Snipit
          </h1>
          <p className="text-zinc-400 mb-6 text-center">
            Use your Google account to continue
          </p>

          {error && (
            <div className="p-3 mb-4 text-sm border border-red-700 bg-red-900/30 text-red-400 rounded-md">
              {error}
            </div>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            size="lg"
            className="w-full flex items-center justify-center gap-2" // text color will be handled by variant="outline" on dark bg
            variant="outline" // Outline buttons in shadcn adapt to dark/light themes
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M44.5 20H24V28.5H36.9C35.5 33.1 31.2 36 24 36C16.3 36 10 29.7 10 22C10 14.3 16.3 8 24 8C27.3 8 30.2 9.1 32.5 11L38.1 5.4C34.3 2.1 29.5 0 24 0C10.7 0 0 10.7 0 24C0 37.3 10.7 48 24 48C37.3 48 48 37.3 48 24C48 22.3 47.8 20.7 47.5 19.1L44.5 20Z"
                  fill="#FFC107"
                />
                <path
                  d="M6.3 14.7L13.5 19.6C15.5 15.1 19.4 12 24 12C26.3 12 28.4 12.8 30.1 14.1L36.1 8.1C32.7 5.2 28.6 3.5 24 3.5C16.7 3.5 10.3 8.7 6.3 14.7Z"
                  fill="#FF3D00"
                />
                <path
                  d="M24 44.5C29.3 44.5 33.9 42.6 37.1 39.7L30.5 34.3C28.7 35.6 26.5 36.5 24 36.5C16.8 36.5 10.9 31.2 9.1 24.7L1.7 29.8C5.6 37.1 14.1 44.5 24 44.5Z"
                  fill="#4CAF50"
                />
                <path
                  d="M47.5 19.1H44.5V20H24V28.5H36.9C36.2 30.7 34.8 32.6 32.9 34L39.3 39.3C43.1 36.1 45.5 30.7 45.5 24C45.5 22.3 45.3 20.7 45 19.1Z"
                  fill="#1976D2"
                />
              </g>
            </svg>
            {isLoading ? "Connecting..." : "Continue with Google"}
          </Button>
        </div>
      </main>
      <footer className="border-t border-zinc-800 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-zinc-400 md:text-left">
            © 2025 Snipit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
