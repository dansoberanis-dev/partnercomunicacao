import { useEffect, useRef } from 'react'
import {
  WORLD_BOUNDS,
  WORLD_DOT_COLS,
  WORLD_DOT_MASK,
  WORLD_DOT_ROWS,
  WORLD_LAND_POLYS,
} from '../data/world-map'

/**
 * Mapa-múndi widescreen animado para o hero das páginas internas (Sobre, Soluções, Contato).
 * Mantém a mesma linguagem visual do globo da página inicial:
 * - Continentes com preenchimento translúcido + textura de pontos luminosos ("luzes de cidades").
 * - Rede global de arcos curvos com pulsos de luz viajantes e ondas de chegada nos hubs.
 */

type LatLon = [number, number]

const HUBS: Record<string, LatLon> = {
  saoPaulo: [-23.55, -46.63],
  curitiba: [-25.43, -49.27],
  rio: [-22.9, -43.2],
  brasilia: [-15.8, -47.9],
  manaus: [-3.1, -60.0],
  recife: [-8.05, -34.9],
  buenosAires: [-34.6, -58.4],
  santiago: [-33.45, -70.67],
  lima: [-12.05, -77.04],
  bogota: [4.7, -74.07],
  mexico: [19.43, -99.13],
  miami: [25.76, -80.19],
  newYork: [40.71, -74.0],
  toronto: [43.65, -79.38],
  losAngeles: [34.05, -118.24],
  lisboa: [38.72, -9.14],
  london: [51.5, -0.12],
  madrid: [40.42, -3.7],
  paris: [48.85, 2.35],
  berlin: [52.52, 13.4],
  moscow: [55.75, 37.6],
  lagos: [6.52, 3.38],
  luanda: [-8.84, 13.23],
  capeTown: [-33.92, 18.42],
  nairobi: [-1.29, 36.82],
  cairo: [30.04, 31.24],
  dubai: [25.2, 55.27],
  mumbai: [19.07, 72.88],
  singapore: [1.35, 103.8],
  shanghai: [31.23, 121.47],
  tokyo: [35.68, 139.69],
  sydney: [-33.87, 151.2],
}

// [origem, destino] — mesma onda de propagação a partir de São Paulo em projeção widescreen.
const LINKS: [string, string][] = [
  ['saoPaulo', 'curitiba'],
  ['saoPaulo', 'rio'],
  ['saoPaulo', 'brasilia'],
  ['saoPaulo', 'buenosAires'],
  ['saoPaulo', 'lisboa'],
  ['saoPaulo', 'newYork'],
  ['saoPaulo', 'lagos'],
  ['saoPaulo', 'capeTown'],
  ['saoPaulo', 'miami'],
  ['brasilia', 'manaus'],
  ['brasilia', 'recife'],
  ['buenosAires', 'santiago'],
  ['santiago', 'lima'],
  ['manaus', 'bogota'],
  ['miami', 'mexico'],
  ['mexico', 'losAngeles'],
  ['losAngeles', 'newYork'],
  ['newYork', 'toronto'],
  ['newYork', 'london'],
  ['lisboa', 'madrid'],
  ['lisboa', 'london'],
  ['london', 'paris'],
  ['paris', 'berlin'],
  ['berlin', 'moscow'],
  ['london', 'cairo'],
  ['lagos', 'luanda'],
  ['lagos', 'nairobi'],
  ['capeTown', 'nairobi'],
  ['nairobi', 'dubai'],
  ['cairo', 'dubai'],
  ['dubai', 'mumbai'],
  ['mumbai', 'singapore'],
  ['singapore', 'shanghai'],
  ['shanghai', 'tokyo'],
  ['singapore', 'sydney'],
  ['moscow', 'shanghai'],
]

const ARC_SAMPLES = 48
const TRAIL = 0.3
const BUCKETS = 6

export type WorldMapVariant = 'default' | 'people' | 'solutions' | 'about'

const PEOPLE_COLORS = [
  { hex: '#FF4D5A', rgb: '255, 77, 90' }, // Vermelho
  { hex: '#38BDF8', rgb: '56, 189, 248' }, // Azul
  { hex: '#FACC15', rgb: '250, 204, 21' }, // Amarelo
] as const

const SOLUTION_PALETTE = [
  '#38BDF8', // 0: Consultoria, BI & KPIs
  '#22D3EE', // 1: Marketing Digital & Redes
  '#A78BFA', // 2: Design & Identidade Visual
  '#FBBF24', // 3: Coaching & Treinamentos
  '#FB7185', // 4: Sala VIP Foto & Audiovisual
] as const

const ABOUT_HUBS = [
  { hub: 'saoPaulo', letter: 'P' },
  { hub: 'newYork', letter: 'A' },
  { hub: 'london', letter: 'R' },
  { hub: 'cairo', letter: 'T' },
  { hub: 'dubai', letter: 'N' },
  { hub: 'singapore', letter: 'E' },
  { hub: 'tokyo', letter: 'R' },
] as const

function hash(i: number) {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return s - Math.floor(s)
}

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

interface DotPoint {
  lon: number
  lat: number
  bucket: number
}

let cachedDots: DotPoint[] | null = null
let cachedPolys: LatLon[][] | null = null

function getDots(): DotPoint[] {
  if (cachedDots) return cachedDots
  const bin = atob(WORLD_DOT_MASK)
  const { lonMin, lonMax, latMin, latMax } = WORLD_BOUNDS
  const dLon = (lonMax - lonMin) / WORLD_DOT_COLS
  const dLat = (latMax - latMin) / WORLD_DOT_ROWS
  const pts: DotPoint[] = []
  let idx = 0
  for (let r = 0; r < WORLD_DOT_ROWS; r++) {
    const lat = latMax - (r + 0.5) * dLat
    for (let c = 0; c < WORLD_DOT_COLS; c++) {
      const i = r * WORLD_DOT_COLS + c
      if ((bin.charCodeAt(i >> 3) >> (i & 7)) & 1) {
        const lon = lonMin + (c + 0.5) * dLon
        // Pequeno jitter sutil quebra o alinhamento rígido em baixa densidade mas preserva textura digital
        const h = hash(idx++)
        pts.push({
          lon,
          lat,
          bucket: Math.min(BUCKETS - 1, Math.floor(Math.pow(h, 0.8) * BUCKETS)),
        })
      }
    }
  }
  cachedDots = pts
  return pts
}

function getPolys(): LatLon[][] {
  if (cachedPolys) return cachedPolys
  cachedPolys = WORLD_LAND_POLYS.map((str) =>
    str.split(';').map((pair) => {
      const [lon, lat] = pair.split(',')
      return [Number(lat), Number(lon)] as LatLon
    }),
  )
  return cachedPolys
}

// Projeção suave widescreen (levemente comprimida em latitudes extremas para manter proporção elegante)
function latNorm(lat: number) {
  const { latMin, latMax } = WORLD_BOUNDS
  const t = (lat - latMin) / (latMax - latMin) // 0..1 sul->norte
  // Suave compressão acima de 60°N para a Groenlândia não ficar desproporcional
  const curved = Math.pow(Math.max(0, Math.min(1, t)), 0.92)
  return 1 - curved
}

function makeSprite(inner: string, mid: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, inner)
  grd.addColorStop(0.25, mid)
  grd.addColorStop(1, 'rgba(40,160,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return c
}

export function WorldMapHero({
  className = '',
  variant = 'default',
}: {
  className?: string
  variant?: WorldMapVariant
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const g: CanvasRenderingContext2D = ctx

    const dots = getDots()
    const polys = getPolys()
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const hubKeys = Object.keys(HUBS)
    const hubDist: Record<string, number> = { saoPaulo: 0 }
    for (let pass = 0; pass < 6; pass++) {
      for (const [a, b] of LINKS) {
        if (hubDist[a] !== undefined && hubDist[b] === undefined) {
          hubDist[b] = hubDist[a] + 1
        }
      }
    }

    const cycle = 9000
    const arcs = LINKS.map(([aName, bName], i) => {
      const a = HUBS[aName]
      const b = HUBS[bName]
      const hop = hubDist[aName] ?? 3
      const delay = hop * 680 + (i % 3) * 140
      const distLon = Math.abs(b[1] - a[1])
      const distLat = Math.abs(b[0] - a[0])
      const span = Math.hypot(distLon, distLat * 1.4)
      const dur = 1500 + span * 10
      const lift = Math.min(34, 6 + span * 0.28)
      return { a, b, bName, delay, dur, lift }
    })

    const glow = makeSprite('rgba(255,255,255,1)', 'rgba(150,225,255,0.75)')
    const softGlow = makeSprite('rgba(170,230,255,0.9)', 'rgba(60,170,255,0.35)')

    const bgCanvas = document.createElement('canvas')
    const bgCtx = bgCanvas.getContext('2d')!

    const bucketColors = Array.from({ length: BUCKETS }, (_, b) => {
      const t = b / (BUCKETS - 1)
      const r = Math.round(55 + 185 * t)
      const g = Math.round(165 + 87 * t)
      const bl = 255
      return `rgba(${r},${g},${bl},${(0.36 + 0.56 * t).toFixed(3)})`
    })

    let W = 0
    let H = 0
    let dpr = 1
    let mapX = 0
    let mapY = 0
    let mapW = 0
    let mapH = 0
    let small = false

    const arcPX = new Float32Array(arcs.length * ARC_SAMPLES)
    const arcPY = new Float32Array(arcs.length * ARC_SAMPLES)
    const hubPX = new Float32Array(hubKeys.length)
    const hubPY = new Float32Array(hubKeys.length)

    const projX = (lon: number) =>
      mapX + ((lon - WORLD_BOUNDS.lonMin) / (WORLD_BOUNDS.lonMax - WORLD_BOUNDS.lonMin)) * mapW
    const projY = (lat: number) => mapY + latNorm(lat) * mapH

    const buildBackground = () => {
      bgCanvas.width = W
      bgCanvas.height = H
      bgCtx.setTransform(1, 0, 0, 1, 0, 0)
      bgCtx.clearRect(0, 0, W, H)

      // Aura suave atrás do mapa
      const cx = mapX + mapW * 0.52
      const cy = mapY + mapH * 0.5
      const aura = bgCtx.createRadialGradient(
        cx,
        cy,
        mapH * 0.1,
        cx,
        cy,
        Math.max(mapW, mapH) * 0.62,
      )
      aura.addColorStop(0, 'rgba(56, 178, 255, 0.18)')
      aura.addColorStop(0.55, 'rgba(30, 118, 210, 0.08)')
      aura.addColorStop(1, 'rgba(12, 42, 78, 0)')
      bgCtx.fillStyle = aura
      bgCtx.fillRect(0, 0, W, H)

      // Grade técnica discreta (estilo rede global widescreen)
      bgCtx.save()
      bgCtx.beginPath()
      bgCtx.rect(mapX, mapY, mapW, mapH)
      bgCtx.clip()

      bgCtx.strokeStyle = 'rgba(120, 205, 255, 0.05)'
      bgCtx.lineWidth = Math.max(1, 0.8 * dpr)
      bgCtx.beginPath()
      for (let lon = -150; lon <= 150; lon += 30) {
        const x = projX(lon)
        bgCtx.moveTo(x, mapY)
        bgCtx.lineTo(x, mapY + mapH)
      }
      for (let lat = -40; lat <= 70; lat += 22) {
        const y = projY(lat)
        bgCtx.moveTo(mapX, y)
        bgCtx.lineTo(mapX + mapW, y)
      }
      bgCtx.stroke()

      // Preenchimento translúcido dos continentes + contorno luminoso
      const landGrad = bgCtx.createLinearGradient(mapX, mapY, mapX + mapW, mapY + mapH)
      landGrad.addColorStop(0, 'rgba(32, 108, 185, 0.28)')
      landGrad.addColorStop(0.5, 'rgba(48, 152, 232, 0.32)')
      landGrad.addColorStop(1, 'rgba(85, 202, 255, 0.36)')

      bgCtx.beginPath()
      for (const ring of polys) {
        for (let i = 0; i < ring.length; i++) {
          const x = projX(ring[i][1])
          const y = projY(ring[i][0])
          if (i === 0) bgCtx.moveTo(x, y)
          else bgCtx.lineTo(x, y)
        }
        bgCtx.closePath()
      }
      bgCtx.fillStyle = landGrad
      bgCtx.fill()
      bgCtx.strokeStyle = 'rgba(130, 215, 255, 0.26)'
      bgCtx.lineWidth = Math.max(1, 0.9 * dpr)
      bgCtx.stroke()

      // Textura de pontos luminosos sobre os continentes (igual ao globo da home)
      const baseR = Math.max(0.95, Math.min(1.65, mapW / 1280) * dpr)
      for (let b = 0; b < BUCKETS; b++) {
        const dotR = baseR * (0.76 + (0.38 * b) / (BUCKETS - 1))
        const d2 = dotR * 2
        bgCtx.fillStyle = bucketColors[b]
        bgCtx.beginPath()
        for (let i = 0; i < dots.length; i++) {
          if (dots[i].bucket !== b) continue
          const x = projX(dots[i].lon)
          const y = projY(dots[i].lat)
          bgCtx.rect(x - dotR, y - dotR, d2, d2)
        }
        bgCtx.fill()
      }
      bgCtx.restore()

      // Rede estática de arcos curvos entre os hubs
      bgCtx.strokeStyle = 'rgba(120, 205, 255, 0.16)'
      bgCtx.lineWidth = Math.max(1, 0.9 * dpr)
      bgCtx.beginPath()
      for (let aIdx = 0; aIdx < arcs.length; aIdx++) {
        const arc = arcs[aIdx]
        const ax = projX(arc.a[1])
        const ay = projY(arc.a[0])
        const bx = projX(arc.b[1])
        const by = projY(arc.b[0])
        const mx = (ax + bx) * 0.5
        const my = (ay + by) * 0.5 - (arc.lift / 138) * mapH
        const base = aIdx * ARC_SAMPLES
        for (let s = 0; s < ARC_SAMPLES; s++) {
          const t = s / (ARC_SAMPLES - 1)
          const mt = 1 - t
          const sx = mt * mt * ax + 2 * mt * t * mx + t * t * bx
          const sy = mt * mt * ay + 2 * mt * t * my + t * t * by
          arcPX[base + s] = sx
          arcPY[base + s] = sy
          if (s === 0) bgCtx.moveTo(sx, sy)
          else bgCtx.lineTo(sx, sy)
        }
      }
      bgCtx.stroke()

      // Pré-calcula posição dos hubs
      for (let h = 0; h < hubKeys.length; h++) {
        const [lat, lon] = HUBS[hubKeys[h]]
        hubPX[h] = projX(lon)
        hubPY[h] = projY(lat)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const cssW = canvas.clientWidth || rect.width
      const cssH = canvas.clientHeight || rect.height
      small = cssW < 640
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2)
      W = Math.max(1, Math.round(cssW * dpr))
      H = Math.max(1, Math.round(cssH * dpr))
      canvas.width = W
      canvas.height = H

      // Posicionamento widescreen: no desktop, estende-se amplamente da área centro-esquerda até a borda direita;
      // no mobile, ocupa praticamente toda a largura na faixa inferior-central em widescreen.
      const aspect = 2.6
      if (small) {
        mapW = W * 0.96
        mapH = Math.min(H * 0.64, mapW / aspect)
        mapW = mapH * aspect
        mapX = (W - mapW) * 0.5
        mapY = H - mapH - H * 0.06
      } else {
        const availW = W * 0.88
        const availH = H * 0.8
        mapH = Math.min(availH, availW / aspect)
        mapW = mapH * aspect
        mapX = W * 0.98 - mapW
        mapY = H * 0.16 + (availH - mapH) * 0.5
      }

      buildBackground()
    }

    const drawTrail = (base: number, from: number, to: number, strength: number) => {
      if (to - from < 0.05 || strength <= 0) return
      const sample = (f: number) => {
        const cl = Math.max(0, Math.min(ARC_SAMPLES - 1.0001, f))
        const i0 = Math.floor(cl)
        const fr = cl - i0
        const a = base + i0
        const b = base + i0 + 1
        return {
          x: arcPX[a] + (arcPX[b] - arcPX[a]) * fr,
          y: arcPY[a] + (arcPY[b] - arcPY[a]) * fr,
        }
      }
      const pts: { x: number; y: number }[] = []
      const segs = Math.max(2, Math.ceil(to - from) + 1)
      for (let k = 0; k <= segs; k++) {
        pts.push(sample(from + ((to - from) * k) / segs))
      }
      const tailP = pts[0]
      const headP = pts[pts.length - 1]
      const grad = ctx.createLinearGradient(tailP.x, tailP.y, headP.x, headP.y)
      grad.addColorStop(0, 'rgba(90,190,255,0)')
      grad.addColorStop(0.7, `rgba(120,210,255,${(0.55 * strength).toFixed(3)})`)
      grad.addColorStop(1, `rgba(220,245,255,${strength.toFixed(3)})`)

      ctx.strokeStyle = grad
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(tailP.x, tailP.y)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
      ctx.lineWidth = 5 * dpr
      ctx.globalAlpha = 0.38
      ctx.stroke()
      ctx.lineWidth = 1.8 * dpr
      ctx.globalAlpha = 1
      ctx.stroke()

      const s = 11 * dpr * strength
      ctx.drawImage(glow, headP.x - s, headP.y - s, s * 2, s * 2)
    }

    const draw = (T: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(bgCanvas, 0, 0)

      if (variant === 'solutions') {
        drawSolutionsRadar(T)
      } else if (variant === 'about') {
        drawAboutOriginWaves(T)
      }

      ctx.globalCompositeOperation = 'lighter'

      if (!reduceMotion) {
        const last = ARC_SAMPLES - 1
        for (let aIdx = 0; aIdx < arcs.length; aIdx++) {
          const arc = arcs[aIdx]
          let el = (T - arc.delay) % cycle
          if (el < 0) el += cycle
          const prog = el / arc.dur
          if (prog > 1 + TRAIL) continue
          const head = ease(Math.min(1, prog))
          const tail = Math.max(0, ease(Math.min(1, Math.max(0, prog - TRAIL))))
          const strength = prog <= 1 ? 1 : Math.max(0, 1 - (prog - 1) / TRAIL)
          drawTrail(aIdx * ARC_SAMPLES, tail * last, head * last, strength)
        }
      }

      // Pulsos de energia nos hubs e ondas de chegada
      const pulseAt: Record<string, number> = {}
      if (!reduceMotion) {
        for (let aIdx = 0; aIdx < arcs.length; aIdx++) {
          const arc = arcs[aIdx]
          let el = (T - arc.delay) % cycle
          if (el < 0) el += cycle
          const after = el - arc.dur
          if (after >= 0 && after < 1300) {
            const p = after / 1300
            const [lat, lon] = HUBS[arc.bName]
            const x = projX(lon)
            const y = projY(lat)
            ctx.strokeStyle = `rgba(150,225,255,${(0.7 * (1 - p)).toFixed(3)})`
            ctx.lineWidth = 1.5 * dpr
            ctx.beginPath()
            ctx.arc(x, y, (4 + p * 22) * dpr, 0, Math.PI * 2)
            ctx.stroke()
            pulseAt[arc.bName] = Math.max(pulseAt[arc.bName] || 0, 1 - p)
          }
        }
      }

      for (let h = 0; h < hubKeys.length; h++) {
        const key = hubKeys[h]
        const x = hubPX[h]
        const y = hubPY[h]
        const isSP = key === 'saoPaulo'
        const boost = pulseAt[key] || 0
        const pulse = reduceMotion
          ? 0.75
          : 0.55 + 0.45 * Math.sin(T * 0.004 + h * 1.1)
        const s =
          (isSP ? 16 : 8.5) * dpr * (0.72 + 0.28 * pulse + 0.42 * boost)
        ctx.drawImage(isSP || boost > 0.25 ? glow : softGlow, x - s, y - s, s * 2, s * 2)
      }

      ctx.globalCompositeOperation = 'source-over'

      if (variant === 'people') {
        drawPeopleBlips(T)
      } else if (variant === 'solutions') {
        drawSolutionBlips(T)
      } else if (variant === 'about') {
        drawAboutEmblems(T)
      }

      function drawSolutionsRadar(time: number) {
        // Radar sutil de GeoMarketing & KPIs posicionado no quadrante direito aberto
        const rx = projX(18)
        const ry = projY(26)
        const maxR = (small ? 76 : 138) * dpr
        const rings = [0.34, 0.67, 1.0]

        g.save()
        // Anéis concêntricos tracejados de cobertura
        for (let i = 0; i < rings.length; i++) {
          g.beginPath()
          g.setLineDash([4 * dpr, 6 * dpr])
          g.strokeStyle = `rgba(56, 189, 248, ${(0.22 - i * 0.04).toFixed(2)})`
          g.lineWidth = Math.max(1, 1.1 * dpr)
          g.arc(rx, ry, maxR * rings[i], 0, Math.PI * 2)
          g.stroke()
        }
        g.setLineDash([])

        // Eixos finos de referência geométrica
        g.strokeStyle = 'rgba(120, 210, 255, 0.1)'
        g.lineWidth = Math.max(1, dpr)
        g.beginPath()
        g.moveTo(rx - maxR * 1.06, ry)
        g.lineTo(rx + maxR * 1.06, ry)
        g.moveTo(rx, ry - maxR * 1.06)
        g.lineTo(rx, ry + maxR * 1.06)
        g.stroke()

        // Varredura angular em múltiplos setores para degradê suave e compatível com todos os navegadores
        if (!reduceMotion) {
          const headAngle = (time * 0.00085) % (Math.PI * 2)
          const sweepSpan = 0.62
          const slices = 10
          for (let s = 0; s < slices; s++) {
            const a0 = headAngle - sweepSpan * (1 - s / slices)
            const a1 = headAngle - sweepSpan * (1 - (s + 1) / slices)
            g.fillStyle = `rgba(56, 189, 248, ${(0.015 + 0.14 * ((s + 1) / slices)).toFixed(3)})`
            g.beginPath()
            g.moveTo(rx, ry)
            g.arc(rx, ry, maxR, a0, a1)
            g.closePath()
            g.fill()
          }

          g.strokeStyle = 'rgba(165, 232, 255, 0.36)'
          g.lineWidth = Math.max(1.2, 1.4 * dpr)
          g.beginPath()
          g.moveTo(rx, ry)
          g.lineTo(rx + Math.cos(headAngle) * maxR, ry + Math.sin(headAngle) * maxR)
          g.stroke()
        }

        // Onda de telemetria pulsando no núcleo do radar
        if (!reduceMotion) {
          const pulseP = (time % 2800) / 2800
          g.strokeStyle = `rgba(34, 211, 238, ${(0.35 * (1 - pulseP)).toFixed(3)})`
          g.lineWidth = Math.max(1.2, 1.5 * dpr)
          g.beginPath()
          g.arc(rx, ry, maxR * (0.08 + 0.92 * pulseP), 0, Math.PI * 2)
          g.stroke()
        }

        g.restore()
      }

      function drawSolutionIcon(
        x: number,
        y: number,
        r: number,
        solIdx: number,
        color: string,
      ) {
        const s = r * 0.56
        g.strokeStyle = color
        g.fillStyle = color
        g.lineCap = 'round'
        g.lineJoin = 'round'
        g.lineWidth = Math.max(1.2, r * 0.115)

        const kind = solIdx % 5
        if (kind === 0) {
          // 01: Consultoria, BI & KPIs (3 barras ascendentes + seta de tendência)
          const bw = s * 0.28
          g.fillRect(x - s * 0.62, y + s * 0.08, bw, s * 0.54)
          g.fillRect(x - bw * 0.5, y - s * 0.16, bw, s * 0.78)
          g.fillRect(x + s * 0.34, y - s * 0.42, bw, s * 1.04)
          g.beginPath()
          g.moveTo(x - s * 0.62, y - s * 0.15)
          g.lineTo(x + s * 0.52, y - s * 0.68)
          g.stroke()
        } else if (kind === 1) {
          // 02: Marketing Digital (megafone estilizado + ondas de alcance)
          g.beginPath()
          g.moveTo(x - s * 0.6, y - s * 0.16)
          g.lineTo(x + s * 0.16, y - s * 0.46)
          g.lineTo(x + s * 0.16, y + s * 0.44)
          g.lineTo(x - s * 0.6, y + s * 0.14)
          g.closePath()
          g.fill()
          g.fillRect(x - s * 0.46, y + s * 0.12, s * 0.18, s * 0.36)
          g.beginPath()
          g.arc(x + s * 0.24, y, s * 0.32, -0.75, 0.75)
          g.stroke()
          g.beginPath()
          g.arc(x + s * 0.24, y, s * 0.55, -0.75, 0.75)
          g.stroke()
        } else if (kind === 2) {
          // 03: Design & Identidade Visual (ponta de caneta vetorial)
          g.beginPath()
          g.moveTo(x, y - s * 0.74)
          g.lineTo(x + s * 0.52, y + s * 0.08)
          g.lineTo(x + s * 0.28, y + s * 0.58)
          g.lineTo(x - s * 0.28, y + s * 0.58)
          g.lineTo(x - s * 0.52, y + s * 0.08)
          g.closePath()
          g.stroke()
          g.beginPath()
          g.moveTo(x, y - s * 0.74)
          g.lineTo(x, y + s * 0.02)
          g.stroke()
          g.beginPath()
          g.arc(x, y + s * 0.14, s * 0.13, 0, Math.PI * 2)
          g.fill()
        } else if (kind === 3) {
          // 04: Coaching & Treinamentos (tela de apresentação + linha crescente)
          g.strokeRect(x - s * 0.64, y - s * 0.54, s * 1.28, s * 0.86)
          g.beginPath()
          g.moveTo(x, y + s * 0.32)
          g.lineTo(x, y + s * 0.64)
          g.moveTo(x - s * 0.34, y + s * 0.64)
          g.lineTo(x + s * 0.34, y + s * 0.64)
          g.moveTo(x - s * 0.38, y + s * 0.06)
          g.lineTo(x - s * 0.08, y - s * 0.2)
          g.lineTo(x + s * 0.12, y - s * 0.02)
          g.lineTo(x + s * 0.42, y - s * 0.32)
          g.stroke()
        } else {
          // 05: Sala VIP (câmera foto/audiovisual + lente)
          g.strokeRect(x - s * 0.66, y - s * 0.34, s * 1.32, s * 0.86)
          g.beginPath()
          g.moveTo(x - s * 0.3, y - s * 0.34)
          g.lineTo(x - s * 0.18, y - s * 0.58)
          g.lineTo(x + s * 0.18, y - s * 0.58)
          g.lineTo(x + s * 0.3, y - s * 0.34)
          g.stroke()
          g.beginPath()
          g.arc(x, y + s * 0.09, s * 0.24, 0, Math.PI * 2)
          g.stroke()
        }
      }

      function drawSolutionBadge(
        x: number,
        y: number,
        r: number,
        alpha: number,
        solIdx: number,
        rippleProgress: number,
        time: number,
      ) {
        if (alpha <= 0.02 || r <= 1) return
        const col = SOLUTION_PALETTE[solIdx % SOLUTION_PALETTE.length]
        g.save()

        // Onda expansiva na entrega da solução
        if (rippleProgress >= 0 && rippleProgress < 1) {
          g.globalAlpha = alpha * (1 - rippleProgress) * 0.8
          g.strokeStyle = col
          g.lineWidth = Math.max(1.2, 1.5 * dpr)
          g.beginPath()
          g.arc(x, y, r * (1 + rippleProgress * 1.3), 0, Math.PI * 2)
          g.stroke()
        }

        // Anel orbital 360° giratório sutil ao redor do medalhão
        g.save()
        g.translate(x, y)
        g.rotate(time * 0.0018)
        g.globalAlpha = alpha * 0.55
        g.strokeStyle = col
        g.lineWidth = Math.max(1, 1.25 * dpr)
        g.setLineDash([4 * dpr, 4 * dpr])
        g.beginPath()
        g.arc(0, 0, r * 1.34, 0, Math.PI * 2)
        g.stroke()
        g.restore()

        // Núcleo escuro + borda técnica luminosa
        g.globalAlpha = alpha
        g.fillStyle = 'rgba(7, 20, 40, 0.94)'
        g.beginPath()
        g.arc(x, y, r, 0, Math.PI * 2)
        g.fill()

        g.strokeStyle = col
        g.lineWidth = Math.max(1.4, 1.75 * dpr)
        g.stroke()

        drawSolutionIcon(x, y, r, solIdx, col)
        g.restore()
      }

      function drawSolutionBlips(time: number) {
        const baseR = (small ? 9.5 : 12.5) * dpr

        if (reduceMotion) {
          const demoHubs = ['saoPaulo', 'newYork', 'london', 'dubai', 'singapore', 'tokyo']
          demoHubs.forEach((name, idx) => {
            const [lat, lon] = HUBS[name]
            drawSolutionBadge(projX(lon), projY(lat), baseR, 0.95, idx, -1, 0)
          })
          return
        }

        // Hub central em São Paulo alternando suavemente entre as 5 frentes de solução
        const spSolIdx = Math.floor(time / cycle) % SOLUTION_PALETTE.length
        const [spLat, spLon] = HUBS.saoPaulo
        const spWave = 0.93 + 0.07 * Math.sin(time * 0.004)
        drawSolutionBadge(projX(spLon), projY(spLat), baseR * 1.08 * spWave, 0.95, spSolIdx, -1, time)

        const blipLife = 2050
        const drawnHub: Record<string, { score: number; x: number; y: number; scale: number; alpha: number; solIdx: number; ripple: number }> = {}

        for (let aIdx = 0; aIdx < arcs.length; aIdx++) {
          const arc = arcs[aIdx]
          const totalCycle = Math.floor((time - arc.delay) / cycle)
          let el = (time - arc.delay) % cycle
          if (el < 0) el += cycle
          const after = el - arc.dur
          if (after < 0 || after > blipLife) continue

          const p = after / blipLife
          let scale = 1
          let alpha = 1
          if (p < 0.16) {
            const k = p / 0.16
            scale = 0.35 + 0.8 * Math.sin((k * Math.PI) / 2) + 0.14 * Math.sin(k * Math.PI)
            alpha = Math.min(1, k * 1.4)
          } else if (p > 0.72) {
            const k = (p - 0.72) / 0.28
            scale = 1 - 0.28 * k
            alpha = 1 - k
          }

          const solIdx = (aIdx + Math.abs(totalCycle)) % SOLUTION_PALETTE.length
          const ripple = p < 0.55 ? p / 0.55 : -1
          const [lat, lon] = HUBS[arc.bName]
          const prev = drawnHub[arc.bName]
          if (!prev || alpha > prev.score) {
            drawnHub[arc.bName] = {
              score: alpha,
              x: projX(lon),
              y: projY(lat),
              scale,
              alpha,
              solIdx,
              ripple,
            }
          }
        }

        for (const key of Object.keys(drawnHub)) {
          const b = drawnHub[key]
          drawSolutionBadge(b.x, b.y, baseR * b.scale, b.alpha, b.solIdx, b.ripple, time)
        }
      }

      function drawAboutOriginWaves(time: number) {
        if (reduceMotion) return
        const [spLat, spLon] = HUBS.saoPaulo
        const sx = projX(spLon)
        const sy = projY(spLat)
        const maxWave = (small ? 95 : 165) * dpr

        g.save()
        for (let w = 0; w < 2; w++) {
          const p = ((time / 3600) + w * 0.5) % 1
          g.strokeStyle = `rgba(125, 211, 252, ${(0.24 * (1 - p)).toFixed(3)})`
          g.lineWidth = Math.max(1.1, 1.35 * dpr)
          g.beginPath()
          g.arc(sx, sy, 14 * dpr + p * maxWave, 0, Math.PI * 2)
          g.stroke()
        }
        g.restore()
      }

      function drawAboutEmblems(time: number) {
        const baseR = (small ? 8.5 : 11) * dpr
        g.save()
        g.textAlign = 'center'
        g.textBaseline = 'middle'

        for (let i = 0; i < ABOUT_HUBS.length; i++) {
          const item = ABOUT_HUBS[i]
          const [lat, lon] = HUBS[item.hub]
          const x = projX(lon)
          const y = projY(lat)

          // Onda sequencial acendendo as letras de P -> A -> R -> T -> N -> E -> R
          const phase = reduceMotion ? 1 : (time * 0.0012 - i * 0.35) % (Math.PI * 2)
          const pulse = reduceMotion ? 0.85 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(phase))
          const isSP = i === 0
          const r = baseR * (isSP ? 1.15 : 0.92 + 0.14 * pulse)
          const col = i % 2 === 0 ? '#7DD3FC' : '#FDE68A'

          g.globalAlpha = 0.25 * pulse
          g.fillStyle = col
          g.beginPath()
          g.arc(x, y, r * 1.45, 0, Math.PI * 2)
          g.fill()

          g.globalAlpha = 0.72 + 0.28 * pulse
          g.fillStyle = 'rgba(8, 22, 42, 0.92)'
          g.beginPath()
          g.arc(x, y, r, 0, Math.PI * 2)
          g.fill()

          g.strokeStyle = col
          g.lineWidth = Math.max(1.2, 1.55 * dpr)
          g.stroke()

          g.fillStyle = '#FFFFFF'
          g.font = `800 ${Math.round(r * 1.02)}px Sora, Manrope, sans-serif`
          g.fillText(item.letter, x, y + r * 0.05)
        }
        g.restore()
      }

      function drawPersonBadge(
        x: number,
        y: number,
        r: number,
        alpha: number,
        colorIdx: number,
        rippleProgress: number,
      ) {
        if (alpha <= 0.02 || r <= 1) return
        const col = PEOPLE_COLORS[colorIdx % PEOPLE_COLORS.length]
        g.save()

        // Onda expansiva colorida na chegada da mensagem
        if (rippleProgress >= 0 && rippleProgress < 1) {
          g.globalAlpha = alpha * (1 - rippleProgress) * 0.85
          g.strokeStyle = col.hex
          g.lineWidth = Math.max(1.2, 1.6 * dpr)
          g.beginPath()
          g.arc(x, y, r * (1 + rippleProgress * 1.25), 0, Math.PI * 2)
          g.stroke()
        }

        // Halo suave colorido atrás do badge
        g.globalAlpha = alpha * 0.32
        g.fillStyle = col.hex
        g.beginPath()
        g.arc(x, y, r * 1.38, 0, Math.PI * 2)
        g.fill()

        // Fundo escuro para contraste máximo de todas as cores primárias
        g.globalAlpha = alpha
        g.fillStyle = 'rgba(8, 22, 42, 0.94)'
        g.beginPath()
        g.arc(x, y, r, 0, Math.PI * 2)
        g.fill()

        // Borda luminosa na cor primária
        g.strokeStyle = col.hex
        g.lineWidth = Math.max(1.4, 1.8 * dpr)
        g.stroke()

        // Silhueta do "bonequinho" (cabeça + ombros) na cor primária
        g.fillStyle = col.hex
        g.beginPath()
        g.arc(x, y - r * 0.23, r * 0.25, 0, Math.PI * 2)
        g.fill()

        g.beginPath()
        g.moveTo(x - r * 0.46, y + r * 0.5)
        g.quadraticCurveTo(x - r * 0.46, y + r * 0.08, x, y + r * 0.08)
        g.quadraticCurveTo(x + r * 0.46, y + r * 0.08, x + r * 0.46, y + r * 0.5)
        g.quadraticCurveTo(x, y + r * 0.66, x - r * 0.46, y + r * 0.5)
        g.closePath()
        g.fill()

        g.restore()
      }

      function drawPeopleBlips(time: number) {
        const baseR = (small ? 8.5 : 11.5) * dpr

        if (reduceMotion) {
          const demoHubs = ['saoPaulo', 'newYork', 'london', 'cairo', 'dubai', 'singapore', 'tokyo', 'sydney']
          demoHubs.forEach((name, idx) => {
            const [lat, lon] = HUBS[name]
            drawPersonBadge(projX(lon), projY(lat), baseR, 0.95, idx, -1)
          })
          return
        }

        // Blip âncora pulsando na origem principal (São Paulo) alternando suavemente com o ciclo
        const spIdx = Math.floor(time / cycle) % PEOPLE_COLORS.length
        const [spLat, spLon] = HUBS.saoPaulo
        const spWave = 0.92 + 0.08 * Math.sin(time * 0.004)
        drawPersonBadge(projX(spLon), projY(spLat), baseR * 1.12 * spWave, 0.96, spIdx, -1)

        // Blip em cada hub de destino no instante em que o feixe de comunicação chega
        const blipLife = 1950
        const drawnHub: Record<string, { score: number; x: number; y: number; scale: number; alpha: number; color: number; ripple: number }> = {}

        for (let aIdx = 0; aIdx < arcs.length; aIdx++) {
          const arc = arcs[aIdx]
          const totalCycle = Math.floor((time - arc.delay) / cycle)
          let el = (time - arc.delay) % cycle
          if (el < 0) el += cycle
          const after = el - arc.dur
          if (after < 0 || after > blipLife) continue

          const p = after / blipLife
          // Pop-in elástico no início e fade-out suave ao final
          let scale = 1
          let alpha = 1
          if (p < 0.16) {
            const k = p / 0.16
            scale = 0.35 + 0.8 * Math.sin((k * Math.PI) / 2) + 0.15 * Math.sin(k * Math.PI)
            alpha = Math.min(1, k * 1.4)
          } else if (p > 0.72) {
            const k = (p - 0.72) / 0.28
            scale = 1 - 0.28 * k
            alpha = 1 - k
          }

          const colorIdx = (aIdx + Math.abs(totalCycle)) % PEOPLE_COLORS.length
          const ripple = p < 0.55 ? p / 0.55 : -1
          const [lat, lon] = HUBS[arc.bName]
          const prev = drawnHub[arc.bName]
          if (!prev || alpha > prev.score) {
            drawnHub[arc.bName] = {
              score: alpha,
              x: projX(lon),
              y: projY(lat),
              scale,
              alpha,
              color: colorIdx,
              ripple,
            }
          }
        }

        for (const key of Object.keys(drawnHub)) {
          const b = drawnHub[key]
          drawPersonBadge(b.x, b.y, baseR * b.scale, b.alpha, b.color, b.ripple)
        }
      }
    }

    resize()

    let raf = 0
    let running = false
    let inView = true
    let T = 0
    let last = 0

    const loop = (now: number) => {
      if (!running) return
      const dt = last ? Math.min(64, now - last) : 16
      last = now
      T += dt
      draw(T)
      raf = requestAnimationFrame(loop)
    }

    const update = () => {
      const shouldRun = !reduceMotion && inView && !document.hidden
      if (shouldRun && !running) {
        running = true
        last = 0
        raf = requestAnimationFrame(loop)
      } else if (!shouldRun && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    }

    draw(reduceMotion ? 4200 : 0)
    update()

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            resize()
            if (!running) draw(reduceMotion ? 4200 : T)
          })
        : null
    ro?.observe(canvas)

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              inView = entries.some((e) => e.isIntersecting)
              update()
            },
            { threshold: 0.02 },
          )
        : null
    io?.observe(canvas)

    const onVis = () => update()
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro?.disconnect()
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  )
}
