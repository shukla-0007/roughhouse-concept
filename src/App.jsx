import { useEffect } from 'react'
import { Loader, Cursor, Nav, Bug } from './components/Chrome'
import Hero from './components/Hero'
import { Manifesto, Channels, Crisis, Team, Vox, Clients, Journal, Contact } from './components/Sections'
import { gsap, ScrollTrigger } from './lib/scroll'
import { useStore } from './store'

export default function App() {
  const ready = useStore((s) => s.ready)

  useEffect(() => {
    if (!ready) return
    const batch = ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.06 }),
    })
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => {
      clearTimeout(id)
      batch.forEach((t) => t.kill())
    }
  }, [ready])

  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Channels />
        <Crisis />
        <Team />
        <Vox />
        <Clients />
        <Journal />
      </main>
      <Contact />
      <Bug />
      <div className="grain" aria-hidden />
    </>
  )
}
