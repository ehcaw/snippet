"use client";
import { Card } from "@/components/ui/card";
import { Music, Users, Play, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/utils/stores";
import { useRouter } from "next/navigation";
import { CreateGroupDialog } from "./create-group-dialog";
import { getTracksFromAllGroups } from "@/lib/actions";
import type { UploadRow } from "@/app/(dashboard)/groups/group/page";

// Fetch function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { userId, setUserId, userEmail, setUserEmail } = useUserStore();
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [recentTracks, setRecentTracks] = useState<UploadRow[]>([]);
  const supabase = createClient();

  // Authentication check
  useEffect(() => {
    async function checkAuth() {
      setIsAuthChecking(true);
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        // Redirect to login if not authenticated
        router.push("/login");
        return;
      }

      setUserId(data.user.id);
      setUserEmail(data.user.email || "");
      setIsAuthChecking(false);
    }

    checkAuth();
  }, [supabase.auth, setUserId, router, setUserEmail]);

  useEffect(() => {
    async function getRecentlyUploaded() {
      if (userId) {
        const tracks = await getTracksFromAllGroups(userId);
        setRecentTracks(tracks || []);
      }
    }

    if (userId) {
      getRecentlyUploaded();
    }
  }, [userId]);

  // Fetch groups data
  const {
    data: groupsData,
    error: groupsError,
    isLoading: groupsLoading,
  } = useSWR(userId ? `/api/groups?user_id=${userId}` : null, fetcher);

  // Process groups data
  const userGroups =
    groupsData?.data?.map((membership: any) => ({
      id: membership.groups.id,
      name: membership.groups.name,
      members: "...", // This would need to come from another query
    })) || [];

  // Show loading state while checking authentication
  if (isAuthChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
        <span className="ml-2">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Gradient Header */}
      <header className="relative overflow-hidden py-10 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3264] via-[#121212] to-[#1DB954]/20 z-0"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#1DB954]/10 blur-3xl z-0"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl z-0"></div>

        <div className="container relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Dashboard
          </h1>
          {userEmail && (
            <p className="text-lg md:text-xl text-white/80 mt-2">
              Welcome back, {userEmail}!
            </p>
          )}
        </div>
      </header>

      <div className="container space-y-12 py-8 md:py-12">
        {/* Your Groups */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">
                Your Groups
              </h2>
              <p className="text-zinc-400">
                Music sharing circles you&apos;ve created or joined.
              </p>
            </div>
            <CreateGroupDialog />
          </div>

          {groupsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
            </div>
          ) : groupsError ? (
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <p className="text-red-400">
                Error loading your groups. Please try again later.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {userGroups.length > 0 ? (
                <>
                  {userGroups.map((group: any) => (
                    <Link key={group.id} href={`/groups/group?id=${group.id}`}>
                      <Card className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 hover:bg-zinc-900 transition-all h-full">
                        <Users className="h-12 w-12 text-[#1DB954]" />
                        <h3 className="text-xl font-bold">{group.name}</h3>
                        <p className="text-zinc-400 text-sm line-clamp-2">
                          {group.description || "No description"}
                        </p>
                      </Card>
                    </Link>
                  ))}
                  <Link
                    href="#"
                    onClick={() =>
                      document
                        .querySelector<HTMLButtonElement>("[data-create-group]")
                        ?.click()
                    }
                  ></Link>
                </>
              ) : (
                <>
                  <Card className="p-6 col-span-full bg-zinc-900 border-zinc-800">
                    <p className="text-center text-zinc-400">
                      You haven&apos;t joined any groups yet.
                    </p>
                  </Card>
                  <Link
                    href="#"
                    onClick={() =>
                      document
                        .querySelector<HTMLButtonElement>("[data-create-group]")
                        ?.click()
                    }
                    className="col-span-full"
                  >
                    <Card className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all h-full items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-[#1DB954]" />
                      </div>
                      <h3 className="text-xl font-bold text-center">
                        Create Your First Group
                      </h3>
                      <p className="text-zinc-400 text-sm text-center">
                        Start a new music sharing circle
                      </p>
                    </Card>
                  </Link>
                </>
              )}
            </div>
          )}
        </section>

        {/* Recently Uploaded Tracks */}
        <section>
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-bold tracking-tighter">
              Recently Uploaded
            </h2>
            <p className="text-zinc-400">
              The latest tracks shared within your groups.
            </p>
          </div>

          {recentTracks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {recentTracks.map((track) => (
                <Card
                  key={track.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <div className="h-12 w-12 rounded-lg bg-[#1DB954]/10 flex items-center justify-center">
                        <Music className="h-6 w-6 text-[#1DB954]" />
                      </div>
                      <div>
                        <h3 className="font-bold">{track.title}</h3>
                        <p className="text-zinc-400">{track.artist}</p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full h-8 w-8 hover:bg-[#1DB954]/20 text-white"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 text-sm text-zinc-400 flex justify-between items-center">
                    <span>Shared in {track.group_name}</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Music className="h-12 w-12 text-zinc-700 mb-4" />
                <h3 className="text-xl font-bold mb-2">No tracks yet</h3>
                <p className="text-zinc-400 max-w-md">
                  When you or members of your groups upload tracks, they'll
                  appear here.
                </p>
              </div>
            </Card>
          )}
        </section>

        {/* Activity Feed */}
        <section>
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-bold tracking-tighter">
              Activity Feed
            </h2>
            <p className="text-zinc-400">
              Recent activity from your music sharing groups.
            </p>
          </div>

          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-zinc-700 mb-4" />
              <h3 className="text-xl font-bold mb-2">Activity coming soon</h3>
              <p className="text-zinc-400 max-w-md">
                We're working on an activity feed to help you keep track of
                what's happening in your groups.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
