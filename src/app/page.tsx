import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music, Users, Upload, Play } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/music.svg" alt="Music Icon" width={24} height={24} />
              <span className="font-bold">Snipit</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-zinc-800"
                >
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 z-0"></div>
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-[#1DB954]/10 blur-3xl z-0"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl z-0"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Share Your Music{" "}
                    <span className="text-[#1DB954]">Collection</span>
                  </h1>
                  <p className="max-w-[600px] text-zinc-400 md:text-xl">
                    Create groups, upload your local music files, and share them
                    with friends. Perfect for Spotify local files and personal
                    collections.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register" className="w-full min-[400px]:w-auto">
                    <Button
                      size="lg"
                      className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90 text-black"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/explore" className="w-full min-[400px]:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-zinc-700 text-black hover:bg-zinc-800"
                    >
                      Explore
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex items-center space-x-4 text-sm text-zinc-400"></div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900">
                    <Users className="h-12 w-12 text-[#1DB954]" />
                    <h3 className="text-xl font-bold">Create Groups</h3>
                    <p className="text-zinc-400">
                      Form music sharing circles with friends, family, or fellow
                      music enthusiasts.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900">
                    <Upload className="h-12 w-12 text-[#1DB954]" />
                    <h3 className="text-xl font-bold">Upload Music</h3>
                    <p className="text-zinc-400">
                      Share your MP3/MP4 files securely with your groups.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900">
                    <Play className="h-12 w-12 text-[#1DB954]" />
                    <h3 className="text-xl font-bold">Use for Spotify</h3>
                    <p className="text-zinc-400">
                      Upload to Spotify as a local file to integrate with your
                      existing playlists.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900">
                    <Music className="h-12 w-12 text-[#1DB954]" />
                    <h3 className="text-xl font-bold">Discover Music</h3>
                    <p className="text-zinc-400">
                      Find new music through your friends&apos; collections.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
        </section>

        <section className="w-full py-12 bg-zinc-900/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to share your music?
                </h2>
                <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
                  Join thousands of music enthusiasts who are already sharing
                  their collections.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-black"
                  >
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-zinc-800 py-6 md:py-0 bg-black">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center space-x-2">
            <Music className="h-5 w-5 text-[#1DB954]" />
            <span className="font-semibold">Snipit</span>
          </div>
          <p className="text-center text-sm leading-loose text-zinc-400 md:text-left">
            © 2025 Snipit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
