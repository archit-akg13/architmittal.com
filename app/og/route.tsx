import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0A0A0A',
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: 'linear-gradient(rgba(76,175,30,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,30,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />
        {/* LIME accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: '#4CAF1E',
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: 8,
              display: 'flex',
            }}
          >
            Archit Mittal
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 'bold',
              color: '#4CAF1E',
              marginBottom: 24,
              display: 'flex',
            }}
          >
            I Automate Chaos
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#AAAAAA',
              display: 'flex',
            }}
          >
            AI Automation Expert | architmittal.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
