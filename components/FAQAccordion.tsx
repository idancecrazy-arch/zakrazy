'use client'

import { useState } from 'react'

const FAQS = [
  {
    question: 'What is the dress code?',
    answer:
      'Semi-formal Attire: We kindly request guests wear suits and cocktail dresses comfortable for the season (September will hopefully be temperate and mild). Tuxes and gowns are welcome, and traditional attire is also encouraged!',
  },
  {
    question: 'Are the ceremony and reception indoors?',
    answer:
      'Yes, both the ceremony at St. Joseph\'s Church and the reception at Golden Unicorn are entirely indoors.',
  },
  {
    question: 'When does the ceremony begin and how long is it?',
    answer:
      'The ceremony will begin promptly at 2pm. Please arrive by 1:30pm to enjoy a selection of choral music arranged by our organist. The ceremony will be a full Catholic wedding mass and end around 3pm, giving some time back to guests to wander and relax before cocktail hour at the Golden Unicorn at 5pm.',
  },
  {
    question: 'Are children welcome?',
    answer:
      'Yes! Children are welcome at both the ceremony and reception. Please note on your RSVP if children will be attending and if a high chair or dietary restrictions are needed.',
  },
  {
    question: 'What kind of food will be served at the reception?',
    answer:
      'We will be sharing the menu closer to our wedding date. Golden Unicorn serves a Chinese banquet dinner, family style. Please note any dietary restrictions or allergies on your RSVP.',
  },
  {
    question: 'Any tips for getting to New York?',
    answer:
      'September 12th is a busy weekend in NYC. We encourage guests to book flights and hotels early. The best airports are: JFK (check for construction related traffic delays getting to and from this airport), LGA, and EWR. Amtrak is a great option if you\'re on the East Coast!',
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
              className={`flex-shrink-0 mt-0.5 text-gold-deep transition-transform duration-300 font-work-sans text-lg ${openIndex === i ? 'rotate-45' : ''}`}
              aria-hidden="true"
            >
              +
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 pb-5' : 'max-h-0'}`}
          >
            <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
