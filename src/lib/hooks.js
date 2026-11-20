import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from './scroll'

/** true while the element is (near) the viewport — used to pause offscreen canvases */
export function useInView(ref, margin = '200px') {
  const [inView, set] = useState(true)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => set(e.isIntersecting), { rootMargin: margin })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref, margin])
  return inView
}

/** 0..1 progress of a tall section scrolling past, kept in a ref (no re-renders) */
export function useSectionProgress(ref, { start = 'top top', end = 'bottom bottom', onUpdate } = {}) {
  const progress = useRef(0)
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      onUpdate: (s) => {
        progress.current = s.progress
        onUpdate?.(s.progress)
      },
    })
    return () => st.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, start, end])
  return progress
}
