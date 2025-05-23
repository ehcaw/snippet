import { Card, CardContent } from "@/components/ui/card";
import { Music, Users, Play, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/utils/stores";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Fetch function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Create Group Dialog component
export function CreateGroupDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const { userId, userEmail } = useUserStore();
  const router = useRouter();
  const { mutate } = useSWR(userId ? `/api/groups?user_id=${userId}` : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          userEmail,
          userId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create group");
      }
      mutate(); // Refresh the groups data
      setOpen(false); // Close dialog on success
      setName(""); // Reset form fields
      setDescription(""); // Reset form fields
    } catch (error) {
      console.error("Error creating group:", error);
      // Optionally, display an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 bg-[#1DB954] text-white hover:bg-[#1DB954]/90"
          size="sm"
          data-create-group // Added for easier selection from dashboard
        >
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Group</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a new group to share music with friends and collaborators.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-zinc-300">
                Group Name
              </Label>
              <Input
                id="name"
                placeholder="My Awesome Music Group"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-[#1DB954]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-zinc-300">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Tell others what this group is about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-[#1DB954]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="bg-[#1DB954] text-white hover:bg-[#1DB954]/90 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
