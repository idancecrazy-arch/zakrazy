'use client'

import { useState, useCallback } from 'react'
import GameProgress from './GameProgress'
import IntroScene from './scenes/IntroScene'
import LawSchoolScene from './scenes/LawSchoolScene'
import SnorkelingScene from './scenes/SnorkelingScene'
import AdoptionScene from './scenes/AdoptionScene'
import FinaleScene from './scenes/FinaleScene'

type Scene = 'intro' | 'law-school' | 'snorkeling' | 'adoption' | 'finale'

const SCENE_ORDER: Scene[] = ['intro', 'law-school', 'snorkeling', 'adoption', 'finale']

function sceneToCompleted(scene: Scene): number {
  const idx = SCENE_ORDER.indexOf(scene)
  return Math.max(0, idx - 1)
}

export default function WeddingGame() {
  const [scene, setScene] = useState<Scene>('intro')
  const [key, setKey] = useState(0) // force remount of scenes on replay

  const advance = useCallback((to: Scene) => {
    setScene(to)
  }, [])

  const restart = useCallback(() => {
    setKey(k => k + 1)
    setScene('intro')
  }, [])

  const scenesCompleted = sceneToCompleted(scene)

  return (
    <div className="flex flex-col gap-6">
      {/* Scene card */}
      <div
        className="rounded-2xl border p-6 sm:p-8"
        style={{
          background: '#FAF5EB',
          borderColor: '#C3AF82',
          minHeight: 320,
          boxShadow: '0 4px 24px rgba(90,80,68,0.10)',
        }}
      >
        {scene === 'intro' && (
          <IntroScene key={`intro-${key}`} onStart={() => advance('law-school')} />
        )}
        {scene === 'law-school' && (
          <LawSchoolScene key={`law-${key}`} onComplete={() => advance('snorkeling')} />
        )}
        {scene === 'snorkeling' && (
          <SnorkelingScene key={`snork-${key}`} onComplete={() => advance('adoption')} />
        )}
        {scene === 'adoption' && (
          <AdoptionScene key={`adopt-${key}`} onComplete={() => advance('finale')} />
        )}
        {scene === 'finale' && (
          <FinaleScene key={`finale-${key}`} onRestart={restart} />
        )}
      </div>

      {/* Progress board — hide on intro */}
      {scene !== 'intro' && (
        <GameProgress scenesCompleted={scenesCompleted} />
      )}
    </div>
  )
}
