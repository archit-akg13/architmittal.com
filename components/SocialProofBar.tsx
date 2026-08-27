import { SOCIAL_LINKS, RESULTS_TICKER } from '@/lib/constants'
import SocialIcon from './SocialIcon'

export default function SocialProofBar() {
  return (
    <section className="border-b border-[--ink]/10 bg-[--paper] text-[--ink]">
      {/* Platform links */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-[--ink-dim] transition-colors hover:text-[--red]"
            >
              <SocialIcon name={link.icon} className="w-5 h-5" />
              <span className="text-sm font-body">
                {link.name}
                {'followers' in link && (
                  <span className="text-subtle ml-1">({link.followers})</span>
                )}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Results ticker */}
      <div className="bg-[--paper2] py-3 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...RESULTS_TICKER, ...RESULTS_TICKER].map((text, i) => (
            <span key={i} className="mx-8 text-sm font-body text-body flex items-center gap-2">
              <span className="text-lime font-bold">&bull;</span> {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
