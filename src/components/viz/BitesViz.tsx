import { useState } from 'react'
import { useVisibleTicker } from '../../lib/useVisibleTicker'

const menu = [
  { name: 'Masala Dosa', tag: 'South Indian', hue: 22 },
  { name: 'Veg Thali', tag: 'Meals', hue: 38 },
  { name: 'Paneer Roll', tag: 'Quick bites', hue: 12 },
  { name: 'Cold Coffee', tag: 'Beverages', hue: 30 },
  { name: 'Chole Bhature', tag: 'North Indian', hue: 18 },
]

export default function BitesViz() {
  const [cart, setCart] = useState<number[]>([])
  const [placed, setPlaced] = useState(false)
  const { ref } = useVisibleTicker(1100, () => {
    if (placed) { setPlaced(false); setCart([]); return }
    if (cart.length >= 3) { setPlaced(true); return }
    setCart((c) => [...c, [0, 3, 2][c.length]])
  })

  return (
    <div className="viz bites" ref={ref}>
      <div className="phone" aria-label="RVU Bites app mockup">
        <div className="phone__notch" />
        <div className="phone__screen">
          <header className="phone__head">
            <span className="phone__brand">RVU <b>Bites</b></span>
            <span className="phone__cart mono">{cart.length}</span>
          </header>
          <p className="phone__sub mono">Main canteen · open</p>
          <ul className="phone__list">
            {menu.map((m, k) => (
              <li key={m.name} className={cart.includes(k) ? 'is-in' : ''}>
                <span className="phone__thumb" style={{ background: `linear-gradient(135deg, hsl(${m.hue} 70% 55%), hsl(${m.hue + 15} 60% 30%))` }} />
                <span className="phone__txt">
                  <b>{m.name}</b>
                  <i>{m.tag}</i>
                </span>
                <span className="phone__add mono">{cart.includes(k) ? '✓' : '+'}</span>
              </li>
            ))}
          </ul>
          <button className={`phone__cta ${placed ? 'is-placed' : ''}`} tabIndex={-1}>
            {placed ? 'Order placed ✓' : `Place order · ${cart.length} item${cart.length === 1 ? '' : 's'}`}
          </button>
        </div>
      </div>
      <ul className="bites__spec mono">
        <li><span>Activities</span><span>Fragments</span></li>
        <li><span>RecyclerView</span><span>Material</span></li>
        <li><span>OkHttp · REST</span><span>Signed APK</span></li>
      </ul>
    </div>
  )
}
