"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * SecretGallery
 * A click-to-unlock masonry gallery of candid / funny photos.
 * Drop this at the very END of the engagement-photoshoot block inside the
 * "Our Story" section. It stays hidden until the visitor clicks to reveal it.
 *
 * Photos must live in /public/secret-gallery/ so they are web-reachable.
 * (Next.js only serves static files from /public — files under lib/ are not.)
 */

const PHOTOS: string[] = [
  "054FFD0C-006C-41B6-ACCC-28C4FB5BF3B4.JPG",
  "14CA87DC-7ED4-47AF-A2C5-A7C58AA0DCA4.JPG",
  "2A80A18A-A4FB-4B6F-84EA-FA9E38557A6A.JPG",
  "2E28E35C-0698-4484-ADB2-A76FA044C993.JPG",
  "38031D52-2EC9-40EA-8EEA-4A7C5FC30B08.JPG",
  "530BC51B-3946-43D4-999E-F6F581084B6B.JPG",
  "7DF0154D-FA03-4F6D-B7DB-9E5D593E2A99.JPG",
  "7F25C18C-BC19-4D93-A413-3C26E73B7B96.JPG",
  "8959EDB6-AD71-47A8-A958-C06C1F07C385.JPG",
  "9360EFCD-A08A-4204-9DD1-C7ADEA1A0B92.JPG",
  "9B79100F-411A-4301-8968-F8B3780D9C5D.JPG",
  "B17DA514-1DE8-42DE-B51A-F3C91E47C129.JPG",
  "C9E912F3-F8AF-433C-A27E-F30CB9293804.JPG",
  "DDE7B485-1116-4CD0-B8D1-17976DD30ACB.JPG",
  "E19BEF50-4ABF-400B-88F5-5089BF305958.JPG",
  "E7DD7A8F-8816-4530-ABCC-DCBE388D408E.JPG",
  "EBEBC42E-4D68-4EE7-9EAB-8E2132C66AFB.JPG",
  "F19E5B1F-CF87-46B1-995F-139FC0FB4384.JPG",
  "FAB6DF6D-6B48-4944-9196-3AF5E38D429F.JPG"
];

const BASE = "/secret-gallery/";

export default function SecretGallery() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const move = useCallback(
    (dir: number) =>
      setActive((i) =>
        i === null ? i : (i + dir + PHOTOS.length) % PHOTOS.length
      ),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, move]);

  return (
    <section className="sg" aria-label="Hidden photo gallery">
      {!open && (
        <button className="sg-trigger" onClick={() => setOpen(true)}>
          <span className="sg-rule" />
          <span className="sg-lock" aria-hidden="true">&#9825;</span>
          <span className="sg-kick">a little secret</span>
          <span className="sg-cta">
            There&rsquo;s more to us than the pretty photos &mdash;{" "}
            <em>unlock the gallery</em>
          </span>
          <span className="sg-rule" />
        </button>
      )}

      {open && (
        <div className="sg-reveal">
          <header className="sg-head">
            <p className="sg-kick">the unedited us</p>
            <h3 className="sg-title">Our (funny) history</h3>
            <p className="sg-sub">
              Years of dim sum, bad lighting, pets, and questionable faces.
            </p>
          </header>

          <div className="sg-masonry">
            {PHOTOS.map((f, i) => (
              <button
                key={f}
                className="sg-item"
                onClick={() => setActive(i)}
                aria-label={`Open photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BASE + f} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}

      {active !== null && (
        <div className="sg-lightbox" onClick={close} role="dialog" aria-modal="true">
          <button className="sg-x" onClick={close} aria-label="Close">&times;</button>
          <button
            className="sg-nav sg-prev"
            onClick={(e) => { e.stopPropagation(); move(-1); }}
            aria-label="Previous"
          >
            &#8249;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="sg-full"
            src={BASE + PHOTOS[active]}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="sg-nav sg-next"
            onClick={(e) => { e.stopPropagation(); move(1); }}
            aria-label="Next"
          >
            &#8250;
          </button>
        </div>
      )}

      <style jsx>{`
        .sg {
          margin: 4rem auto 0;
          max-width: 1100px;
          padding: 0 1rem;
        }
        .sg-trigger {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          padding: 2.5rem 0;
          color: #8a7a66;
          transition: color 0.25s ease;
        }
        .sg-trigger:hover { color: #5c4f3f; }
        .sg-rule {
          width: 64px;
          height: 1px;
          background: currentColor;
          opacity: 0.4;
        }
        .sg-lock { font-size: 22px; line-height: 1; }
        .sg-kick {
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          font-size: 11px;
        }
        .sg-cta {
          font-family: Georgia, serif;
          font-size: 15px;
          font-style: normal;
        }
        .sg-cta em { font-style: italic; text-decoration: underline; text-underline-offset: 3px; }

        .sg-reveal { animation: sgFade 0.6s ease; }
        @keyframes sgFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .sg-head { text-align: center; margin-bottom: 2rem; }
        .sg-head .sg-kick { color: #9a7b52; display: block; margin-bottom: 10px; }
        .sg-title {
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 400;
          font-style: italic;
          margin: 0 0 8px;
          color: #2b2622;
        }
        .sg-sub { color: #6f655c; font-family: Georgia, serif; font-size: 15px; margin: 0; }

        .sg-masonry {
          column-count: 4;
          column-gap: 14px;
        }
        @media (max-width: 900px) { .sg-masonry { column-count: 3; } }
        @media (max-width: 560px) { .sg-masonry { column-count: 2; } }
        .sg-item {
          display: block;
          width: 100%;
          margin: 0 0 14px;
          padding: 0;
          border: none;
          background: none;
          cursor: zoom-in;
          break-inside: avoid;
        }
        .sg-item img {
          width: 100%;
          display: block;
          border-radius: 3px;
          box-shadow: 0 2px 12px rgba(60, 45, 30, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .sg-item:hover img {
          transform: translateY(-3px);
          box-shadow: 0 8px 22px rgba(60, 45, 30, 0.2);
        }

        .sg-lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(20, 17, 14, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: sgFade 0.25s ease;
        }
        .sg-full {
          max-width: 90vw;
          max-height: 86vh;
          border-radius: 4px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
        .sg-x {
          position: absolute;
          top: 18px;
          right: 24px;
          font-size: 34px;
          line-height: 1;
          color: #f6f1e8;
          background: none;
          border: none;
          cursor: pointer;
        }
        .sg-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 46px;
          color: #f6f1e8;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0 18px;
          opacity: 0.75;
          transition: opacity 0.2s;
        }
        .sg-nav:hover { opacity: 1; }
        .sg-prev { left: 8px; }
        .sg-next { right: 8px; }
      `}</style>
    </section>
  );
}
