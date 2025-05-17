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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <div className="max-w-3xl w-full text-center space-y-12">
        {/* Large 404 text */}
        <h1 className="text-[10rem] font-bold text-primary/20 leading-none select-none">
          404
        </h1>

        {/* Main content container */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Page not found
          </h2>

          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {message}
          </p>

          {/* Custom illustration - can be replaced with an actual image */}
          <div className="flex justify-center my-8">
            <div className="w-48 h-48 rounded-full bg-muted/20 flex items-center justify-center">
              <span className="text-6xl">🔍</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Back to home</span>
            </Link>

            <Button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go back</span>
            </Button>
          </div>
        </div>

        {/* Optional: Add some additional help text */}
        <div className="text-sm text-muted-foreground mt-12">
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
