import { useEffect, useRef, useState } from 'react'
import { profile, sections } from '../data'
import { gsap, ScrollTrigger, scrollToId, lockScroll } from '../lib/motion'

const pad = (n: number) => String(n).padStart(2, '0')

/* A camera viewfinder wrapped around the whole site: REC timecode, scene slate, frame progress. */
export default function Hud({ ready }: { ready: boolean }) {
  const tc = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [scene, setScene] = useState(0)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!ready) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const s = (now - start) / 1000
      const frames = Math.floor((s % 1) * 24)
      if (tc.current)
        tc.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(Math.floor(s) % 60)}:${pad(frames)}`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const triggers = sections.map((s, i) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && setScene(i),
      }),
    )
    const progress = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => bar.current && gsap.set(bar.current, { scaleX: self.progress }),
    })
    gsap.fromTo('.hud__item', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out', delay: 0.4 })
    return () => {
      cancelAnimationFrame(raf)
      triggers.forEach((t) => t.kill())
      progress.kill()
    }
  }, [ready])

  useEffect(() => {
    lockScroll(menu)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  const go = (id: string) => {
    setMenu(false)
    requestAnimationFrame(() => scrollToId(id))
  }

  return (
    <>
      <div className="hud" aria-hidden={!ready}>
        <span className="hud__corner hud__corner--tl" />
        <span className="hud__corner hud__corner--tr" />
        <span className="hud__corner hud__corner--bl" />
        <span className="hud__corner hud__corner--br" />

        <div className="hud__item hud__tl mono">
          <a href="#top" className="hud__brand" onClick={(e) => { e.preventDefault(); go('top') }} aria-label="Back to top">
            <span className="rec" aria-hidden="true" /> REC
          </a>
          <span ref={tc} className="hud__tc">00:00:00:00</span>
        </div>

        <nav className="hud__item hud__nav mono" aria-label="Primary">
          <a href="#scenes" onClick={(e) => { e.preventDefault(); go('scenes') }}>Work</a>
          <a href="#archive" onClick={(e) => { e.preventDefault(); go('archive') }}>Projects</a>
          <a href="#toolkit" onClick={(e) => { e.preventDefault(); go('toolkit') }}>Tech Stack</a>
          <a href="#credits" onClick={(e) => { e.preventDefault(); go('credits') }}>Contact</a>
          <a href={profile.resume} target="_blank" rel="noreferrer" className="hud__cv">
            Resume ↗
          </a>
        </nav>

        <div className="hud__item hud__tr mono">
          <span className="hud__slate">
            SC.{pad(scene + 1)} <i>—</i> {sections[scene].label}
          </span>
          <button className="hud__menu" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="index">
            {menu ? 'Close' : 'Index'}
          </button>
        </div>

        <div className="hud__item hud__bl mono">
          <span>24 FPS</span>
          <span>f/1.8</span>
          <span className="hide-sm">12.97° N 77.59° E</span>
        </div>

        <div className="hud__item hud__br mono">
          <span className="hud__frames">
            <span ref={bar} className="hud__bar" />
          </span>
        </div>
      </div>

      <div id="index" className={`index ${menu ? 'is-open' : ''}`} aria-hidden={!menu}>
        <ol>
          {sections.map((s, i) => (
            <li key={s.id}>
              <button onClick={() => go(s.id)} tabIndex={menu ? 0 : -1}>
                <span className="mono">SC.{pad(i + 1)}</span>
                {s.label}
              </button>
            </li>
          ))}
        </ol>
        <a className="mono" href={profile.resume} target="_blank" rel="noreferrer" tabIndex={menu ? 0 : -1}>
          Download Resume ↗
        </a>
      </div>
    </>
  )
}
