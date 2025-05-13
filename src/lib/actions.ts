"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";

export async function uploadMusic(
  file: File,
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

    // Generate a unique filename to avoid collisions
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;

    // Upload file to Supabase storage
    const { data: fileData, error: uploadError } = await supabase.storage
      .from("mp4")
      .upload(`uploads/${uniqueFilename}`, file, {
        cacheControl: "3600",
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("mp4")
      .getPublicUrl(`uploads/${uniqueFilename}`);

    const publicUrl = publicUrlData.publicUrl;

    // Now store metadata in a database table for querying
    const { data: trackData, error: trackError } = await supabase
      .from("tracks")
      .insert([
        {
          title,
          artist,
          group_id: groupId,
          uploaded_by: user.id,
          file_path: `uploads/${uniqueFilename}`,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          upload_date: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (trackError) {
      // If metadata insertion fails, try to delete the uploaded file
      await supabase.storage.from("mp4").remove([`uploads/${uniqueFilename}`]);
      throw trackError;
    }

    // Revalidate relevant paths to show the new upload
    revalidatePath("/dashboard/library");
    revalidatePath(`/groups/group?id=${groupId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      url: publicUrl,
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
