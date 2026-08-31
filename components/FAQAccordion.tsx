'use client'

import { ReactNode, useState } from 'react'

type Faq = {
  question: string
  answer: ReactNode
}

const FAQS: Faq[] = [
  {
    question: 'What is the dress code?',
    answer:
      'Semi-formal Attire: We kindly request guests wear suits and cocktail dresses comfortable for the season (September will hopefully be temperate and mild). Tuxes and gowns are welcome, and traditional attire is also encouraged!',
  },
  {
    question: 'Is there a different dress code at the wedding reception?',
    answer:
      'No, the dress code is the same for the ceremony and reception. There is no need to change between the two. Semi-formal attire works for the whole day.',
  },
  {
    question: 'Is there a welcome party?',
    answer:
      'Yes! We are hosting a casual welcome party at Walker Rooftop (Walker Hotel Tribeca, 77 Walker Street) on Friday, September 11th from 6:30 to 9:30 PM. We will have light fare, so we encourage you to eat beforehand. Let us know on your RSVP if you can join us.',
  },
  {
    question: 'Are the ceremony and reception indoors?',
    answer:
      'Yes, both the ceremony at St. Joseph\'s Church and the reception at Golden Unicorn are entirely indoors. The reception is on the 5th floor of Golden Unicorn.',
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
    answer: (
      <>
        Golden Unicorn serves a Chinese banquet, and dinner is family style.
        Ten courses come out one at a time, from roast suckling pig and twin
        lobsters to steamed whole fish, and we finish with two desserts we
        picked ourselves. The{' '}
        <a
          href="#menu"
          className="text-rose-deep underline underline-offset-2 hover:text-dark-taupe transition-colors duration-200"
        >
          full menu is further down this page
        </a>
        , with the allergies and restrictions each course may touch marked
        beside it.
      </>
    ),
  },
  {
    question: 'How does a family style dinner work?',
    answer:
      'There is nothing to choose ahead of time. You will be seated at a round table of about ten, and each course arrives on a large platter that is set in the middle for the table to share. Serving spoons come with the food, so help yourself to what you like and pass it along. Courses keep coming for a while, so go easy on the early ones.',
  },
  {
    question: 'Will there be dessert?',
    answer:
      'Yes, two of them. First come piggy buns filled with egg custard, and then our wedding cake, which is black sesame and vanilla. The cake is nut free.',
  },
  {
    question: 'I have a food allergy or a dietary restriction. What should I do?',
    answer: (
      <>
        Please tell us. Note it on your RSVP, and if you have already sent your
        RSVP in, just{' '}
        <a
          href="mailto:christineandmichaelzak@gmail.com?subject=Dietary%20question"
          className="text-rose-deep underline underline-offset-2 hover:text-dark-taupe transition-colors duration-200"
        >
          email us
        </a>
        . The{' '}
        <a
          href="#menu"
          className="text-rose-deep underline underline-offset-2 hover:text-dark-taupe transition-colors duration-200"
        >
          menu below
        </a>{' '}
        marks the common triggers course by course, but it is a guide rather
        than a full ingredient list. If you need something more specific, or you
        are not sure whether a course is safe for you, reach out and we will
        work it out with the restaurant. The sooner we know, the easier it is to
        arrange.
      </>
    ),
  },
  {
    question: 'Any tips for getting to New York?',
    answer:
      'September 12th is a busy weekend in NYC. We encourage guests to book flights and hotels early. The best airports are: JFK (check for construction related traffic delays getting to and from this airport), LGA, and EWR. Amtrak is a great option if you\'re on the East Coast!',
  },
]

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
            aria-controls={`faq-answer-${i}`}
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
            id={`faq-answer-${i}`}
            className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}
          >
            <div className="overflow-hidden">
              <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
