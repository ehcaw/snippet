import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { filename, mp3File }: { filename: string; mp3File: Blob } =
      await request.json();

    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${filename}`;

    // Create a blob for the file
    const blob = await put(uniqueFilename, mp3File, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      uploadUrl: blob.downloadUrl,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
