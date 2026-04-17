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
    WebkitMaskImage: [
      'linear-gradient(to bottom, transparent 0%, black 10%, black 78%, transparent 100%)',
      'linear-gradient(to right,  transparent 0%, black 10%, black 90%, transparent 100%)',
    ].join(', '),
    maskImage: [
      'linear-gradient(to bottom, transparent 0%, black 10%, black 78%, transparent 100%)',
      'linear-gradient(to right,  transparent 0%, black 10%, black 90%, transparent 100%)',
    ].join(', '),
    WebkitMaskComposite: 'destination-in' as const,
    maskComposite: 'intersect' as const,
  }

  return (
    <div
      style={{ width: size, height: Math.round(size * 1.35), ...maskStyle }}
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
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
      />
    </div>
  )
}
