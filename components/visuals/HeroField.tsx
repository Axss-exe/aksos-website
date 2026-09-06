'use client'

import { useEffect, useRef } from 'react'

const fragments = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 37) % 100,
  y: 12 + ((i * 53) % 76),
  length: 8 + (i % 4) * 5,
  tilt: (i % 3) - 1,
}))

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0
    let isVisible = true
    let width = 1
    let height = 1
    let pixelRatio = 1
    let reducedMotion = false

    const resizeBitmap = () => {
      const bounds = host.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(bounds.width))
      const nextHeight = Math.max(1, Math.round(bounds.height))
      const nextRatio = Math.min(2, window.devicePixelRatio || 1)
      if (nextWidth === width && nextHeight === height && nextRatio === pixelRatio) return
      width = nextWidth
      height = nextHeight
      pixelRatio = nextRatio
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
    }

    const render = (time: number) => {
      frame = 0
      if (!isVisible) return
      resizeBitmap()
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      context.clearRect(0, 0, width, height)
      const drift = reducedMotion ? 0 : Math.sin(time * 0.0003) * 3
      fragments.forEach((fragment, index) => {
        const x = (width * fragment.x) / 100 + drift * (index % 2 ? 1 : -1)
        const y = (height * fragment.y) / 100
        context.strokeStyle = `rgba(26,26,26,${0.12 + (index % 4) * 0.03})`
        context.lineWidth = 0.7
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(x + fragment.length, y + fragment.tilt * 9)
        context.stroke()
      })
      if (!reducedMotion) frame = requestAnimationFrame(render)
    }

    const schedule = () => {
      if (isVisible && !frame) frame = requestAnimationFrame(render)
    }
    const resizeObserver = new ResizeObserver(schedule)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) schedule()
      else if (frame) cancelAnimationFrame(frame)
      if (!isVisible) frame = 0
    })
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    resizeObserver.observe(host)
    intersectionObserver.observe(host)
    resizeBitmap()
    schedule()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [])

  return (
    <div className="visual hero-field">
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="visual-note">FIELD / LATENT STRUCTURE</span>
    </div>
  )
}

export default HeroField
