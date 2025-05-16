"use server";

import { revalidatePath } from "next/cache";
import { createClient as cc } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { MemberRow } from "@/app/(dashboard)/groups/group/page";

interface FileMetadata {
  filePath: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  fileName: string;
}

export async function uploadFileToSupabase(file: File) {
  if (!file) {
    throw new Error("No file provided");
  }

  const supabase = await createClient();

  try {
    // Generate a unique filename to avoid collisions
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

    // Upload file to Supabase storageq
    const { data, error } = await supabase.storage
      .from("mp4")
      .upload(`uploads/${uniqueFilename}`, file, {
        cacheControl: "3600",
        contentType: file.type,
      });

    if (error) {
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("mp4")
      .getPublicUrl(`uploads/${uniqueFilename}`);

    return {
      filePath: `uploads/${uniqueFilename}`,
      fileUrl: publicUrlData.publicUrl,
      fileType: file.type,
      fileSize: file.size,
      fileName: file.name,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function uploadMusic(
  fileMetadata: FileMetadata,
  title: string,
  artist: string,
  groupId: string,
) {
  try {
    const supabase = await createClient();

    // Get current user for upload attribution
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const { data: trackData, error: trackError } = await supabase
      .from("tracks")
      .insert([
        {
          title,
          artist,
          group_id: groupId,
          uploaded_by: user.id,
          file_path: fileMetadata.filePath,
          file_url: fileMetadata.fileUrl,
          file_type: fileMetadata.fileType,
          file_size: fileMetadata.fileSize,
          upload_date: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (trackError) {
      throw trackError;
    }

    // Revalidate relevant paths to show the new upload
    revalidatePath("/dashboard/library");
    revalidatePath(`/groups/group?id=${groupId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      track: trackData,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(
      typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : "Failed to upload file",
    );
  }
}

export async function getTracksForGroup(groupId: string) {
  const supabase = await createClient();
  const { data: groupTracks } = await supabase
    .from("tracks")
    .select()
    .eq("group_id", groupId)
    .order("upload_date", { ascending: false });
  return groupTracks;
}

export async function getTracksFromUser(userId: string) {
  const supabase = await createClient();
  const { data: userTracks } = await supabase
    .from("tracks")
    .select()
    .eq("uploaded_by", userId)
    .order("upload_date", { ascending: false });
  return userTracks;
}

export async function getTracksFromAllGroups(userId: string) {
  const supabase = await createClient();
  const { data: groups } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("member_id", userId);
  const { data: tracks } = await supabase
    .from("tracks")
    .select()
    .in("group_id", groups || [])
    .order("upload_date", { ascending: false });
  return tracks;
}

export async function searchTracks(query: string) {
  const supabase = await createClient();
  const { data: tracks } = await supabase
    .from("tracks")
    .select()
    .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
    .order("upload_date", { ascending: false });
  return tracks;
}

export async function downloadMedia(url: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("mp4").download(url);
  if (error) {
    return null;
  }
  return data;
}

export async function getGroupMembers(groupId: string): Promise<MemberRow[]> {
  try {
    // First, get the regular client to query group members
    const supabase = await createClient();

    // Get all members of the group
    const { data: groupMembers, error: membersError } = await supabase
      .from("group_members")
      .select(
        `
        member_id,
        group_id,
        joined_at
      `,
      )
      .eq("group_id", groupId);

    if (membersError) {
      console.error("Error fetching group members:", membersError);
      throw membersError;
    }

    if (!groupMembers || groupMembers.length === 0) {
      return [];
    }

    // Get the unique member IDs
    const memberIds = groupMembers.map((member) => member.member_id);

    // Use service role key to get detailed user information
    const adminSupabase = cc(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Get user information from auth.users
    const { data: users, error: usersError } = await adminSupabase
      .from("users_view")
      .select("id, email")
      .in("id", memberIds);

    if (usersError) {
      console.error("Error fetching user details:", usersError);
      throw usersError;
    }

    // Combine member data with user details to match MemberRow type
    return groupMembers.map((member) => {
      const user = users?.find((u) => u.id === member.member_id);

      // Return object that matches MemberRow type
      return {
        member_id: member.member_id,
        group_id: member.group_id,
        joined_at: member.joined_at,
        profiles: {
          username: user?.email?.split("@")[0] || "Unknown User",
        },
      };
    });
  } catch (error) {
    console.error("Error getting group members:", error);
    throw new Error(
      typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : "Failed to get group members",
    );
  }
}
