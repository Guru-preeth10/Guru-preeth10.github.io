import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/* Academy-leader countdown: 3 · 2 · 1, a sweeping hand, then the gate opens. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(3)

  useEffect(() => {
    const el = root.current!
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onDone })
      if (reduced) {
        tl.to(el, { autoAlpha: 0, duration: 0.3, delay: 0.2 })
        return
      }
      const step = 0.38
      tl.fromTo('.leader__ring', { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.28, ease: 'power3.out' })
      for (let i = 0; i < 3; i++) {
        tl.fromTo(
          '.leader__sweep',
          { '--a': '0deg' },
          { '--a': '360deg', duration: step, ease: 'none', onStart: () => setN(3 - i) },
          i === 0 ? '<' : '>',
        )
      }
      tl.to('.leader__inner', { scale: 1.1, autoAlpha: 0, duration: 0.25, ease: 'power2.in' })
        .to('.leader__shutter--t', { yPercent: -100, duration: 0.65, ease: 'expo.inOut' }, '-=0.08')
        .to('.leader__shutter--b', { yPercent: 100, duration: 0.65, ease: 'expo.inOut' }, '<')
        .set(el, { display: 'none' })
    }, el)
    return () => ctx.revert()
  }, [onDone])

  return (
    <div className="leader" ref={root} role="status" aria-label="Loading portfolio">
      <div className="leader__shutter leader__shutter--t" />
      <div className="leader__shutter leader__shutter--b" />
      <div className="leader__inner">
        <div className="leader__ring">
          <div className="leader__sweep" />
          <span className="leader__cross leader__cross--h" />
          <span className="leader__cross leader__cross--v" />
          <span className="leader__num">{n}</span>
        </div>
        <p className="leader__meta mono">
          <span>GH — REEL 2026</span>
          <span>PICTURE START</span>
        </p>
      </div>
    </div>
  )
}
