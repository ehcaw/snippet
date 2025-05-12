"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Users, Music, FileMusic } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Upload = {
  id: string;
  name: string;
  file_path: string;
  created_at: string;
  uploaded_by: string;
  user: {
    name: string;
    avatar_url?: string;
  };
};

type Member = {
  id: string;
  name: string;
  avatar_url?: string;
  role: string;
};

export default function GroupPage() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("id");
  const supabase = createClient();

  const [groupName, setGroupName] = useState<string>("");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    async function fetchGroupData() {
      try {
        setLoading(true);

        // Fetch group details
        const { data: groupData, error: groupError } = await supabase
          .from("groups")
          .select("name")
          .eq("id", groupId)
          .single();

        if (groupError) throw groupError;
        setGroupName(groupData.name);

        // Fetch uploads
        const { data: uploadsData, error: uploadsError } = await supabase
          .from("uploads")
          .select(
            `
            id,
            name,
            file_path,
            created_at,
            uploaded_by,
            user:uploaded_by (name, avatar_url)
          `,
          )
          .eq("group_id", groupId)
          .order("created_at", { ascending: false });

        if (uploadsError) throw uploadsError;
        setUploads(uploadsData || []);

        // Fetch members
        const { data: membersData, error: membersError } = await supabase
          .from("group_members")
          .select(
            `
            id,
            user:user_id (id, name, avatar_url),
            role
          `,
          )
          .eq("group_id", groupId);

        if (membersError) throw membersError;

        // Transform the data structure to match our Member type
        const formattedMembers = membersData.map((item: any) => ({
          id: item.user.id,
          name: item.user.name,
          avatar_url: item.user.avatar_url,
          role: item.role,
        }));

        setMembers(formattedMembers || []);
      } catch (error) {
        console.error("Error fetching group data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGroupData();
  }, [groupId, supabase]);

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("uploads")
        .download(filePath);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading group data...
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{groupName}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileMusic className="h-5 w-5" />
                <span>Uploads</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploads.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">
                  No music uploads in this group yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {uploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Music className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full" />
                        <div>
                          <p className="font-medium">{upload.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded by {upload.user?.name || "Unknown user"} ·
                            {new Date(upload.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDownload(upload.file_path, upload.name)
                        }
                        className="flex items-center gap-1"
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Members ({members.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2">
                    <Avatar>
                      <AvatarImage src={member.avatar_url || ""} />
                      <AvatarFallback>
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {member.role}
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
