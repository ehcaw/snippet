"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Users, Play, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/utils/stores";
import { useRouter } from "next/navigation";
import { CreateGroupDialog } from "./create-group-dialog";
// Fetch function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { userId, setUserId, userEmail, setUserEmail } = useUserStore();
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
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

  const recentTracks: any[] = [];

  // Show loading state while checking authentication
  if (isAuthChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container space-y-12 py-8 md:py-12">
      {/* Your Groups */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-bold tracking-tighter">Your Groups</h2>
            <p className="text-muted-foreground">
              Music sharing circles you&apos;ve created or joined.
            </p>
          </div>
          <CreateGroupDialog />
        </div>

        {groupsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : groupsError ? (
          <Card className="p-6">
            <p className="text-red-500">
              Error loading your groups. Please try again later.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {userGroups.length > 0 ? (
              <>
                {userGroups.map((group: any) => (
                  <Link key={group.id} href={`/groups/group?id=${group.id}`}>
                    <Card className="flex flex-col gap-2 rounded-lg border p-6 hover:shadow-md transition-shadow h-full">
                      <Users className="h-12 w-12 text-primary" />
                      <h3 className="text-xl font-bold">{group.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {group.description || "No description"}
                      </p>
                    </Card>
                  </Link>
                ))}
              </>
            ) : (
              <Card className="p-6 col-span-full">
                <p className="text-center text-muted-foreground">
                  You haven&apos;t joined any groups yet.
                </p>
              </Card>
            )}

            <Link href="/groups">
              <Card className="flex flex-col gap-2 rounded-lg border p-6 hover:shadow-md transition-shadow h-full items-center justify-center text-center bg-muted/50">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Explore More Groups</h3>
                <p className="text-muted-foreground">
                  Discover or create new music sharing circles
                </p>
              </Card>
            </Link>
          </div>
        )}
      </section>

      {/* Recently Uploaded Tracks (unchanged) */}
      <section>
        <div className="space-y-2 mb-6">
          <h2 className="text-3xl font-bold tracking-tighter">
            Recently Uploaded
          </h2>
          <p className="text-muted-foreground">
            The latest tracks shared within your groups.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recentTracks.map((track) => (
            <Card
              key={track.id}
              className="flex flex-col gap-2 rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{track.title}</h3>
                    <p className="text-muted-foreground">{track.artist}</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-8 w-8"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-sm text-muted-foreground flex justify-between items-center">
                <span>Shared in {track.group}</span>
                <span>{track.uploadDate}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
