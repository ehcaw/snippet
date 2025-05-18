"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Upload,
  Users,
  Library,
  PlusCircle,
  Headphones,
  Compass,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      title: "Home",
    },
    {
      href: "/library",
      icon: Library,
      title: "My Library",
    },
    {
      href: "/upload",
      icon: Upload,
      title: "Upload",
    },
  ];

  return (
    <div className="hidden border-r border-zinc-800 bg-zinc-900 md:block w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex-1 space-y-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-base font-medium",
                pathname === route.href
                  ? "bg-spotify-green text-black hover:bg-spotify-green/90"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-3 h-5 w-5" />
                {route.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
