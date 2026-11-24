import { useEffect, useRef } from 'react'
import { scenes, type Scene } from '../data'
import { gsap, ScrollTrigger } from '../lib/motion'
import GatewayViz from './viz/GatewayViz'
import SchedulerViz from './viz/SchedulerViz'
import FinanceViz from './viz/FinanceViz'
import BitesViz from './viz/BitesViz'

const Viz = ({ kind }: { kind: Scene['visual'] }) =>
  kind === 'gateway' ? <GatewayViz /> : kind === 'scheduler' ? <SchedulerViz /> : kind === 'finance' ? <FinanceViz /> : <BitesViz />

export default function Scenes() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const el = track.current!
      const dist = () => el.scrollWidth - window.innerWidth
      const tween = gsap.to(el, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => `+=${dist()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      gsap.utils.toArray<HTMLElement>('.scene').forEach((s) => {
        gsap.from(s.querySelectorAll('[data-in]'), {
          y: 40,
          autoAlpha: 0,
          stagger: 0.06,
          ease: 'power3.out',
          duration: 0.9,
          scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left 70%' },
        })
      })
      gsap.to('.reel__progress i', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: true },
      })
    })
    mm.add('(max-width: 1023px)', () => {
      gsap.utils.toArray<HTMLElement>('.scene').forEach((s) => {
        gsap.from(s.querySelectorAll('[data-in]'), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: s, start: 'top 80%' },
        })
      })
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => {
      clearTimeout(t)
      mm.revert()
    }
  }, [])

  return (
    <section id="scenes" className="reel" ref={root} aria-label="Selected work">
      <div className="reel__track" ref={track}>
        <div className="reel__intro">
          <header className="sec-head">
            <span className="mono">SC.03</span>
            <span className="mono">Selected work</span>
          </header>
          <h2 className="display">
            Four scenes,
            <br />
            <span className="serif">one director.</span>
          </h2>
          <p className="muted">
            Each project is cut like a scene: a logline, the craft behind it, and a live replay of how it behaves.
          </p>
          <span className="reel__hint mono" aria-hidden="true">
            <span className="reel__progress"><i /></span>
          </span>
        </div>

        {scenes.map((s) => (
          <article className="scene" key={s.id} aria-labelledby={`${s.id}-t`}>
            <div className="scene__copy">
              <div className="scene__slate mono" data-in>
                <span>SCENE {s.no}</span>
                <span>{s.kicker}</span>
                <span>{s.year}</span>
              </div>
              <h3 id={`${s.id}-t`} className="scene__title" data-in>
                {s.title}
              </h3>
              <p className="scene__log" data-in>
                {s.logline}
              </p>
              <ul className="scene__points" data-in>
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {s.metrics && (
                <dl className="scene__metrics" data-in>
                  {s.metrics.map((m) => (
                    <div key={m.k}>
                      <dt>{m.v}</dt>
                      <dd className="mono">{m.k}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="scene__foot" data-in>
                <ul className="tags mono">
                  {s.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <a className="link-arrow" href={s.repo} target="_blank" rel="noreferrer">
                  View source <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <div className="scene__viz" data-in>
              <span className="scene__no" aria-hidden="true">{s.no}</span>
              <Viz kind={s.visual} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
