import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { gsap, lenis } from '../lib/scroll'
import { store, useStore } from '../store'

/* ── Loader: a film-leader countdown ──────────────────────────────────── */
export function Loader() {
  const { progress } = useProgress()
  const scenes = useStore((s) => s.scenesReady)
  const [gone, setGone] = useState(false)
  const root = useRef()
  const done = useRef(false)
  const t0 = useRef(performance.now())
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    lenis.stop()
    const id = setTimeout(() => setTimedOut(true), 12000)
    return () => clearTimeout(id)
  }, [])

  const complete = scenes >= 1 || timedOut
  const digit = complete ? 1 : Math.max(2, 5 - Math.floor((progress / 100) * 3))

  useEffect(() => {
    if (!complete || done.current) return
    done.current = true
    const wait = Math.max(0, 1600 - (performance.now() - t0.current))
    const id = setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true)
          lenis.start()
        },
      })
      tl.to('.loader__flash', { opacity: 1, duration: 0.08 })
        .add(() => store.set({ ready: true }))
        .set(root.current, { background: 'transparent' })
        .set('.loader__inner', { autoAlpha: 0 })
        .to('.loader__flash', { opacity: 0, duration: 0.5, ease: 'power2.out' })
    }, wait)
    return () => clearTimeout(id)
  }, [complete])

  if (gone) return null
  return (
    <div ref={root} className="loader" aria-live="polite">
      <div className="loader__inner">
        <div className="leader">
          <svg viewBox="0 0 200 200" aria-hidden>
            <circle cx="100" cy="100" r="92" />
            <circle cx="100" cy="100" r="74" />
            <line x1="0" y1="100" x2="200" y2="100" />
            <line x1="100" y1="0" x2="100" y2="200" />
          </svg>
          <div className="leader__sweep" />
          <span className="leader__digit">{digit}</span>
        </div>
        <p className="loader__label mono">Stand by — {Math.round(progress)}%</p>
        <p className="loader__sample">A sample concept by <em>Ayush Shukla</em></p>
      </div>
      <div className="loader__flash" />
    </div>
  )
}

/* ── Cursor ───────────────────────────────────────────────────────────── */
export function Cursor() {
  const dot = useRef()
  const ring = useRef()
  const label = useStore((s) => s.cursor)

  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.12 })
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.12 })
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })
    const move = (e) => {
      xd(e.clientX)
      yd(e.clientY)
      xr(e.clientX)
      yr(e.clientY)
    }
    const over = (e) => {
      const el = e.target.closest('a, button, [data-cursor]')
      ring.current?.classList.toggle('is-link', !!el)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className={`cursor-ring ${label ? 'has-label' : ''}`} aria-hidden>
        <span>{label}</span>
      </div>
    </>
  )
}

/* ── Nav ──────────────────────────────────────────────────────────────── */
const LINKS = [
  ['Services', '#channels'],
  ['Crisis', '#crisis'],
  ['Team', '#team'],
  ['Clients', '#clients'],
  ['Journal', '#journal'],
]

export function Nav() {
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    let last = 0
    const on = ({ scroll }) => {
      setHidden(scroll > 200 && scroll > last)
      setSolid(scroll > window.innerHeight * 2.6)
      last = scroll
    }
    lenis.on('scroll', on)
    return () => lenis.off('scroll', on)
  }, [])

  const go = (href) => (e) => {
    e.preventDefault()
    setOpen(false)
    lenis.scrollTo(href, { duration: 1.6 })
  }

  return (
    <header className={`nav ${hidden && !open ? 'is-hidden' : ''} ${open ? 'is-open' : ''} ${solid ? 'is-solid' : ''}`}>
      <a href="#top" className="wordmark" onClick={go('#top')} aria-label="Rough House Media — home">
        rough<span>house</span>
        <small>media</small>
      </a>
      <nav className="nav__links">
        {LINKS.map(([l, h]) => (
          <a key={h} href={h} onClick={go(h)}>
            {l}
          </a>
        ))}
      </nav>
      <a href="#contact" className="nav__cta" onClick={go('#contact')}>
        <span className="live-dot" /> Book a call
      </a>
      <button className="nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <i />
        <i />
      </button>
    </header>
  )
}

/* ── Broadcast "bug": the sample watermark, styled like a channel logo ── */
export function Bug() {
  return (
    <div className="bug" title="Sample redesign concept by Ayush Shukla">
      <span className="bug__tag">SAMPLE</span>
      <span className="bug__name">Concept by Ayush Shukla</span>
    </div>
  )
}
