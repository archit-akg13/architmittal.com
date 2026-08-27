/* n8n-style workflow diagram, animated: marching wires + pulsing nodes. Pure SVG/CSS. */
const NODES = [
  { x: 8, y: 24, label: 'Lead lands', icon: '⚡', c: '#F4BD45' },
  { x: 36, y: 8, label: 'AI agent', icon: '🤖', c: '#CF1134' },
  { x: 36, y: 44, label: 'CRM update', icon: '📊', c: '#5B4BA6' },
  { x: 66, y: 24, label: 'WhatsApp reply', icon: '💬', c: '#1F7A3D' },
]
const WIRES = [
  'M 22 28 C 30 28, 28 13, 36 13',
  'M 22 30 C 30 30, 28 49, 36 49',
  'M 50 13 C 60 13, 58 28, 66 28',
  'M 50 49 C 60 49, 58 30, 66 30',
]

export default function WorkflowArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 82 60" className={className} role="img" aria-label="An automated workflow: lead in, AI agent and CRM in parallel, WhatsApp reply out">
      {WIRES.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(22,19,14,.28)" strokeWidth=".7" strokeDasharray="2.2 1.6" className="wf-wire" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      {NODES.map((n, i) => (
        <g key={n.label} className="wf-node" style={{ animationDelay: `${i * 0.5}s` }}>
          <rect x={n.x} y={n.y} width="14" height="10" rx="2.2" fill="#fff" stroke={n.c} strokeWidth=".8" />
          <text x={n.x + 7} y={n.y + 4.6} textAnchor="middle" fontSize="3.6">{n.icon}</text>
          <text x={n.x + 7} y={n.y + 8.2} textAnchor="middle" fontSize="2.1" fill="#16130E" fontFamily="system-ui" fontWeight="600">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}
