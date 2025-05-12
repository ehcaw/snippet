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
      href: "/dashboard/library",
      icon: Library,
      title: "My Library",
    },
    {
      href: "/dashboard/upload",
      icon: Upload,
      title: "Upload",
    },
    {
      href: "/dashboard/groups",
      icon: Users,
      title: "My Groups",
    },
    {
      href: "/dashboard/discover",
      icon: Compass,
      title: "Discover",
    },
  ];

  return (
    <div className="hidden border-r bg-white md:block w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex-1 space-y-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-base font-medium",
                pathname === route.href
                  ? "bg-spotify-green text-white hover:bg-spotify-green/90"
                  : "text-gray-700 hover:bg-gray-100",
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
        <div className="space-y-4 pt-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 text-lg font-semibold tracking-tight">
              Your Playlists
            </h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
              >
                <Headphones className="mr-3 h-5 w-5" />
                Workout Mix
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
              >
                <Headphones className="mr-3 h-5 w-5" />
                Chill Vibes
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
              >
                <Headphones className="mr-3 h-5 w-5" />
                Road Trip
              </Button>
            </div>
          </div>
          <Button className="w-full justify-start bg-spotify-green text-white hover:bg-spotify-green/90">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Playlist
          </Button>
        </div>
      </div>
    </div>
  );
}
