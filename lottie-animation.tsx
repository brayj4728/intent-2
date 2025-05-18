"use client"

import { useState, useEffect } from "react"
import Lottie from "react-lottie-player"

const LottieAnimation = () => {
  const [animationData, setAnimationData] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnimationData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sin%20ttulo-2-zOHsqKE3Ls2GPrrMhpdGM7wUYZs4RJ.json",
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch animation data: ${response.status}`)
        }

        const data = await response.json()
        setAnimationData(data)
      } catch (err) {
        console.error("Error loading Lottie animation:", err)
        setError(err instanceof Error ? err.message : "Unknown error loading animation")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnimationData()
  }, [])

  if (isLoading) {
    return <div className="w-full h-[200px] bg-[#1c1c1c]" />
  }

  if (error || !animationData) {
    return <div className="w-full h-[200px] bg-[#1c1c1c]" />
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

export default LottieAnimation
