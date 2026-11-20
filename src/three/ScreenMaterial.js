import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

/**
 * A broadcast-monitor screen: cover-fit image, light barrel distortion, scanlines,
 * rolling band, grain, chroma split (grows with scroll speed) and a CRT power-on.
 * Hover brings it "on air": full colour, clean picture.
 */
export const ScreenMaterial = shaderMaterial(
  {
    uMap: null,
    uImgAspect: 16 / 9,
    uPlaneAspect: 16 / 9,
    uTime: 0,
    uOn: 0,
    uHover: 0,
    uVel: 0,
    uSeed: 0,
    uDim: 1,
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform sampler2D uMap;
    uniform float uImgAspect, uPlaneAspect, uTime, uOn, uHover, uVel, uSeed, uDim;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    vec2 cover(vec2 uv) {
      float r = uPlaneAspect / uImgAspect;
      vec2 s = r > 1.0 ? vec2(1.0, 1.0 / r) : vec2(r, 1.0);
      return (uv - 0.5) * s + 0.5;
    }

    void main() {
      vec2 c = vUv - 0.5;
      float d = dot(c, c);
      vec2 uv = 0.5 + c * (1.0 + d * 0.07 * (1.0 - uHover * 0.7));

      // CRT power-on: a bright line opens horizontally, then vertically
      float sx = smoothstep(0.0, 0.3, uOn);
      float sy = smoothstep(0.25, 0.75, uOn);
      float mask = step(abs(c.x), 0.5 * sx) * step(abs(c.y), max(0.5 * sy, 0.004));

      float shift = 0.0012 + min(abs(uVel), 6.0) * 0.0012 + (1.0 - uHover) * 0.0008;
      vec2 cuv = cover(uv);
      vec3 col = vec3(
        texture2D(uMap, cuv + vec2(shift, 0.0)).r,
        texture2D(uMap, cuv).g,
        texture2D(uMap, cuv - vec2(shift, 0.0)).b
      );

      // off-air monitors run a little cool and desaturated
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      vec3 cool = mix(vec3(lum), col, 0.5) * vec3(0.86, 0.84, 1.0);
      col = mix(cool, col, uHover);

      float scan = 0.5 + 0.5 * sin(vUv.y * 340.0);
      col *= 1.0 - (1.0 - uHover * 0.75) * 0.1 * scan;
      float band = smoothstep(0.0, 0.12, abs(fract(vUv.y * 0.7 - uTime * 0.07 + uSeed) - 0.5));
      col *= 0.93 + 0.07 * band;

      float n = hash(floor(vUv * vec2(1280.0, 720.0)) + fract(uTime * 9.0) * 31.0);
      col += (n - 0.5) * (0.03 * (1.0 - uHover * 0.6) + min(abs(uVel), 6.0) * 0.015);

      col *= 1.0 - d * 1.15;
      col *= uDim;

      float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
      col = col * inside * mask + mask * (1.0 - sy) * 0.9;

      gl_FragColor = vec4(col, 1.0);
      #include <colorspace_fragment>
    }
  `,
)

extend({ ScreenMaterial })

/* ── Canvas-drawn screens ─────────────────────────────────────────────── */
const W = 768
const H = 432

function makeCanvas() {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  return c
}

function toTexture(canvas) {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

const FONT = '"Archivo", system-ui, sans-serif'
const MONO = '"JetBrains Mono", ui-monospace, monospace'

function bars() {
  const c = makeCanvas()
  const g = c.getContext('2d')
  const top = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0']
  const mid = ['#0000c0', '#131313', '#c000c0', '#131313', '#00c0c0', '#131313', '#c0c0c0']
  const bw = W / 7
  top.forEach((col, i) => ((g.fillStyle = col), g.fillRect(i * bw, 0, bw + 1, H * 0.67)))
  mid.forEach((col, i) => ((g.fillStyle = col), g.fillRect(i * bw, H * 0.67, bw + 1, H * 0.08)))
  const low = ['#00214c', '#ffffff', '#32006a', '#131313', '#090909', '#131313', '#1d1d1d']
  const lw = [1.25, 1.25, 1.25, 1.25, 0.33, 0.33, 1.34].map((v) => (v / 7) * W)
  let x = 0
  low.forEach((col, i) => ((g.fillStyle = col), g.fillRect(x, H * 0.75, lw[i] + 1, H * 0.25), (x += lw[i])))
  g.fillStyle = 'rgba(0,0,0,.72)'
  g.fillRect(W / 2 - 170, H * 0.33 - 34, 340, 68)
  g.fillStyle = '#fff'
  g.font = `600 30px ${FONT}`
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText('ROUGH HOUSE · 1998', W / 2, H * 0.33)
  return { texture: toTexture(c) }
}

function onAir() {
  const c = makeCanvas()
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W * 0.6)
  grd.addColorStop(0, '#3a0b0b')
  grd.addColorStop(1, '#0b0607')
  g.fillStyle = grd
  g.fillRect(0, 0, W, H)
  g.shadowColor = '#ff3b30'
  g.shadowBlur = 40
  g.strokeStyle = '#ff4b3e'
  g.lineWidth = 8
  g.beginPath()
  g.roundRect(W / 2 - 230, H / 2 - 82, 460, 164, 22)
  g.stroke()
  g.fillStyle = '#ff5a4d'
  g.font = `800 112px ${FONT}`
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText('ON AIR', W / 2, H / 2 + 6)
  return { texture: toTexture(c) }
}

function standBy() {
  const c = makeCanvas()
  const g = c.getContext('2d')
  g.fillStyle = '#1b1028'
  g.fillRect(0, 0, W, H)
  g.strokeStyle = 'rgba(255,255,255,.25)'
  g.lineWidth = 2
  g.beginPath()
  g.arc(W / 2, H / 2 - 18, 110, 0, Math.PI * 2)
  g.moveTo(W / 2 - 160, H / 2 - 18)
  g.lineTo(W / 2 + 160, H / 2 - 18)
  g.moveTo(W / 2, H / 2 - 150)
  g.lineTo(W / 2, H / 2 + 115)
  g.stroke()
  g.fillStyle = '#fff'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `800 64px ${FONT}`
  g.fillText('STAND BY', W / 2, H / 2 - 18)
  g.fillStyle = 'rgba(255,255,255,.7)'
  g.font = `500 22px ${MONO}`
  g.fillText('CONCEPT · AYUSH SHUKLA', W / 2, H - 52)
  return { texture: toTexture(c) }
}

/** live timecode — redrawn ~12×/s by `update` */
function rec() {
  const c = makeCanvas()
  const g = c.getContext('2d')
  const texture = toTexture(c)
  let last = -1
  const pad = (n) => String(n).padStart(2, '0')
  const update = (t) => {
    const f = Math.floor(t * 12)
    if (f === last) return
    last = f
    g.fillStyle = '#08070a'
    g.fillRect(0, 0, W, H)
    g.strokeStyle = 'rgba(255,255,255,.18)'
    g.lineWidth = 2
    const m = 34
    ;[[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, sx, sy]) => {
      g.beginPath()
      g.moveTo(x, y + 40 * sy)
      g.lineTo(x, y)
      g.lineTo(x + 40 * sx, y)
      g.stroke()
    })
    if (Math.floor(t * 1.4) % 2 === 0) {
      g.fillStyle = '#ff3b30'
      g.beginPath()
      g.arc(86, 92, 15, 0, Math.PI * 2)
      g.fill()
    }
    g.fillStyle = '#fff'
    g.font = `600 34px ${MONO}`
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    g.fillText('REC', 116, 93)
    const s = Math.floor(t)
    const tc = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(Math.floor(t * 25) % 25)}`
    g.font = `500 64px ${MONO}`
    g.textAlign = 'center'
    g.fillText(tc, W / 2, H / 2 + 6)
    g.font = `500 20px ${MONO}`
    g.fillStyle = 'rgba(255,255,255,.55)'
    g.fillText('CAM 2 · STUDIO A · RICHMOND', W / 2, H / 2 + 70)
    texture.needsUpdate = true
  }
  update(0)
  return { texture, update }
}

export const CANVAS_SCREENS = { bars, onair: onAir, standby: standBy, rec }
