"use client";

export async function uploadToBlob(file: File) {
  try {
    // Get a presigned URL from the server
    const response = await fetch("/api/upload-url");
    const { url, fields } = await response.json();

    // Create a FormData instance
    const formData = new FormData();

    // Add the fields to the FormData
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // Add the file to the FormData
    formData.append("file", file);

    // Upload the file directly to Vercel Blob
    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Upload failed");
    }

    // Return the URL of the uploaded file
    return `${url}/${fields.key}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
