import { useEffect, useRef, useState } from 'react'

/** Runs a ticking callback only while the element is on screen. */
export function useVisibleTicker(ms: number, onTick: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  const cb = useRef(onTick)
  cb.current = onTick
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => cb.current(), ms)
    return () => clearInterval(id)
  }, [visible, ms])

  return { ref, visible }
}
