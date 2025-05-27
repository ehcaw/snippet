"use client";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Users, CheckCircle, XCircle, Music } from "lucide-react";

function InviteComp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const groupId = useRef("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "invalid"
  >("loading");
  const [message, setMessage] = useState("");
  const [groupName, setGroupName] = useState("");

  groupId.current = searchParams.get("group_id") || "";

  const supabase = createClient();

  useEffect(() => {
    if (!groupId.current || groupId.current.length < 1) {
      router.push("/dashboard");
      return;
    }

    async function validateGroupId(id: string) {
      const { data, error } = await supabase
        .from("groups")
        .select("id, name")
        .eq("id", id)
        .single();
      if (error || !data) {
        return null;
      }
      return data;
    }

    async function processInvite() {
      try {
        setLoading(true);
        setStatus("loading");
        setMessage("Validating group invitation...");

        // Validate group ID
        const groupData = await validateGroupId(groupId.current);
        if (!groupData) {
          setStatus("invalid");
          setMessage(
            "This invitation link is invalid or the group no longer exists.",
          );
          setTimeout(() => router.push("/dashboard"), 3000);
          return;
        }

        setGroupName(groupData.name);
        setMessage(`Joining ${groupData.name}...`);

        // Check authentication
        const { data, error } = await supabase.auth.getUser();
        if (!data.user || error) {
          router.push(
            "/login?redirect=" +
              encodeURIComponent(`/invite_user?group_id=${groupId.current}`),
          );
          return;
        }

        setMessage("Adding you to the group...");

        // Add user to group
        const response = await fetch("/api/confirm-invite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: data.user.id,
            group_id: groupId.current,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setStatus("error");
          setMessage(
            errorData.error ||
              "Failed to join the group. You may already be a member.",
          );
          setTimeout(() => router.push("/dashboard"), 3000);
        } else {
          setStatus("success");
          setMessage(`Successfully joined ${groupData.name}!`);
          setTimeout(() => router.push("/dashboard"), 2000);
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
        setTimeout(() => router.push("/dashboard"), 3000);
      } finally {
        setLoading(false);
      }
    }

    processInvite();
  }, [groupId, supabase, router]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 animate-spin text-[#1DB954]" />;
      case "success":
        return <CheckCircle className="h-16 w-16 text-[#1DB954]" />;
      case "error":
        return <XCircle className="h-16 w-16 text-red-400" />;
      case "invalid":
        return <XCircle className="h-16 w-16 text-red-400" />;
      default:
        return <Loader2 className="h-16 w-16 animate-spin text-[#1DB954]" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "text-[#1DB954]";
      case "success":
        return "text-[#1DB954]";
      case "error":
      case "invalid":
        return "text-red-400";
      default:
        return "text-[#1DB954]";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Gradient Header */}
      <header className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3264] via-[#121212] to-[#1DB954]/20 z-0"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#1DB954]/10 blur-3xl z-0"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl z-0"></div>

        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1DB954]/20 to-[#1DB954]/5 border border-[#1DB954]/20 mb-6">
              <Users className="h-10 w-10 text-[#1DB954]" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Group Invitation
            </h1>

            {groupName && (
              <p className="text-lg md:text-xl text-zinc-300">
                Youve been invited to join{" "}
                <span className="text-[#1DB954] font-semibold">
                  {groupName}
                </span>
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Status Content */}
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              {getStatusIcon()}

              <div className="space-y-2">
                <h2 className={`text-xl font-semibold ${getStatusColor()}`}>
                  {status === "loading" && "Processing Invitation"}
                  {status === "success" && "Welcome to the Group!"}
                  {status === "error" && "Invitation Failed"}
                  {status === "invalid" && "Invalid Invitation"}
                </h2>

                <p className="text-zinc-400 leading-relaxed">{message}</p>
              </div>

              {status === "success" && (
                <div className="w-full pt-4 border-t border-zinc-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                    <Music className="h-4 w-4" />
                    <span>Redirecting to your dashboard...</span>
                  </div>
                </div>
              )}

              {(status === "error" || status === "invalid") && (
                <div className="w-full pt-4 border-t border-zinc-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                    <span>Redirecting to dashboard...</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
          <Loader2 className="h-12 w-12 animate-spin text-[#1DB954]" />
          <p className="text-xl mt-4">Loading invitation...</p>
        </div>
      }
    >
      <InviteComp />
    </Suspense>
  );
}
