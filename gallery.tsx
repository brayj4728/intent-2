"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Anton } from "next/font/google"

// Componente para el cursor personalizado
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detectar si es un dispositivo móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    if (!isMobile) {
      window.addEventListener("mousemove", updatePosition)
      document.body.addEventListener("mouseleave", handleMouseLeave)
      document.body.addEventListener("mouseenter", handleMouseEnter)
    }

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("resize", checkMobile)
    }
  }, [isVisible, isMobile])

  if (isMobile) return null

  return (
    <div
      className="fixed pointer-events-none z-50 mix-blend-difference"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease, transform 0.1s ease, width 0.3s ease, height 0.3s ease",
      }}
    >
      <motion.div
        className="rounded-full bg-white"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{
          width: "30px",
          height: "30px",
          transition: "transform 0.2s ease-out",
        }}
      />
    </div>
  )
}

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

// Hook mejorado para detectar dispositivos móviles
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallMobile, setIsSmallMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
      setIsMobile(window.innerWidth < 768 || isTouchDevice)
      setIsSmallMobile(window.innerWidth < 480)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return { isMobile, isSmallMobile }
}

// Componente de imagen con efecto de hover tipo NVMBR con nota amarilla
const NvmbrImageEffect = ({
  src,
  alt,
  onClick,
  index,
  noteTitle = "Project",
  noteDescription = "A creative design project with innovative approach and aesthetic appeal.",
  tags = ["Design", "Creative"],
}: {
  src: string
  alt: string
  onClick: () => void
  index: number
  noteTitle?: string
  noteDescription?: string
  tags?: string[]
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { isMobile } = useMobile()

  // En móvil, mostrar la nota amarilla al hacer clic en lugar de hover
  const handleTouchStart = () => {
    if (isMobile) {
      setIsHovered(true)
    }
  }

  const handleTouchEnd = () => {
    if (isMobile) {
      // Mantener la nota visible por un momento antes de ocultarla
      setTimeout(() => {
        setIsHovered(false)
      }, 1500)
    }
  }

  return (
    <div
      className="relative overflow-hidden cursor-pointer w-full h-full"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Imagen principal con optimizaciones */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-500 ${!isLoaded ? "bg-gray-800" : ""}`}
        style={{
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover"
          priority={index < 2}
          loading={index < 2 ? "eager" : "lazy"}
          draggable={false}
          onLoad={() => setIsLoaded(true)}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
        />
      </div>

      {/* Nota amarilla - ajustada para móvil */}
      <motion.div
        className="absolute top-0 left-0 bg-yellow-300 p-2 sm:p-4 w-[140px] xs:w-[180px] sm:w-[240px] z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : -50,
          transition: {
            duration: 0.3,
            ease: [0.43, 0.13, 0.23, 0.96],
          },
        }}
        style={{
          maxWidth: isMobile ? "80%" : undefined,
          fontSize: isMobile ? "0.8rem" : undefined,
        }}
      >
        <h3 className="font-bold text-black text-sm sm:text-lg mb-1 sm:mb-2 truncate">{noteTitle}</h3>
        <p className="text-black text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-3">{noteDescription}</p>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-yellow-400 text-black text-[10px] xs:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Añadir estas funciones para optimizar la carga de videos
const LazyVideo = ({
  src,
  autoPlay = true,
  loop = true,
  muted = true,
  className = "",
  onTimeUpdate,
  onClick,
  videoRef,
}: {
  src: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  className?: string
  onTimeUpdate?: () => void
  onClick?: (e: React.MouseEvent) => void
  videoRef: React.RefObject<HTMLVideoElement>
}) => {
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className={`${className} relative`}>
      {isInView ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          className="w-full h-full object-cover"
          onTimeUpdate={onTimeUpdate}
          onClick={onClick}
          preload="metadata"
        />
      ) : (
        <div className="w-full h-full bg-gray-800 animate-pulse"></div>
      )}
    </div>
  )
}

// Modificar la función principal de Gallery para usar el nuevo componente
export default function Gallery() {
  const { isMobile, isSmallMobile } = useMobile()
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
  const [loadedImages, setLoadedImages] = useState<number[]>([])

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
  const verticalGalleryContentRef = useRef<HTMLDivElement>(null)

  // Referencias para elementos con efecto parallax
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const textSectionRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)

  // Optimización de memoria para videos
  useEffect(() => {
    return () => {
      // Limpiar referencias de video al desmontar
      if (videoRef1.current) {
        videoRef1.current.pause()
        videoRef1.current.src = ""
        videoRef1.current.load()
      }
      if (videoRef2.current) {
        videoRef2.current.pause()
        videoRef2.current.src = ""
        videoRef2.current.load()
      }
    }
  }, [])

  // Configuración del efecto parallax para el contenedor principal
  const { scrollYProgress } = useScroll({
    target: mainContainerRef,
    offset: ["start start", "end start"],
  })

  // Transformaciones para diferentes elementos
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -150, -350])
  const portraitY = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1.25])
  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1.25])

  // Gallery items data - Memoized to prevent unnecessary recalculations
  const galleryItems = [
    {
      id: 1,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/93c9cb209152827.66fadf21db2b0%20%281%29.jpg-yNZmwIfu5oLfLe5zvNYg0KTjL88T3R.jpeg",
      alt: "Besties - Coca Cola y Oreo",
      noteTitle: "Coca-Cola & Oreo",
      noteDescription: "Una colaboración icónica que celebra la amistad entre dos marcas legendarias.",
      tags: ["Branding", "Colaboración"],
    },
    {
      id: 2,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b46930113812687.66ec60e9475be.png-24qLzeQnqTmm1HCq1jBQ13IHYpSmAy.jpeg",
      alt: "Dreams Productions",
      noteTitle: "Dreams Productions",
      noteDescription: "Estudio de producción audiovisual con enfoque en experiencias sensoriales.",
      tags: ["Branding", "Audio", "Visual"],
    },
    {
      id: 3,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/50cb02164000681.63efa2a9cd282-EHMyArqZbD133w6mSiiVwrp9lVB2dY.gif",
      alt: "Colsubsidio",
      noteTitle: "Colsubsidio",
      noteDescription:
        "Manejo de social media, marca para una de las cajas de compensación más importantes de Colombia.",
      tags: ["Social Media"],
    },
    {
      id: 4,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ba3f4a208243573.66eb484aa02e4%20%281%29-uYCauGAhpUoGVoivDjqdFRKu19vLs5.png",
      alt: "Rebeca Beauty",
      noteTitle: "Rebeca Beauty",
      noteDescription: "Marca de belleza que celebra la elegancia y autenticidad en cada detalle.",
      tags: ["Belleza", "Elegancia"],
    },
    {
      id: 5,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/portacocac%20cola.jpg-cIpZT42OkXtlDomwtizt6WlNZdW4iT.jpeg",
      alt: "Coca-Cola LOVE Papa Johns",
      noteTitle: "Coca-Cola & Papa Johns",
      noteDescription: "Campaña que celebra la perfecta combinación de amor y amistad, con estas dos marcas",
      tags: ["Campaña", "Colaboración"],
    },
  ]

  const handleImageClick = (index: number) => {
    setSelectedImage(index)
    setIsVerticalGalleryOpen(true)
    setIsPlaying(true) // Reset play state when opening gallery
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

    // Floating animation
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },

    // Floating animation with slight rotation
    floatWithRotation: {
      y: [0, -15, 0],
      rotate: [-1, 1, -1],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
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

  // Añadir estilos para la animación de flotación
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-15px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      
      @keyframes floatWithRotation {
        0% {
          transform: translateY(0px) rotate(-1deg);
        }
        50% {
          transform: translateY(-15px) rotate(1deg);
        }
        100% {
          transform: translateY(0px) rotate(-1deg);
        }
      }
      
      .float-animation {
        animation: float 4s ease-in-out infinite;
      }
      
      .float-rotation-animation {
        animation: floatWithRotation 5s ease-in-out infinite;
      }
      
      .float-shadow {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        transition: box-shadow 0.3s ease-in-out;
      }
      
      .float-shadow:hover {
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
      }
    `
    style.id = "float-animation-style"
    document.head.appendChild(style)

    return () => {
      const existingStyle = document.getElementById("float-animation-style")
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (isVerticalGalleryOpen && selectedImage !== null) {
      setLoadedImages([selectedImage])

      // Cargar imágenes adicionales después de un retraso
      const timer = setTimeout(() => {
        setLoadedImages([0, 1, 2, 3, 4])
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isVerticalGalleryOpen, selectedImage])

  // Añadir un efecto para prevenir el scroll horizontal en todo el documento
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
    html, body {
      overflow-x: hidden;
      max-width: 100vw;
    }
    * {
      max-width: 100%;
      box-sizing: border-box;
    }
  `
    style.id = "prevent-horizontal-scroll"
    document.head.appendChild(style)

    return () => {
      const existingStyle = document.getElementById("prevent-horizontal-scroll")
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  return (
    <motion.div
      ref={mainContainerRef}
      className="w-full bg-black text-white min-h-screen py-2 px-1 sm:py-8 sm:px-2 md:px-4 relative z-10 overflow-x-hidden"
      style={{
        position: "relative",
        backgroundColor: "#000000",
        paddingBottom: "0", // Eliminado el padding inferior
        minHeight: "100vh",
        marginBottom: "0", // Eliminado el margen inferior
        zIndex: 10, // Añadir un z-index menor que las secciones posteriores
        overflowX: "hidden", // Añadir esta línea
      }}
      whileHover={{
        boxShadow: "0 10px 30px rgba(255, 255, 255, 0.1)",
        transition: { duration: 0.3 },
      }}
    >
      {/* Text Section */}
      <motion.div ref={textSectionRef} className="max-w-7xl mx-auto mb-4 px-2 sm:px-0 overflow-hidden">
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:gap-36">
          <div className="text-white">
            <div className="pt-5 pr-5 pb-5 pl-0 mb-6" style={{ width: "100%" }}>
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">
                <motion.h2
                  className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase text-left ${anton.className} break-words`}
                  style={{
                    fontSize: isSmallMobile ? "32pt" : isMobile ? "40pt" : "70pt",
                    lineHeight: 1.1,
                    letterSpacing: isSmallMobile ? "1px" : "2px",
                    width: "100%",
                    height: "auto",
                    marginBottom: 0,
                    wordBreak: "break-word", // Añadir esta propiedad para evitar que el texto se salga
                    overflowWrap: "break-word", // Añadir esta propiedad como respaldo
                    maxWidth: "100%",
                  }}
                >
                  DISEÑADOR
                  <br />
                  GRÁFICO
                  <motion.div
                    ref={portraitRef}
                    className="inline-block relative ml-4 align-middle"
                    style={{
                      width: isMobile ? "80px" : "110px",
                      height: isMobile ? "80px" : "110px",
                      display: isSmallMobile ? "none" : "inline-block", // Solo ocultar en móviles muy pequeños si es necesario
                    }}
                  >
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A9lqogjw_18lyvpy_88o.jpg-tGxxv1HJLQTn2P2wNuyinYddon3IxE.jpeg"
                      alt="Portrait photograph"
                      width={110}
                      height={110}
                      className="object-cover w-auto h-auto"
                      priority
                    />
                  </motion.div>
                </motion.h2>

                {/* Contenedor del video y botón CV */}
                <div className="relative w-full md:w-[265px] h-[161px] flex items-center justify-end p-[10px]">
                  <div
                    className="relative w-[120px] sm:w-[180px] md:w-[218px] h-[90px] sm:h-[120px] md:h-[141px] overflow-hidden rounded-md"
                    style={{
                      top: isMobile ? "-20px" : "0px",
                      right: isMobile ? "auto" : "0",
                      left: isMobile ? "0" : "auto",
                      marginRight: isMobile ? "auto" : "0",
                      marginLeft: isMobile ? "0" : "auto",
                    }}
                  >
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sin%20ttulo-2-D9Nq26yuN14lZPeaFocKk1j3eRSCoN.mp4"
                        type="video/mp4"
                      />
                      Tu navegador no soporta videos HTML5.
                    </video>
                  </div>

                  {/* Botón CV - Ahora fuera del div del video para mayor visibilidad */}
                  <button
                    className={`w-[149px] h-[35px] bg-[#FF1717] rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-[#e31515] transition-colors ${
                      isMobile ? "mt-[30px] mx-auto" : "absolute left-1/2 transform -translate-x-1/2 bottom-[-60px]"
                    }`}
                    onClick={() =>
                      window.open(
                        "https://dour-law-641.notion.site/Brayan-Rojas-1c7789e20b7b80fdac86e9c96e899cea",
                        "_blank",
                      )
                    }
                    style={{
                      zIndex: 10,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <span className="text-white font-medium text-center">cv</span>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-base sm:text-lg mb-4 px-2 sm:px-0">
              Transformamos ideas en experiencias visuales impactantes. Con un enfoque centrado en el usuario y un
              dominio experto de herramientas de diseño, creamos narrativas visuales que conectan y comunican.
              Creatividad, estrategia y tecnología al servicio de la innovación visual.
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start px-2 sm:px-0">
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
        </div>
      </motion.div>

      {/* Gallery Grid with Parallax Effect */}
      <motion.div
        ref={galleryRef}
        className="max-w-7xl mx-auto relative overflow-visible py-4 sm:py-6 md:py-10 mb-8 sm:mb-12 px-2 sm:px-0"
      >
        {/* Primera fila de la galería con el nuevo efecto */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 xs:gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-3 md:mb-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="aspect-[418/565] relative overflow-hidden">
                <NvmbrImageEffect
                  src={galleryItems[index].image}
                  alt={galleryItems[index].alt}
                  onClick={() => handleImageClick(index)}
                  index={index}
                  noteTitle={galleryItems[index].noteTitle}
                  noteDescription={galleryItems[index].noteDescription}
                  tags={galleryItems[index].tags}
                />
              </div>
            ))}
          </div>

          {/* Segunda fila de la galería */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 xs:gap-3 md:gap-6 mb-4">
            {[3, 4].map((index) => (
              <div key={index} className="aspect-[418/565] relative overflow-hidden">
                <NvmbrImageEffect
                  src={galleryItems[index].image}
                  alt={galleryItems[index].alt}
                  onClick={() => handleImageClick(index)}
                  index={index}
                  noteTitle={galleryItems[index].noteTitle}
                  noteDescription={galleryItems[index].noteDescription}
                  tags={galleryItems[index].tags}
                />
              </div>
            ))}
            {/* Div vacío para mantener la estructura de 3 columnas - oculto en móvil */}
            <div className="hidden sm:block bg-black aspect-[418/565] relative overflow-hidden w-full h-auto opacity-0"></div>
          </div>
        </div>
      </motion.div>

      {/* SVG Definitions for Video Controls */}
      <svg style={{ display: "none" }}>
        <defs>
          <symbol id="volume-high" viewBox="0 0 24 24">
            <path
              d="M14.016 3.234C9.422 5.094 5.25 10.688 5.25 12c0 1.312 4.172 6.906 8.766 8.766.328.14.703.14 1.031 0 .328-.14.703-.469.703-.984V4.219c0-.516-.375-.844-.703-.984-.32-.328-.14-.703-.14-1.031 0z"
              fill="white"
            />
            <path
              d="M3 9v6h2l4 4V5L5 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"
              fill="white"
            />
          </symbol>
          <symbol id="volume-low" viewBox="0 0 24 24">
            <path
              d="M14.016 3.234C9.422 5.094 5.25 10.688 5.25 12c0 1.312 4.172 6.906 8.766 8.766.328.14.703.14 1.031 0 .328-.14.703-.469.703-.984V4.219c0-.516-.375-.844-.703-.984-.32-.328-.14-.703-.14-1.031 0z"
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
          <div className="fixed inset-0 z-50 overflow-hidden" onClick={() => setIsVerticalGalleryOpen(false)}>
            {/* Sliding panel from top */}
            <motion.div
              className="absolute inset-0 overflow-y-auto scrollbar-hide"
              style={{
                backgroundColor: "#1c1c1c",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingBottom: "0", // Padding eliminado
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animations.panel}
            >
              <div
                ref={verticalGalleryContentRef}
                className="relative w-full max-w-7xl mx-auto py-0 px-0 mb-8 md:mb-16 min-h-[90vh]"
                style={{ backgroundColor: "#1c1c1c" }}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <motion.button
                  className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50 bg-white text-black w-10 h-10 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                  onClick={() => setIsVerticalGalleryOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.4 } }}
                >
                  ✕
                </motion.button>

                {/* Vertical Images */}
                <div className="flex flex-col gap-[-1px] w-full">
                  {selectedImage === 0 && loadedImages.includes(0) && (
                    <div className="w-full flex flex-col gap-0">
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/93c9cb209152827.66fadf21db2b0%20%281%29.jpg-yNZmwIfu5oLfLe5zvNYg0KTjL88T3R.jpeg"
                          alt="Besties Por Siempre - Coca Cola y Oreo"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ba333260157367.67aca4081aae4-i0KmGS8RIPPFBn41YyLsvQ2WvE8mYZ.png"
                          alt="Oreo Coca-Cola Special Edition Cookies - Close-up Detail"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2058-fGn6MteNaw65JRvPzj9bdxyn0gcSGW.png"
                          alt="Escanea aquí para entrar en el modo Bestie"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>

                      {/* Nueva imagen 3 - sin efecto hover */}
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20108.jpg-EW64iLS6mTRoXjOB1dw7d1g1R5UFWW.jpeg"
                          alt="Besties Por Siempre - Coca Cola y Oreo Tiempo Limitado"
                          width={1920}
                          height={1080}
                          className="object-contain w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          style={{
                            transform: "scale(1)",
                            maxWidth: "100%",
                            width: "100%",
                            border: "none",
                          }}
                        />
                      </motion.div>

                      {/* Nueva imagen 4 - sin efecto hover */}
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20109.jpg-BOlL8XWmbMqfZFhu7FdQXZ3F5KZSLC.jpeg"
                          alt="Oreo Edición Especial Coca-Cola - Empaque"
                          width={1920}
                          height={1080}
                          className="object-contain w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          style={{
                            transform: "scale(1)",
                            maxWidth: "100%",
                            width: "100%",
                            border: "none",
                          }}
                        />
                      </motion.div>

                      <motion.div
                        className="w-full py-16 px-4 md:px-8"
                        variants={animations.content}
                        style={{ borderBottom: "none" }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-[172px] max-w-7xl mx-auto">
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
                  {selectedImage === 1 && loadedImages.includes(1) && (
                    <>
                      <div className="w-full flex justify-center">
                        <motion.div className="relative w-full aspect-auto">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b46930113812687.66ec60e9475be.png-24qLzeQnqTmm1HCq1jBQ13IHYpSmAy.jpeg"
                            alt="Dreams Productions - Abstract Design"
                            width={1920}
                            height={1080}
                            className="object-cover w-full h-auto transition-opacity duration-500"
                            sizes="(max-width: 768px) 100vw, 100vw"
                            draggable={false}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          />
                        </motion.div>
                      </div>

                      <div className="flex justify-center">
                        <motion.div className="relative w-full aspect-auto">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a7877b113812687.66ec60e94854d.jpg-1wKdPneu3EkNQgTqsOyeBpeetDOluk.jpeg"
                            alt="Dreams Productions - ID Visual Design"
                            width={1920}
                            height={1080}
                            className="object-cover w-full h-auto transition-opacity duration-500"
                            sizes="(max-width: 768px) 100vw, 100vw"
                            draggable={false}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          />
                        </motion.div>
                      </div>

                      <div className="flex justify-center">
                        <motion.div className="relative w-full aspect-auto">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0dca2d113812687.66ec60e947aa5.jpg-rKUsQ9RnurVzEIuCGRKwY6NEUpzy60.jpeg"
                            alt="Dreams Productions - Professional Microphone"
                            width={1920}
                            height={1080}
                            className="object-cover w-full h-auto transition-opacity duration-500"
                            sizes="(max-width: 768px) 100vw, 100vw"
                            draggable={false}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          />
                        </motion.div>
                      </div>

                      <div className="flex justify-center">
                        <motion.div className="relative w-full aspect-auto">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/80c331113812687.66ec60e948c2e%20%281%29.jpg-g86TCFIzBVtp6QEsqOb1kHWahIL7sf.jpeg"
                            alt="Dreams Productions - Wall Installation"
                            width={1920}
                            height={1080}
                            className="object-cover w-full h-auto transition-opacity duration-500"
                            sizes="(max-width: 768px) 100vw, 100vw"
                            draggable={false}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          />
                        </motion.div>
                      </div>

                      <div className="flex justify-center">
                        <motion.div className="relative w-full aspect-auto">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e505cf113812687.66ec60e94989c%20%281%29.jpg-LN9UMiXlH9hPtnvSn2zNKGVFZ4b0Wp.jpeg"
                            alt="Dreams Productions - Marketing Material"
                            width={1920}
                            height={1080}
                            className="object-cover w-full h-auto transition-opacity duration-500"
                            sizes="(max-width: 768px) 100vw, 100vw"
                            draggable={false}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          />
                        </motion.div>
                      </div>

                      <div className="flex justify-center">
                        <motion.div className="relative w-full aspect-auto">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5252f0113812687.66ec60e947ff3%20%281%29.jpg-ZxwhMlQbxpnrBBAK6FDrGBNwUoTtLq.jpeg"
                            alt="Dreams Productions - Headphones Design"
                            width={1920}
                            height={1080}
                            className="object-cover w-full h-auto transition-opacity duration-500"
                            sizes="(max-width: 768px) 100vw, 100vw"
                            draggable={false}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          />
                        </motion.div>
                      </div>

                      <div className="flex justify-center">
                        <motion.div className="relative w-full aspect-auto">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cc250b113812687.66ec60e949dd4%20%281%29.jpg-mwQquCEO12Mw1yo1ArZxxOI6tjd6Ir.jpeg"
                            alt="Dreams Productions - Triptych Detail"
                            width={1920}
                            height={1080}
                            className="object-cover w-full h-auto transition-opacity duration-500"
                            sizes="(max-width: 768px) 100vw, 100vw"
                            draggable={false}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          />
                        </motion.div>
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
                        <LazyVideo
                          videoRef={videoRef1}
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Comp%201-LzI3qwKBXGAe7ueUTlnBibAYq0hYzx.mp4"
                          autoPlay={isPlaying}
                          loop
                          muted={isMuted}
                          className="w-auto h-auto max-w-full"
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
                                [{isPlaying ? "pause" : "play"}]
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Video Controls */}
                        {showControls && activeVideo === 1 && (
                          <div className="video-controls absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 transition-opacity duration-300">
                            <div className="bottom-controls flex items-center justify-between">
                              <div className="left-controls flex items-center">
                                <button
                                  className="p-2 touch-manipulation"
                                  style={{ minWidth: "44px", minHeight: "44px" }}
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
                        <LazyVideo
                          videoRef={videoRef2}
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DREAMS-ekMPUBNoPs4q8ppTTRxrzxh6FrcX37.mp4"
                          autoPlay={isPlaying}
                          loop
                          muted={isMuted}
                          className="w-auto h-auto max-w-full"
                          onTimeUpdate={() => updateProgress(2)}
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePlayPause(2)
                          }}
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
                      <div className="w-full py-16 px-4 md:px-8" style={{ borderBottom: "none" }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-[172px] max-w-7xl mx-auto">
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

                  {selectedImage === 2 && loadedImages.includes(2) && (
                    <div className="w-full flex flex-col items-center gap-0">
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/50cb02164000681.63efa2a9cd282-EHMyArqZbD133w6mSiiVwrp9lVB2dY.gif"
                          alt="Colsubsidio - Con todo lo que te mereces"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9be7bb164000681.63efa2a9ca674-FVnpiN0QvT1VVck4w015aQ36R8rckc.gif"
                          alt="Colsubsidio - Social Media"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4284c7164000681.63efa2a9ce106-EdYDIt0cvigySd7dRepAGWt0QJO4ql.gif"
                          alt="Colsubsidio - Materiales promocionales"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/254e6e164000681.63efa2a9cc460-sBMxm5K9rjOAmC73eGjAChA94IMtAO.gif"
                          alt="Colsubsidio - Subsidio de vivienda nueva y arrendamiento"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div
                        className="w-full py-16 px-4 md:px-8"
                        variants={animations.content}
                        style={{ borderBottom: "none" }}
                      >
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
                              Colsubsidio es más que una marca, es un aliado en cada etapa de la vida. Nos inspiramos en
                              la diversidad de sus servicios y en su compromiso con el bienestar de los colombianos para
                              crear una identidad visual que refleje su esencia.
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
                              Desde campañas publicitarias hasta piezas para redes sociales, nuestro branding busca
                              conectar con el público de manera auténtica y cercana. Cada diseño transmite la calidez y
                              la confianza que caracterizan a Colsubsidio.
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
                              La identidad visual de Colsubsidio se basa en la cercanía y la transparencia. Colores
                              cálidos, tipografías amigables y un estilo visual limpio y moderno reflejan su compromiso
                              con el bienestar de las familias colombianas.
                            </motion.p>
                          </div>
                          <div className="text-white">
                            <h2 className={`text-white text-6xl font-bold ${anton.className}`}>
                              COLSUBSIDIO
                              <br />
                              CON TODO LO QUE
                              <br />
                              TE MERECES
                            </h2>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                  {selectedImage === 3 && loadedImages.includes(3) && (
                    <div className="w-full flex flex-col items-center gap-0">
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ba3f4a208243573.66eb484aa02e4%20%281%29-uYCauGAhpUoGVoivDjqdFRKu19vLs5.png"
                          alt="Rebeca Beauty - Imagen Principal"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      {/* Resto de imágenes de Rebeca Beauty */}
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b87dee208243573.66eb484a9f99a%20%281%29-kZrBtz9QBFa1WE2Qy4VHVabA2zBZr9.png"
                          alt="Rebeca Beauty - Que Es Tu Marca"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1b7b45208243573.66eb484a9ec25%20%281%29-tMdUZ4y8UAUWKPg59WJQDNDbt81Wbm.png"
                          alt="Rebeca Beauty - Espacio de respeto"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/184dba208243573.66eb484a9f2c1%20%281%29-oIhFU1v5X68JcWlKKLGVcnJ0UTNa50.png"
                          alt="Rebeca Beauty - Paleta de colores"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/da5961208243573.66eb484a9a1b9%20%281%29-ZVbCNTeH0VsPUVjkeLQff9CuYQO9gT.png"
                          alt="Rebeca Beauty - Variaciones del logotipo"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0d28eb208243573.66eb484a9c198%20%281%29-1zQ3M4Ny2mfj37r3IAaDfyG1MVuy0i.png"
                          alt="Rebeca Beauty - Tipografías"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/412258208243573.66eb484aa0c4b%20%281%29-EbykRUcR2YUNtfvU1YUEx9fXJUyqQx.png"
                          alt="Rebeca Beauty - El toque de distinción que tu bolso merece"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4582ca208243573.66eb484a9d200-QOZUJxds3cdNn8ogdNyy7VbKkGQCno.png"
                          alt="Rebeca Beauty - Live the Trends, Taste the Creativity - Handbags in tan and red"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </motion.div>

                      <motion.div
                        className="w-full py-16 px-4 md:px-8"
                        variants={animations.content}
                        style={{ borderBottom: "none" }}
                      >
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
                              Rebeca Beauty es una marca que celebra la elegancia y la autenticidad. Nos inspiramos en
                              la belleza natural y en la confianza que surge cuando te sientes bien contigo misma. Cada
                              diseño refleja nuestra pasión por crear accesorios que realzan tu estilo personal.
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
                              Nuestra identidad visual combina sofisticación y accesibilidad. Utilizamos una paleta de
                              colores cálidos y neutros que transmiten elegancia atemporal, complementada con toques de
                              color que aportan personalidad y distinción a cada pieza.
                            </motion.p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                  {selectedImage === 4 && loadedImages.includes(4) && (
                    <div className="w-full flex flex-col items-center gap-0">
                      {/* Imagen 1 - Papa John's y Coca-Cola */}
                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20132.jpg-slZbY2I3VHXkT88nhYj7zwbqTFvq0b.jpeg"
                          alt="Papa John's y Coca-Cola - Mejor combinación. Mejor momento."
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          style={{
                            transform: "scale(1.02)",
                            maxWidth: "100%",
                            width: "100%",
                            border: "none",
                          }}
                        />
                      </motion.div>

                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20133.jpg-GJdH3w2G5J4LamSdmJSam2RntpJle6.jpeg"
                          alt="Coca-Cola LOVE Papa John's - Objetivo Creativo"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          style={{
                            transform: "scale(1.02)",
                            maxWidth: "100%",
                            width: "100%",
                            border: "none",
                          }}
                        />
                      </motion.div>

                      <motion.div className="relative w-full aspect-auto">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20136.jpg-i8jYoc3UGTW6s32kQABOS6yFtOVq4o.jpeg"
                          alt="Coca-Cola y Papa John's - Love Concept Design"
                          width={1920}
                          height={1080}
                          className="object-cover w-full h-auto transition-opacity duration-500"
                          sizes="(max-width: 768px) 100vw, 100vw"
                          draggable={false}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                          style={{
                            transform: "scale(1.02)",
                            maxWidth: "100%",
                            width: "100%",
                            border: "none",
                          }}
                        />
                      </motion.div>

                      <motion.div
                        className="w-full bg-black p-8 flex flex-col md:flex-row justify-between items-center gap-8"
                        variants={animations.content}
                        style={{
                          transform: "scale(1.02)",
                          maxWidth: "100%",
                          width: "100%",
                          minHeight: "600px",
                          borderBottom: "none",
                        }}
                      >
                        {/* Frame izquierdo - Video TikTok */}
                        <div className="bg-white p-2 w-full md:w-[409px] h-[712px] max-w-full flex items-center justify-center">
                          <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden">
                            <video
                              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tiktok-4lT1UeNvqwyq6pkaj19Siq6aj7xDKn.mp4"
                              className="w-full h-full object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                              controls={false}
                            />
                          </div>
                        </div>

                        {/* Frame derecho - Imagen promocional Papa John's y Coca-Cola */}
                        <div className="bg-white p-2 w-full md:w-[379px] h-[470px] max-w-full">
                          <div className="w-full h-full overflow-hidden">
                            <Image
                              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/485366195_1065606008927030_2275402115682916533_n%20%281%29%201.jpg-zGkO568ne8ghrhCvpwrYezRa6srqfu.jpeg"
                              alt="Promoción Papa Lovers - Papa John's y Coca-Cola"
                              width={379}
                              height={470}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="w-full py-16 px-4 md:px-8"
                        variants={animations.content}
                        style={{ borderBottom: "none" }}
                      >
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
                              La colaboración entre Papa John's y Coca-Cola representa la unión perfecta entre dos
                              marcas icónicas. Nos inspiramos en la experiencia compartida de disfrutar una deliciosa
                              pizza con la bebida refrescante por excelencia, creando una campaña que celebra estos
                              momentos de placer y conexión.
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
                              El diseño de esta campaña fusiona los elementos visuales distintivos de ambas marcas,
                              creando una identidad cohesiva que respeta sus esencias individuales. Utilizamos el rojo
                              como color predominante, complementado con elementos gráficos que evocan frescura y sabor.
                            </motion.p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Añadir el cursor personalizado */}
      <CustomCursor />
    </motion.div>
  )
}
