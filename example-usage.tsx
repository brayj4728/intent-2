"use client"

import VideoPlayer from "./video-player"

export default function VideoPlayerExample() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video Player Example</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Basic Usage</h2>
        <VideoPlayer
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Comp%201-LzI3qwKBXGAe7ueUTlnBibAYq0hYzx.mp4"
          className="w-full aspect-video"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Custom Size</h2>
        <VideoPlayer
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DREAMS-ekMPUBNoPs4q8ppTTRxrzxh6FrcX37.mp4"
          className="w-full max-w-md aspect-video mx-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Muted by Default</h2>
          <VideoPlayer
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Comp%201-LzI3qwKBXGAe7ueUTlnBibAYq0hYzx.mp4"
            muted={true}
            className="w-full aspect-video"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Paused by Default</h2>
          <VideoPlayer
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DREAMS-ekMPUBNoPs4q8ppTTRxrzxh6FrcX37.mp4"
            autoPlay={false}
            className="w-full aspect-video"
          />
        </div>
      </div>
    </div>
  )
}
