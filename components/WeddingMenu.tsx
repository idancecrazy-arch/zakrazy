import { MENU_COURSES } from '@/lib/weddingMenu'

export default function WeddingMenu() {
  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="mt-16 pt-10 border-t border-pale-gold/40 flex flex-col gap-6 scroll-mt-32"
    >
      <div className="flex flex-col items-center text-center gap-3 mb-2">
        <p className="font-work-sans text-xs tracking-[0.18em] uppercase text-ink-muted font-medium">
          Dinner at Golden Unicorn
        </p>
        <h2
          id="menu-heading"
          className="font-italiana text-3xl sm:text-4xl text-dark-taupe tracking-wide leading-tight"
        >
          Our Wedding Menu
        </h2>
        <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed max-w-md">
          Dinner is a Chinese banquet served family style. Each course comes out
          on its own and is set in the middle of your table for everyone to
          share. Please reach out to us with any questions about the food.
        </p>
      </div>

      <ol className="flex flex-col divide-y divide-pale-gold/40">
        {MENU_COURSES.map((course) => (
          <li
            key={course}
            className="py-4 font-cormorant text-2xl text-dark-taupe tracking-wide"
          >
            {course}
          </li>
        ))}
      </ol>

      <div className="mt-4 pt-8 border-t border-pale-gold/40 flex flex-col gap-4">
        <a
          href="mailto:christineandmichaelzak@gmail.com?subject=Dietary%20question"
          className="font-work-sans text-[12px] tracking-[0.18em] uppercase px-8 py-4 min-h-[52px] flex items-center justify-center border border-gold-line text-dark-taupe hover:bg-blush transition-colors duration-200 self-start"
        >
          Email Us About Food
        </a>
      </div>
    </section>
  )
}
