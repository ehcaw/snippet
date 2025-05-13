"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";

interface FileMetadata {
  filePath: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  fileName: string;
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
          original_filename: fileMetadata.fileName,
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
