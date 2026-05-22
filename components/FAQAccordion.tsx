'use client'

import { useState } from 'react'

const FAQS = [
  {
    question: 'What is the dress code?',
    answer:
      'Formal attire. Tuxedos or dark suits for gentlemen; evening gowns or formal dresses for ladies. Everything is indoors, so no need to worry about outdoor footwear.',
  },
  {
    question: 'Is the ceremony and reception indoors?',
    answer:
      'Yes — both the ceremony at St. Joseph\'s Church and the reception at Golden Unicorn are entirely indoors.',
  },
  {
    question: 'How long is the ceremony?',
    answer:
      'The ceremony is approximately 30–45 minutes. Please plan to arrive a few minutes early so we can begin promptly.',
  },
  {
    question: 'Are children welcome?',
    answer:
      'Children are warmly welcome! Please indicate on your RSVP if children will be joining your party, and let us know if a high chair is needed. The reception features family-style dining that works beautifully for all ages.',
  },
  {
    question: 'What kind of food will be served at the reception?',
    answer:
      'Golden Unicorn serves beautiful family-style Chinese cuisine. Dishes will be shared across the table. Please note any dietary restrictions or allergies on your RSVP so we can work with the venue to accommodate you.',
  },
  {
    question: 'Any tips for getting to New York?',
    answer:
      'September 12th falls on a busy weekend in New York City with several large events happening around the same time. We strongly recommend booking flights and hotels as early as possible — rates and availability will tighten as the date approaches. Once you\'re in the city, public transit is the easiest way to get around: the MTA subway now accepts tap-to-pay with a credit/debit card or Apple Pay/Google Pay directly at the turnstile, so there\'s no need to buy a MetroCard.',
  },
] as const

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-pale-gold/40">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button
            type="button"
            className="w-full flex items-start justify-between gap-4 py-5 text-left min-h-[56px]"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="font-crimson text-lg text-dark-taupe leading-snug flex-1">
              {faq.question}
            </span>
            <span
              className={`flex-shrink-0 mt-0.5 text-gold-line transition-transform duration-300 font-work-sans text-lg ${openIndex === i ? 'rotate-45' : ''}`}
              aria-hidden="true"
            >
              +
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 pb-5' : 'max-h-0'}`}
          >
            <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
