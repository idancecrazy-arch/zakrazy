'use client'
import { useRef } from 'react'

interface Props {
  size?: number
}

export default function BloomingRose({ size = 200 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleMouseEnter() {
    videoRef.current?.play()
  }

  function handleMouseLeave() {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  const maskStyle = {
    WebkitMaskImage: 'radial-gradient(ellipse 72% 78% at 50% 52%, black 25%, rgba(0,0,0,0.6) 48%, transparent 70%)',
    maskImage: 'radial-gradient(ellipse 72% 78% at 50% 52%, black 25%, rgba(0,0,0,0.6) 48%, transparent 70%)',
  }

  return (
    <div
      style={{ width: size, height: size, ...maskStyle }}
      className="cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src="/rose-bloom.mp4"
        muted
        playsInline
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}
