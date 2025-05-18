"use client"

import { useEffect, useRef, useState } from "react"

export default function RiveAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const animationRef = useRef<any>(null)

  // Load Rive script manually
  useEffect(() => {
    // We don't need the Rive script anymore
    // Just set up any initial state if needed
  }, [])

  // Handle hover state changes
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isHovered])

  return (
    <div
      className="w-full h-[200px] bg-[#1c1c1c] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={containerRef}
    ></div>
  )
}
