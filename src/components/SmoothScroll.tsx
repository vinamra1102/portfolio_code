"use client"

import { useEffect, useRef } from "react"
import Lenis from "@studio-freight/lenis"

const LENIS_DURATION = 1.4
const LENIS_TOUCH_MULTIPLIER = 2

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: LENIS_DURATION,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: LENIS_TOUCH_MULTIPLIER,
      infinite: false,
    })

    lenisRef.current = lenis

    lenis.on("scroll", () => {
      window.dispatchEvent(new Event("scroll"))
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
