"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Anton } from "next/font/google"

// Inicializar la fuente Anton
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export default function IntroScreenParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Configuración del efecto parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Transformaciones basadas en el scroll
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -300])
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Efecto para manejar el scroll y actualizar el desenfoque manualmente

  // Efecto para bloquear el scroll al inicio y liberarlo después
  useEffect(() => {
    setIsMounted(true)

    // Bloquear scroll inicialmente
    document.body.style.overflow = "hidden"

    // Desbloquear después de 1 segundo
    const timer = setTimeout(() => {
      document.body.style.overflow = "auto"
    }, 1000)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "auto"
    }
  }, [])

  // Calcular diferentes niveles de desenfoque para cada letra

  // Renderizar texto con desenfoque variable
  const renderBlurredText = (text: string, baseBlur: number) => {
    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        {text}
      </div>
    )
  }

  if (!isMounted) {
    return (
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
        <div className="flex flex-col items-center justify-center gap-12 px-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-10">
          <h1
            className={`text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center tracking-wide ${anton.className}`}
            style={{ letterSpacing: "0.05em" }}
          >
            SOMOS
            <br />
            NARRADORES
            <br />
            HISTORIAS
          </h1>
          <p className="text-white text-lg md:text-xl text-center max-w-[653px]">
            Me siento cómodo trabajando al ritmo y al coste que se adapta. Trabajo tan duro como usted.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      <div
        className="flex flex-col items-center justify-center gap-12 px-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-10"
        style={{ opacity: opacity.get() }}
      >
        <motion.div
          className={`text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center tracking-wide ${anton.className}`}
          style={{ y: titleY, letterSpacing: "0.05em" }}
        >
          <div className="mb-2">{renderBlurredText("SOMOS", 0)}</div>
          <div className="mb-2">{renderBlurredText("NARRADORES", 0)}</div>
          <div>{renderBlurredText("HISTORIAS", 0)}</div>
        </motion.div>

        <motion.p className="text-white text-lg md:text-xl text-center max-w-[653px]" style={{ y: subtitleY }}>
          {renderBlurredText(
            "Me siento cómodo trabajando al ritmo y al coste que se adapta. Trabajo tan duro como usted.",
            0,
          )}
        </motion.p>
      </div>
    </div>
  )
}
