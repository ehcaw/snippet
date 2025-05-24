import { Sidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Music } from "lucide-react";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-zinc-200 flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-zinc-700 bg-gradient-to-r from-[#121829]/90 via-black/80 to-[#10251b]/90 shadow-2xl backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 group transition-opacity hover:opacity-80"
          >
            <Image src="/music.svg" alt="Music Icon" width={24} height={24} />
            <span className="text-2xl font-bold tracking-tight text-white">
              Snipit
            </span>
          </Link>
          {/* Placeholder for potential future elements like a user dropdown */}
          <div>{/* e.g., <UserAccountNav user={data.user} /> */}</div>
        </div>
      </header>

      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        {" "}
        {/* Ensure full height for the content area below header */}
        <Sidebar /> {/* Assuming Sidebar is styled for a dark theme */}
        <main className="flex-1 overflow-y-auto bg-[#080808]">
          {" "}
          {/* Main content area with a slightly off-black bg */}
          <div className="p-4 sm:p-6 lg:p-8">
            {" "}
            {/* Padding for content within main */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
