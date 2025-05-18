"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Users, Music, FileMusic, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Database } from "../../../../../database.types";
import { UploadDialog } from "@/components/dashboard/upload-file-dialog";
import { getGroupMembers } from "@/lib/actions";
import { toast, useToast } from "@/hooks/use-toast";

type GroupDetails = Database["public"]["Tables"]["groups"]["Row"];
export type MemberRow = Database["public"]["Tables"]["group_members"]["Row"] & {
  // User details from auth.users
  email?: string | null;
  displayName?: string | null;
  // Keeping the profiles property for backward compatibility
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
    if (!groupId) return;

    async function fetchGroupData() {
      try {
        setLoading(true);

        // Fetch group details
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
      }
    }

    fetchGroupData();
    loadMembers();
  }, [groupId, supabase]);

  const handleDownload = async (uploadLink: string, fileName: string) => {
    try {
      // Extract the file path from the upload link if needed
      const filePath = uploadLink.includes("/")
        ? uploadLink.split("/").pop() || uploadLink
        : uploadLink;

      const { data, error } = await supabase.storage
        .from("uploads")
        .download(filePath);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "music-file";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  async function downloadViaFetch(url: string): Promise<void> {
    const fileName = url.split("/").pop();
    const { data, error } = await supabase.storage
      .from("mp4")
      .download(`uploads/${fileName}`);
    if (!data) {
      toast({
        title: "Error downloading file",
        description: "Please try again",
      });
      return;
    }
    const blobUrl = URL.createObjectURL(data);

    // 4) Create a temporary <a> tag and click it
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.download = fileName || "";
    document.body.appendChild(a);
    a.click();

    // 5) Clean up
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    }, 100);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-zinc-100">
        <p className="text-xl">Loading group data...</p>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8 text-zinc-100">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{group?.name}</h1>
        <UploadDialog>
          <Button size="sm" className="h-9 px-3 bg-spotify-green text-black hover:bg-spotify-green/90">
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </UploadDialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-700 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <FileMusic className="h-5 w-5 text-spotify-green" />
                <span>Uploads</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {uploads.length === 0 ? (
                <p className="text-zinc-400 text-center py-6">
                  No music uploads in this group yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {uploads.map((upload) => (
                    <div
                      key={`${upload.user_email}-${upload.upload_date}`}
                      className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg bg-zinc-850 hover:bg-zinc-750 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Music className="h-10 w-10 text-spotify-green p-2 bg-spotify-green/10 rounded-full" />
                        <div>
                          <p className="font-medium text-white">
                            {upload.title || "Music File"} - {upload.artist || "Unknown Artist"}
                          </p>
                          <p className="text-sm text-zinc-400">
                            Uploaded by {upload.user_email || "Unknown user"} ·{" "}
                            {new Date(
                              upload.upload_date || "",
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 border-spotify-green text-spotify-green hover:bg-spotify-green/10 hover:text-spotify-green"
                        onClick={() => downloadViaFetch(upload.file_url)}
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
        </div>

        <div>
          <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-700 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Users className="h-5 w-5 text-spotify-green" />
                <span>Members ({members.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.member_id}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-750 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={member.profiles?.avatar_url || ""} />
                      <AvatarFallback className="bg-spotify-green text-black font-semibold">
                        {(member.profiles?.username || member.email || "U")
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">
                        {member.profiles?.username || member.email || "Unknown user"}
                      </p>
                      <p className="text-xs text-zinc-400">
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function GroupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-zinc-900 text-zinc-100 text-xl">Loading... </div>}>
      <GroupComp />
    </Suspense>
  );
}
