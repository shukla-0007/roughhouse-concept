import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { store } from '../store'

gsap.registerPlugin(ScrollTrigger)

export const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)

// Normalised scroll velocity, read by the WebGL scenes every frame
export const scrollState = { velocity: 0 }
lenis.on('scroll', (l) => {
  scrollState.velocity = l.velocity
  // screens slide out from under a still pointer without a pointerout — drop stale labels
  if (Math.abs(l.velocity) > 1.5 && store.get().cursor) store.set({ cursor: null })
})

export { gsap, ScrollTrigger }
