import Link from "next/link";
import { Users, UserPlus, Settings, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GroupsPage() {
  // Mock data for groups
  const groups = [
    {
      id: "1",
      name: "Rock Enthusiasts",
      description: "Sharing the best rock music from all eras",
      members: 12,
      tracks: 45,
      color: "from-red-500 to-orange-500",
      recentMembers: [
        { id: "1", name: "Alex", image: "/placeholder-user.jpg" },
        { id: "2", name: "Sam", image: "/placeholder-user.jpg" },
        { id: "3", name: "Jamie", image: "/placeholder-user.jpg" },
      ],
    },
    {
      id: "2",
      name: "Jazz Club",
      description: "For jazz lovers and musicians",
      members: 8,
      tracks: 32,
      color: "from-blue-500 to-indigo-500",
      recentMembers: [
        { id: "4", name: "Taylor", image: "/placeholder-user.jpg" },
        { id: "5", name: "Jordan", image: "/placeholder-user.jpg" },
      ],
    },
    {
      id: "3",
      name: "EDM Lovers",
      description: "Electronic dance music community",
      members: 15,
      tracks: 67,
      color: "from-purple-500 to-pink-500",
      recentMembers: [
        { id: "6", name: "Casey", image: "/placeholder-user.jpg" },
        { id: "7", name: "Riley", image: "/placeholder-user.jpg" },
        { id: "8", name: "Morgan", image: "/placeholder-user.jpg" },
      ],
    },
    {
      id: "4",
      name: "Classical Appreciation",
      description: "Sharing and discussing classical compositions",
      members: 6,
      tracks: 28,
      color: "from-green-500 to-teal-500",
      recentMembers: [
        { id: "9", name: "Avery", image: "/placeholder-user.jpg" },
        { id: "10", name: "Quinn", image: "/placeholder-user.jpg" },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="spotify-gradient rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold tracking-tight">My Groups</h1>
        <p className="text-lg opacity-90">Manage your music sharing groups.</p>
      </div>

      <div className="flex justify-end">
        <Button className="bg-spotify-green text-white hover:bg-spotify-green/90">
          <UserPlus className="mr-2 h-5 w-5" />
          Create New Group
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="overflow-hidden border-none shadow-lg card-hover"
          >
            <CardHeader
              className={`bg-gradient-to-r ${group.color} text-white`}
            >
              <CardTitle className="text-xl">{group.name}</CardTitle>
              <CardDescription className="text-white/80">
                {group.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-spotify-green" />
                    <p className="font-medium">{group.members} members</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Music className="h-5 w-5 text-spotify-green" />
                    <p className="text-muted-foreground">
                      {group.tracks} tracks
                    </p>
                  </div>
                </div>
                <div className="flex -space-x-3">
                  {group.recentMembers.map((member) => (
                    <Avatar
                      key={member.id}
                      className="border-2 border-white h-10 w-10 shadow-sm"
                    >
                      <AvatarImage
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                      />
                      <AvatarFallback className="bg-spotify-green text-white">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-gray-50 p-4">
              <Button
                className="bg-spotify-green text-white hover:bg-spotify-green/90"
                asChild
              >
                <Link href={`/dashboard/groups/${group.id}`}>
                  <Users className="mr-2 h-4 w-4" />
                  View Group
                </Link>
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
