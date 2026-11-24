import { useEffect, useRef } from 'react'
import { certs, circuit } from '../data'
import { gsap } from '../lib/motion'

/* Film-festival laurel wreath: paired botanical leaves curving from base to tip. */
function Laurel({ side }: { side: 'l' | 'r' }) {
  const nodes = Array.from({ length: 7 }, (_, i) => {
    const t = i / 6 // 0 (bottom) -> 1 (top)
    // Quadratic Bezier from (42, 88) via (8, 52) to (34, 14)
    const u = 1 - t
    const cx = u * u * 42 + 2 * u * t * 8 + t * t * 34
    const cy = u * u * 88 + 2 * u * t * 52 + t * t * 14
    const dx = 2 * u * (8 - 42) + 2 * t * (34 - 8)
    const dy = 2 * u * (52 - 88) + 2 * t * (14 - 52)
    const tangent = (Math.atan2(dy, dx) * 180) / Math.PI
    const scale = 1 - t * 0.22
    return (
      <g key={i} transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${tangent.toFixed(1)}) scale(${scale.toFixed(2)})`}>
        {i < 6 && <ellipse cx="4" cy="-5.5" rx="6.5" ry="2.6" transform="rotate(-34 4 -5.5)" />}
        <ellipse cx="4" cy="5.5" rx="6.5" ry="2.6" transform="rotate(34 4 5.5)" />
      </g>
    )
  })
  return (
    <svg className={`laurel laurel--${side}`} viewBox="0 0 60 100" aria-hidden="true">
      <path d="M42 88 Q8 52 34 14" fill="none" strokeWidth="1.35" strokeLinecap="round" />
      {nodes}
    </svg>
  )
}

export default function Circuit() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.award').forEach((el, i) => {
        gsap.from(el, {
          y: 60,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          delay: (i % 2) * 0.12,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="circuit" className="section circuit" ref={root}>
      <header className="sec-head">
        <span className="mono">SC.06</span>
        <span className="mono">Festival circuit</span>
      </header>
      <h2 className="display circuit__title">
        Official <span className="serif">selections.</span>
      </h2>
      <p className="muted circuit__lead">Hackathons, 2024 – 2026. Usually as team lead, always under a 24-hour clock.</p>

      <ul className="awards">
        {circuit.map((c) => (
          <li className="award" key={c.event}>
            <div className="award__wreath">
              <Laurel side="l" />
              <div className="award__center">
                <span className="mono award__kick">Official selection</span>
                <span className="award__event">{c.event}</span>
                <span className="award__award">{c.award}</span>
              </div>
              <Laurel side="r" />
            </div>
            <p className="award__detail">{c.detail}</p>
          </li>
        ))}
      </ul>

      <div className="certs">
        <span className="mono certs__k">Certifications</span>
        <ul>
          {certs.map((c) => (
            <li key={c.name}>
              <span className="certs__n">{c.name}</span>
              <span className="mono certs__b">{c.by} · {c.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
