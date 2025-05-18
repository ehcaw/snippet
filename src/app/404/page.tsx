"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

function NotFoundComp() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4">
      <div className="max-w-3xl w-full text-center space-y-12 bg-black/50 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-2xl">
        {/* Large 404 text */}
        <h1 className="text-[10rem] font-bold text-white/20 leading-none select-none">
          404
        </h1>

        {/* Main content container */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Page not found
          </h2>

          <p className="text-white/80 text-lg max-w-xl mx-auto">
            {message || "The page you are looking for does not exist or has been moved."}
          </p>

          {/* Custom illustration - can be replaced with an actual image */}
          <div className="flex justify-center my-8">
            <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-6xl">🚧</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-purple-600 hover:bg-white/90 transition-colors font-semibold"
            >
              <Home className="h-5 w-5" />
              <span>Back to home</span>
            </Link>

            <Button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go back</span>
            </Button>
          </div>
        </div>

        {/* Optional: Add some additional help text */}
        <div className="text-sm text-white/70 mt-12">
          If you believe this is an error, please contact support or try again
          later.
        </div>
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div> Loading...</div>}>
      <NotFoundComp />
    </Suspense>
  );
}
