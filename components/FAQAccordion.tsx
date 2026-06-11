'use client'

import { useState } from 'react'

const FAQS = [
  {
    question: 'What is the dress code?',
    answer:
      'Formal attire. Tuxedos or dark suits for gentlemen; evening gowns or formal dresses for ladies. Everything is indoors.',
  },
  {
    question: 'Is the ceremony and reception indoors?',
    answer:
      'Yes, both the ceremony at St. Joseph\'s Church and the reception at Golden Unicorn are entirely indoors.',
  },
  {
    question: 'How long is the ceremony?',
    answer:
      'About 30 to 45 minutes. Please arrive a few minutes early.',
  },
  {
    question: 'Are children welcome?',
    answer:
      'Children are welcome. Note on your RSVP if children will be attending and if a high chair is needed.',
  },
  {
    question: 'What kind of food will be served at the reception?',
    answer:
      'Golden Unicorn serves a Chinese banquet dinner, family style. Note any dietary restrictions or allergies on your RSVP.',
  },
  {
    question: 'Any tips for getting to New York?',
    answer:
      'September 12th is a busy weekend in NYC. Book flights and hotels early. Airports: JFK, LGA, and EWR. Amtrak is a great option if you\'re on the East Coast.',
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
