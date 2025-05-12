import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Upload, Clock, Play, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function DashboardPage() {
  // Mock data for recently shared tracks
  const recentTracks = [
    {
      id: 1,
      title: "Summer Vibes",
      artist: "DJ Cool",
      sharedBy: "Alex",
      group: "Beach Party",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Midnight Blues",
      artist: "Jazz Trio",
      sharedBy: "Sam",
      group: "Jazz Lovers",
      time: "Yesterday",
    },
    {
      id: 3,
      title: "Rock Anthem",
      artist: "The Rockers",
      sharedBy: "Jamie",
      group: "Rock Club",
      time: "2 days ago",
    },
    {
      id: 4,
      title: "Chill Beats",
      artist: "Lo-Fi Producer",
      sharedBy: "Taylor",
      group: "Study Group",
      time: "3 days ago",
    },
  ];

  // Mock data for featured playlists
  const featuredPlaylists = [
    {
      id: 1,
      title: "Summer Hits",
      tracks: 24,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 2,
      title: "Workout Mix",
      tracks: 18,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 3,
      title: "Chill Vibes",
      tracks: 32,
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 4,
      title: "Road Trip",
      tracks: 45,
      image: "/placeholder.svg?height=150&width=150",
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="spotify-gradient rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Good afternoon
        </h1>
        <p className="text-lg opacity-90">
          Welcome to your music sharing dashboard.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <Upload className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card className="card-hover border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="text-sm font-medium">Your Groups</CardTitle>
            <Users className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +1 new group this month
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="text-sm font-medium">
              Shared With You
            </CardTitle>
            <Music className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              +8 new tracks this week
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="text-sm font-medium">
              Listening Time
            </CardTitle>
            <Clock className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">12h</div>
            <p className="text-xs text-muted-foreground">+2h from last week</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredPlaylists.map((playlist) => (
            <div key={playlist.id} className="group relative cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src={playlist.image || "/placeholder.svg"}
                  alt={playlist.title}
                  width={150}
                  height={150}
                  className="object-cover transition-all group-hover:scale-105 group-hover:brightness-75"
                />
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 rounded-full bg-spotify-green opacity-0 transition-opacity group-hover:opacity-100 hover:scale-105"
                >
                  <Play className="h-5 w-5 text-white" fill="white" />
                </Button>
              </div>
              <div className="mt-2">
                <h3 className="font-semibold">{playlist.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {playlist.tracks} tracks
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recently Shared</h2>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentTracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between space-x-4 p-2 rounded-md hover:bg-gray-50 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                      <Music className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium leading-none">{track.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm">Shared by {track.sharedBy}</p>
                      <p className="text-xs text-muted-foreground">
                        in {track.group}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {track.time}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <Heart className="h-5 w-5 text-muted-foreground hover:text-spotify-green" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <Play className="h-5 w-5 text-muted-foreground hover:text-spotify-green" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
