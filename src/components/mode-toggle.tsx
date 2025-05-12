"use client";
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-spotify-gray hover:text-spotify-green"
    >
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Light mode</span>
    </Button>
  );
}
