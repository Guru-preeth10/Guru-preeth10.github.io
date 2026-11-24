import { useEffect, useRef } from 'react'
import { toolkit } from '../data'
import { gsap } from '../lib/motion'

export default function Toolkit() {
  const root = useRef<HTMLElement>(null)
  const all = toolkit.flatMap((g) => g.items)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.marquee__row--a', {
        xPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(
        '.marquee__row--b',
        { xPercent: -18 },
        { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.from('.kit__group', {
        y: 30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.kit__groups', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="toolkit" className="section toolkit" ref={root}>
      <header className="sec-head">
        <span className="mono">SC.05</span>
        <span className="mono">Toolkit</span>
      </header>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__row marquee__row--a">
          {[...all, ...all].map((t, i) => (
            <span key={i} className={i % 3 === 1 ? 'is-solid' : ''}>{t}</span>
          ))}
        </div>
        <div className="marquee__row marquee__row--b">
          {[...all].reverse().concat([...all].reverse()).map((t, i) => (
            <span key={i} className={i % 4 === 2 ? 'is-solid' : ''}>{t}</span>
          ))}
        </div>
      </div>

      <div className="kit">
        <div className="kit__lead">
          <h2 className="display">
            The camera <span className="serif">kit.</span>
          </h2>
          <p className="muted">
            Languages, frameworks and tools I reach for — from on-device models to Gradle build variants.
          </p>
        </div>
        <dl className="kit__groups">
          {toolkit.map((g) => (
            <div className="kit__group" key={g.group}>
              <dt className="mono">{g.group}</dt>
              <dd>
                {g.items.map((it) => (
                  <span key={it}>{it}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
