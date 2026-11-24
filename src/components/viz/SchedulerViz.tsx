import { useMemo, useState } from 'react'
import { useVisibleTicker } from '../../lib/useVisibleTicker'

type P = { id: string; arrival: number; burst: number; priority: number }
type Slice = { id: string; start: number; end: number }

const procs: P[] = [
  { id: 'P1', arrival: 0, burst: 5, priority: 3 },
  { id: 'P2', arrival: 1, burst: 3, priority: 1 },
  { id: 'P3', arrival: 2, burst: 6, priority: 4 },
  { id: 'P4', arrival: 3, burst: 2, priority: 2 },
]

// Non-preemptive pick-next scheduler shared by FCFS / SJF / Priority
function pickNext(key: (p: P) => number): Slice[] {
  const left = [...procs]
  const out: Slice[] = []
  let t = 0
  while (left.length) {
    const ready = left.filter((p) => p.arrival <= t)
    if (!ready.length) { t = Math.min(...left.map((p) => p.arrival)); continue }
    ready.sort((a, b) => key(a) - key(b) || a.arrival - b.arrival)
    const p = ready[0]
    out.push({ id: p.id, start: t, end: t + p.burst })
    t += p.burst
    left.splice(left.indexOf(p), 1)
  }
  return out
}

function roundRobin(q: number): Slice[] {
  const rem = new Map(procs.map((p) => [p.id, p.burst]))
  const queue: P[] = []
  const out: Slice[] = []
  let t = 0, idx = 0
  const admit = () => { while (idx < procs.length && procs[idx].arrival <= t) queue.push(procs[idx++]) }
  admit()
  while (queue.length || idx < procs.length) {
    if (!queue.length) { t = procs[idx].arrival; admit(); continue }
    const p = queue.shift()!
    const run = Math.min(q, rem.get(p.id)!)
    out.push({ id: p.id, start: t, end: t + run })
    t += run
    rem.set(p.id, rem.get(p.id)! - run)
    admit()
    if (rem.get(p.id)! > 0) queue.push(p)
  }
  return out
}

const algos = [
  { name: 'FCFS', run: () => pickNext((p) => p.arrival) },
  { name: 'SJF', run: () => pickNext((p) => p.burst) },
  { name: 'Round Robin · q=2', run: () => roundRobin(2) },
  { name: 'Priority', run: () => pickNext((p) => p.priority) },
]

function avgWait(s: Slice[]) {
  const finish = new Map<string, number>()
  s.forEach((x) => finish.set(x.id, x.end))
  const w = procs.map((p) => finish.get(p.id)! - p.arrival - p.burst)
  return (w.reduce((a, b) => a + b, 0) / w.length).toFixed(2)
}

export default function SchedulerViz() {
  const [a, setA] = useState(0)
  const { ref } = useVisibleTicker(3200, () => setA((x) => (x + 1) % algos.length))
  const slices = useMemo(() => algos[a].run(), [a])
  const total = slices[slices.length - 1].end

  return (
    <div className="viz os" ref={ref}>
      <div className="viz__bar mono">
        <span>scheduler.gantt</span>
        <span>avg wait <b>{avgWait(slices)}</b> units</span>
      </div>
      <div className="os__tabs mono" role="tablist" aria-label="Scheduling algorithm">
        {algos.map((x, k) => (
          <button key={x.name} role="tab" aria-selected={k === a} className={k === a ? 'is-on' : ''} onClick={() => setA(k)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className="os__rows">
        {procs.map((p) => (
          <div className="os__row" key={p.id}>
            <span className="mono os__pid">{p.id}</span>
            <div className="os__lane">
              {slices.map((s, k) =>
                s.id === p.id ? (
                  <span
                    key={`${a}-${k}`}
                    className={`os__slice os__slice--${p.id}`}
                    style={{
                      left: `${(s.start / total) * 100}%`,
                      width: `${((s.end - s.start) / total) * 100}%`,
                      animationDelay: `${k * 90}ms`,
                    }}
                  />
                ) : null,
              )}
            </div>
          </div>
        ))}
        <div className="os__axis mono">
          {Array.from({ length: total + 1 }, (_, k) => (
            <span key={k} style={{ left: `${(k / total) * 100}%` }}>{k % 2 === 0 ? k : ''}</span>
          ))}
        </div>
      </div>
      <div className="os__legend mono">
        {procs.map((p) => (
          <span key={p.id}>
            {p.id} <i>arr {p.arrival} · burst {p.burst} · pri {p.priority}</i>
          </span>
        ))}
      </div>
    </div>
  )
}
