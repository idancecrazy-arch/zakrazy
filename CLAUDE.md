# Christine & Michael's Wedding Website

## What this is
The wedding website for Christine and Michael, getting married on September 12,
2026 at St. Joseph's Church in Greenwich Village, with the reception at Golden
Unicorn in Chinatown. The look follows a design system called Celestial Plié:
an ivory, blush, and lilac palette with calligraphic swan motifs. The site
already has a live RSVP page. What we are building next is a full follow-up
experience for guests who have already replied.

## Stack
- Next.js 16 (App Router), React 19, and TypeScript: the framework that runs the pages.
- Tailwind CSS v4 for styling; Framer Motion for animation.
- react-hook-form and Zod for the RSVP form and its validation.
- Airtable holds the guest list and RSVP responses, reached through the site's
  own API routes (its secret key lives in an environment variable, never in the code).
- Redis stores saved state for the private planner section; Resend sends email notifications.
- Hosted on Vercel.

## How to run it
From the project folder, run `npm run dev`, then open http://localhost:3000 in a
browser. Pages refresh automatically as files change. First time only: run `npm install` first.

## How to check it works
- Open the page you changed and click through it in a phone-width window.
- `npm run build` confirms the whole site still compiles; `npm run lint` checks
  style; `npm test` runs the automated tests.
- Confirm the existing RSVP flow still works after any change near it.

## Conventions
- Plain, warm language. No em dashes.
- Mobile-first: design for phones first, then larger screens.
- Stay faithful to the Celestial Plié design system (ivory, blush, lilac;
  calligraphic swans; existing fonts and spacing). Reuse existing components
  instead of inventing new looks.
- This is a newer Next.js with breaking changes. Read the matching guide in
  node_modules/next/dist/docs/ before writing page or routing code.

## Do not
- Never commit secrets or API keys. The Airtable API key especially must stay in
  environment variables and out of git, along with the planner password, Resend
  key, and cron secret.
- Do not break existing pages (home, our story, ceremony, reception, travel,
  FAQ, registry, RSVP) when adding features.
- Do not store payment information, and do not keep sensitive guest data beyond
  what an RSVP needs.

@AGENTS.md
