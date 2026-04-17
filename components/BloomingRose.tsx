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

  return (
    <div
      style={{ width: size, height: size }}
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
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  )
}
