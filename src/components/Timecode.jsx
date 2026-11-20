import { useEffect, useRef } from 'react'

const pad = (n) => String(n).padStart(2, '0')

/** SMPTE-style running timecode, written straight to the DOM (no re-renders) */
export default function Timecode() {
  const el = useRef()
  useEffect(() => {
    const t0 = performance.now()
    let raf
    const tick = () => {
      const t = (performance.now() - t0) / 1000
      const s = Math.floor(t)
      if (el.current)
        el.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(Math.floor(t * 25) % 25)}`
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <span ref={el} className="timecode">00:00:00:00</span>
}
