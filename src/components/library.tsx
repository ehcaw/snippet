"use client";
import { useState, useEffect } from "react";
import { Music, Play, MoreHorizontal, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTracksFromUser, getTracksFromAllGroups } from "@/lib/actions";
import { useUserStore } from "@/utils/stores";

export default function LibraryPage() {
  // Mock data for uploaded tracks
  const { userId } = useUserStore();
  const [myUploads, setMyUploads] = useState<any[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<any[]>([]);

  useEffect(() => {
    const myUploadSetter = async () => {
      const uploads = await getTracksFromUser(userId || "");
      const groupuploads = await getTracksFromAllGroups(userId || "");
      setMyUploads(uploads || []);
      setSharedWithMe(groupuploads || []);
    };
    myUploadSetter();
  }, [userId]);

  return (
    <div className="space-y-6 pb-20 text-zinc-100">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
        <p className="text-lg opacity-90">
          Browse and play your music collection.
        </p>
      </div>

      <Tabs defaultValue="my-uploads" className="space-y-6">
        <TabsList className="bg-zinc-800 p-1 rounded-md">
          <TabsTrigger
            value="my-uploads"
            className="data-[state=active]:bg-spotify-green data-[state=active]:text-white data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:bg-zinc-700 data-[state=inactive]:hover:text-zinc-100 rounded-sm px-3 py-1.5 text-sm font-medium"
          >
            My Uploads
          </TabsTrigger>
          <TabsTrigger
            value="shared-with-me"
            className="data-[state=active]:bg-spotify-green data-[state=active]:text-white data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:bg-zinc-700 data-[state=inactive]:hover:text-zinc-100 rounded-sm px-3 py-1.5 text-sm font-medium"
          >
            Shared With Me
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-uploads" className="space-y-4">
          <Card className="bg-zinc-800 border border-zinc-700 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardTitle>My Uploads</CardTitle>
              <CardDescription className="text-white/80">
                Music files you`%apos`ve uploaded to share.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-zinc-750 px-6 py-3 grid grid-cols-12 text-sm font-medium text-zinc-400 border-b border-zinc-700">
                <div className="col-span-1">#</div>
                <div className="col-span-5">TITLE</div>
                <div className="col-span-3">ARTIST</div>
                <div className="col-span-2 text-right">
                  <Clock className="h-4 w-4 inline" />
                </div>
                <div className="col-span-1"></div>
              </div>

              <div>
                {myUploads.map((track, index) => (
                  <div
                    key={track.id}
                    className="grid grid-cols-12 items-center px-6 py-3 hover:bg-zinc-750 group border-b border-zinc-700"
                  >
                    <div className="col-span-1 text-zinc-400">{index + 1}</div>
                    <div className="col-span-5 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white relative group-hover:opacity-80">
                        <Music className="h-5 w-5 group-hover:hidden" />
                        <Play className="h-5 w-5 hidden group-hover:block" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-100">
                          {track.title}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 text-zinc-300">
                      {track.artist}
                    </div>
                    <div className="col-span-2 text-right text-zinc-300">
                      {track.duration}
                    </div>
                    <div className="col-span-1 flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={
                          track.liked
                            ? "text-spotify-green"
                            : "text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-spotify-green"
                        }
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={track.liked ? "#1DB954" : "none"}
                        />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-zinc-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-zinc-800 border-zinc-700 text-zinc-100"
                        >
                          <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700">
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700">
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared-with-me" className="space-y-4">
          <Card className="bg-zinc-800 border border-zinc-700 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
              <CardTitle>Shared With Me</CardTitle>
              <CardDescription className="text-white/80">
                Music shared with you by your groups.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-zinc-750 px-6 py-3 grid grid-cols-12 text-sm font-medium text-zinc-400 border-b border-zinc-700">
                <div className="col-span-1">#</div>
                <div className="col-span-4">TITLE</div>
                <div className="col-span-3">ARTIST</div>
                <div className="col-span-2">SHARED BY</div>
                <div className="col-span-1 text-right">
                  <Clock className="h-4 w-4 inline" />
                </div>
                <div className="col-span-1"></div>
              </div>

              <div>
                {sharedWithMe.map((track, index) => (
                  <div
                    key={track.id}
                    className="grid grid-cols-12 items-center px-6 py-3 hover:bg-zinc-750 group border-b border-zinc-700"
                  >
                    <div className="col-span-1 text-zinc-400">{index + 1}</div>
                    <div className="col-span-4 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white relative group-hover:opacity-80">
                        <Music className="h-5 w-5 group-hover:hidden" />
                        <Play className="h-5 w-5 hidden group-hover:block" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-100">
                          {track.title}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 text-zinc-300">
                      {track.artist}
                    </div>
                    <div className="col-span-2 text-zinc-300">
                      {track.sharedBy}
                    </div>
                    <div className="col-span-1 text-right text-zinc-300">
                      {track.duration}
                    </div>
                    <div className="col-span-1 flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={
                          track.liked
                            ? "text-spotify-green"
                            : "text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-spotify-green"
                        }
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={track.liked ? "#1DB954" : "none"}
                        />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-zinc-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-zinc-800 border-zinc-700 text-zinc-100"
                        >
                          <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700">
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700">
                            Add to Playlist
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700">
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
