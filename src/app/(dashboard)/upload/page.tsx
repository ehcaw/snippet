"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, FileMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadMusic } from "@/lib/actions";
import { useUserStore } from "@/utils/stores";
import useSWR from "swr";
import { toast } from "@/hooks/use-toast";
import { uploadFileToSupabase } from "@/lib/actions";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [group, setGroup] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { userId } = useUserStore();

  const {
    data: groupsData,
    error: groupsError,
    isLoading: groupsLoading,
  } = useSWR(userId ? `/api/groups?user_id=${userId}` : null, fetcher);

  // Process groups data
  const groups =
    groupsData?.data?.map((membership: any) => ({
      id: membership.groups.id,
      name: membership.groups.name,
      members: "...", // This would need to come from another query
    })) || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check if file is mp3 or mp4
      if (
        selectedFile.type === "audio/mpeg" ||
        selectedFile.type === "audio/mp4" ||
        selectedFile.type === "video/mp4"
      ) {
        setFile(selectedFile);
      } else {
        alert("Please select an MP3 or MP4 file");
      }
    }
  };

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "failed to upload file");
    }
    return await response.json();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !artist || !group) {
      alert("Please fill in all fields");
      return;
    }

    setIsUploading(true);

    try {
      // Call the server action to upload the file
      const fileMetadata = await uploadFile(file);
      const result = await uploadMusic(fileMetadata, title, artist, group);

      // Reset form and redirect
      setFile(null);
      setTitle("");
      setArtist("");
      setGroup("");
      toast({
        title: "Upload Successful",
        description: `${title} by ${artist} has been uploaded.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20 text-zinc-100">
      <Card className="bg-zinc-800 border border-zinc-700 shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle>Upload a Track</CardTitle>
            <CardDescription className="text-white/80">
              Upload MP3 or MP4 files to share with your groups.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="file" className="text-white font-medium">
                Music File
              </Label>
              {file ? (
                <div className="flex items-center justify-between rounded-md border-2 border-spotify-green p-4 bg-zinc-700">
                  <div className="flex items-center space-x-3">
                    <FileMusic className="h-8 w-8 text-spotify-green" />
                    <div>
                      <span className="font-medium text-zinc-100">
                        {file.name}
                      </span>
                      <p className="text-sm text-zinc-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-zinc-600 p-10 transition-colors hover:border-spotify-green">
                  <div className="flex flex-col items-center justify-center space-y-3 text-center">
                    <div className="rounded-full bg-spotify-green/10 p-3">
                      <Upload className="h-10 w-10 text-spotify-green" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-lg text-zinc-100 font-medium">
                        Drag and drop your file here or click to browse
                      </p>
                      <p className="text-sm text-zinc-400">
                        MP3 or MP4 files up to 50MB
                      </p>
                    </div>
                    <Input
                      id="file"
                      type="file"
                      accept=".mp3,.mp4,audio/mpeg,audio/mp4,video/mp4"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById("file")?.click()}
                      className="bg-spotify-green text-white hover:bg-spotify-green/90"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-100 font-medium">
                Track Title
              </Label>
              <Input
                id="title"
                placeholder="Enter track title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-spotify-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist" className="text-zinc-100 font-medium">
                Artist
              </Label>
              <Input
                id="artist"
                placeholder="Enter artist name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-spotify-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group" className="text-zinc-100 font-medium">
                Share with Group
              </Label>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger className="bg-zinc-700 border-zinc-600 text-zinc-100 data-[placeholder]:text-zinc-400 focus:ring-spotify-green">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                  {groups.map((g: any) => (
                    <SelectItem
                      key={g.id}
                      value={g.id}
                      className="focus:bg-spotify-green/20 focus:text-white hover:bg-zinc-700"
                    >
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="bg-zinc-850 p-6 rounded-b-lg border-t border-zinc-700">
            <Button
              type="submit"
              disabled={isUploading}
              className="w-full bg-spotify-green text-white hover:bg-spotify-green/90 text-lg py-6"
            >
              {isUploading ? "Uploading..." : "Upload Track"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
