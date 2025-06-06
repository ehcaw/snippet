"use client";

import { useState } from "react";
import { Upload, X, FileMusic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGroupsStore, useUserStore } from "@/utils/stores";
import { uploadMusic } from "@/lib/actions";
import useSWR from "swr";
import { cx } from "class-variance-authority";

interface UploadDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function UploadDialog({ children, onSuccess }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
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

      // Reset form and close dialog
      setFile(null);
      setTitle("");
      setArtist("");
      setGroup("");
      setOpen(false);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-zinc-900 border-zinc-800 text-zinc-100">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 -m-4 mb-0 rounded-t-lg">
            <DialogTitle className="text-xl">Upload a Track</DialogTitle>
            <DialogDescription className="text-white/80">
              Upload MP3 or MP4 files to share with your groups.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 p-6 pt-8">
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="text-base font-medium">
                Music File
              </Label>
              {file ? (
                <div className="flex items-center justify-between rounded-md border-2 border-spotify-green p-4 bg-zinc-800">
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
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-zinc-700 p-6 transition-colors hover:border-spotify-green">
                  <div className="flex flex-col items-center justify-center space-y-3 text-center">
                    <Upload className="h-8 w-8 text-spotify-green" />
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-zinc-100">
                        Drag and drop your file here or click to browse
                      </p>
                      <p className="text-sm text-zinc-400">
                        MP3 or MP4 files up to 50MB
                      </p>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".mp3,.mp4,audio/mpeg,audio/mp4,video/mp4"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className="bg-spotify-green text-white hover:bg-spotify-green/90"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Track Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter track title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 focus-visible:ring-spotify-green placeholder:text-zinc-500 text-zinc-100"
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
                  className="bg-zinc-800 border-zinc-700 focus-visible:ring-spotify-green placeholder:text-zinc-500 text-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group" className="text-base font-medium">
                Share with Group
              </Label>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 focus:ring-spotify-green data-[placeholder]:text-zinc-500 text-zinc-100">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 text-zinc-100 border-zinc-700">
                  {groups.length > 0 ? (
                    groups.map((g: any) => (
                      <SelectItem
                        key={g.id}
                        value={g.id}
                        className="focus:bg-spotify-green/20 focus:text-white hover:bg-zinc-700"
                      >
                        {g.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem
                      value="no-groups"
                      disabled
                      className="text-zinc-500"
                    >
                      No groups available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="bg-zinc-950 p-6 -m-4 mt-0 rounded-b-lg border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUploading}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || !file || !title || !artist || !group}
              className="bg-spotify-green text-white hover:bg-spotify-green/90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Track"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
