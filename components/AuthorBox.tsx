import Image from 'next/image'
import { TOPMATE_URL } from '@/lib/constants'
import SocialIcon from './SocialIcon'

export default function AuthorBox() {
  return (
    <div className="border border-gray-200 rounded-xl p-6 my-8">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-shrink-0">
          <Image
            src="/images/archit-headshot-200.jpg"
            alt="Archit Mittal"
            width={64}
            height={64}
            loading="lazy"
            className="rounded-full border-2 border-lime object-cover"
          />
        </div>
        <div>
          <h4 className="font-heading font-semibold text-heading">Archit Mittal</h4>
          <p className="text-body text-sm font-body mb-3">
            AI Automation Expert | I Automate Chaos. Helping businesses save lakhs through intelligent automation.
          </p>
          <div className="flex items-center gap-4">
            <a href={TOPMATE_URL} target="_blank" rel="noopener noreferrer" className="bg-lime hover:bg-lime-dark text-white px-4 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors">
              Book a 1:1 with Archit
            </a>
            <div className="flex gap-2">
              <a href="https://linkedin.com/in/automate-archit" target="_blank" rel="noopener noreferrer" className="text-subtle hover:text-lime transition-colors"><SocialIcon name="linkedin" className="w-4 h-4" /></a>
              <a href="https://x.com/automate_archit" target="_blank" rel="noopener noreferrer" className="text-subtle hover:text-lime transition-colors"><SocialIcon name="twitter" className="w-4 h-4" /></a>
              <a href="https://github.com/archit-akg13" target="_blank" rel="noopener noreferrer" className="text-subtle hover:text-lime transition-colors"><SocialIcon name="github" className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
