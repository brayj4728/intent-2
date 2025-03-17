"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Anton } from "next/font/google"

// Configurar la fuente Anton
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

// CSS to hide scrollbars
const scrollbarHideStyles = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isVerticalGalleryOpen, setIsVerticalGalleryOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState({ video1: 0, video2: 0 })
  const [duration, setDuration] = useState({ video1: 0, video2: 0 })
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [isPhotoshopHovered, setIsPhotoshopHovered] = useState(false)
  const [isIllustratorHovered, setIsIllustratorHovered] = useState(false)
  const [isDavinciHovered, setIsDavinciHovered] = useState(false)
  const [isAfterEffectsHovered, setIsAfterEffectsHovered] = useState(false)
  const [isFigmaHovered, setIsFigmaHovered] = useState(false)

  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const progressBarRef1 = useRef<HTMLProgressElement>(null)
  const progressBarRef2 = useRef<HTMLProgressElement>(null)
  const seekRef1 = useRef<HTMLInputElement>(null)
  const seekRef2 = useRef<HTMLInputElement>(null)
  const seekTooltipRef1 = useRef<HTMLDivElement>(null)
  const seekTooltipRef2 = useRef<HTMLDivElement>(null)
  const videoContainerRef1 = useRef<HTMLDivElement>(null)
  const videoContainerRef2 = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Referencias para elementos con efecto parallax
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const textSectionRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)

  // Configuración del efecto parallax para el contenedor principal
  const { scrollYProgress } = useScroll({
    target: mainContainerRef,
    offset: ["start start", "end start"],
  })

  // Transformaciones para diferentes elementos
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -150, -350])
  const portraitY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100, 250])
  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1.25])

  // Track mouse position relative to the gallery container
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (galleryRef.current) {
        const rect = galleryRef.current.getBoundingClientRect()
        // Calculate mouse position relative to the gallery container (0 to 1)
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Gallery items data - Memoized to prevent unnecessary recalculations
  const galleryItems = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        image:
          i === 0
            ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/93c9cb209152827.66fadf21db2b0%20%281%29.jpg-yNZmwIfu5oLfLe5zvNYg0KTjL88T3R.jpeg"
            : i === 1
              ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b46930113812687.66ec60e9475be.png-24qLzeQnqTmm1HCq1jBQ13IHYpSmAy.jpeg"
              : `/placeholder.svg?height=800&width=1200`,
        alt: i === 0 ? "Besties - Coca Cola y Oreo" : i === 1 ? "Dreams Productions" : "Rebeca Beauty",
      })),
    [],
  )

  const handleImageClick = (index: number) => {
    setSelectedImage(index)
    setIsVerticalGalleryOpen(true)
    setIsPlaying(true) // Reset play state when opening gallery
  }

  // Calculate parallax transform based on mouse position
  const getParallaxTransform = () => {
    const moveX = (mousePosition.x - 0.5) * 30 // -15px to 15px movement
    const moveY = (mousePosition.y - 0.5) * 30 // -15px to 15px movement
    const rotateX = (mousePosition.y - 0.5) * 5 // -2.5deg to 2.5deg rotation
    const rotateY = (mousePosition.x - 0.5) * -5 // -2.5deg to 2.5deg rotation
    return `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  // Determine how many containers to show based on selected image
  const containerCount = selectedImage === 0 ? 1 : selectedImage === 1 ? 7 : 8

  // Optimized animation variants
  const animations = {
    // Main gallery items animation
    item: {
      hidden: { opacity: 0, y: -60 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.08,
          duration: 0.5,
          ease: [0.25, 1, 0.5, 1],
        },
      }),
    },

    // Sliding panel animation
    panel: {
      hidden: { y: "-100%" },
      visible: {
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      },
      exit: {
        y: "-100%",
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      },
    },

    // Content animation
    content: {
      hidden: { opacity: 0, y: -40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
  }

  // Helper function to determine if a container should show content
  const shouldShowContent = (index: number) => {
    if (selectedImage === 0 && index === 0) return true
    if (selectedImage === 1 && index <= 6) return true
    if (selectedImage === 2 && index === 0) return true
    return false
  }

  const togglePlayPause = (videoNum?: number) => {
    const newIsPlaying = !isPlaying
    setIsPlaying(newIsPlaying)

    if (videoNum === 1 || !videoNum) {
      if (videoRef1.current) {
        if (newIsPlaying) {
          videoRef1.current.play()
        } else {
          videoRef1.current.pause()
        }
      }
    }

    if (videoNum === 2 || !videoNum) {
      if (videoRef2.current) {
        if (newIsPlaying) {
          videoRef2.current.play()
        } else {
          videoRef2.current.pause()
        }
      }
    }
  }

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Update progress bar and current time
  const updateProgress = (videoNum: number) => {
    const videoRef = videoNum === 1 ? videoRef1 : videoRef2
    const progressBarRef = videoNum === 1 ? progressBarRef1 : progressBarRef2
    const seekRef = videoNum === 1 ? seekRef1 : seekRef2

    if (videoRef.current && progressBarRef.current && seekRef.current) {
      const currentTimeValue = videoRef.current.currentTime
      const durationValue = videoRef.current.duration || 0

      // Update progress bar value
      progressBarRef.current.value = currentTimeValue
      progressBarRef.current.max = durationValue

      // Update seek range input
      seekRef.current.value = currentTimeValue.toString()
      seekRef.current.max = durationValue.toString()

      // Update state for time display
      if (videoNum === 1) {
        setCurrentTime((prev) => ({ ...prev, video1: currentTimeValue }))
        if (durationValue && durationValue !== duration.video1) {
          setDuration((prev) => ({ ...prev, video1: durationValue }))
        }
      } else {
        setCurrentTime((prev) => ({ ...prev, video2: currentTimeValue }))
        if (durationValue && durationValue !== duration.video2) {
          setDuration((prev) => ({ ...prev, video2: durationValue }))
        }
      }
    }
  }

  // Seek to a specific time
  const seekTo = (videoNum: number, time: number) => {
    const videoRef = videoNum === 1 ? videoRef1 : videoRef2
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  // Update tooltip position and time on seek bar hover
  const updateSeekTooltip = (videoNum: number, event: React.MouseEvent<HTMLInputElement>) => {
    const seekRef = videoNum === 1 ? seekRef1 : seekRef2
    const seekTooltipRef = videoNum === 1 ? seekTooltipRef1 : seekTooltipRef2
    const videoRef = videoNum === 1 ? videoRef1 : videoRef2

    if (seekRef.current && seekTooltipRef.current && videoRef.current) {
      const rect = seekRef.current.getBoundingClientRect()
      const percent = (event.clientX - rect.left) / rect.width
      const seekTime = percent * videoRef.current.duration

      // Update tooltip position
      seekTooltipRef.current.style.left = `${event.clientX - rect.left}px`

      // Update tooltip text
      seekTooltipRef.current.textContent = formatTime(seekTime)

      // Show tooltip
      seekTooltipRef.current.style.display = "block"
    }
  }

  // Hide seek tooltip
  const hideSeekTooltip = (videoNum: number) => {
    const seekTooltipRef = videoNum === 1 ? seekTooltipRef1 : seekTooltipRef2
    if (seekTooltipRef.current) {
      seekTooltipRef.current.style.display = "none"
    }
  }

  // Toggle mute
  const toggleMute = () => {
    const newMuteState = !isMuted
    setIsMuted(newMuteState)

    if (videoRef1.current) {
      videoRef1.current.muted = newMuteState
    }

    if (videoRef2.current) {
      videoRef2.current.muted = newMuteState
    }
  }

  // Change volume
  const changeVolume = (value: number) => {
    setVolume(value)

    if (videoRef1.current) {
      videoRef1.current.volume = value
    }

    if (videoRef2.current) {
      videoRef2.current.volume = value
    }

    // Update mute state based on volume
    if (value === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = (videoNum: number) => {
    const containerRef = videoNum === 1 ? videoContainerRef1 : videoContainerRef2

    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Effect to sync video playback state when isPlaying changes
  useEffect(() => {
    if (selectedImage === 1) {
      if (isPlaying) {
        videoRef1.current?.play().catch((e) => console.log("Video play error:", e))
        videoRef2.current?.play().catch((e) => console.log("Video play error:", e))
      } else {
        videoRef1.current?.pause()
        videoRef2.current?.pause()
      }
    }
  }, [isPlaying, selectedImage])

  // Effect to handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    // Add global style to hide scrollbars when gallery is open
    if (isVerticalGalleryOpen) {
      const style = document.createElement("style")
      style.textContent = `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `
      style.id = "hide-scrollbar-style"
      document.head.appendChild(style)

      return () => {
        const existingStyle = document.getElementById("hide-scrollbar-style")
        if (existingStyle) {
          existingStyle.remove()
        }
      }
    }
  }, [isVerticalGalleryOpen])

  return (
    <motion.div
      ref={mainContainerRef}
      className="w-full bg-black text-white min-h-screen py-16 px-4 md:px-8 relative z-10 pb-32"
      style={{
        y: useTransform(scrollYProgress, [0, 0.8], [0, -100]),
        translateY: useTransform(scrollYProgress, [0.8, 1], [-100, -100]),
        position: useTransform(scrollYProgress, (pos) => (pos > 0.05 ? "sticky" : "relative")),
        top: 0,
        willChange: "transform, position",
        perspective: "1000px",
        transformStyle: "preserve-3d",
        boxShadow: useTransform(
          scrollYProgress,
          [0, 0.2, 0.8, 1],
          [
            "none",
            "0 20px 50px rgba(0, 0, 0, 0.5)",
            "0 30px 70px rgba(0, 0, 0, 0.7)",
            "0 40px 90px rgba(0, 0, 0, 0.8)",
          ],
        ),
        clipPath: useTransform(scrollYProgress, [0, 1], ["inset(0% 0% 0% 0%)", "inset(0% 0% 15% 0%)"]),
        scale: useTransform(scrollYProgress, [0, 1], [1, 0.95]),
        height: "auto",
        minHeight: "100vh",
        paddingBottom: "8rem",
      }}
    >
      {/* Text Section */}
      <motion.div ref={textSectionRef} className="max-w-7xl mx-auto mb-16" style={{ y: textY }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-36">
          <div className="text-white">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase"
              style={{
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                width: "100%",
                maxWidth: "414px",
                height: "auto",
                marginBottom: 0,
                scale: titleScale,
              }}
            >
              DESIGNER
              <br />
              GRAPHIC &<br />
              <span style={{ color: "#ff0000" }}>UX AND UI</span>
            </motion.h2>
            <p className="text-lg mb-4">
              Transformamos ideas en experiencias visuales impactantes. Con un enfoque centrado en el usuario y un
              dominio experto de herramientas de diseño, creamos narrativas visuales que conectan y comunican.
              Creatividad, estrategia y tecnología al servicio de la innovación visual.
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {/* Photoshop */}
              <motion.div
                className="bg-[#171717] rounded-lg flex items-center justify-center w-[57px] h-[53px]"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setIsPhotoshopHovered(true)}
                onMouseLeave={() => setIsPhotoshopHovered(false)}
              >
                <div className="relative w-[35px] h-[27px]">
                  <Image
                    src={
                      isPhotoshopHovered
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%2020-P0mOZDAVqDABHuNiQo0135JDCvY2xN.png"
                        : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%2010-VOKXpxT57ShvXVqs6PwGpY0FlpusND.png"
                    }
                    alt="Adobe Photoshop"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* Illustrator */}
              <motion.div
                className="bg-[#171717] rounded-lg flex items-center justify-center w-[57px] h-[53px]"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setIsIllustratorHovered(true)}
                onMouseLeave={() => setIsIllustratorHovered(false)}
              >
                <div className="relative w-[36px] h-[31px]">
                  <Image
                    src={
                      isIllustratorHovered
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%202ilustrator-RpHAOZ3qoH95YX07cYszEnRIqs1CEI.png"
                        : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%201ilustrator-HW2nNuLddJMmwVG3WE2aZxR4eQI0GY.png"
                    }
                    alt="Adobe Illustrator"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* DaVinci Resolve */}
              <motion.div
                className="bg-[#171717] rounded-lg flex items-center justify-center w-[57px] h-[53px]"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setIsDavinciHovered(true)}
                onMouseLeave={() => setIsDavinciHovered(false)}
              >
                <div className="relative w-[33px] h-[33px]">
                  <Image
                    src={
                      isDavinciHovered
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%202davinci-gzkw3CXug3xe6jWuxd7Jgup1cHXYg6.png"
                        : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%201davinci-KHqTqhsQtDpyD9rDWtNua33X4SIupm.png"
                    }
                    alt="DaVinci Resolve"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* After Effects */}
              <motion.div
                className="bg-[#171717] rounded-lg flex items-center justify-center w-[57px] h-[53px]"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setIsAfterEffectsHovered(true)}
                onMouseLeave={() => setIsAfterEffectsHovered(false)}
              >
                <div className="relative w-[39px] h-[23px]">
                  <Image
                    src={
                      isAfterEffectsHovered
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%202after-bBV1votul5dXgYxXAChln5R88ZLslv.png"
                        : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%201after-hhaQ6ZzHG9IvbDBU2zuFYjUWj0BupZ.png"
                    }
                    alt="Adobe After Effects"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* Figma */}
              <motion.div
                className="bg-[#171717] rounded-lg flex items-center justify-center w-[57px] h-[53px]"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setIsFigmaHovered(true)}
                onMouseLeave={() => setIsFigmaHovered(false)}
              >
                <div className="relative w-[23px] h-[33px]">
                  <Image
                    src={
                      isFigmaHovered
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%203figma-sdwaLQYDmcwxPrSLru5BTN6qfzCM90.png"
                        : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%204figma-OIJFRzJGvjJEc9UF7kCNXhxadMHAVe.png"
                    }
                    alt="Figma"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>
          </div>
          <div className="text-white flex justify-end">
            <motion.div
              ref={portraitRef}
              className="relative w-full max-w-[300px] h-[290px] mx-auto md:mx-0"
              style={{ y: portraitY }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A9lqogjw_18lyvpy_88o.jpg-tGxxv1HJLQTn2P2wNuyinYddon3IxE.jpeg"
                alt="Portrait photograph"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Gallery Grid with Parallax Effect */}
      <motion.div
        ref={galleryRef}
        className="max-w-7xl mx-auto relative overflow-hidden"
        style={{
          perspective: "1500px",
          transformStyle: "preserve-3d",
          y: useTransform(scrollYProgress, [0, 1], [0, -500]),
          rotateX: useTransform(scrollYProgress, [0, 1], [0, 5]),
          z: useTransform(scrollYProgress, [0, 1], [0, -100]),
        }}
      >
        {/* First row with all images */}
        <div
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-12 mb-8 sm:mb-16"
          style={{
            transform: getParallaxTransform(),
            transition: "transform 0.5s ease-out",
            transformStyle: "preserve-3d",
          }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="bg-black aspect-[418/565] relative overflow-hidden cursor-pointer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={animations.item}
              custom={index}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                transition: { duration: 0.3 },
              }}
              onClick={() => handleImageClick(index)}
            >
              <div className="w-full h-full">
                <Image
                  src={galleryItems[index].image || "/placeholder.svg"}
                  alt={galleryItems[index].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-opacity duration-500"
                  priority
                  draggable={false}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rest of the grid with empty cells */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12"
          style={{
            transform: getParallaxTransform(),
            transition: "transform 0.5s ease-out",
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index + 3}
              className="bg-black aspect-[418/565] relative overflow-hidden cursor-pointer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={animations.item}
              custom={index + 3}
              whileHover={{ scale: 1.02 }}
            />
          ))}
        </div>
      </motion.div>

      {/* SVG Definitions for Video Controls */}
      <svg style={{ display: "none" }}>
        <defs>
          <symbol id="volume-high" viewBox="0 0 24 24">
            <path
              d="M14.016 3.234C9.422 5.094 5.25 10.688 5.25 12c0 1.312 4.172 6.906 8.766 8.766.328.14.703.14 1.031 0 .328-.14.703-.469.703-.984V4.219c0-.516-.375-.844-.703-.984-.328-.14-.703-.14-1.031 0z"
              fill="white"
            />
            <path
              d="M3 9v6h2l4 4V5L5 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"
              fill="white"
            />
          </symbol>
          <symbol id="volume-low" viewBox="0 0 24 24">
            <path
              d="M14.016 3.234C9.422 5.094 5.25 10.688 5.25 12c0 1.312 4.172 6.906 8.766 8.766.328.14.703.14 1.031 0 .328-.14.703-.469.703-.984V4.219c0-.516-.375-.844-.703-.984-.328-.14-.703-.14-1.031 0z"
              fill="white"
            />
            <path
              d="M3 9v6h2l4 4V5L5 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
              fill="white"
            />
          </symbol>
          <symbol id="volume-mute" viewBox="0 0 24 24">
            <path
              d="M14.016 3.234C9.422 5.094 5.25 10.688 5.25 12c0 1.312 4.172 6.906 8.766 8.766.328.14.703.14 1.031 0 .328-.14.703-.469.703-.984V4.219c0-.516-.375-.844-.703-.984-.328-.14-.703-.14-1.031 0z"
              fill="white"
            />
            <path d="M3 9v6h2l4 4V5L5 9H3z" fill="white" />
          </symbol>
          <symbol id="fullscreen" viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="white" />
          </symbol>
          <symbol id="fullscreen-exit" viewBox="0 0 24 24">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="white" />
          </symbol>
        </defs>
      </svg>

      {/* Vertical Scrolling Gallery */}
      <AnimatePresence>
        {isVerticalGalleryOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Sliding panel from top */}
            <motion.div
              className="absolute inset-0 overflow-y-auto scrollbar-hide"
              style={{ backgroundColor: "#1c1c1c" }}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animations.panel}
              onClick={() => setIsVerticalGalleryOpen(false)}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                className="relative w-full max-w-7xl mx-auto py-8 sm:py-12 px-2 sm:px-4 mb-16 min-h-[90vh]"
                style={{ backgroundColor: "#1c1c1c" }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50 bg-white text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                  onClick={() => setIsVerticalGalleryOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.4 } }}
                >
                  ✕
                </motion.button>

                {/* Vertical Images */}
                <div className="flex flex-col gap-0 w-full">
                  {selectedImage === 0 && (
                    <div className="w-full flex flex-col gap-0">
                      <motion.img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/93c9cb209152827.66fadf21db2b0%20%281%29.jpg-yNZmwIfu5oLfLe5zvNYg0KTjL88T3R.jpeg"
                        alt="Besties Por Siempre - Coca Cola y Oreo"
                        className="w-auto h-auto max-w-full"
                        variants={animations.content}
                      />
                      <motion.img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ba333260157367.67aca4081aae4-i0KmGS8RIPPFBn41YyLsvQ2WvE8mYZ.png"
                        alt="Oreo Coca-Cola Special Edition Cookies - Close-up Detail"
                        className="w-auto h-auto max-w-full"
                        variants={animations.content}
                      />
                      <motion.img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2058-fGn6MteNaw65JRvPzj9bdxyn0gcSGW.png"
                        alt="Escanea aquí para entrar en el modo Bestie"
                        className="w-auto h-auto max-w-full bg-black"
                        variants={animations.content}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      />
                      <motion.div className="w-full py-16 px-4 md:px-8" variants={animations.content}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[172px] max-w-7xl mx-auto">
                          <div className="text-white">
                            <motion.div
                              className="border border-white rounded-lg inline-block px-4 py-2 mb-4"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <motion.span
                                className="text-white"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 500, damping: 8 }}
                              >
                                Inspiración
                              </motion.span>
                            </motion.div>
                            <motion.p
                              className="text-[#9d9d9d]"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              La amistad verdadera es inconfundible, como la combinación única de sabores de esta
                              edición especial. Nos inspiramos en los momentos compartidos, en los recuerdos que se
                              crean con cada risa y en la energía vibrante de estar juntos.
                            </motion.p>
                          </div>
                          <div className="text-white">
                            <motion.div
                              className="border border-white rounded-lg inline-block px-4 py-2 mb-4"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <motion.span
                                className="text-white"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 500, damping: 8 }}
                              >
                                Branding
                              </motion.span>
                            </motion.div>
                            <motion.p
                              className="text-[#9d9d9d]"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              Más que una colaboración, esta edición limitada representa una experiencia sensorial. Cada
                              elemento visual refuerza la unión de dos marcas legendarias, combinando nostalgia con un
                              estilo contemporáneo que celebra la amistad sin límites.
                            </motion.p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[172px] max-w-7xl mx-auto mt-16">
                          <div className="text-white">
                            <motion.div
                              className="border border-white rounded-lg inline-block px-4 py-2 mb-4"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <motion.span
                                className="text-white"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 500, damping: 8 }}
                              >
                                Style
                              </motion.span>
                            </motion.div>
                            <motion.p
                              className="text-[#9d9d9d]"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              La diseño de Besties por Siempre fusiona la esencia icónica de Oreo y Coca-Cola en una
                              estética moderna y dinámica. Formas envolventes, tipografías atrevidas y un juego visual
                              en blanco y negro reflejan la conexión entre dos clásicos que se reinventan
                            </motion.p>
                          </div>
                          <div className="text-white flex flex-col items-center">
                            <motion.div
                              className="relative"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Comp%201-gm462ujpMPLMh9AeNlO3pBumA3PmLw.gif"
                                alt="Coca-Cola y Oreo - Besties por Siempre Animated Heart"
                                width={800}
                                height={444}
                                className="object-contain"
                                priority
                              />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {selectedImage === 1 && (
                    <>
                      <div className="w-full flex justify-center">
                        <motion.img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b46930113812687.66ec60e9475be.png-24qLzeQnqTmm1HCq1jBQ13IHYpSmAy.jpeg"
                          alt="Dreams Productions - Abstract Design"
                          className="w-auto h-auto max-w-full"
                          variants={animations.content}
                        />
                      </div>

                      <div className="flex justify-center">
                        <motion.img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a7877b113812687.66ec60e94854d.jpg-1wKdPneu3EkNQgTqsOyeBpeetDOluk.jpeg"
                          alt="Dreams Productions - ID Visual Design"
                          className="w-auto h-auto max-w-full"
                          variants={animations.content}
                        />
                      </div>

                      <div className="flex justify-center">
                        <motion.img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0dca2d113812687.66ec60e947aa5.jpg-rKUsQ9RnurVzEIuCGRKwY6NEUpzy60.jpeg"
                          alt="Dreams Productions - Professional Microphone"
                          className="w-auto h-auto max-w-full"
                          variants={animations.content}
                        />
                      </div>

                      <div className="flex justify-center">
                        <motion.img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/80c331113812687.66ec60e948c2e%20%281%29.jpg-g86TCFIzBVtp6QEsqOb1kHWahIL7sf.jpeg"
                          alt="Dreams Productions - Wall Installation"
                          className="w-auto h-auto max-w-full"
                          variants={animations.content}
                        />
                      </div>

                      <div className="flex justify-center">
                        <motion.img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e505cf113812687.66ec60e94989c%20%281%29.jpg-LN9UMiXlH9hPtnvSn2zNKGVFZ4b0Wp.jpeg"
                          alt="Dreams Productions - Marketing Material"
                          className="w-auto h-auto max-w-full"
                          variants={animations.content}
                        />
                      </div>

                      <div className="flex justify-center">
                        <motion.img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5252f0113812687.66ec60e947ff3%20%281%29.jpg-ZxwhMlQbxpnrBBAK6FDrGBNwUoTtLq.jpeg"
                          alt="Dreams Productions - Headphones Design"
                          className="w-auto h-auto max-w-full"
                          variants={animations.content}
                        />
                      </div>

                      <div className="flex justify-center">
                        <motion.img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cc250b113812687.66ec60e949dd4%20%281%29.jpg-mwQquCEO12Mw1yo1ArZxxOI6tjd6Ir.jpeg"
                          alt="Dreams Productions - Triptych Detail"
                          className="w-auto h-auto max-w-full"
                          variants={animations.content}
                        />
                      </div>

                      <div
                        className="flex justify-center relative"
                        ref={videoContainerRef1}
                        onMouseEnter={() => {
                          setShowControls(true)
                          setActiveVideo(1)
                        }}
                        onMouseLeave={() => {
                          setShowControls(false)
                          setActiveVideo(null)
                        }}
                        onMouseMove={(e) => {
                          if (videoContainerRef1.current) {
                            const rect = videoContainerRef1.current.getBoundingClientRect()
                            setCursorPosition({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            })
                          }
                        }}
                        onTouchStart={() => {
                          setShowControls(true)
                          setActiveVideo(1)
                        }}
                        onTouchEnd={() => {
                          setTimeout(() => {
                            setShowControls(false)
                            setActiveVideo(null)
                          }, 3000)
                        }}
                      >
                        <motion.video
                          ref={videoRef1}
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Comp%201-LzI3qwKBXGAe7ueUTlnBibAYq0hYzx.mp4"
                          autoPlay={isPlaying}
                          loop
                          muted={isMuted}
                          playsInline
                          className="w-auto h-auto max-w-full"
                          variants={animations.content}
                          onTimeUpdate={() => updateProgress(1)}
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePlayPause(1)
                          }}
                        />

                        {/* Play/Pause Button Overlay */}
                        {activeVideo === 1 && (
                          <div
                            className="absolute flex flex-col justify-center items-center z-30 cursor-pointer pointer-events-none"
                            style={{
                              left: `${cursorPosition.x}px`,
                              top: `${cursorPosition.y}px`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <div className="flex flex-col justify-center items-center">
                              {isPlaying ? (
                                <svg
                                  className="mb-4"
                                  width="40"
                                  height="48"
                                  viewBox="0 0 40 48"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect x="8" y="6" width="10" height="36" fill="white" />
                                  <rect x="22" y="6" width="10" height="36" fill="white" />
                                </svg>
                              ) : (
                                <svg
                                  className="mb-4"
                                  width="40"
                                  height="48"
                                  viewBox="0 0 40 48"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M8 6V42L34 24L8 6Z" fill="white" />
                                </svg>
                              )}
                              <span className="text-white uppercase whitespace-nowrap">
                                [ {isPlaying ? "pause" : "play"} ]
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Video Controls */}
                        {showControls && activeVideo === 1 && (
                          <div className="video-controls absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 transition-opacity duration-300">
                            <div className="bottom-controls flex items-center justify-between">
                              <div className="left-controls flex items-center">
                                <button
                                  className="p-2"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    togglePlayPause(1)
                                  }}
                                >
                                  {isPlaying ? (
                                    <svg className="w-4 h-4">
                                      <use href="#volume-high"></use>
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4">
                                      <use href="#volume-mute"></use>
                                    </svg>
                                  )}
                                </button>
                                <div className="time ml-2 text-white text-xs">
                                  <time>{formatTime(currentTime.video1)}</time>
                                  <span> / </span>
                                  <time>{formatTime(duration.video1)}</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className="flex justify-center relative"
                        ref={videoContainerRef2}
                        onMouseEnter={() => {
                          setShowControls(true)
                          setActiveVideo(2)
                        }}
                        onMouseLeave={() => {
                          setShowControls(false)
                          setActiveVideo(null)
                        }}
                        onMouseMove={(e) => {
                          if (videoContainerRef2.current) {
                            const rect = videoContainerRef2.current.getBoundingClientRect()
                            setCursorPosition({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            })
                          }
                        }}
                        onTouchStart={() => {
                          setShowControls(true)
                          setActiveVideo(2)
                        }}
                        onTouchEnd={() => {
                          setTimeout(() => {
                            setShowControls(false)
                            setActiveVideo(null)
                          }, 3000)
                        }}
                      >
                        <motion.video
                          ref={videoRef2}
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DREAMS-ekMPUBNoPs4q8ppTTRxrzxh6FrcX37.mp4"
                          autoPlay={isPlaying}
                          loop
                          muted={isMuted}
                          playsInline
                          controls={false}
                          className="w-auto h-auto max-w-full"
                          variants={animations.content}
                          onTimeUpdate={() => updateProgress(2)}
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePlayPause(2)
                          }}
                          // Figma design data
                          // {
                          //   "id": "256:94",
                          //   "name": "Frame 57",
                          //   "type": "FRAME",
                          //   "x": 144,
                          //   "y": 5100,
                          //   "width": 1712,
                          //   "height": 514,
                          //   "relativeTransform": [
                          //     [
                          //       1,
                          //       0,
                          //       144
                          //     ],
                          //     [
                          //       0,
                          //       1,
                          //       5100
                          //     ]
                          //   ],
                          //   "constraints": {
                          //     "horizontal": "MIN",
                          //     "vertical": "MIN"
                          //   },
                          //   "fills": [],
                          //   "strokes": [],
                          //   "strokeWeight": 1,
                          //   "cornerRadius": 0,
                          //   "effects": [],
                          //   "blendMode": "PASS_THROUGH",
                          //   "layoutAlign": "INHERIT",
                          //   "layoutGrow": 0,
                          //   "layoutMode": "HORIZONTAL",
                          //   "itemSpacing": 241,
                          //   "children": [
                          //     {
                          //       "id": "256:84",
                          //       "name": "Frame 53",
                          //       "type": "FRAME",
                          //       "x": 0,
                          //       "y": 0,
                          //       "width": 704,
                          //       //           "opacity": 1,
                          //           "blendMode": "NORMAL",
                          //           "color": {
                          //             "r": 0.615686297416687,
                          //             "g": 0.615686297416687,
                          //             "b": 0.615686297416687
                          //           },
                          //           "boundVariables": {}
                          //         }
                          //       ],
                          //       "strokes": [],
                          //       "strokeWeight": 1,
                          //       "effects": [],
                          //       "blendMode": "PASS_THROUGH",
                          //       "layoutAlign": "STRETCH",
                          //       "layoutGrow": 0,
                          //       "children": []
                          //     }
                          //   ]
                          // }
                        />

                        {/* Play/Pause Button Overlay */}
                        {activeVideo === 2 && (
                          <div
                            className="absolute flex flex-col justify-center items-center z-30 cursor-pointer pointer-events-none"
                            style={{
                              left: `${cursorPosition.x}px`,
                              top: `${cursorPosition.y}px`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <div className="flex flex-col justify-center items-center">
                              {isPlaying ? (
                                <svg
                                  className="mb-4"
                                  width="40"
                                  height="48"
                                  viewBox="0 0 40 48"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect x="8" y="6" width="10" height="36" fill="white" />
                                  <rect x="22" y="6" width="10" height="36" fill="white" />
                                </svg>
                              ) : (
                                <svg
                                  className="mb-4"
                                  width="40"
                                  height="48"
                                  viewBox="0 0 40 48"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M8 6V42L34 24L8 6Z" fill="white" />
                                </svg>
                              )}
                              <span className="text-white uppercase whitespace-nowrap">
                                [ {isPlaying ? "pause" : "play"} ]
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Video Controls */}
                        {showControls && activeVideo === 2 && (
                          <div className="video-controls absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 transition-opacity duration-300">
                            <div className="bottom-controls flex items-center justify-between">
                              <div className="left-controls flex items-center">
                                <button
                                  className="p-2"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    togglePlayPause(2)
                                  }}
                                >
                                  {isPlaying ? (
                                    <svg className="w-4 h-4">
                                      <use href="#volume-high"></use>
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4">
                                      <use href="#volume-mute"></use>
                                    </svg>
                                  )}
                                </button>
                                <div className="time ml-2 text-white text-xs">
                                  <time>{formatTime(currentTime.video2)}</time>
                                  <span> / </span>
                                  <time>{formatTime(duration.video2)}</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Design Information Section */}
                      <div className="w-full py-16 px-4 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[172px] max-w-7xl mx-auto">
                          <div className="text-white">
                            <motion.div
                              className="border border-white rounded-lg inline-block px-4 py-2 mb-4"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <motion.span
                                className="text-white"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 500, damping: 8 }}
                              >
                                Inspiración
                              </motion.span>
                            </motion.div>
                            <motion.p
                              className="text-[#9d9d9d]"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              Nuestra identidad visual es una fusión entre lo digital y lo sensorial. A través de
                              composiciones abstractas, glitch effects y una paleta de colores intensos, buscamos
                              transmitir la energía cruda del sonido y la luz en movimiento.
                            </motion.p>
                          </div>
                          <div className="text-white">
                            <motion.div
                              className="border border-white rounded-lg inline-block px-4 py-2 mb-4"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <motion.span
                                className="text-white"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 500, damping: 8 }}
                              >
                                Branding
                              </motion.span>
                            </motion.div>
                            <motion.p
                              className="text-[#9d9d9d]"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              Desde carteles y piezas digitales hasta instalaciones físicas, nuestro branding se adapta
                              a múltiples formatos sin perder su esencia. Cada diseño refuerza la experiencia sensorial,
                              integrando elementos gráficos con movimiento y profundidad
                            </motion.p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[172px] max-w-7xl mx-auto mt-16">
                          <div className="text-white">
                            <motion.div
                              className="border border-white rounded-lg inline-block px-4 py-2 mb-4"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <motion.span
                                className="text-white"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 500, damping: 8 }}
                              >
                                Style
                              </motion.span>
                            </motion.div>
                            <motion.p
                              className="text-[#9d9d9d]"
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              DREAMS PRODUCTION está construido sobre un lenguaje dinámico donde el ritmo del audio se
                              convierte en imagen. Formas distorsionadas, tipografías minimalistas y texturas futuristas
                              crean una estética vibrante y en constante evolución.
                            </motion.p>
                          </div>
                          <div className="text-white">
                            <h2 className={`text-white text-6xl font-bold ${anton.className}`}>
                              SOUND
                              <br />
                              DREAMS
                            </h2>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedImage === 2 && (
                    <div className="w-full flex flex-col items-center gap-0">
                      <motion.img
                        src="/placeholder.svg?height=800&width=1200"
                        alt="Rebeca Beauty"
                        className="w-auto h-auto max-w-full"
                        variants={animations.content}
                      />
                      <motion.img
                        src="/placeholder.svg?height=800&width=1200"
                        alt="Rebeca Beauty Brand Story"
                        className="w-auto h-auto max-w-full"
                        variants={animations.content}
                      />
                      <motion.img
                        src="/placeholder.svg?height=800&width=1200"
                        alt="Rebeca Beauty Logo Guidelines"
                        className="w-auto h-auto max-w-full"
                        variants={animations.content}
                      />
                      <motion.img
                        src="/placeholder.svg?height=800&width=1200"
                        alt="Rebeca Beauty Logo Size Guidelines"
                        className="w-auto h-auto max-w-full"
                        variants={animations.content}
                      />
                      <motion.img
                        src="/placeholder.svg?height=800&width=1200"
                        alt="Rebeca Beauty Campaign - The Touch of Distinction"
                        className="w-auto h-auto max-w-full"
                        variants={animations.content}
                      />
                      <motion.img
                        src="/placeholder.svg?height=800&width=1200"
                        alt="Rebeca Beauty Handbag Collection - Live the Trends"
                        className="w-auto h-auto max-w-full"
                        variants={animations.content}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

