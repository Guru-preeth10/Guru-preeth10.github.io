import { useEffect, useRef, useState } from 'react'
import { profile } from '../data'
import { gsap } from '../lib/motion'

const roll = [
  ['Directed by', 'Gurupreeth H'],
  ['Written in', 'React · TypeScript'],
  ['Motion', 'GSAP · ScrollTrigger · Lenis'],
  ['Cinematography', 'Raw WebGL fragment shader'],
  ['Typography', 'Bricolage Grotesque · Instrument Serif · Geist'],
  ['Shot on location', 'Bengaluru, Karnataka'],
  ['Languages spoken', 'English · Hindi · Kannada'],
]

export default function Credits() {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.credits__big .char', {
        yPercent: 110,
        stagger: 0.03,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.credits__big', start: 'top 85%' },
      })
      gsap.from('.roll li', {
        y: 50,
        autoAlpha: 0,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: '.roll', start: 'top 90%', end: 'bottom 60%', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const big = "Let's roll."
  return (
    <section id="credits" className="section credits" ref={root}>
      <header className="sec-head">
        <span className="mono">SC.07</span>
        <span className="mono">End credits</span>
      </header>

      <p className="credits__pre serif">Have a scene that needs building?</p>
      <h2 className="credits__big" aria-label={big}>
        {big.split('').map((c, i) => (
          <span className="char" key={i} aria-hidden="true">
            {c === ' ' ? '\u00a0' : c}
          </span>
        ))}
      </h2>

      <div className="contact">
        <a className="contact__mail" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <button className="btn btn--ghost mono" onClick={copy} aria-live="polite">
          {copied ? 'Copied ✓' : 'Copy email'}
        </button>
      </div>

      <ul className="channels mono">
        <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a></li>
        <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
        <li><a href={profile.resume} target="_blank" rel="noreferrer">Resume (PDF) ↗</a></li>
        <li><a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a></li>
      </ul>

      <ol className="roll">
        {roll.map(([k, v]) => (
          <li key={k}>
            <span className="mono">{k}</span>
            <span>{v}</span>
          </li>
        ))}
      </ol>

      <footer className="foot mono">
        <span>© {new Date().getFullYear()} Gurupreeth H</span>
        <span>No frames were dropped in the making of this site.</span>
        <span>FIN.</span>
      </footer>
    </section>
  )
}
