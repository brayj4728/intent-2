"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Anton } from "next/font/google"

// Inicializar la fuente Anton
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export default function DesignDiary() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Configuración del efecto de scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Transformación para el contenido - optimizada para menos cálculos
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0], {
    clamp: true,
  })
  const contentY = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [50, 0, 0, -50], {
    clamp: true,
  })

  useEffect(() => {
    // Implementar Intersection Observer para cargar el video solo cuando sea visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.play().catch((err) => {
                console.log("La reproducción automática del video fue impedida:", err)
              })
            }
            // Desconectar el observer después de iniciar la reproducción
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }, // Iniciar reproducción cuando al menos 10% del video es visible
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      observer.disconnect()
      // Detener y liberar recursos del video al desmontar
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ""
        videoRef.current.load()
      }
    }
  }, [])

  // Añadir estilos para ocultar la barra de scroll
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
    video::-webkit-scrollbar {
      width: 0 !important;
      display: none;
    }
    video {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full py-16 px-4 md:px-8 overflow-hidden z-20"
      style={{
        backgroundColor: "#ff0000",
        minHeight: "100vh",
        position: "relative",
        isolation: "isolate",
        marginTop: "-50px",
        marginBottom: "-1px",
        maxWidth: "100vw", // Añadir esta línea
        overflowX: "hidden", // Añadir esta línea
      }}
    >
      {/* Capa de fondo sólido para asegurar que nada se vea detrás */}
      <div className="absolute inset-0 bg-[#ff0000] -z-10"></div>
      <motion.div
        className="max-w-7xl mx-auto flex flex-col items-center gap-12 relative z-10"
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
      >
        {/* Primera frase */}
        <div className="w-full flex flex-col items-center gap-4">
          <h1
            className={`text-white text-5xl md:text-7xl lg:text-8xl font-bold text-center ${anton.className}`}
            style={{ letterSpacing: "0.15em" }}
          >
            ATENCIÓN
          </h1>
          <h2
            className={`text-white text-3xl md:text-5xl lg:text-6xl font-bold text-center ${anton.className}`}
            style={{ letterSpacing: "0.15em" }}
          >
            DIARIO DE DISEÑO
          </h2>
        </div>

        {/* Video */}
        <div className="w-full max-w-xl mx-auto overflow-hidden">
          {" "}
          {/* Añadir overflow-hidden */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover scrollbar-hide"
              loop
              muted
              playsInline
              controls
              preload="metadata"
              poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/poster-eye-animation-placeholder.jpg"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              controlsList="nodownload"
            >
              <source
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/animacion%20principal%20del%20ojo_12_2-5NToifzAKpxaA5dKsKqabQrCcZJipW.mp4"
                type="video/mp4"
              />
              Tu navegador no soporta videos HTML5.
            </video>
          </div>
        </div>

        {/* Segunda frase */}
        <div className="w-full flex flex-col items-center gap-8 mt-4">
          <h2
            className={`text-white text-4xl md:text-6xl font-bold text-center ${anton.className}`}
            style={{ letterSpacing: "0.15em" }}
          >
            EN PROCESO
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <p className="text-white text-lg md:text-xl text-center">Los Diseños en los que he trabajado</p>
            <span className={`text-white text-3xl md:text-5xl font-bold ${anton.className}`}>&</span>
            <p className="text-white text-lg md:text-xl text-center">Sus procesos sigue desplazandote</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
