"use client";

import { createClient } from "@/utils/supabase/client";
import { randomUUID } from "crypto";

// This function handles the file upload from the client side
export async function uploadFileToSupabase(file: File) {
  if (!file) {
    throw new Error("No file provided");
  }

  const supabase = createClient();

  try {
    // Generate a unique filename to avoid collisions
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

    // Upload file to Supabase storage
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
