"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useMotionValue, useSpring, useAnimationControls } from "framer-motion"
import Image from "next/image"

interface DragGalleryProps {
  items: {
    id: number
    image: string
    alt: string
  }[]
}

export default function DragGallery({ items }: DragGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Motion values para el arrastre
  const x = useMotionValue(0)
  const controls = useAnimationControls()

  // Calcular los límites de arrastre
  const calculateBounds = () => {
    if (!containerRef.current) return { min: 0, max: 0 }
    const containerWidth = containerRef.current.clientWidth
    const contentWidth = containerRef.current.scrollWidth
    return {
      min: -(contentWidth - containerWidth),
      max: 0,
    }
  }

  // Actualizar dimensiones cuando cambia el tamaño de la ventana
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
        setContentWidth(containerRef.current.scrollWidth)
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [items])

  // Efecto de resorte para movimiento más suave
  const springConfig = { damping: 30, stiffness: 200 }
  const springX = useSpring(x, springConfig)

  // Transformar el cursor durante el arrastre
  const cursorVariants = {
    default: { cursor: "grab" },
    dragging: { cursor: "grabbing" },
  }

  return (
    <div ref={containerRef} className="w-full overflow-hidden relative" style={{ touchAction: "none" }}>
      <motion.div
        className="flex items-center gap-6 py-8"
        drag="x"
        dragConstraints={calculateBounds()}
        style={{ x: springX }}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        variants={cursorVariants}
        initial="default"
        animate={isDragging ? "dragging" : "default"}
        whileTap={{ cursor: "grabbing" }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="min-w-[300px] h-[400px] relative bg-black flex-shrink-0 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.alt}
              fill
              className="object-cover"
              draggable={false}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Indicador de arrastre */}
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
        Arrastra para explorar
      </div>
    </div>
  )
}
