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

  // No top fade so the rose bloom is never clipped; gentle bottom + side fades only
  const maskStyle = {
    WebkitMaskImage: [
      'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
      'linear-gradient(to right,  transparent 0%, black 14%, black 86%, transparent 100%)',
    ].join(', '),
    maskImage: [
      'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
      'linear-gradient(to right,  transparent 0%, black 14%, black 86%, transparent 100%)',
    ].join(', '),
    WebkitMaskComposite: 'destination-in' as const,
    maskComposite: 'intersect' as const,
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
