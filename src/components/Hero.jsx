import { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import MonitorWall from '../three/MonitorWall'
import { useInView, useSectionProgress } from '../lib/hooks'
import { gsap } from '../lib/scroll'
import { useStore } from '../store'
import Timecode from './Timecode'

export default function Hero() {
  const section = useRef()
  const progress = useSectionProgress(section)
  const inView = useInView(section)
  const ready = useStore((s) => s.ready)

  useLayoutEffect(() => {
    gsap.set('.hero__line > span', { yPercent: 110 })
    gsap.set('.hero__strap', { clipPath: 'inset(0 100% 0 0)' })
    gsap.set('.hero__meta, .hero__hint', { autoAlpha: 0 })
  }, [])

  useEffect(() => {
    if (!ready) return
    const tl = gsap.timeline({ delay: 0.9 })
    tl.to('.hero__line > span', { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 })
      .to('.hero__strap', { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.7')
      .to('.hero__meta, .hero__hint', { autoAlpha: 1, duration: 0.8 }, '-=0.4')
    return () => tl.kill()
  }, [ready])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
      tl.to('.hero__copy', { autoAlpha: 0, y: -40, duration: 0.18, ease: 'none' }, 0.1)
        .fromTo('.hero__hint', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.05, immediateRender: false }, 0.02)
        .fromTo('.hero__caption', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.5)
        .to('.hero__caption', { autoAlpha: 0, y: -30, duration: 0.1 }, 0.86)
        .to({}, { duration: 0.04 }, 0.96)
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={section} className="hero" id="top">
      <div className="hero__sticky">
        <div className="hero__glow" aria-hidden />
        <Canvas
          className="hero__canvas"
          frameloop={inView ? 'always' : 'never'}
          dpr={[1, 1.75]}
          flat
          camera={{ fov: 35, near: 0.1, far: 80, position: [0, 0, -8] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <MonitorWall progress={progress} />
          </Suspense>
        </Canvas>

        <div className="hero__frame" aria-hidden>
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
        </div>

        <div className="hero__meta mono">
          <span className="live-dot" /> LIVE <span className="sep">/</span> <Timecode />
          <span className="hero__meta-r">CAM 1 · STUDIO A</span>
        </div>

        <div className="hero__copy">
          <h1 className="hero__title">
            <span className="hero__line"><span>Making the media</span></span>
            <span className="hero__line"><span>work for <em>you.</em></span></span>
          </h1>
          <div className="hero__strap">
            <span className="hero__strap-tag">ROUGH HOUSE</span>
            <span className="hero__strap-text">Media training · Crisis communications · Video production</span>
          </div>
        </div>

        <p className="hero__caption">
          Founded in 1998 by two BBC journalists. <br />
          Trusted by charities, institutions and the people <em>who speak for them.</em>
        </p>

        <div className="hero__hint mono">
          <span>Scroll — cut to wide</span>
          <i />
        </div>
      </div>
    </section>
  )
}
