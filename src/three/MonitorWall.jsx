import { use, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { CANVAS_SCREENS } from './ScreenMaterial'
import { SCREENS, media } from '../data'
import { store } from '../store'
import { lenis, scrollState } from '../lib/scroll'

const COLS = 5
const ROWS = 3
const SW = 1.6 // screen width
const SH = 0.9 // screen height
const GAP = 0.14
const R = 10 // radius of the curved wall
const STEP = (SW + GAP) / R
const CENTER = 7
const FOV = 35
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2))

const fontsReady =
  typeof document !== 'undefined' && document.fonts
    ? Promise.all([
        document.fonts.load('800 64px "Archivo"'),
        document.fonts.load('500 64px "JetBrains Mono"'),
      ]).catch(() => null)
    : Promise.resolve()

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function slot(i) {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  const a = (col - (COLS - 1) / 2) * STEP
  const y = ((ROWS - 1) / 2 - row) * (SH + GAP)
  return { a, y, pos: [Math.sin(a) * R, y, -Math.cos(a) * R], rot: [0, -a, 0] }
}

function Monitor({ i, screen, texture, aspect, materials, tally }) {
  const { pos, rot } = slot(i)
  const mat = useRef()
  const tallyMat = useRef()

  useEffect(() => {
    materials.current[i] = mat.current
    tally.current[i] = tallyMat.current
  }, [i, materials, tally])

  const hover = (on) => (e) => {
    if (on) e.stopPropagation()
    if (screen.kind === 'onair') return
    gsap.to(mat.current.uniforms.uHover, { value: on ? 1 : 0, duration: on ? 0.35 : 0.6, ease: 'power2.out' })
    if (screen.target) {
      store.set({ cursor: on ? screen.label : null })
      document.body.style.cursor = on ? 'pointer' : ''
    }
  }

  return (
    <group position={pos} rotation={rot}>
      <RoundedBox args={[SW + 0.1, SH + 0.1, 0.16]} radius={0.035} smoothness={3} position={[0, 0, -0.085]}>
        <meshBasicMaterial color="#141118" />
      </RoundedBox>
      {/* tally light */}
      <mesh position={[SW / 2 - 0.1, SH / 2 + 0.028, 0.002]}>
        <planeGeometry args={[0.12, 0.018]} />
        <meshBasicMaterial ref={tallyMat} color={screen.kind === 'onair' ? '#ff3b30' : '#3a2a2e'} toneMapped={false} />
      </mesh>
      <mesh
        onPointerOver={hover(true)}
        onPointerOut={hover(false)}
        onClick={(e) => {
          e.stopPropagation()
          if (screen.target) lenis.scrollTo(screen.target, { duration: 1.6 })
        }}
      >
        <planeGeometry args={[SW, SH]} />
        <screenMaterial
          ref={mat}
          uMap={texture}
          uImgAspect={aspect}
          uPlaneAspect={SW / SH}
          uSeed={(i * 0.137) % 1}
          uOn={0}
          uHover={screen.kind === 'onair' ? 1 : 0}
        />
      </mesh>
    </group>
  )
}

export default function MonitorWall({ progress }) {
  use(fontsReady)
  const imgScreens = SCREENS.map((s, i) => [s, i]).filter(([s]) => s.kind === 'img')
  const loaded = useTexture(imgScreens.map(([s]) => media(s.src)))
  const canvases = useMemo(() => {
    const out = {}
    SCREENS.forEach((s, i) => {
      if (s.kind !== 'img') out[i] = CANVAS_SCREENS[s.kind]()
    })
    return out
  }, [])

  const textures = useMemo(() => {
    const out = {}
    imgScreens.forEach(([, i], k) => {
      const t = loaded[k]
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
      out[i] = { texture: t, aspect: t.image.width / t.image.height }
    })
    Object.entries(canvases).forEach(([i, c]) => (out[i] = { texture: c.texture, aspect: 16 / 9 }))
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, canvases])

  const materials = useRef([])
  const tally = useRef([])
  const { camera, size, pointer } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  const ptr = useRef({ x: 0, y: 0 })
  const powered = useRef(false)

  useEffect(() => {
    store.set((s) => ({ scenesReady: s.scenesReady + 1 }))
  }, [])

  // CRT power-on, centre screen first, once the loader has cut away
  useEffect(() => {
    const powerOn = () => {
      if (powered.current) return
      powered.current = true
      materials.current.forEach((m, i) => {
        if (!m) return
        const { a, y } = slot(i)
        const dist = Math.hypot(a * R, y)
        gsap.to(m.uniforms.uOn, { value: 1, duration: 0.9, delay: 0.15 + dist * 0.12, ease: 'power2.out' })
      })
    }
    if (store.get().ready) powerOn()
    return store.sub(() => store.get().ready && powerOn())
  }, [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const p = progress.current
    const aspect = size.width / size.height

    // distance that fills the frame with the centre screen → distance that shows the whole wall
    const dNear = Math.max(SH / 2 / TAN, SW / 2 / (TAN * aspect)) * 0.86
    // outer edge of the end columns sits ~0.9 in front of the wall centre on the curve
    const dFar = THREE.MathUtils.clamp(Math.max(4.5 / (TAN * aspect), 2.1 / TAN) + 0.9, 9.4, 24)
    const k = easeInOut(THREE.MathUtils.clamp(p / 0.7, 0, 1))
    const tail = THREE.MathUtils.clamp((p - 0.7) / 0.3, 0, 1)
    const d = THREE.MathUtils.lerp(dNear, dFar, k) + tail * 1.5

    ptr.current.x += (pointer.x - ptr.current.x) * Math.min(1, dt * 3)
    ptr.current.y += (pointer.y - ptr.current.y) * Math.min(1, dt * 3)
    const sway = 0.15 + k * 0.85

    camera.position.set(
      ptr.current.x * 0.55 * sway + Math.sin(t * 0.25) * 0.04,
      ptr.current.y * 0.3 * sway - k * 0.15,
      -R + d,
    )
    // lift the wall in frame as the camera pulls out, leaving room for the caption
    look.set(ptr.current.x * 0.15 * sway, -k * 0.95, -R)
    camera.lookAt(look)
    camera.rotation.z = -tail * 0.03 + ptr.current.x * -0.01
    if (camera.fov !== FOV) {
      camera.fov = FOV
      camera.updateProjectionMatrix()
    }

    const vel = scrollState.velocity
    const dim = 1 - tail * 0.45
    materials.current.forEach((m, i) => {
      if (!m) return
      m.uniforms.uTime.value = t
      m.uniforms.uVel.value += (vel - m.uniforms.uVel.value) * 0.1
      m.uniforms.uDim.value = dim
      const hv = m.uniforms.uHover.value
      const tm = tally.current[i]
      if (tm && SCREENS[i].kind !== 'onair') tm.color.setRGB(0.23 + hv * 0.77, 0.16 + hv * 0.07, 0.18 + hv * 0.01)
    })
    Object.values(canvases).forEach((c) => c.update?.(t))
  })

  return (
    <group>
      {SCREENS.map((s, i) => (
        <Monitor
          key={i}
          i={i}
          screen={s}
          texture={textures[i].texture}
          aspect={textures[i].aspect}
          materials={materials}
          tally={tally}
        />
      ))}
    </group>
  )
}

export { CENTER }
