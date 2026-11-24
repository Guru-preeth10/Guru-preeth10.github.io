import { useState } from 'react'
import { useVisibleTicker } from '../../lib/useVisibleTicker'

const lines = [
  { t: '$ docker compose up --build', c: 'cmd' },
  { t: '[+] Building frontend …', c: 'dim' },
  { t: '[+] Building backend …', c: 'dim' },
  { t: '✔ Network finance_default   Created', c: 'ok' },
  { t: '✔ Container finance-backend  Started', c: 'ok' },
  { t: '✔ Container finance-frontend Started', c: 'ok' },
  { t: 'backend   | env loaded from .env', c: 'dim' },
  { t: 'frontend  | ready — serving app', c: 'hl' },
]

export default function FinanceViz() {
  const [n, setN] = useState(0)
  const { ref } = useVisibleTicker(520, () => setN((x) => (x >= lines.length + 5 ? 0 : x + 1)))
  const up = n >= 6

  return (
    <div className="viz fin" ref={ref}>
      <div className="viz__bar mono">
        <span>~/smart-finance-advisor</span>
        <span className={up ? 'ok' : 'dim'}>{up ? '● running' : '○ starting'}</span>
      </div>
      <div className="fin__grid">
        <pre className="fin__term mono" aria-label="docker compose output">
          {lines.slice(0, n).map((l, k) => (
            <span key={k} className={l.c}>
              {l.t}
              {'\n'}
            </span>
          ))}
          <span className="fin__cursor">▍</span>
        </pre>
        <svg className={`fin__map ${up ? 'is-up' : ''}`} viewBox="0 0 220 240" role="img" aria-label="Frontend and backend containers on a shared network">
          <rect className="fin__net" x="6" y="6" width="208" height="228" rx="14" />
          <text x="18" y="26" className="fin__lbl">compose network</text>
          <g className="fin__box">
            <rect x="40" y="46" width="140" height="48" rx="10" />
            <text x="110" y="75" textAnchor="middle">frontend</text>
          </g>
          <g className="fin__box">
            <rect x="40" y="146" width="140" height="48" rx="10" />
            <text x="110" y="175" textAnchor="middle">backend</text>
          </g>
          <path className="fin__wire" d="M110 94 V146" />
          <circle className="fin__pkt" r="3.5" cx="110" cy="94" />
          <text x="122" y="124" className="fin__lbl">REST</text>
          <g className="fin__env">
            <rect x="150" y="206" width="52" height="20" rx="5" />
            <text x="176" y="220" textAnchor="middle">.env</text>
          </g>
        </svg>
      </div>
    </div>
  )
}
