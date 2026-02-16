import { useEffect, useRef } from 'react'
import useReducedMotion from '../../hooks/useReducedMotion'

const MIN_STAR_COUNT = 90
const MAX_STAR_COUNT = 260
const MIN_NODE_COUNT = 16
const MAX_NODE_COUNT = 36
const MIN_NEBULA_COUNT = 3
const MAX_NEBULA_COUNT = 7
const MIN_GLYPH_COUNT = 6
const MAX_GLYPH_COUNT = 16

const STAR_TINTS = [
  [240, 239, 241],
  [27, 219, 239],
  [190, 165, 255]
]

const NEBULA_TINTS = [
  [27, 219, 239],
  [222, 45, 231],
  [28, 100, 148],
  [39, 25, 58]
]

const PROGRAM_GLYPHS = ['<>', '{}', '01', 'AI', '//', 'fn()', '[]', '->']

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function pickRandom(values) {
  return values[Math.floor(Math.random() * values.length)]
}

function createNodePair(count, previousPair = null) {
  if (count < 2) return { from: 0, to: 0 }

  let from = Math.floor(Math.random() * count)
  let to = Math.floor(Math.random() * count)

  while (to === from) {
    to = Math.floor(Math.random() * count)
  }

  if (previousPair && previousPair.from === from && previousPair.to === to) {
    from = (from + 1) % count
    to = (to + 2) % count
    if (to === from) to = (to + 1) % count
  }

  return { from, to }
}

export default function CosmicNeuralBackground() {
  const canvasRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return undefined

    let width = 0
    let height = 0
    let dpr = 1
    let animationFrameId = 0

    const pointer = { x: 0.5, y: 0.5 }
    const stars = []
    const nebulas = []
    const nodes = []
    const packets = []
    const glyphs = []
    const traces = []

    const drawBackdrop = () => {
      const gradient = context.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, 'rgba(18, 14, 39, 0.88)')
      gradient.addColorStop(0.45, 'rgba(24, 35, 62, 0.82)')
      gradient.addColorStop(1, 'rgba(10, 28, 44, 0.84)')
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)
    }

    const rebuildScene = () => {
      stars.length = 0
      nebulas.length = 0
      nodes.length = 0
      packets.length = 0
      glyphs.length = 0
      traces.length = 0

      const area = width * height
      const starCount = clamp(Math.round(area / 6800), MIN_STAR_COUNT, MAX_STAR_COUNT)
      const nodeCount = clamp(Math.round(area / 41000), MIN_NODE_COUNT, MAX_NODE_COUNT)
      const nebulaCount = clamp(Math.round(area / 240000), MIN_NEBULA_COUNT, MAX_NEBULA_COUNT)
      const glyphCount = clamp(Math.round(area / 130000), MIN_GLYPH_COUNT, MAX_GLYPH_COUNT)
      const traceCount = clamp(Math.round(area / 170000), 7, 18)
      const packetCount = clamp(Math.round(nodeCount / 2), 6, 16)

      for (let index = 0; index < starCount; index += 1) {
        const tint = pickRandom(STAR_TINTS)
        stars.push({
          x: randomBetween(0, width),
          y: randomBetween(0, height),
          radius: randomBetween(0.5, 1.9),
          alpha: randomBetween(0.22, 0.92),
          twinkleSpeed: randomBetween(0.0004, 0.0012),
          phase: randomBetween(0, Math.PI * 2),
          driftX: randomBetween(-0.018, 0.018),
          driftY: randomBetween(-0.012, 0.012),
          parallax: randomBetween(10, 36),
          tint
        })
      }

      for (let index = 0; index < nebulaCount; index += 1) {
        const tint = pickRandom(NEBULA_TINTS)
        nebulas.push({
          baseX: randomBetween(0.08 * width, 0.92 * width),
          baseY: randomBetween(0.08 * height, 0.92 * height),
          radius: randomBetween(width * 0.2, width * 0.38),
          pulse: randomBetween(0, Math.PI * 2),
          sway: randomBetween(16, 52),
          speed: randomBetween(0.00008, 0.00024),
          alpha: randomBetween(0.12, 0.22),
          tint
        })
      }

      for (let index = 0; index < nodeCount; index += 1) {
        nodes.push({
          x: randomBetween(0.08 * width, 0.92 * width),
          y: randomBetween(0.12 * height, 0.9 * height),
          vx: randomBetween(-0.12, 0.12),
          vy: randomBetween(-0.1, 0.1),
          radius: randomBetween(1.4, 2.9),
          phase: randomBetween(0, Math.PI * 2)
        })
      }

      for (let index = 0; index < packetCount; index += 1) {
        const pair = createNodePair(nodeCount)
        packets.push({
          from: pair.from,
          to: pair.to,
          progress: randomBetween(0, 1),
          speed: randomBetween(0.0025, 0.008),
          tint: index % 2 === 0 ? [27, 219, 239] : [222, 45, 231]
        })
      }

      for (let index = 0; index < glyphCount; index += 1) {
        glyphs.push({
          x: randomBetween(20, width - 20),
          y: randomBetween(20, height - 20),
          size: randomBetween(10, 16),
          alpha: randomBetween(0.15, 0.32),
          driftX: randomBetween(-0.05, 0.05),
          driftY: randomBetween(0.08, 0.22),
          phase: randomBetween(0, Math.PI * 2),
          glyph: pickRandom(PROGRAM_GLYPHS)
        })
      }

      for (let index = 0; index < traceCount; index += 1) {
        const horizontal = Math.random() > 0.5
        traces.push({
          horizontal,
          x: randomBetween(0.06 * width, 0.94 * width),
          y: randomBetween(0.08 * height, 0.92 * height),
          length: randomBetween(60, 180)
        })
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      rebuildScene()
      drawFrame(performance.now())
    }

    const drawCircuitGrid = (pointerOffsetX, pointerOffsetY) => {
      const spacing = width > 960 ? 140 : 100
      const offsetX = (pointerOffsetX * 0.6) % spacing
      const offsetY = (pointerOffsetY * 0.6) % spacing

      context.beginPath()
      for (let x = -spacing; x < width + spacing; x += spacing) {
        context.moveTo(x + offsetX, 0)
        context.lineTo(x + offsetX, height)
      }
      for (let y = -spacing; y < height + spacing; y += spacing) {
        context.moveTo(0, y + offsetY)
        context.lineTo(width, y + offsetY)
      }
      context.lineWidth = 1
      context.strokeStyle = 'rgba(27, 219, 239, 0.055)'
      context.stroke()

      context.beginPath()
      for (const trace of traces) {
        if (trace.horizontal) {
          context.moveTo(trace.x + pointerOffsetX * 0.22, trace.y + pointerOffsetY * 0.22)
          context.lineTo(trace.x + trace.length + pointerOffsetX * 0.22, trace.y + pointerOffsetY * 0.22)
        } else {
          context.moveTo(trace.x + pointerOffsetX * 0.22, trace.y + pointerOffsetY * 0.22)
          context.lineTo(trace.x + pointerOffsetX * 0.22, trace.y + trace.length + pointerOffsetY * 0.22)
        }
      }
      context.lineWidth = 1.1
      context.strokeStyle = 'rgba(222, 45, 231, 0.09)'
      context.stroke()
    }

    const drawNebulas = (timestamp, pointerOffsetX, pointerOffsetY) => {
      for (const nebula of nebulas) {
        const swayX = Math.sin(timestamp * nebula.speed + nebula.pulse) * nebula.sway
        const swayY = Math.cos(timestamp * nebula.speed * 1.2 + nebula.pulse) * nebula.sway

        const x = nebula.baseX + swayX + pointerOffsetX * 0.35
        const y = nebula.baseY + swayY + pointerOffsetY * 0.35
        const radius = nebula.radius + Math.sin(timestamp * 0.0002 + nebula.pulse) * 24
        const [r, g, b] = nebula.tint

        const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${nebula.alpha})`)
        gradient.addColorStop(0.56, `rgba(${r}, ${g}, ${b}, ${nebula.alpha * 0.34})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        context.fillStyle = gradient
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    const drawStars = (timestamp, pointerOffsetX, pointerOffsetY) => {
      for (const star of stars) {
        if (!reducedMotion) {
          star.x += star.driftX
          star.y += star.driftY

          if (star.x < -4) star.x = width + 4
          if (star.x > width + 4) star.x = -4
          if (star.y < -4) star.y = height + 4
          if (star.y > height + 4) star.y = -4
        }

        const alphaPulse = Math.sin(timestamp * star.twinkleSpeed + star.phase) * 0.25
        const alpha = clamp(star.alpha + alphaPulse, 0.06, 0.98)
        const [r, g, b] = star.tint

        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        context.beginPath()
        context.arc(
          star.x + pointerOffsetX * (star.parallax / 34),
          star.y + pointerOffsetY * (star.parallax / 34),
          star.radius,
          0,
          Math.PI * 2
        )
        context.fill()
      }
    }

    const drawNodesAndEdges = (timestamp, pointerOffsetX, pointerOffsetY) => {
      const maxDistance = width > 1100 ? 220 : 180

      for (const node of nodes) {
        if (!reducedMotion) {
          node.x += node.vx
          node.y += node.vy

          if (node.x < 22 || node.x > width - 22) node.vx *= -1
          if (node.y < 22 || node.y > height - 22) node.vy *= -1
        }
      }

      for (let index = 0; index < nodes.length; index += 1) {
        const first = nodes[index]

        for (let secondIndex = index + 1; secondIndex < nodes.length; secondIndex += 1) {
          const second = nodes[secondIndex]
          const dx = first.x - second.x
          const dy = first.y - second.y
          const distance = Math.hypot(dx, dy)

          if (distance > maxDistance) continue

          const strength = 1 - distance / maxDistance
          const alpha = clamp(strength * 0.32, 0.03, 0.24)

          context.beginPath()
          context.moveTo(first.x + pointerOffsetX * 0.3, first.y + pointerOffsetY * 0.3)
          context.lineTo(second.x + pointerOffsetX * 0.3, second.y + pointerOffsetY * 0.3)
          context.lineWidth = 1
          context.strokeStyle = `rgba(27, 219, 239, ${alpha})`
          context.stroke()

          if (distance < maxDistance * 0.55) {
            context.beginPath()
            context.moveTo(first.x + pointerOffsetX * 0.25, first.y + pointerOffsetY * 0.25)
            context.lineTo(second.x + pointerOffsetX * 0.25, second.y + pointerOffsetY * 0.25)
            context.lineWidth = 0.75
            context.strokeStyle = `rgba(222, 45, 231, ${alpha * 0.55})`
            context.stroke()
          }
        }
      }

      for (const packet of packets) {
        const from = nodes[packet.from]
        const to = nodes[packet.to]

        if (!from || !to) continue

        if (!reducedMotion) {
          packet.progress += packet.speed
        }

        if (packet.progress >= 1) {
          const pair = createNodePair(nodes.length, packet)
          packet.from = pair.from
          packet.to = pair.to
          packet.progress = 0
        }

        const x = from.x + (to.x - from.x) * packet.progress + pointerOffsetX * 0.24
        const y = from.y + (to.y - from.y) * packet.progress + pointerOffsetY * 0.24
        const trailProgress = Math.max(packet.progress - 0.08, 0)
        const trailX = from.x + (to.x - from.x) * trailProgress + pointerOffsetX * 0.24
        const trailY = from.y + (to.y - from.y) * trailProgress + pointerOffsetY * 0.24
        const [r, g, b] = packet.tint

        context.beginPath()
        context.moveTo(trailX, trailY)
        context.lineTo(x, y)
        context.lineWidth = 1.7
        context.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.32)`
        context.stroke()

        context.beginPath()
        context.fillStyle = `rgba(${r}, ${g}, ${b}, 0.96)`
        context.arc(x, y, 2.5, 0, Math.PI * 2)
        context.fill()

        context.beginPath()
        context.fillStyle = `rgba(${r}, ${g}, ${b}, 0.2)`
        context.arc(x, y, 6, 0, Math.PI * 2)
        context.fill()
      }

      for (const node of nodes) {
        const pulse = reducedMotion ? 1 : 1 + Math.sin(timestamp * 0.003 + node.phase) * 0.24
        const x = node.x + pointerOffsetX * 0.28
        const y = node.y + pointerOffsetY * 0.28

        context.beginPath()
        context.fillStyle = 'rgba(27, 219, 239, 0.22)'
        context.arc(x, y, node.radius * 3 * pulse, 0, Math.PI * 2)
        context.fill()

        context.beginPath()
        context.fillStyle = 'rgba(27, 219, 239, 0.95)'
        context.arc(x, y, node.radius * pulse, 0, Math.PI * 2)
        context.fill()
      }
    }

    const drawGlyphs = (timestamp, pointerOffsetX, pointerOffsetY) => {
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      for (const glyph of glyphs) {
        if (!reducedMotion) {
          glyph.y -= glyph.driftY
          glyph.x += glyph.driftX

          if (glyph.y < -24) {
            glyph.y = height + randomBetween(12, 42)
            glyph.x = randomBetween(24, width - 24)
            glyph.glyph = pickRandom(PROGRAM_GLYPHS)
          }

          if (glyph.x < 8) glyph.x = width - 12
          if (glyph.x > width - 8) glyph.x = 12
        }

        const pulse = Math.sin(timestamp * 0.001 + glyph.phase) * 0.12
        const alpha = clamp(glyph.alpha + pulse, 0.08, 0.38)

        context.font = `${glyph.size}px "JetBrains Mono", monospace`
        context.fillStyle = `rgba(200, 222, 255, ${alpha})`
        context.fillText(glyph.glyph, glyph.x + pointerOffsetX * 0.18, glyph.y + pointerOffsetY * 0.18)
      }
    }

    const drawFrame = (timestamp) => {
      context.clearRect(0, 0, width, height)

      const pointerOffsetX = (pointer.x - 0.5) * 24
      const pointerOffsetY = (pointer.y - 0.5) * 20

      drawBackdrop()
      drawNebulas(timestamp, pointerOffsetX, pointerOffsetY)
      drawCircuitGrid(pointerOffsetX, pointerOffsetY)
      drawStars(timestamp, pointerOffsetX, pointerOffsetY)
      drawNodesAndEdges(timestamp, pointerOffsetX, pointerOffsetY)
      drawGlyphs(timestamp, pointerOffsetX, pointerOffsetY)
    }

    const animate = (timestamp) => {
      drawFrame(timestamp)
      animationFrameId = window.requestAnimationFrame(animate)
    }

    const handlePointerMove = (event) => {
      pointer.x = clamp(event.clientX / width, 0, 1)
      pointer.y = clamp(event.clientY / height, 0, 1)

      if (reducedMotion) {
        drawFrame(performance.now())
      }
    }

    const handlePointerLeave = () => {
      pointer.x = 0.5
      pointer.y = 0.5

      if (reducedMotion) {
        drawFrame(performance.now())
      }
    }

    resize()

    if (!reducedMotion) {
      animationFrameId = window.requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [reducedMotion])

  return (
    <div className="cosmic-background" aria-hidden="true">
      <canvas ref={canvasRef} className="cosmic-canvas" />
    </div>
  )
}
