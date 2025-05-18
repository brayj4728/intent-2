"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface VideoPlayerProps {
  src: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  className?: string
}

export default function VideoPlayer({
  src,
  autoPlay = true,
  loop = true,
  muted = false,
  className = "w-full",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLProgressElement>(null)
  const seekRef = useRef<HTMLInputElement>(null)
  const seekTooltipRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  // Toggle play/pause
  const togglePlayPause = () => {
    const newIsPlaying = !isPlaying
    setIsPlaying(newIsPlaying)

    if (videoRef.current) {
      if (newIsPlaying) {
        videoRef.current.play().catch((e) => console.log("Video play error:", e))
      } else {
        videoRef.current.pause()
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
  const updateProgress = () => {
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
      setCurrentTime(currentTimeValue)
      if (durationValue && durationValue !== duration) {
        setDuration(durationValue)
      }
    }
  }

  // Seek to a specific time
  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  // Update tooltip position and time on seek bar hover
  const updateSeekTooltip = (event: React.MouseEvent<HTMLInputElement>) => {
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
  const hideSeekTooltip = () => {
    if (seekTooltipRef.current) {
      seekTooltipRef.current.style.display = "none"
    }
  }

  // Toggle mute
  const toggleMute = () => {
    const newMuteState = !isMuted
    setIsMuted(newMuteState)

    if (videoRef.current) {
      videoRef.current.muted = newMuteState
    }
  }

  // Change volume
  const changeVolume = (value: number) => {
    setVolume(value)

    if (videoRef.current) {
      videoRef.current.volume = value
    }

    // Update mute state based on volume
    if (value === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

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

  // Effect to sync video playback state when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play().catch((e) => console.log("Video play error:", e))
    } else {
      videoRef.current?.pause()
    }
  }, [isPlaying])

  return (
    <div
      ref={videoContainerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onMouseMove={(e) => {
        if (videoContainerRef.current) {
          const rect = videoContainerRef.current.getBoundingClientRect()
          setCursorPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          })
        }
      }}
      onTouchStart={() => setShowControls(true)}
      onTouchEnd={() => {
        setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }}
    >
      <motion.video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onTimeUpdate={updateProgress}
        onClick={(e) => {
          e.stopPropagation()
          togglePlayPause()
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration)
          }
        }}
      />

      {/* Play/Pause Button Overlay */}
      {showControls && (
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
            <span className="text-white uppercase whitespace-nowrap">[{isPlaying ? "pause" : "play"}]</span>
          </div>
        </div>
      )}

      {/* Video Controls */}
      {showControls && (
        <div className="video-controls absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 transition-opacity duration-300">
          {/* Progress Bar */}
          <div
            className="progress-container w-full h-1 bg-gray-600 mb-2 cursor-pointer"
            onClick={(e) => {
              if (videoContainerRef.current) {
                const rect = e.currentTarget.getBoundingClientRect()
                const pos = (e.clientX - rect.left) / rect.width
                if (videoRef.current) {
                  videoRef.current.currentTime = pos * videoRef.current.duration
                }
              }
            }}
          >
            <progress
              ref={progressBarRef}
              className="w-full h-full appearance-none [&::-webkit-progress-bar]:bg-gray-600 [&::-webkit-progress-value]:bg-white [&::-moz-progress-bar]:bg-white"
              max={100}
              value={0}
            />
          </div>

          {/* Seek Bar (hidden but functional) */}
          <input
            ref={seekRef}
            type="range"
            className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
            min="0"
            max="100"
            step="0.1"
            value={currentTime}
            onChange={(e) => seekTo(Number.parseFloat(e.target.value))}
            onMouseMove={updateSeekTooltip}
            onMouseLeave={hideSeekTooltip}
          />

          {/* Seek Tooltip */}
          <div
            ref={seekTooltipRef}
            className="absolute top-[-25px] transform translate-x-[-50%] bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded hidden"
          >
            00:00
          </div>

          <div className="bottom-controls flex items-center justify-between">
            <div className="left-controls flex items-center">
              {/* Play/Pause Button */}
              <button
                className="p-2 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlayPause()
                }}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16" fill="white" />
                    <rect x="14" y="4" width="4" height="16" fill="white" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" fill="white" />
                  </svg>
                )}
              </button>

              {/* Volume Button */}
              <button
                className="p-2 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMute()
                }}
              >
                {isMuted ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path
                      d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path
                      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                      fill="white"
                    />
                  </svg>
                )}
              </button>

              {/* Time Display */}
              <div className="time ml-2 text-white text-xs">
                <time>{formatTime(currentTime)}</time>
                <span> / </span>
                <time>{formatTime(duration)}</time>
              </div>
            </div>

            <div className="right-controls">
              {/* Fullscreen Button */}
              <button
                className="p-2 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFullscreen()
                }}
              >
                {isFullscreen ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path
                      d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path
                      d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                      fill="white"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
