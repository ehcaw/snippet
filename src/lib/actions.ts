"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function uploadMusic(
  file: File,
  title: string,
  artist: string,
  groupId: string,
) {
  try {
    // Upload file to Vercel Blob
    const filename = `${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Here you would typically save the metadata to your database
    // For now, we'll just return the blob URL

    // Revalidate the library page to show the new upload
    revalidatePath("/dashboard/library");

    return {
      success: true,
      url: blob.url,
      title,
      artist,
      groupId,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
}
