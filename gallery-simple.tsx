"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function GallerySimple() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  // Configuración del efecto parallax
  const { scrollYProgress } = useScroll({
    target: mainContainerRef,
    offset: ["start start", "end start"],
  })

  // Transformaciones basadas en el scroll
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -150, -350])
  const portraitY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100, 250])
  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1.25])

  // Datos de la galería
  const galleryItems = [
    { id: 1, alt: "Proyecto 1" },
    { id: 2, alt: "Proyecto 2" },
    { id: 3, alt: "Proyecto 3" },
    { id: 4, alt: "Proyecto 4" },
    { id: 5, alt: "Proyecto 5" },
    { id: 6, alt: "Proyecto 6" },
  ]

  return (
    <motion.div
      ref={mainContainerRef}
      className="w-full bg-black text-white min-h-screen py-16 px-4 md:px-8 relative z-10"
    >
      {/* Sección de texto */}
      <motion.div className="max-w-7xl mx-auto mb-16" style={{ y: textY }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-36">
          <div className="text-white">
            <motion.h2 className="text-5xl font-bold mb-4" style={{ scale: titleScale }}>
              DESIGNER
              <br />
              GRAPHIC &<br />
              <span className="text-red-600">UX AND UI</span>
            </motion.h2>
            <p className="text-lg mb-4">
              Transformamos ideas en experiencias visuales impactantes. Con un enfoque centrado en el usuario y un
              dominio experto de herramientas de diseño, creamos narrativas visuales que conectan y comunican.
            </p>
            <div className="flex flex-wrap gap-2">
              {/* Iconos de herramientas */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg flex items-center justify-center w-[57px] h-[53px]">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-white flex justify-end">
            <motion.div className="relative w-[300px] h-[290px] bg-gray-700" style={{ y: portraitY }}></motion.div>
          </div>
        </div>
      </motion.div>

      {/* Cuadrícula de la galería */}
      <div className="max-w-7xl mx-auto">
        {/* Primera fila */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 mb-16">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="bg-gray-800 aspect-[418/565] relative overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedImage(index)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">Proyecto {index + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {[3, 4, 5].map((index) => (
            <motion.div
              key={index}
              className="bg-gray-800 aspect-[418/565] relative overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">Proyecto {index + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
