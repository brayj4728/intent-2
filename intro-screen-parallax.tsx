"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function IntroScreenParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [blurAmount, setBlurAmount] = useState(0)

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
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const scrollPercentage = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))

        // Calcular el desenfoque basado en el porcentaje de scroll
        const calculatedBlur = Math.min(8, scrollPercentage * 20)
        setBlurAmount(calculatedBlur)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Llamar inicialmente para establecer el valor correcto

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
  const getLetterBlur = (index: number, baseBlur: number) => {
    // Aplicar diferentes factores de desenfoque según la posición de la letra
    // Usamos una función sinusoidal para crear variación natural
    const factor = 0.3 + 0.7 * Math.abs(Math.sin(index * 0.5))
    return baseBlur * factor
  }

  // Renderizar texto con desenfoque variable
  const renderBlurredText = (text: string, baseBlur: number) => {
    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
          filter: `blur(${baseBlur}px)`,
          WebkitFilter: `blur(${baseBlur}px)`,
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
          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center tracking-tight">
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
          className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center tracking-tight"
          style={{ y: titleY }}
        >
          <div className="mb-2">{renderBlurredText("SOMOS", blurAmount * 0.3)}</div>
          <div className="mb-2">{renderBlurredText("NARRADORES", blurAmount * 0.7)}</div>
          <div>{renderBlurredText("HISTORIAS", blurAmount * 0.4)}</div>
        </motion.div>

        <motion.p className="text-white text-lg md:text-xl text-center max-w-[653px]" style={{ y: subtitleY }}>
          {renderBlurredText(
            "Me siento cómodo trabajando al ritmo y al coste que se adapta. Trabajo tan duro como usted.",
            blurAmount * 0.4,
          )}
        </motion.p>
      </div>
    </div>
  )
}

