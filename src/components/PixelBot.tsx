import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/*
  BIT-24: A tiny 16x16 pixel-art AI code-bot companion that wakes up once you
  scroll past the opening Hero and trots after your cursor.
  Drawn on a crisp pixelated canvas — zero external sprites, pointer-events: none.
*/

type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string }

const INK = '#0a0b0d'
const VISOR = '#12151b'
const BONE = '#ece7dd'
const SHADE = '#aba59a'
const EMBER = '#f45d2c'
const GLOW = '#ffb194'
const LIME = '#b9d97a'

export default function PixelBot() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false

    let active = false
    let hoveredInteractive = false
    let happyUntil = 0
    let lastMoveAt = performance.now()

    const mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 }
    const pos = { x: mouse.x + 28, y: mouse.y + 20 }
    const vel = { x: 0, y: 0 }
    const sparks: Spark[] = []

    let raf = 0
    let walkPhase = 0

    const updateScrollVisibility = () => {
      const shouldShow = window.scrollY > window.innerHeight * 0.42
      if (shouldShow && !active) {
        pos.x = mouse.x + 32
        pos.y = mouse.y + 24
        active = true
        wrap.classList.add('is-active')
        if (!raf) raf = requestAnimationFrame(render)
      } else if (!shouldShow && active) {
        active = false
        wrap.classList.remove('is-active')
        if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      }
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      lastMoveAt = performance.now()
      const el = e.target as Element | null
      hoveredInteractive = !!el?.closest('a, button, [role="tab"]')
    }

    const onDown = () => {
      if (!active) return
      happyUntil = performance.now() + 550
      lastMoveAt = performance.now()
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
        sparks.push({
          x: 10,
          y: 5,
          vx: Math.cos(a) * (0.28 + Math.random() * 0.18),
          vy: Math.sin(a) * (0.28 + Math.random() * 0.18) - 0.15,
          life: 1,
          color: i % 2 === 0 ? EMBER : BONE,
        })
      }
    }

    updateScrollVisibility()
    window.addEventListener('scroll', updateScrollVisibility, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })

    // Helper to paint pixel rectangles on a 20x20 virtual grid (scaled 3x -> 60x60)
    const S = 3
    const px = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color
      ctx.fillRect(Math.round(x) * S, Math.round(y) * S, w * S, h * S)
    }

    const render = (now: number) => {
      if (!active) {
        raf = 0
        return
      }
      raf = requestAnimationFrame(render)

      // Target offset beside cursor (flips to left side if near right edge)
      const offsetX = mouse.x > window.innerWidth - 90 ? -42 : 26
      const offsetY = 18
      const tx = mouse.x + offsetX
      const ty = mouse.y + offsetY

      const dx = tx - pos.x
      const dy = ty - pos.y
      const dist = Math.hypot(dx, dy)

      if (dist > 2.5) {
        const pull = Math.min(0.14, 0.045 + dist * 0.0006)
        vel.x = vel.x * 0.72 + dx * pull
        vel.y = vel.y * 0.72 + dy * pull
        const speed = Math.hypot(vel.x, vel.y)
        const maxSpeed = 9.5
        if (speed > maxSpeed) {
          vel.x = (vel.x / speed) * maxSpeed
          vel.y = (vel.y / speed) * maxSpeed
        }
        pos.x += vel.x
        pos.y += vel.y
        walkPhase += Math.min(0.38, speed * 0.075)
      } else {
        vel.x *= 0.6
        vel.y *= 0.6
      }

      const speed = Math.hypot(vel.x, vel.y)
      const isMoving = dist > 4 && speed > 0.35
      const idleMs = now - lastMoveAt
      const isSleeping = !isMoving && idleMs > 4200 && now > happyUntil
      const isHappy = now < happyUntil

      const tilt = Math.max(-7, Math.min(7, vel.x * 0.9))
      wrap.style.transform = `translate3d(${(pos.x - 30).toFixed(1)}px, ${(pos.y - 30).toFixed(1)}px, 0) rotate(${tilt.toFixed(1)}deg)`

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Bobbing offset (in virtual pixels)
      const bob = isMoving
        ? (Math.sin(walkPhase * 2) > 0 ? -1 : 0)
        : isSleeping
          ? 1
          : Math.sin(now * 0.004) > 0.3
            ? -1
            : 0

      // Ground shadow
      px(6, 18, 8, 1, 'rgba(0,0,0,0.42)')

      // Antenna
      const antY = 3 + bob
      px(9, antY + 1, 2, 2, SHADE)
      const ledColor = hoveredInteractive
        ? LIME
        : Math.sin(now * 0.007) > -0.2
          ? EMBER
          : GLOW
      px(9, antY, 2, 1, isSleeping ? SHADE : ledColor)

      // Head outline (12x8 at x=4..15, y=5..12 + bob)
      const hy = 5 + bob
      px(5, hy - 1, 10, 1, INK)
      px(4, hy, 12, 7, INK)
      px(5, hy + 7, 10, 1, INK)

      // Head shell (bone + subtle bottom/side bevel)
      px(5, hy, 10, 7, BONE)
      px(5, hy + 6, 10, 1, SHADE)
      px(14, hy + 1, 1, 5, SHADE)
      // Side ear bolts
      px(3, hy + 2, 1, 3, SHADE)
      px(16, hy + 2, 1, 3, SHADE)

      // Dark CRT Visor (x=6..13, y=hy+1..hy+5)
      px(6, hy + 1, 8, 5, VISOR)

      // Eye look offset (-1, 0, +1) toward cursor
      const lookX = Math.abs(mouse.x - pos.x) < 12 ? 0 : mouse.x < pos.x ? -1 : 1
      const blinking = !isSleeping && !isHappy && (now % 3400) < 130

      const eyeColor = hoveredInteractive ? LIME : EMBER
      const ex1 = 7 + (lookX > 0 ? 1 : 0)
      const ex2 = 11 + (lookX < 0 ? -1 : 0)

      if (isHappy) {
        // Happy ^ ^ pixel eyes
        px(7, hy + 3, 1, 1, EMBER)
        px(8, hy + 2, 1, 1, GLOW)
        px(9, hy + 3, 1, 1, EMBER)

        px(11, hy + 3, 1, 1, EMBER)
        px(12, hy + 2, 1, 1, GLOW)
        px(13, hy + 3, 1, 1, EMBER)
      } else if (isSleeping || blinking) {
        // Closed - - eyes
        px(7, hy + 4, 2, 1, isSleeping ? SHADE : eyeColor)
        px(11, hy + 4, 2, 1, isSleeping ? SHADE : eyeColor)
      } else if (hoveredInteractive) {
        // Curious < > code bracket eyes when hovering clickable UI
        px(8, hy + 2, 1, 1, LIME)
        px(7, hy + 3, 1, 1, LIME)
        px(8, hy + 4, 1, 1, LIME)

        px(11, hy + 2, 1, 1, LIME)
        px(12, hy + 3, 1, 1, LIME)
        px(11, hy + 4, 1, 1, LIME)
      } else {
        // Standard glowing 2x2 eyes + specular pixel
        px(ex1, hy + 2, 2, 2, eyeColor)
        px(ex1, hy + 2, 1, 1, GLOW)
        px(ex2, hy + 2, 2, 2, eyeColor)
        px(ex2, hy + 2, 1, 1, GLOW)
      }

      // Compact torso (x=6..13, y=hy+7..hy+9)
      const by = hy + 7
      px(6, by, 8, 3, INK)
      px(7, by, 6, 2, SHADE)
      // Glowing core pixel
      px(9, by + 1, 2, 1, isSleeping ? VISOR : EMBER)

      // Pixel feet (alternating 4-step trot when moving)
      const fy = by + 2
      if (isMoving) {
        const step = Math.floor(walkPhase) % 2
        px(6, fy + (step === 0 ? 0 : 1), 2, 2, INK)
        px(6, fy + (step === 0 ? 0 : 1), 2, 1, BONE)
        px(12, fy + (step === 1 ? 0 : 1), 2, 2, INK)
        px(12, fy + (step === 1 ? 0 : 1), 2, 1, BONE)
      } else if (isSleeping) {
        px(6, fy, 3, 1, BONE)
        px(11, fy, 3, 1, BONE)
      } else {
        px(7, fy, 2, 2, INK)
        px(7, fy, 2, 1, BONE)
        px(11, fy, 2, 2, INK)
        px(11, fy, 2, 1, BONE)
      }

      // Sleeping floating pixel 'z'
      if (isSleeping) {
        const zPhase = ((now * 0.0015) % 1)
        const zy = Math.round(3 - zPhase * 3)
        const zx = 14 + Math.round(zPhase * 2)
        ctx.globalAlpha = 1 - zPhase
        px(zx, zy, 3, 1, BONE)
        px(zx + 1, zy + 1, 1, 1, BONE)
        px(zx, zy + 2, 3, 1, BONE)
        ctx.globalAlpha = 1
      }

      // Click sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.015
        s.life -= 0.045
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.globalAlpha = Math.max(0, s.life)
        px(s.x, s.y, 1, 1, s.color)
        ctx.globalAlpha = 1
      }
    }

    if (active && !raf) raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', updateScrollVisibility)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <div ref={wrapRef} className="pixel-bot" aria-hidden="true">
      <canvas ref={canvasRef} width={60} height={60} />
    </div>
  )
}
