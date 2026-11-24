import { useEffect, useRef } from 'react'
import { facts } from '../data'
import { gsap } from '../lib/motion'

const text =
  "I'm Gurupreeth — an engineering student who builds things end to end: security layers for language models, operating-system internals, containerised web apps and Android products. I also study film direction, so I care about how a system feels as much as how it works."

const highlight = new Set(['security', 'language', 'models,', 'operating-system', 'internals,', 'film', 'direction,', 'feels', 'works.'])

export default function Logline() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.logline__w',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: { trigger: '.logline__text', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.from('.fact', {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.facts', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="logline" className="section logline" ref={root}>
      <header className="sec-head">
        <span className="mono">SC.02</span>
        <span className="mono">Logline</span>
      </header>
      <p className="logline__text" aria-label={text}>
        {text.split(' ').map((w, i) => (
          <span key={i} className={`logline__w ${highlight.has(w) ? 'is-hl' : ''}`} aria-hidden="true">
            {w}{' '}
          </span>
        ))}
      </p>
      <div className="facts">
        {facts.map((f) => (
          <div className="fact" key={f.k}>
            <span className="mono fact__k">{f.k}</span>
            <span className="fact__v">{f.v}</span>
            <span className="fact__s">{f.s}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
