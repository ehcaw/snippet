import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const supabase = await createClient();

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. User must be logged in to upload files." },
        { status: 401 },
      );
    }
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

    const fileMetadata = {
      filePath: `uploads/${uniqueFilename}`,
      fileUrl: publicUrlData.publicUrl,
      fileType: file.type,
      fileSize: file.size,
      fileName: file.name,
    };

    return NextResponse.json(fileMetadata, { status: 200 });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 },
    );
  }
}
