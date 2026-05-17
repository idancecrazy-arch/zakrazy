'use client'

import { useState } from 'react'

const FAQS = [
  {
    question: 'What is the dress code?',
    answer:
      'Formal attire. Tuxedos or dark suits for gentlemen; evening gowns or cocktail dresses for ladies. Everything is indoors, so no need to worry about outdoor footwear.',
  },
  {
    question: 'Is the ceremony and reception indoors?',
    answer:
      'Yes — both the ceremony at St. Joseph\'s Church and the reception at Golden Unicorn are entirely indoors. No umbrellas or outdoor shoes required.',
  },
  {
    question: 'What is the parking situation?',
    answer:
      'Street parking in Greenwich Village and Chinatown is limited, especially on weekends. We recommend using paid parking garages nearby, or arriving by subway or rideshare. Specific garage recommendations will be shared in the formal invitation.',
  },
  {
    question: 'How do I get there by subway?',
    answer:
      'St. Joseph\'s Church (Greenwich Village) is easily reached via the A/C/E to West 4th Street, or the 1 train to Christopher Street. Golden Unicorn (Chinatown) is close to the J/Z/N/Q/R/6 trains at Canal Street. A formal map and directions will be included in the invitation.',
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
    question: 'Can my plus one bring their own plus one?',
    answer:
      'Due to venue capacity, our guest list is carefully curated. Plus ones are welcome where indicated on your invitation — unfortunately, plus ones cannot extend additional guests.',
  },
  {
    question: 'Is the venue wheelchair accessible?',
    answer:
      'We are confirming accessibility details for both venues and will include this information in the formal invitation. Please note any accessibility needs in the Special Requests field of your RSVP and we\'ll be in touch directly.',
  },
  {
    question: 'What kind of food will be served at the reception?',
    answer:
      'Golden Unicorn serves beautiful family-style Chinese cuisine. Dishes will be shared across the table. Please note any dietary restrictions, allergies, or preferences on your RSVP so we can work with the venue to accommodate you.',
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
