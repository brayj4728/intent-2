"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export default function DreamsGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Images data
  const images = [
    { id: 1, src: "/placeholder.svg?height=967&width=1928", alt: "Dream image 1" },
    { id: 2, src: "/placeholder.svg?height=967&width=1928", alt: "Dream image 2" },
    { id: 3, src: "/placeholder.svg?height=967&width=1928", alt: "Dream image 3" },
    { id: 4, src: "/placeholder.svg?height=967&width=1928", alt: "Dream image 4" },
    { id: 5, src: "/placeholder.svg?height=967&width=1928", alt: "Dream image 5" },
  ]

  // Parallax effect values, calculated outside the map function
  const parallaxYValues = images.map((_, index) => {
    return useTransform(scrollYProgress, [0, 1], [index * -20, index * 20])
  })

  return (
    <div ref={containerRef} className="w-full bg-black text-white">
      {/* Images Section */}
      <div className="flex flex-col gap-[45px] w-full max-w-[1928px] mx-auto">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="w-full h-auto aspect-[1928/967] relative bg-[#ff0202]"
            style={{ y: parallaxYValues[index] }}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index < 2}
            />
          </motion.div>
        ))}
      </div>

      {/* Text Section */}
      <div className="w-full max-w-[1928px] mx-auto py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[172px]">
          <div className="text-white">
            <p className="text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac
              aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
              himenaeos.
            </p>
          </div>
          <div className="text-white">
            <p className="text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac
              aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
              himenaeos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
