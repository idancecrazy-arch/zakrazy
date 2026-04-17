import Link from 'next/link'
import { Metadata } from 'next'
import SwanMotif from '@/components/SwanMotif'
import CrossMotif from '@/components/CrossMotif'
import CountdownTimer from '@/components/CountdownTimer'
import FeatherDivider from '@/components/FeatherDivider'
import CloudMotif from '@/components/CloudMotif'
import { COUPLE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Save the Date',
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        {/* Aetherial cloud backgrounds */}
        <CloudMotif
          className="absolute -top-4 -left-8 rotate-12"
          fill="#FFE5CC"
          opacity={0.06}
          width={280}
          height={112}
        />
        <CloudMotif
          className="absolute top-1/4 -right-12 -rotate-6"
          fill="#D4EED8"
          opacity={0.07}
          width={240}
          height={96}
        />
        <CloudMotif
          className="absolute bottom-1/4 -left-16 rotate-3"
          fill="#F2DEDE"
          opacity={0.06}
          width={260}
          height={104}
        />
        <CloudMotif
          className="absolute -bottom-6 right-0 -rotate-12"
          fill="#FFE5CC"
          opacity={0.05}
          width={220}
          height={88}
        />

        {/* Gold rule */}
        <div className="w-20 h-px bg-gold-line gold-rule mb-10" />

        {/* Main heading */}
        <h1 className="font-italiana text-6xl sm:text-7xl md:text-8xl text-dark-taupe tracking-wide leading-none mb-6">
          Save the Date
        </h1>

        {/* Date */}
        <p className="font-italiana text-2xl sm:text-3xl text-dusty-lilac tracking-[0.2em] mb-1">
          September 12, 2026
        </p>

        {/* 龍鳳呈祥 — Dragon Phoenix Bring Fortune */}
        <p className="font-chinese text-xl text-pale-gold/70 tracking-[0.3em] mb-4">
          龍鳳呈祥
        </p>

        {/* Swan + Cross motifs */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <SwanMotif size={140} color="#5A5044" />
          <CrossMotif size={28} color="#EAD0B1" />
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-pale-gold/60" />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-ivory py-10 flex justify-center px-6">
        <Link
          href="/rsvp"
          className="
            font-work-sans text-[12px] tracking-[0.25em] uppercase
            px-10 py-5 bg-gold-line text-ivory
            hover:bg-dark-taupe hover:-translate-y-0.5 hover:shadow-md
            transition-all duration-300
          "
        >
          Confirm Your Details
        </Link>
      </section>

      {/* ── Calligraphic divider ─────────────────────────── */}
      <div className="flex justify-center py-8 bg-ivory">
        <FeatherDivider width={280} color="#EAD0B1" />
      </div>

      {/* ── Countdown ────────────────────────────────────── */}
      <section className="bg-ivory py-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10 text-center">
          <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray">
            Until the Celebration
          </p>

          <CountdownTimer />

          {/* Invitation line */}
          <p className="font-lora italic text-xl text-deep-ivory max-w-md leading-relaxed">
            We joyfully invite you to celebrate with us
          </p>

          {/* Names */}
          <div className="flex flex-col items-center gap-1">
            <p className="font-italiana text-3xl sm:text-4xl text-dark-taupe tracking-wide">
              {COUPLE.partner1.first} {COUPLE.partner1.last}
            </p>
            <p className="font-lora italic text-gold-line text-xl">&amp;</p>
            <p className="font-italiana text-3xl sm:text-4xl text-dark-taupe tracking-wide">
              {COUPLE.partner2.first} {COUPLE.partner2.last}
            </p>
          </div>

          {/* Gold rule */}
          <div className="w-16 h-px bg-pale-gold" />
        </div>
      </section>

      {/* ── Final swan ───────────────────────────────────── */}
      <section className="bg-ivory py-16 flex flex-col items-center gap-6 text-center px-6">
        <SwanMotif size={100} color="#5A5044" />
        <p className="font-lora italic text-base text-deep-ivory max-w-xs leading-relaxed">
          More details coming soon — we cannot wait to celebrate with you.
        </p>
        <Link
          href="/rsvp"
          className="
            font-work-sans text-[12px] tracking-[0.25em] uppercase
            px-10 py-5 bg-gold-line text-ivory
            hover:bg-dark-taupe hover:-translate-y-0.5 hover:shadow-md
            transition-all duration-300
          "
        >
          Confirm Your Details
        </Link>
      </section>
    </>
  )
}
