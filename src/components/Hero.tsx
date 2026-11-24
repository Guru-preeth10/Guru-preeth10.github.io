import { useEffect, useRef } from 'react'
import ShaderField from './ShaderField'
import { profile } from '../data'
import { gsap, scrollToId } from '../lib/motion'

const split = (word: string) =>
  word.split('').map((c, i) => (
    <span className="char" key={i} aria-hidden="true">
      {c}
    </span>
  ))

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero .char', { yPercent: 110, rotate: 6 })
      gsap.set('.hero [data-rise]', { autoAlpha: 0, y: 24 })
      if (!ready) return
      const tl = gsap.timeline({ delay: 0.05 })
      tl.to('.hero .char', { yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.035 })
        .to('.hero [data-rise]', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, '-=0.8')

      // camera "dolly out" as you leave the opening shot
      gsap.to('.hero__title', {
        yPercent: -18,
        scale: 0.94,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="top" className="hero" ref={root} aria-label="Introduction">
      <ShaderField />
      <div className="hero__frame">
        <p className="hero__eyebrow mono" data-rise>
          <span className="dot" /> AI / ML Engineer — Builder — Storyteller
        </p>

        <h1 className="hero__title" aria-label={profile.name}>
          <span className="line">
            {split(profile.first)}
            <span className="line__b">{split(profile.last)}</span>
            <span className="line__gap" aria-hidden="true">&nbsp;</span>
            <span className="line__init">{split('H')}</span>
            <span className="char char--dot" aria-hidden="true">.</span>
          </span>
        </h1>

        <p className="hero__tag serif" data-rise>
          Systems that <em>think</em>. Frames that <em>feel</em>.
        </p>

        <div className="hero__foot">
          <dl className="hero__meta" data-rise>
            <div>
              <dt className="mono">Role</dt>
              <dd>B.Tech CSE, AI &amp; ML</dd>
            </div>
            <div>
              <dt className="mono">Base</dt>
              <dd>RV University, Bengaluru</dd>
            </div>
            <div>
              <dt className="mono">Now</dt>
              <dd>Semester 5 · building on-device AI security</dd>
            </div>
          </dl>
          <div className="hero__cta" data-rise>
            <button className="btn btn--primary" onClick={() => scrollToId('scenes')}>
              <span>Roll the work</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
