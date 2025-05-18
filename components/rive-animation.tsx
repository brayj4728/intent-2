"use client"

import { useRef, useState } from "react"
import { useRive } from "@rive-app/react-canvas"

export default function RiveAnimation({ rivFile }: { rivFile: string }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Usar el hook useRive para cargar y controlar la animación
  const { RiveComponent, rive } = useRive({
    src: rivFile,
    autoplay: true,
    onLoad: () => setIsLoaded(true),
    onLoadError: (e) => console.error("Error cargando animación Rive:", e),
  })

  return (
    <div ref={containerRef} className="w-full h-[200px] overflow-hidden">
      {isLoaded ? (
        <RiveComponent className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#1c1c1c]">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
