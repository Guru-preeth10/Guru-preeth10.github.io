import { useCallback, useEffect, useState } from 'react'
import Preloader from './components/Preloader'
import Hud from './components/Hud'
import Hero from './components/Hero'
import Logline from './components/Logline'
import Scenes from './components/Scenes'
import Archive from './components/Archive'
import Toolkit from './components/Toolkit'
import Circuit from './components/Circuit'
import Credits from './components/Credits'
import { lockScroll, ScrollTrigger, startSmoothScroll } from './lib/motion'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    lockScroll(true)
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  const onDone = useCallback(() => {
    setReady(true)
    startSmoothScroll()
    lockScroll(false)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      {!ready && <Preloader onDone={onDone} />}
      <Hud ready={ready} />
      <main id="main" className={ready ? 'is-ready' : ''}>
        <Hero ready={ready} />
        <Logline />
        <Scenes />
        <Archive />
        <Toolkit />
        <Circuit />
        <Credits />
      </main>
    </>
  )
}
