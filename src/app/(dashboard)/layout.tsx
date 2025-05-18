import { Sidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Music } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-full bg-zinc-900 text-zinc-100">
      <header className="sticky top-0 z-10 w-full border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60">
        <div className="container flex h-14 items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-spotify-green"
          >
            <Music className="h-6 w-6" />
            <span className="font-bold">Snippet</span>
          </Link>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
