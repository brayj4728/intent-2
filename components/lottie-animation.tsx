"use client"

import { useState, useEffect } from "react"
import Lottie from "react-lottie-player"

export default function LottieAnimation() {
  const [animationData, setAnimationData] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Fetch the Lottie JSON data
    fetch("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sin%20ttulo-2-zOHsqKE3Ls2GPrrMhpdGM7wUYZs4RJ.json")
      .then((response) => response.json())
      .then((data) => {
        setAnimationData(data)
      })
      .catch((error) => {
        console.error("Error loading Lottie animation:", error)
      })
  }, [])

  if (!animationData) {
    return null // Don't render anything until animation data is loaded
  }

  return (
    <div
      className="w-full h-[200px] overflow-hidden"
      onMouseEnter={() => setIsPlaying(true)}
      onMouseLeave={() => setIsPlaying(false)}
    >
      <Lottie loop animationData={animationData} play={isPlaying} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
