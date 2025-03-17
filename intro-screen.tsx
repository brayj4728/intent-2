"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function IntroScreen() {
  const [isVisible, setIsVisible] = useState(true)

  // Ocultar la pantalla de intro después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  // Variantes de animación
  const containerVariants = {
    visible: { opacity: 1 },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial="visible"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="w-full max-w-[1185px] mx-auto px-4 flex flex-col items-center justify-center gap-[43px]">
        <motion.h1
          className="text-white text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          SOMOS NARRADORES HISTORIAS
        </motion.h1>

        <motion.p
          className="text-white text-lg md:text-xl max-w-[653px] text-center"
          initial="hidden"
          animate="visible"
          variants={textVariants}
          transition={{ delay: 0.3 }}
        >
          Me siento cómodo trabajando al ritmo y al coste que se adapta. Trabajo tan duro como usted.
        </motion.p>
      </div>
    </motion.div>
  )
}

