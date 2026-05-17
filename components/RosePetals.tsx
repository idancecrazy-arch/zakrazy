'use client'

const PETALS = [
  { color: '#EBD2C8', delay: 0,    duration: 9,  left: 8,   drift: 30,  spin: 300, size: 14 },
  { color: '#C8B9D2', delay: 0.8,  duration: 11, left: 18,  drift: -25, spin: 420, size: 10 },
  { color: '#EBD2C8', delay: 1.5,  duration: 8,  left: 30,  drift: 20,  spin: 240, size: 12 },
  { color: '#C8B9D2', delay: 2.2,  duration: 10, left: 42,  drift: -35, spin: 360, size: 16 },
  { color: '#EBD2C8', delay: 0.3,  duration: 12, left: 55,  drift: 25,  spin: 480, size: 9  },
  { color: '#C8B9D2', delay: 3.1,  duration: 9,  left: 65,  drift: -20, spin: 300, size: 13 },
  { color: '#EBD2C8', delay: 1.8,  duration: 11, left: 75,  drift: 35,  spin: 390, size: 11 },
  { color: '#C8B9D2', delay: 4.0,  duration: 8,  left: 85,  drift: -30, spin: 270, size: 15 },
  { color: '#EBD2C8', delay: 2.6,  duration: 10, left: 92,  drift: 15,  spin: 450, size: 10 },
  { color: '#C8B9D2', delay: 0.5,  duration: 13, left: 12,  drift: -18, spin: 330, size: 14 },
  { color: '#EBD2C8', delay: 3.7,  duration: 9,  left: 22,  drift: 28,  spin: 210, size: 12 },
  { color: '#C8B9D2', delay: 1.2,  duration: 10, left: 38,  drift: -22, spin: 360, size: 9  },
  { color: '#EBD2C8', delay: 5.0,  duration: 11, left: 50,  drift: 32,  spin: 540, size: 16 },
  { color: '#C8B9D2', delay: 2.9,  duration: 8,  left: 60,  drift: -28, spin: 280, size: 11 },
  { color: '#EBD2C8', delay: 4.4,  duration: 12, left: 70,  drift: 18,  spin: 420, size: 13 },
  { color: '#C8B9D2', delay: 0.9,  duration: 9,  left: 80,  drift: -33, spin: 360, size: 10 },
  { color: '#EBD2C8', delay: 3.3,  duration: 11, left: 90,  drift: 24,  spin: 300, size: 14 },
  { color: '#C8B9D2', delay: 1.6,  duration: 10, left: 5,   drift: -20, spin: 480, size: 12 },
  { color: '#EBD2C8', delay: 5.5,  duration: 9,  left: 28,  drift: 36,  spin: 240, size: 9  },
  { color: '#C8B9D2', delay: 2.1,  duration: 12, left: 48,  drift: -16, spin: 390, size: 15 },
  { color: '#EBD2C8', delay: 4.8,  duration: 8,  left: 62,  drift: 22,  spin: 330, size: 11 },
  { color: '#C8B9D2', delay: 0.7,  duration: 11, left: 72,  drift: -26, spin: 450, size: 13 },
  { color: '#EBD2C8', delay: 3.5,  duration: 10, left: 83,  drift: 30,  spin: 270, size: 10 },
  { color: '#C8B9D2', delay: 6.0,  duration: 9,  left: 95,  drift: -14, spin: 360, size: 16 },
]

export default function RosePetals() {
  return (
    <>
      <style>{`
        @keyframes petal-fall {
          0%   { transform: translateY(-8vh) translateX(0) rotate(0deg); opacity: 0; }
          8%   { opacity: 0.75; }
          88%  { opacity: 0.55; }
          100% { transform: translateY(108vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
        }
        .petal {
          position: fixed;
          top: 0;
          pointer-events: none;
          will-change: transform, opacity;
          animation: petal-fall var(--dur) ease-in-out var(--delay) infinite;
        }
      `}</style>
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {PETALS.map((p, i) => (
          <svg
            key={i}
            className="petal"
            style={{
              left: `${p.left}%`,
              '--dur': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              '--drift': `${p.drift}px`,
              '--spin': `${p.spin}deg`,
            } as React.CSSProperties}
            width={p.size}
            height={p.size * 1.4}
            viewBox="0 0 10 14"
            fill={p.color}
            opacity="0.8"
          >
            <ellipse cx="5" cy="7" rx="4" ry="6" />
          </svg>
        ))}
      </div>
    </>
  )
}
