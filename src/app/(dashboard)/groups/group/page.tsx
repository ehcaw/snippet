"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Users,
  Music,
  FileMusic,
  Upload,
  Loader2,
  UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Database } from "../../../../../database.types";
import { UploadDialog } from "@/components/dashboard/upload-file-dialog";
import { InviteMemberDialog } from "@/components/dashboard/invite-member-dialog";
import { getGroupMembers } from "@/lib/actions";
import { toast } from "@/hooks/use-toast"; // Assuming useToast is correctly set up

type GroupDetails = Database["public"]["Tables"]["groups"]["Row"];
export type MemberRow = Database["public"]["Tables"]["group_members"]["Row"] & {
  email?: string | null;
  displayName?: string | null;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
};
export type UploadRow = Database["public"]["Tables"]["tracks"]["Row"] & {
  user_email: string;
  group_name?: string;
};

function GroupComp() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("id");
  const supabase = createClient();

  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    async function fetchGroupData() {
      try {
        setLoading(true);

        const { data: groupData, error: groupError } = await supabase
          .from("groups")
          .select("*")
          .eq("id", groupId)
          .single();

        if (groupError) throw groupError;
        setGroup(groupData);

        const { data: uploadsData, error: uploadsError } = await supabase.rpc(
          "get_tracks_with_user_emails",
          { p_group_id: groupId },
        );

        if (uploadsError) throw uploadsError;
        setUploads(uploadsData || []);
      } catch (error) {
        console.error("Error fetching group data:", error);
        toast({
          title: "Error",
          description: "Could not load group data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    async function loadMembers() {
      try {
        const groupMembers = await getGroupMembers(groupId || "");
        setMembers(groupMembers);
      } catch (error: any) {
        console.error("Failed to load members: ", error);
        toast({
          title: "Error",
          description: "Could not load group members.",
          variant: "destructive",
        });
      }
    }

    fetchGroupData();
    loadMembers();
  }, [groupId, supabase]);

  async function downloadTrack(fileUrl: string, fileName?: string) {
    if (!fileUrl) {
      toast({
        title: "Error",
        description: "File URL is missing.",
        variant: "destructive",
      });
      return;
    }
    try {
      // The file_url from `get_tracks_with_user_emails` should be the direct storage URL
      // If it's a path like `public/track.mp3`, then use that directly.
      // If it's a full URL, extract the path.
      // For this example, assuming file_url is a path like `folder/track.mp3` within the bucket.
      const path = fileUrl.startsWith(
        supabase.storage.from("uploads").getPublicUrl("").data.publicUrl,
      )
        ? fileUrl.substring(
            supabase.storage.from("uploads").getPublicUrl("").data.publicUrl
              .length,
          )
        : fileUrl;

      const { data, error } = await supabase.storage
        .from("uploads") // Ensure this is your correct bucket name
        .download(path);

      if (error) throw error;
      if (!data) throw new Error("No data received for download.");

      const blob = new Blob([data], {
        type: data.type || "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || path.split("/").pop() || "track";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Success",
        description: `Downloading ${fileName || "track"}...`,
      });
    } catch (error: any) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Failed",
        description:
          error.message || "Could not download the track. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
        <Loader2 className="h-12 w-12 animate-spin text-[#1DB954]" />
        <p className="text-xl mt-4">Loading group data...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
        <Music className="h-16 w-16 text-zinc-700 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Group Not Found</h2>
        <p className="text-zinc-400">
          The group you are looking for does not exist or could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Gradient Header */}
      <header className="relative overflow-hidden py-8 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3264] via-[#121212] to-[#1DB954]/20 z-0"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#1DB954]/10 blur-3xl z-0 opacity-80"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl z-0 opacity-80"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-900/5 blur-3xl z-0"></div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            {/* Group Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#1DB954]/20 to-[#1DB954]/5 border border-[#1DB954]/20 mb-3">
              <Users className="h-8 w-8 text-[#1DB954]" />
            </div>

            {/* Group Name */}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
              {group.name}
            </h1>

            {/* Group Description */}
            {group.description && (
              <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                {group.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <UploadDialog>
                <Button
                  size="lg"
                  className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100 font-bold px-8 py-4 text-lg shadow-lg transition-all duration-300 hover:scale-105 min-w-[200px] border border-zinc-700 hover:border-zinc-600"
                >
                  <Upload className="h-6 w-6 mr-3" />
                  Upload Track
                </Button>
              </UploadDialog>
              <InviteMemberDialog groupId={groupId || ""}>
                <Button
                  size="lg"
                  className="bg-zinc-900 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-200 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 min-w-[200px] border border-zinc-800 hover:border-zinc-600"
                >
                  <UserPlus className="h-6 w-6 mr-3" />
                  Invite Members
                </Button>
              </InviteMemberDialog>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-4 text-zinc-400">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-md font-medium">
                  {members.length} Members
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                <span className="text-lg font-medium">
                  {uploads.length} Tracks
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 md:py-12 space-y-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Uploads Section */}
          <section className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardHeader className="border-b border-zinc-800 pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
                  <FileMusic className="h-7 w-7 text-[#1DB954]" />
                  <span className="text-white">Shared Tracks</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {uploads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Music className="h-16 w-16 text-zinc-700 mb-6" />
                    <h3 className="text-xl font-bold mb-2 text-white">
                      No Tracks Yet
                    </h3>
                    <p className="text-zinc-400 max-w-md">
                      Be the first to share a track in this group! Use the
                      upload button above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {uploads.map((upload) => (
                      <div
                        key={upload.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-zinc-800/70 border border-zinc-700/50 hover:bg-zinc-800 transition-all"
                      >
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                          <div className="p-3 rounded-md bg-[#1DB954]/10">
                            <Music className="h-6 w-6 text-[#1DB954]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-white">
                              {upload.title || "Untitled Track"}
                            </h4>
                            <p className="text-sm text-zinc-400">
                              {upload.artist || "Unknown Artist"}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                              Shared by {upload.user_email || "Unknown User"} on{" "}
                              {new Date(
                                upload.upload_date || Date.now(),
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100 font-bold px-8 py-4 text-sm shadow-lg transition-all duration-300 hover:scale-105 min-w-[200px] border border-zinc-700 hover:border-zinc-600"
                          onClick={() =>
                            downloadTrack(
                              upload.file_url,
                              `${upload.artist || "track"} - ${upload.title || "untitled"}.${upload.file_url.split(".").pop()}`,
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Members Section */}
          <aside className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardHeader className="border-b border-zinc-800 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                    <Users className="h-7 w-7 text-[#1DB954]" />
                    <span className="text-white">
                      Members ({members.length})
                    </span>
                  </CardTitle>
                  <InviteMemberDialog groupId={groupId || ""} />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {members.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Users className="h-12 w-12 text-zinc-700 mb-4" />
                    <h3 className="text-lg font-semibold mb-1 text-white">
                      No Members Yet
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Invite members to start sharing!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div
                        key={member.member_id}
                        className="flex items-center gap-3 p-3 rounded-md bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={member.profiles?.avatar_url || ""}
                          />
                          <AvatarFallback className="bg-[#1DB954] text-black font-semibold">
                            {(member.profiles?.username || member.email || "U")
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">
                            {member.profiles?.username ||
                              member.email ||
                              "Unknown User"}
                          </p>
                          <p className="text-xs text-zinc-400">
                            Joined on{" "}
                            {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function GroupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
          <Loader2 className="h-12 w-12 animate-spin text-[#1DB954]" />
          <p className="text-xl mt-4">Loading Group...</p>
        </div>
      }
    >
      <GroupComp />
    </Suspense>
  );
}
