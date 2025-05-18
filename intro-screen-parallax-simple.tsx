"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function IntroScreenParallaxSimple() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Configuración del efecto parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Transformaciones basadas en el scroll
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -300])
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 6])

  // Efecto para bloquear el scroll al inicio y liberarlo después
  useEffect(() => {
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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: "100vh", backgroundColor: "#000000" }}
    >
      <motion.div
        className="flex flex-col items-center justify-center gap-12 px-4"
        style={{
          opacity,
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
        }}
      >
        <motion.h1
          className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center tracking-tight"
          style={{
            y: titleY,
            filter: `blur(${blur}px)`,
            lineHeight: 1,
            maxWidth: "1185px",
          }}
        >
          SOMOS
          <br />
          NARRADORES
          <br />
          HISTORIAS
        </motion.h1>

        <motion.p
          className="text-white text-lg md:text-xl text-center max-w-[653px]"
          style={{
            y: subtitleY,
            filter: `blur(${blur}px)`,
          }}
        >
          Me siento cómodo trabajando al ritmo y al coste que se adapta. Trabajo tan duro como usted.
        </motion.p>
      </motion.div>
    </div>
  )
}
