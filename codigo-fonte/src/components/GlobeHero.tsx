import { useEffect, useRef } from 'react'
import { GLOBE_LAND_MASK, GLOBE_POINT_COUNT } from '../data/globe-land'
import { SP_CITY_CENTER, SP_CITY_OUTLINE } from '../data/sao-paulo-city'

/**
 * Globo 3D animado do hero (canvas 2D, sem bibliotecas externas).
 * - Gira lentamente em torno do próprio eixo.
 * - Continentes desenhados como "luzes de cidades" (pontos).
 * - Arcos de conexão saindo de São Paulo e se espalhando pelo mundo,
 *   com um brilho que percorre cada traço (efeito de comunicação).
 * - Um arco de retorno (Londres → São Paulo): quando o ponto luminoso chega à
 *   cidade com o mapa de frente para o usuário, a silhueta da CAPITAL acende
 *   em branco e azul-claro — as mesmas cores da luz que corre pelo globo.
 * - Anéis orbitais com "cometas" de luz.
 * O zoom sutil (Ken Burns) é aplicado no elemento pai via CSS.
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

// [origem, destino] — a ordem define a "onda" de propagação a partir de São Paulo.
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
  ['losAngeles', 'tokyo'],
  ['moscow', 'shanghai'],
]

/**
 * Arcos de "retorno" que terminam em São Paulo. A chegada do ponto luminoso
 * (quando a cidade está de frente para o usuário) acende a silhueta da capital
 * de São Paulo em branco/azul, as cores da luz que percorre o globo.
 * `arrive` = instante (ms) em que o ponto toca São Paulo.
 */
const INBOUND_LINKS: { from: string; to: string; arrive: number }[] = [
  // Um único feixe por volta do globo. A chegada acontece com o estado de São
  // Paulo de frente e ainda à esquerda da letra "P" (antes de o mapa alcançá-la),
  // cerca de 2 s depois de o globo começar a girar; repete a cada volta (60 s).
  { from: 'london', to: 'saoPaulo', arrive: 2000 },
]

const DEG = Math.PI / 180
const SPIN = (2 * Math.PI) / 60000 // uma volta completa a cada 60 s
const BASE_LON = -25 * DEG // começa com o Brasil de frente; o estado de SP fica na área livre do globo
const VIEW_LAT = 14 * DEG // vista levemente de cima
const ROLL = -8 * DEG // leve inclinação do eixo
const ARC_SAMPLES = 64
const TRAIL = 0.3 // tamanho do rastro de luz (fração do arco)
const BUCKETS = 6
const SP_FLASH_MS = 1700 // duração do brilho da capital após a chegada do ponto

function toVec([lat, lon]: LatLon): [number, number, number] {
  const la = lat * DEG
  const lo = lon * DEG
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]
}

function hash(i: number) {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return s - Math.floor(s)
}

const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t)

function buildLand() {
  const bin = atob(GLOBE_LAND_MASK)
  const golden = Math.PI * (3 - Math.sqrt(5))
  const xs: number[] = []
  const ys: number[] = []
  const zs: number[] = []
  const base: number[] = []
  const hubVecs = Object.values(HUBS).map(toVec)
  const near = Math.cos(5.5 * DEG)
  for (let i = 0; i < GLOBE_POINT_COUNT; i++) {
    if (!((bin.charCodeAt(i >> 3) >> (i & 7)) & 1)) continue
    const y = 1 - (2 * (i + 0.5)) / GLOBE_POINT_COUNT
    const r = Math.sqrt(1 - y * y)
    const th = i * golden
    const lat = Math.asin(y)
    const lon = Math.atan2(Math.sin(th) * r, Math.cos(th) * r)
    const X = Math.cos(lat) * Math.sin(lon)
    const Y = Math.sin(lat)
    const Z = Math.cos(lat) * Math.cos(lon)
    let b = 0.4 + 0.6 * Math.pow(hash(i), 1.6)
    for (const h of hubVecs) {
      if (X * h[0] + Y * h[1] + Z * h[2] > near) {
        b = Math.min(1, b + 0.45)
        break
      }
    }
    xs.push(X)
    ys.push(Y)
    zs.push(Z)
    base.push(b)
  }
  return {
    count: xs.length,
    X: Float32Array.from(xs),
    Y: Float32Array.from(ys),
    Z: Float32Array.from(zs),
    base: Float32Array.from(base),
  }
}

type Arc = {
  pts: Float32Array // x,y,z * ARC_SAMPLES
  from: string
  to: string
  delay: number
  dur: number
  inbound?: boolean
}

/** Arco geodésico com elevação — mesma geometria para os arcos normais e de retorno. */
function arcPoints(a: [number, number, number], b: [number, number, number], omega: number) {
  const sinO = Math.sin(omega) || 1e-6
  const lift = 0.04 + 0.3 * (omega / Math.PI)
  const pts = new Float32Array(ARC_SAMPLES * 3)
  for (let s = 0; s < ARC_SAMPLES; s++) {
    const t = s / (ARC_SAMPLES - 1)
    const k1 = Math.sin((1 - t) * omega) / sinO
    const k2 = Math.sin(t * omega) / sinO
    const h = 1 + lift * Math.sin(Math.PI * t)
    pts[s * 3] = (a[0] * k1 + b[0] * k2) * h
    pts[s * 3 + 1] = (a[1] * k1 + b[1] * k2) * h
    pts[s * 3 + 2] = (a[2] * k1 + b[2] * k2) * h
  }
  return { pts, omega }
}

function buildArcs() {
  const arcs: Arc[] = []
  const arrival: Record<string, number> = { saoPaulo: 0 }
  const childCount: Record<string, number> = {}
  for (const [from, to] of LINKS) {
    const a = toVec(HUBS[from])
    const b = toVec(HUBS[to])
    const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
    const { pts, omega } = arcPoints(a, b, Math.acos(dot))
    const n = (childCount[from] = (childCount[from] ?? 0) + 1)
    const delay = (arrival[from] ?? 0) + (n - 1) * 260 + hash(arcs.length + 3) * 200
    const dur = 1100 + 1700 * (omega / Math.PI)
    if (arrival[to] === undefined) arrival[to] = delay + dur
    arcs.push({ pts, from, to, delay, dur })
  }

  // Arcos de retorno: o ponto luminoso viaja até São Paulo e "bate" no estado
  for (const link of INBOUND_LINKS) {
    const a = toVec(HUBS[link.from])
    const b = toVec(HUBS[link.to])
    const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
    const { pts, omega } = arcPoints(a, b, Math.acos(dot))
    const dur = 1100 + 1700 * (omega / Math.PI)
    arcs.push({
      pts,
      from: link.from,
      to: link.to,
      delay: Math.max(0, link.arrive - dur),
      dur,
      inbound: true,
    })
  }

  const cycle = Math.max(...arcs.map((a) => a.delay + a.dur)) + 2400
  return { arcs, cycle }
}

type Ring = { radius: number; incl: number; phase: number; speed: number; comet: number }

const RINGS: Ring[] = [
  { radius: 1.16, incl: 74 * DEG, phase: 20 * DEG, speed: 0.000045, comet: 0.00011 },
  { radius: 1.26, incl: -62 * DEG, phase: 140 * DEG, speed: -0.00003, comet: -0.00008 },
  { radius: 1.09, incl: 84 * DEG, phase: 260 * DEG, speed: 0.00002, comet: 0.00014 },
]
const RING_SAMPLES = 160

function makeSprite(inner: string, mid: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  if (!g) return c
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, inner)
  grd.addColorStop(0.25, mid)
  grd.addColorStop(1, 'rgba(40,160,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return c
}

export function GlobeHero({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const maybeCtx = canvas.getContext('2d')
    if (!maybeCtx) return
    const ctx: CanvasRenderingContext2D = maybeCtx

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const land = buildLand()
    const { arcs, cycle } = buildArcs()
    const hubNames = Array.from(new Set(LINKS.flat()))
    const hubVecs = hubNames.map((n) => toVec(HUBS[n]))
    const arrivalsByHub: Record<string, Arc[]> = {}
    for (const a of arcs) (arrivalsByHub[a.to] ??= []).push(a)

    // ---------- Capital de São Paulo: silhueta + chegada que acende em branco/azul
    const inboundArcs = arcs.filter((a) => a.inbound)
    const spPolys = [SP_CITY_OUTLINE]
      .filter((ring) => ring.length >= 6)
      .map((ring) => {
        const n = ring.length / 2
        const vecs = new Float32Array(n * 3)
        for (let i = 0; i < n; i++) {
          const v = toVec([ring[i * 2], ring[i * 2 + 1]])
          vecs[i * 3] = v[0]
          vecs[i * 3 + 1] = v[1]
          vecs[i * 3 + 2] = v[2]
        }
        return vecs
      })
    const spCounts = spPolys.map((poly) => poly.length / 3)
    const spStarts: number[] = []
    let spTotalPoints = 0
    for (const count of spCounts) {
      spStarts.push(spTotalPoints)
      spTotalPoints += count
    }
    const spSX = new Float32Array(spTotalPoints)
    const spSY = new Float32Array(spTotalPoints)
    const spZ = new Float32Array(spTotalPoints)
    const spCenterVec = toVec(SP_CITY_CENTER)

    const glow = makeSprite('rgba(255,255,255,1)', 'rgba(150,225,255,0.75)')
    const softGlow = makeSprite('rgba(170,230,255,0.9)', 'rgba(60,170,255,0.35)')

    // buffers de projeção
    const pSX = new Float32Array(land.count)
    const pSY = new Float32Array(land.count)
    const pB = new Int8Array(land.count) // -1 = verso, 0..BUCKETS-1 = frente
    const arcSX = new Float32Array(arcs.length * ARC_SAMPLES)
    const arcSY = new Float32Array(arcs.length * ARC_SAMPLES)
    const arcVis = new Uint8Array(arcs.length * ARC_SAMPLES)
    const ringSX = new Float32Array(RINGS.length * RING_SAMPLES)
    const ringSY = new Float32Array(RINGS.length * RING_SAMPLES)
    const ringVis = new Uint8Array(RINGS.length * RING_SAMPLES)

    let W = 0
    let H = 0
    let dpr = 1
    let cx = 0
    let cy = 0
    let R = 0
    let small = false
    let atmosphere: CanvasGradient | null = null
    let body: CanvasGradient | null = null
    let highlight: CanvasGradient | null = null

    const bucketColors = Array.from({ length: BUCKETS }, (_, b) => {
      const t = b / (BUCKETS - 1)
      const r = Math.round(50 + 190 * t)
      const g = Math.round(160 + 92 * t)
      const bl = 255
      return `rgba(${r},${g},${bl},${(0.4 + 0.6 * t).toFixed(3)})`
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const cssW = canvas.clientWidth || rect.width
      const cssH = canvas.clientHeight || rect.height
      const desktopLayout = window.innerWidth >= 768
      small = cssW < 640
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2)
      W = Math.max(1, Math.round(cssW * dpr))
      H = Math.max(1, Math.round(cssH * dpr))
      canvas.width = W
      canvas.height = H
      cx = desktopLayout ? W * 0.525 : W * 0.5
      cy = H * (desktopLayout ? 0.52 : 0.5)
      R = desktopLayout
        ? Math.min(W * 0.34, H * 0.365)
        : Math.min(W * 0.34, H * 0.37)

      atmosphere = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.42)
      atmosphere.addColorStop(0, 'rgba(80,190,255,0.75)')
      atmosphere.addColorStop(0.16, 'rgba(50,160,255,0.3)')
      atmosphere.addColorStop(1, 'rgba(30,110,220,0)')

      body = ctx.createRadialGradient(cx - R * 0.18, cy - R * 0.22, R * 0.05, cx, cy, R)
      body.addColorStop(0, 'rgba(14,52,92,0.97)')
      body.addColorStop(0.6, 'rgba(6,26,52,0.98)')
      body.addColorStop(0.84, 'rgba(10,48,92,0.98)')
      body.addColorStop(0.95, 'rgba(40,140,230,0.96)')
      body.addColorStop(1, 'rgba(170,230,255,0.98)')

      highlight = ctx.createRadialGradient(
        cx - R * 0.42,
        cy - R * 0.48,
        0,
        cx - R * 0.42,
        cy - R * 0.48,
        R * 0.9,
      )
      highlight.addColorStop(0, 'rgba(180,230,255,0.08)')
      highlight.addColorStop(1, 'rgba(180,230,255,0)')
    }

    const draw = (T: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, W, H)

      const lon0 = BASE_LON - T * SPIN
      const cl = Math.cos(lon0)
      const sl = Math.sin(lon0)
      const ct = Math.cos(VIEW_LAT)
      const st = Math.sin(VIEW_LAT)
      const cr = Math.cos(ROLL)
      const sr = Math.sin(ROLL)

      // ---------- atmosfera + corpo do globo
      ctx.fillStyle = atmosphere as CanvasGradient
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.42, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = body as CanvasGradient
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()

      // ---------- projeção dos pontos de terra
      for (let i = 0; i < land.count; i++) {
        const X = land.X[i]
        const Y = land.Y[i]
        const Z = land.Z[i]
        const x = X * cl - Z * sl
        const z1 = Z * cl + X * sl
        const y = Y * ct - z1 * st
        const z = Y * st + z1 * ct
        pSX[i] = cx + (x * cr - y * sr) * R
        pSY[i] = cy - (x * sr + y * cr) * R
        if (z < 0) {
          pB[i] = -1
        } else {
          const inten = land.base[i] * (0.28 + 0.72 * z)
          pB[i] = Math.min(BUCKETS - 1, Math.floor(inten * BUCKETS))
        }
      }

      const ds = Math.max(1.2 * dpr, R * 0.0052)

      // verso (visto através do "vidro")
      if (!small) {
        ctx.fillStyle = 'rgba(110,190,255,0.07)'
        ctx.beginPath()
        for (let i = 0; i < land.count; i++) {
          if (pB[i] === -1) ctx.rect(pSX[i] - ds * 0.4, pSY[i] - ds * 0.4, ds * 0.8, ds * 0.8)
        }
        ctx.fill()
      }

      // frente (modo aditivo = brilho de luzes de cidade)
      ctx.globalCompositeOperation = 'lighter'
      for (let b = 0; b < BUCKETS; b++) {
        const s = b === BUCKETS - 1 ? ds * 1.3 : ds
        const h = s / 2
        ctx.fillStyle = bucketColors[b]
        ctx.beginPath()
        for (let i = 0; i < land.count; i++) {
          if (pB[i] === b) ctx.rect(pSX[i] - h, pSY[i] - h, s, s)
        }
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = highlight as CanvasGradient
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()

      // borda luminosa
      ctx.strokeStyle = 'rgba(190,235,255,0.9)'
      ctx.lineWidth = Math.max(1, 1.5 * dpr)
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.stroke()

      // ---------- São Paulo: silhueta da capital + acendimento na chegada do ponto
      const spcx = spCenterVec[0] * cl - spCenterVec[2] * sl
      const spz1 = spCenterVec[2] * cl + spCenterVec[0] * sl
      const spcy = spCenterVec[1] * ct - spz1 * st
      const spcz = spCenterVec[1] * st + spz1 * ct
      const spCenterZ = spcz

      let spFlash = 0
      if (!reduceMotion && spCenterZ > 0.22) {
        for (let i = 0; i < inboundArcs.length; i++) {
          const arc = inboundArcs[i]
          let local = (T - arc.delay - arc.dur) % cycle
          if (local < 0) local += cycle
          if (local < SP_FLASH_MS) {
            spFlash = Math.max(spFlash, 1 - local / SP_FLASH_MS)
          }
        }
      }
      ctx.globalCompositeOperation = 'lighter'

      // ---------- projeção dos arcos
      for (let a = 0; a < arcs.length; a++) {
        const pts = arcs[a].pts
        for (let s = 0; s < ARC_SAMPLES; s++) {
          const X = pts[s * 3]
          const Y = pts[s * 3 + 1]
          const Z = pts[s * 3 + 2]
          const x = X * cl - Z * sl
          const z1 = Z * cl + X * sl
          const y = Y * ct - z1 * st
          const z = Y * st + z1 * ct
          const sx = x * cr - y * sr
          const sy = x * sr + y * cr
          const k = a * ARC_SAMPLES + s
          arcSX[k] = cx + sx * R
          arcSY[k] = cy - sy * R
          arcVis[k] = z > -0.01 || sx * sx + sy * sy > 1.0 ? 1 : 0
        }
      }

      // traços estáticos (sutis)
      ctx.strokeStyle = 'rgba(120,205,255,0.3)'
      ctx.lineWidth = Math.max(1, 0.9 * dpr)
      ctx.beginPath()
      for (let a = 0; a < arcs.length; a++) {
        let pen = false
        for (let s = 0; s < ARC_SAMPLES; s++) {
          const k = a * ARC_SAMPLES + s
          if (!arcVis[k]) {
            pen = false
            continue
          }
          if (pen) ctx.lineTo(arcSX[k], arcSY[k])
          else ctx.moveTo(arcSX[k], arcSY[k])
          pen = true
        }
      }
      ctx.stroke()

      // ---------- anéis orbitais
      for (let r = 0; r < RINGS.length; r++) {
        const ring = RINGS[r]
        const ci = Math.cos(ring.incl)
        const si = Math.sin(ring.incl)
        const ph = ring.phase + T * ring.speed
        const cp = Math.cos(ph)
        const sp = Math.sin(ph)
        for (let s = 0; s < RING_SAMPLES; s++) {
          const th = (s / RING_SAMPLES) * Math.PI * 2
          // círculo no plano XZ, inclinado em X, girado em Y
          const x0 = Math.cos(th) * ring.radius
          const z0 = Math.sin(th) * ring.radius
          const y1 = -z0 * si
          const z1 = z0 * ci
          const x2 = x0 * cp + z1 * sp
          const z2 = -x0 * sp + z1 * cp
          const sx = x2 * cr - y1 * sr
          const sy = x2 * sr + y1 * cr
          const k = r * RING_SAMPLES + s
          ringSX[k] = cx + sx * R
          ringSY[k] = cy - sy * R
          ringVis[k] = z2 > 0 || sx * sx + sy * sy > 1 ? 1 : 0
        }
      }

      ctx.strokeStyle = 'rgba(120,205,255,0.2)'
      ctx.lineWidth = Math.max(1, 0.8 * dpr)
      ctx.beginPath()
      for (let r = 0; r < RINGS.length; r++) {
        let pen = false
        for (let s = 0; s <= RING_SAMPLES; s++) {
          const k = r * RING_SAMPLES + (s % RING_SAMPLES)
          if (!ringVis[k]) {
            pen = false
            continue
          }
          if (pen) ctx.lineTo(ringSX[k], ringSY[k])
          else ctx.moveTo(ringSX[k], ringSY[k])
          pen = true
        }
      }
      ctx.stroke()

      if (reduceMotion) {
        drawHubs(T, true)
        ctx.globalCompositeOperation = 'source-over'
        drawSaoPaulo()
        drawStationaryP()
        return
      }

      // cometas nos anéis
      for (let r = 0; r < RINGS.length; r++) {
        const ring = RINGS[r]
        let head = (T * ring.comet + r * 0.37) % 1
        if (head < 0) head += 1
        const len = 0.14
        drawTrail(
          (i) => r * RING_SAMPLES + (((i % RING_SAMPLES) + RING_SAMPLES) % RING_SAMPLES),
          ringSX,
          ringSY,
          ringVis,
          (head - len) * RING_SAMPLES,
          head * RING_SAMPLES,
          0.7,
        )
      }

      // ---------- brilho percorrendo os traços
      for (let a = 0; a < arcs.length; a++) {
        const arc = arcs[a]
        let local = (T - arc.delay) % cycle
        if (local < 0) local += cycle
        const t = local / arc.dur
        if (t > 1 + TRAIL) continue
        const head = easeInOut(Math.min(1, t))
        const tail = Math.max(0, easeInOut(Math.min(1, Math.max(0, t - TRAIL))))
        const last = ARC_SAMPLES - 1
        drawTrail(
          (i) => a * ARC_SAMPLES + Math.min(last, Math.max(0, i)),
          arcSX,
          arcSY,
          arcVis,
          tail * last,
          head * last,
          t <= 1 ? 1 : Math.max(0, 1 - (t - 1) / TRAIL),
        )
      }

      drawHubs(T, false)
      ctx.globalCompositeOperation = 'source-over'

      // o estado de SP acende por cima dos feixes: o ponto luminoso "bate" nele
      // e a silhueta branca/azul continua legível (inclusive em telas pequenas)
      drawSaoPaulo()

      drawStationaryP()

      function drawStationaryP() {
        const px = (dx: number) => cx + dx * R
        const py = (dy: number) => cy + dy * R

        const traceContour = () => {
          ctx.beginPath()
          // Contorno externo da letra P fiel à logo original
          ctx.moveTo(px(-0.068), py(-0.588))
          ctx.lineTo(px(0.665), py(-0.588))
          const outerSteps = 36
          for (let i = 1; i <= outerSteps; i++) {
            const ang = -Math.PI / 2 + Math.PI * (i / outerSteps)
            const dx = 0.665 + (1.105 - 0.665) * Math.cos(ang)
            const dy = -0.2155 + 0.3725 * Math.sin(ang)
            ctx.lineTo(px(dx), py(dy))
          }
          ctx.lineTo(px(0.665), py(0.157))
          ctx.lineTo(px(0.462), py(0.157))
          ctx.lineTo(px(0.462), py(0.405))
          ctx.quadraticCurveTo(px(0.462), py(0.472), px(0.535), py(0.472))
          ctx.lineTo(px(0.639), py(0.472))
          ctx.lineTo(px(0.639), py(0.648))
          ctx.lineTo(px(-0.068), py(0.648))
          ctx.lineTo(px(-0.068), py(0.472))
          ctx.lineTo(px(0.032), py(0.472))
          ctx.quadraticCurveTo(px(0.101), py(0.472), px(0.101), py(0.405))
          ctx.lineTo(px(0.101), py(-0.338))
          ctx.quadraticCurveTo(px(0.101), py(-0.404), px(0.032), py(-0.404))
          ctx.lineTo(px(-0.068), py(-0.404))
          ctx.closePath()

          // Recorte interno do "D" do P (mantém o globo girando visível por dentro)
          ctx.moveTo(px(0.462), py(-0.389))
          ctx.lineTo(px(0.595), py(-0.389))
          const holeSteps = 28
          for (let i = 1; i <= holeSteps; i++) {
            const ang = -Math.PI / 2 + Math.PI * (i / holeSteps)
            const dx = 0.595 + (0.892 - 0.595) * Math.cos(ang)
            const dy = -0.212 + 0.177 * Math.sin(ang)
            ctx.lineTo(px(dx), py(dy))
          }
          ctx.lineTo(px(0.595), py(-0.035))
          ctx.lineTo(px(0.462), py(-0.035))
          ctx.closePath()
        }

        ctx.save()
        traceContour()
        // Sombra projetada suave para destacar o P flutuando sobre o globo
        ctx.shadowColor = 'rgba(4, 14, 32, 0.72)'
        ctx.shadowBlur = Math.max(8, 16 * dpr)
        ctx.shadowOffsetX = -3 * dpr
        ctx.shadowOffsetY = 3.5 * dpr

        // Gradiente metálico branco-prata idêntico ao P da logo original
        const grad = ctx.createLinearGradient(px(-0.07), py(0), px(1.1), py(0))
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.96)')
        grad.addColorStop(0.48, 'rgba(218, 232, 245, 0.94)')
        grad.addColorStop(0.75, 'rgba(252, 254, 255, 0.96)')
        grad.addColorStop(1, 'rgba(232, 243, 252, 0.95)')
        ctx.fillStyle = grad
        ctx.fill('evenodd')

        // Borda sutil luminosa harmonizando com a atmosfera do globo
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.strokeStyle = 'rgba(200, 238, 255, 0.65)'
        ctx.lineWidth = Math.max(1, 1.25 * dpr)
        ctx.stroke()
        ctx.restore()
      }
      /**
       * Silhueta da CAPITAL (município de São Paulo) desenhada NO MAPA do globo.
       * Sem zoom, sem deslocamento: ela acompanha a rotação exatamente como as luzes
       * dos continentes. Quando o feixe de retorno "bate" na cidade, a silhueta
       * acende em BRANCO e AZUL-CLARO — as mesmas cores da luz que percorre o globo.
       * Nada é desenhado quando a cidade está no verso do globo.
       */
      function drawSaoPaulo() {
        if (spCenterZ <= 0.22) return

        let written = 0
        for (let p = 0; p < spPolys.length; p++) {
          const pts = spPolys[p]
          const n = spCounts[p]
          for (let i = 0; i < n; i++) {
            const X = pts[i * 3]
            const Y = pts[i * 3 + 1]
            const Z = pts[i * 3 + 2]
            const x = X * cl - Z * sl
            const z1 = Z * cl + X * sl
            const y = Y * ct - z1 * st
            const z = Y * st + z1 * ct
            spSX[written + i] = cx + (x * cr - y * sr) * R
            spSY[written + i] = cy - (x * sr + y * cr) * R
            spZ[written + i] = z
          }
          written += n
        }

        // coordenadas da silhueta (com o leve crescimento aplicado sobre o centro)
        const traceClosed = (p: number) => {
          const start = spStarts[p]
          const n = spCounts[p]
          ctx.beginPath()
          for (let i = 0; i < n; i++) {
            const idx = start + i
            const x = cxs + (spSX[idx] - cxs) * zoom
            const y = cys + (spSY[idx] - cys) * zoom
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
        }
        const visiblePoly = (p: number) => {
          const start = spStarts[p]
          const n = spCounts[p]
          for (let i = 0; i < n; i++) if (spZ[start + i] <= 0.02) return false
          return true
        }

        const cxs = cx + (spcx * cr - spcy * sr) * R
        const cys = cy - (spcx * sr + spcy * cr) * R
        const facing = Math.max(0, Math.min(1, (spCenterZ - 0.22) / 0.3))
        const flash = spFlash * facing

        // A capital tem ~3 px no globo em escala real. Para a silhueta ser legível,
        // ela cresce ancorada no ponto exato da cidade (sem deslocamento) até um
        // tamanho mínimo de tela, acompanhando a rotação do globo.
        let minX = Infinity
        let maxX = -Infinity
        let minY = Infinity
        let maxY = -Infinity
        for (let p = 0; p < spPolys.length; p++) {
          const start = spStarts[p]
          const n = spCounts[p]
          for (let i = 0; i < n; i++) {
            const idx = start + i
            if (spSX[idx] < minX) minX = spSX[idx]
            if (spSX[idx] > maxX) maxX = spSX[idx]
            if (spSY[idx] < minY) minY = spSY[idx]
            if (spSY[idx] > maxY) maxY = spSY[idx]
          }
        }
        const naturalSize = Math.max(maxX - minX, maxY - minY, 0.5)
        const targetSize = small ? 30 : 46
        const maxZoom = Math.max(1, targetSize / naturalSize)
        // entrada rápida (com um leve "estalo") e permanência durante o brilho
        const grow = Math.min(1, flash * 1.6)
        const pop = 1 + 0.12 * Math.sin(Math.min(1, grow) * Math.PI)
        const zoom = 1 + (maxZoom * pop - 1) * grow

        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, R * 0.998, 0, Math.PI * 2)
        ctx.clip()

        if (flash > 0.02) {
          // halo branco-azulado difuso centrado na capital (acompanha a rotação)
          ctx.globalCompositeOperation = 'lighter'
          const haloR = Math.max(targetSize * 0.75, R * 0.05)
          const halo = ctx.createRadialGradient(cxs, cys, 0, cxs, cys, haloR)
          halo.addColorStop(0, `rgba(226, 246, 255, ${((small ? 0.45 : 0.34) * flash).toFixed(3)})`)
          halo.addColorStop(0.5, `rgba(140, 208, 255, ${((small ? 0.22 : 0.16) * flash).toFixed(3)})`)
          halo.addColorStop(1, 'rgba(80, 170, 255, 0)')
          ctx.fillStyle = halo
          ctx.beginPath()
          ctx.arc(cxs, cys, haloR, 0, Math.PI * 2)
          ctx.fill()

          ctx.globalCompositeOperation = 'source-over'

          // preenchimento branco → azul-claro, exatamente sobre a silhueta no mapa
          const light = ctx.createLinearGradient(
            cxs - R * 0.03,
            cys - R * 0.03,
            cxs + R * 0.03,
            cys + R * 0.03,
          )
          light.addColorStop(0, `rgba(255, 255, 255, ${flash.toFixed(3)})`)
          light.addColorStop(0.6, `rgba(248, 253, 255, ${flash.toFixed(3)})`)
          light.addColorStop(1, `rgba(205, 236, 255, ${flash.toFixed(3)})`)

          ctx.lineJoin = 'round'
          for (let p = 0; p < spPolys.length; p++) {
            if (!visiblePoly(p)) continue
            traceClosed(p)
            ctx.fillStyle = light
            ctx.fill()
            // contorno azul-claro fino, da mesma família da luz do globo
            ctx.strokeStyle = `rgba(150, 216, 255, ${(0.92 * flash).toFixed(3)})`
            ctx.lineWidth = Math.max(0.5, 0.6 * dpr)
            ctx.stroke()
          }

          // contorno luminoso branco por cima
          ctx.globalCompositeOperation = 'lighter'
          ctx.shadowColor = `rgba(150, 215, 255, ${(0.9 * flash).toFixed(3)})`
          ctx.shadowBlur = (small ? 7 : 11) * dpr * flash
          ctx.strokeStyle = `rgba(240, 251, 255, ${(0.95 * flash).toFixed(3)})`
          ctx.lineWidth = Math.max(1, (small ? 0.8 : 0.9) * dpr)
          for (let p = 0; p < spPolys.length; p++) {
            if (!visiblePoly(p)) continue
            traceClosed(p)
            ctx.stroke()
          }
          ctx.shadowBlur = 0
          ctx.shadowColor = 'transparent'
          ctx.globalCompositeOperation = 'source-over'
        } else {
          // contorno azul muito discreto: localiza a capital sem chamar atenção
          ctx.strokeStyle = `rgba(186, 232, 255, ${(0.32 * facing).toFixed(3)})`
          ctx.lineWidth = Math.max(1, 0.85 * dpr)
          for (let p = 0; p < spPolys.length; p++) {
            if (!visiblePoly(p)) continue
            traceClosed(p)
            ctx.stroke()
          }
        }

        ctx.restore()
      }

      function drawHubs(time: number, staticOnly: boolean) {
        for (let h = 0; h < hubNames.length; h++) {
          const v = hubVecs[h]
          const x = v[0] * cl - v[2] * sl
          const z1 = v[2] * cl + v[0] * sl
          const y = v[1] * ct - z1 * st
          const z = v[1] * st + z1 * ct
          if (z < 0.05) continue
          const sx = cx + (x * cr - y * sr) * R
          const sy = cy - (x * sr + y * cr) * R
          const facing = Math.min(1, z * 1.4)

          let flash = 0
          if (!staticOnly) {
            const incoming = arrivalsByHub[hubNames[h]]
            if (incoming) {
              for (const arc of incoming) {
                let local = (time - arc.delay - arc.dur) % cycle
                if (local < 0) local += cycle
                if (local < 1100) {
                  const p = local / 1100
                  flash = Math.max(flash, 1 - p)
                  // onda de chegada
                  ctx.strokeStyle = `rgba(150,225,255,${(0.75 * (1 - p) * facing).toFixed(3)})`
                  ctx.lineWidth = Math.max(1, 1.2 * dpr)
                  ctx.beginPath()
                  const rr = (4 + 22 * p) * dpr * (R / (380 * dpr))
                  ctx.ellipse(sx, sy, rr, rr * (0.45 + 0.55 * z), ROLL, 0, Math.PI * 2)
                  ctx.stroke()
                }
              }
            }
            if (hubNames[h] === 'saoPaulo') {
              const p = (time % 2400) / 2400
              ctx.strokeStyle = `rgba(150,225,255,${(0.6 * (1 - p) * facing).toFixed(3)})`
              ctx.lineWidth = Math.max(1, 1.2 * dpr)
              ctx.beginPath()
              const rr = (5 + 26 * p) * dpr * (R / (380 * dpr))
              ctx.ellipse(sx, sy, rr, rr * (0.45 + 0.55 * z), ROLL, 0, Math.PI * 2)
              ctx.stroke()
            }

            // onda de luz branca no exato momento em que o ponto alcança a capital
            if (hubNames[h] === 'saoPaulo' && spFlash > 0.05) {
              const wave = 1 - spFlash
              ctx.strokeStyle = `rgba(206, 240, 255, ${(0.75 * spFlash).toFixed(3)})`
              ctx.lineWidth = Math.max(1, 1.4 * dpr)
              ctx.beginPath()
              const rr = (4 + 16 * wave) * dpr * (R / (380 * dpr))
              ctx.ellipse(sx, sy, rr, rr * (0.45 + 0.55 * z), ROLL, 0, Math.PI * 2)
              ctx.stroke()
            }
          }

          // Durante o acendimento da capital, o brilho do hub de São Paulo é
          // omitido: a própria silhueta branca é a luz do mapa.
          if (hubNames[h] === 'saoPaulo' && spFlash > 0.05) continue
          const size = (10 + 16 * flash) * dpr * Math.max(0.6, R / (380 * dpr))
          ctx.globalAlpha = (0.55 + 0.45 * flash) * facing
          ctx.drawImage(softGlow, sx - size, sy - size, size * 2, size * 2)
          ctx.globalAlpha = 1
        }
      }
    }

    function drawTrail(
      idx: (i: number) => number,
      xs: Float32Array,
      ys: Float32Array,
      vis: Uint8Array,
      from: number,
      to: number,
      strength: number,
    ) {
      if (to - from < 0.05 || strength <= 0) return
      const sample = (f: number) => {
        const i0 = Math.floor(f)
        const fr = f - i0
        const a = idx(i0)
        const b = idx(i0 + 1)
        return {
          x: xs[a] + (xs[b] - xs[a]) * fr,
          y: ys[a] + (ys[b] - ys[a]) * fr,
          v: vis[a] && vis[b],
        }
      }
      const pts: { x: number; y: number }[] = []
      const segs = Math.max(2, Math.ceil(to - from) + 1)
      for (let k = 0; k <= segs; k++) {
        const p = sample(from + ((to - from) * k) / segs)
        if (!p.v) {
          pts.length = 0 // reinicia após trecho oculto (atrás do globo)
          continue
        }
        pts.push({ x: p.x, y: p.y })
      }
      if (pts.length < 2) return
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
      ctx.lineWidth = 6 * dpr
      ctx.globalAlpha = 0.4
      ctx.stroke()
      ctx.lineWidth = 2 * dpr
      ctx.globalAlpha = 1
      ctx.stroke()

      const s = 12 * dpr * strength
      ctx.drawImage(glow, headP.x - s, headP.y - s, s * 2, s * 2)
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

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
      resize()
      draw(reduceMotion ? 4200 : T)
    }) : null
    ro?.observe(canvas)
    if (!ro) window.addEventListener('resize', resize)

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((entries) => {
            inView = entries[0]?.isIntersecting ?? true
            update()
          })
        : null
    io?.observe(canvas)

    document.addEventListener('visibilitychange', update)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro?.disconnect()
      io?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Globo terrestre girando com conexões de luz se espalhando entre cidades, simbolizando comunicação integrada"
      className={className}
    />
  )
}
