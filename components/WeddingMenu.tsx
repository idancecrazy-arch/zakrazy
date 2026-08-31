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
          share. Take what you like as it arrives, and pace yourself, because
          there is a lot of it.
        </p>
        <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed max-w-md">
          Every course below is marked with the allergies and restrictions it
          may touch. Please read it as a guide rather than a full ingredient
          list, and reach out to us with anything you need.
        </p>
      </div>

      <ol className="flex flex-col divide-y divide-pale-gold/40">
        {MENU_COURSES.map((course) => (
          <li key={course.name} className="py-5 flex flex-col gap-2">
            <h3 className="font-cormorant text-2xl text-dark-taupe tracking-wide">
              {course.name}
            </h3>
            <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed">
              {course.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-work-sans text-[10px] tracking-[0.14em] uppercase px-3 py-1 rounded-full bg-blush/60 text-dark-taupe whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
              {course.askUs && (
                <span className="font-work-sans text-[10px] tracking-[0.14em] uppercase px-3 py-1 rounded-full bg-lilac/40 text-lilac-deep whitespace-nowrap">
                  Ask us for details
                </span>
              )}
            </div>
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
