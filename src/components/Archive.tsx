import { useEffect, useRef } from 'react'
import { archive, profile } from '../data'
import { gsap } from '../lib/motion'

export default function Archive() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.arc__row', {
        y: 30,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.arc__list', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="archive" className="section archive" ref={root}>
      <header className="sec-head">
        <span className="mono">SC.04</span>
        <span className="mono">Projects</span>
      </header>
      <div className="archive__top">
        <h2 className="display">
          Projects <span className="serif">&amp; experiments.</span>
        </h2>
        <a className="link-arrow" href={profile.github} target="_blank" rel="noreferrer">
          All repositories on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
      <ol className="arc__list">
        {archive.map((a, i) => (
          <li className="arc__row" key={a.name}>
            <a href={a.url} target="_blank" rel="noreferrer" className="arc__link">
              <span className="mono arc__i">{String(i + 1).padStart(2, '0')}</span>
              <span className="arc__name">{a.name}</span>
              <span className="arc__desc">{a.desc}</span>
              <span className="mono arc__lang">{a.lang}</span>
              <span className="mono arc__year">{a.year}</span>
              <span className="arc__go" aria-hidden="true">↗</span>
            </a>
            {a.live && (
              <a className="arc__live mono" href={a.live} target="_blank" rel="noreferrer">
                <span className="rec" aria-hidden="true" /> Live
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
