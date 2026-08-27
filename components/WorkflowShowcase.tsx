/* Outcome-first workflow gallery: four n8n-style animated diagrams, each an outcome a
 * client can buy. Copy states capabilities, never invented metrics. */

type Node = { x: number; y: number; label: string; icon: string; c: string }
type Flow = { title: string; outcome: string; nodes: Node[]; wires: string[]; accent: string }

const FLOWS: Flow[] = [
  {
    title: 'LinkedIn lead generation',
    outcome: 'Prospects found, researched and messaged while you sleep — you wake up to warm replies only.',
    accent: '#CF1134',
    nodes: [
      { x: 2, y: 22, label: 'Search', icon: '🔎', c: '#5B4BA6' },
      { x: 30, y: 6, label: 'Research', icon: '🤖', c: '#CF1134' },
      { x: 30, y: 38, label: 'Personal', icon: '✍️', c: '#B8611B' },
      { x: 58, y: 22, label: 'Sequence', icon: '📨', c: '#1F7A3D' },
      { x: 83, y: 22, label: 'Warm replies', icon: '🔥', c: '#A97B10' },
    ],
    wires: ['M 16 26 C 24 26, 22 11, 30 11', 'M 16 28 C 24 28, 22 43, 30 43', 'M 44 11 C 52 11, 50 26, 58 26', 'M 44 43 C 52 43, 50 28, 58 28', 'M 72 27 L 84 27'],
  },
  {
    title: 'Cross-platform content engine',
    outcome: 'One piece of content becomes native posts everywhere, on schedule, with performance fed back in.',
    accent: '#5B4BA6',
    nodes: [
      { x: 2, y: 22, label: 'Idea', icon: '💡', c: '#A97B10' },
      { x: 30, y: 22, label: 'Draft', icon: '🤖', c: '#CF1134' },
      { x: 58, y: 4, label: 'Instagram', icon: '📸', c: '#CF1134' },
      { x: 58, y: 24, label: 'LinkedIn', icon: '💼', c: '#5B4BA6' },
      { x: 58, y: 44, label: 'Blog', icon: '📝', c: '#1F7A3D' },
      { x: 84, y: 24, label: 'Metrics', icon: '📈', c: '#B8611B' },
    ],
    wires: ['M 16 27 L 30 27', 'M 44 25 C 52 25, 50 9, 58 9', 'M 44 27 L 58 29', 'M 44 29 C 52 29, 50 49, 58 49', 'M 72 29 L 84 29', 'M 72 9 C 80 9, 78 27, 84 28'],
  },
  {
    title: 'WhatsApp sales follow-up',
    outcome: 'Every enquiry answered in seconds, qualified, and booked into your calendar — no lead goes cold.',
    accent: '#1F7A3D',
    nodes: [
      { x: 2, y: 22, label: 'Enquiry', icon: '💬', c: '#1F7A3D' },
      { x: 30, y: 6, label: 'Qualify', icon: '🤖', c: '#CF1134' },
      { x: 30, y: 38, label: 'CRM', icon: '📊', c: '#5B4BA6' },
      { x: 58, y: 22, label: 'Offer slot', icon: '📅', c: '#B8611B' },
      { x: 84, y: 22, label: 'Booked', icon: '✅', c: '#A97B10' },
    ],
    wires: ['M 16 26 C 24 26, 22 11, 30 11', 'M 16 28 C 24 28, 22 43, 30 43', 'M 44 11 C 52 11, 50 26, 58 26', 'M 44 43 C 52 43, 50 28, 58 28', 'M 72 27 L 84 27'],
  },
  {
    title: 'Reports that write themselves',
    outcome: 'Numbers pulled, reconciled and narrated into a morning report — the "let me just check" hour, deleted.',
    accent: '#B8611B',
    nodes: [
      { x: 2, y: 6, label: 'Sheets', icon: '📗', c: '#1F7A3D' },
      { x: 2, y: 38, label: 'Bank', icon: '🏦', c: '#5B4BA6' },
      { x: 30, y: 22, label: 'Match', icon: '🔁', c: '#B8611B' },
      { x: 58, y: 22, label: 'Narrate', icon: '🤖', c: '#CF1134' },
      { x: 84, y: 22, label: '9am mail', icon: '☕', c: '#A97B10' },
    ],
    wires: ['M 16 11 C 24 11, 22 26, 30 26', 'M 16 43 C 24 43, 22 28, 30 28', 'M 44 27 L 58 27', 'M 72 27 L 84 27'],
  },
]

function Diagram({ f }: { f: Flow }) {
  return (
    <svg viewBox="0 0 100 56" className="w-full" role="img" aria-label={`${f.title} workflow`}>
      {f.wires.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(22,19,14,.30)" strokeWidth=".7" strokeDasharray="2.2 1.6" className="wf-wire" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
      {f.nodes.map((n, i) => (
        <g key={n.label} className="wf-node" style={{ animationDelay: `${i * 0.45}s` }}>
          <rect x={n.x} y={n.y} width="14" height="10" rx="2.2" fill="#fff" stroke={n.c} strokeWidth=".8" />
          <text x={n.x + 7} y={n.y + 4.6} textAnchor="middle" fontSize="3.4">{n.icon}</text>
          <text x={n.x + 7} y={n.y + 8.4} textAnchor="middle" fontSize="1.9" fill="#16130E" fontFamily="system-ui" fontWeight="600">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

export default function WorkflowShowcase() {
  return (
    <section className="border-t border-[--ink]/10 bg-[--paper] py-16 text-[--ink] sm:py-24" id="workflows">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow">Where I can help you</p>
        <h2 className="display mt-3 max-w-3xl text-[--ink] text-[clamp(2.2rem,6vw,4.5rem)]">Outcomes, drawn as the machines that produce them</h2>
        <p className="mt-4 max-w-xl text-lg text-[--ink-dim]">Every diagram below is a system I build end to end. On the 1:1 call we draw yours.</p>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {FLOWS.map((f) => (
            <article key={f.title} data-reveal className="dcard relative overflow-hidden p-7">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: f.accent }} />
              <h3 className="font-body text-lg font-semibold">{f.title}</h3>
              <div className="mt-4 rounded-lg border border-[--ink]/10 bg-[--paper] p-3"><Diagram f={f} /></div>
              <p className="mt-4 text-[15px] leading-relaxed text-[--ink-dim]">{f.outcome}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="/book" className="inline-flex h-14 items-center rounded-md bg-[--red] px-8 font-body text-base font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5">
            Draw my workflow on a 1:1 →
          </a>
          <p className="mt-3 text-sm text-[--ink]/55">₹2,999 · fully adjusted against any done-for-you build you take up.</p>
        </div>
      </div>
    </section>
  )
}
