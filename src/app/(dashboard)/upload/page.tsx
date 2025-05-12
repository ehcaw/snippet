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

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [group, setGroup] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for groups
  const groups = [
    { id: "1", name: "Rock Enthusiasts" },
    { id: "2", name: "Jazz Club" },
    { id: "3", name: "EDM Lovers" },
    { id: "4", name: "Classical Appreciation" },
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !artist || !group) {
      alert("Please fill in all fields");
      return;
    }

    setIsUploading(true);

    try {
      // Call the server action to upload the file
      await uploadMusic(file, title, artist, group);

      // Reset form and redirect
      setFile(null);
      setTitle("");
      setArtist("");
      setGroup("");
      router.push("/dashboard/library");
      router.refresh();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20">
      <div className="spotify-gradient rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold tracking-tight">Upload Music</h1>
        <p className="text-lg opacity-90">Share your music with your groups.</p>
      </div>

      <Card className="border-none shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle>Upload a Track</CardTitle>
            <CardDescription className="text-white/80">
              Upload MP3 or MP4 files to share with your groups.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="file" className="text-base font-medium">
                Music File
              </Label>
              {file ? (
                <div className="flex items-center justify-between rounded-md border-2 border-spotify-green p-4 bg-green-50">
                  <div className="flex items-center space-x-3">
                    <FileMusic className="h-8 w-8 text-spotify-green" />
                    <div>
                      <span className="font-medium">{file.name}</span>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-10 transition-colors hover:border-spotify-green">
                  <div className="flex flex-col items-center justify-center space-y-3 text-center">
                    <div className="rounded-full bg-green-100 p-3">
                      <Upload className="h-10 w-10 text-spotify-green" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-lg font-medium">
                        Drag and drop your file here or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
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
              <Label htmlFor="title" className="text-base font-medium">
                Track Title
              </Label>
              <Input
                id="title"
                placeholder="Enter track title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300 focus-visible:ring-spotify-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist" className="text-base font-medium">
                Artist
              </Label>
              <Input
                id="artist"
                placeholder="Enter artist name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="border-gray-300 focus-visible:ring-spotify-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group" className="text-base font-medium">
                Share with Group
              </Label>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger className="border-gray-300 focus:ring-spotify-green">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 p-6 rounded-b-lg">
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
