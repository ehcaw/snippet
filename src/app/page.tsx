import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music, Users, Upload, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Music className="h-6 w-6" />
              <span className="font-bold">MusicShare</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Share Your Music Collection
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create groups, upload your local music files, and share them
                    with friends. Perfect for Spotify local files and personal
                    collections.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2 rounded-lg border p-6">
                    <Users className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">Create Groups</h3>
                    <p className="text-muted-foreground">
                      Form music sharing circles with friends, family, or fellow
                      music enthusiasts.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border p-6">
                    <Upload className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">Upload Music</h3>
                    <p className="text-muted-foreground">
                      Share your MP3/MP4 files securely with your groups.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border p-6">
                    <Play className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">Stream Anywhere</h3>
                    <p className="text-muted-foreground">
                      Listen to shared music directly in the app on any device.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border p-6">
                    <Music className="h-12 w-12 text-primary" />
                    <h3 className="text-xl font-bold">Discover Music</h3>
                    <p className="text-muted-foreground">
                      Find new music through your friends`&apos` collections.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 MusicShare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
