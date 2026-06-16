import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registry',
  description: 'Registry information for Christine & Michael\'s wedding.',
}

export default function RegistryPage() {
  return (
    <div className="min-h-screen bg-ivory pt-36 sm:pt-40 pb-24 px-5 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <h1 className="font-italiana text-4xl sm:text-5xl text-dark-taupe tracking-wide leading-tight">
            Registry
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8">
          <p className="font-crimson text-lg text-dark-taupe/90 leading-relaxed">
            Your presence at our wedding is the greatest gift we could ask for. While gifts are not necessary, we understand some may wish to contribute to our honeymoon fund. This is entirely optional and greatly appreciated.
          </p>

          <div className="flex flex-col items-center gap-4">
            <a
              href="https://www.honeyfund.com/site/liu-zakrajsek-09-12-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="font-work-sans text-[12px] tracking-[0.18em] uppercase px-8 py-4 min-h-[52px] flex items-center border border-gold-line text-dark-taupe hover:bg-blush transition-colors duration-200"
            >
              View Honeymoon Fund
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
