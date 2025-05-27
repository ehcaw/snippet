"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InviteMemberDialogProps {
  groupId: string;
  children?: React.ReactNode;
}

export function InviteMemberDialog({
  groupId,
  children,
}: InviteMemberDialogProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const inviteLink = `${typeof window !== "undefined" ? window.location.origin : ""}/invite_user?group_id=${groupId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="bg-zinc-900 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-200 font-semibold px-8 py-4 text-sm transition-all duration-300 hover:scale-105 min-w-[200px] border border-zinc-800 hover:border-zinc-600"
          >
            <UserPlus className="h-4 w-4" />
            Invite Members
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#1DB954]" />
            Invite Members
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Share this link with others to invite them to join this group.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invite-link" className="text-zinc-300">
              Invite Link
            </Label>
            <div className="flex gap-2">
              <Input
                id="invite-link"
                value={inviteLink}
                readOnly
                className="bg-zinc-800 border-zinc-700 text-white flex-1 cursor-text select-all"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleCopy}
                size="sm"
                className="bg-[#1DB954] text-black hover:bg-[#1DB954]/90 px-3"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="text-sm text-zinc-400">
            <p>
              Anyone with this link can join the group. Keep it private if you
              want to control membership.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
