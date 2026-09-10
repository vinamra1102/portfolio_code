"use client"

import { useEffect } from "react"
import Lenis from "@studio-freight/lenis"

const LENIS_DURATION = 1.4
const LENIS_TOUCH_MULTIPLIER = 2

/**
 * The running instance, kept at module scope so components that need to drive
 * the scroll (overlays freezing the page, the dot nav jumping to a section)
 * can reach it without threading a context through the Server Component root
 * layout. Null whenever Lenis is not running, which is the reduced-motion
 * case, so every helper below has to cope with that.
 */
let lenisInstance: Lenis | null = null

export function getLenis() {
  return lenisInstance
}

/**
 * Freeze the page behind a full screen overlay. Lenis drives the scroll
 * position itself, so `body { overflow: hidden }` alone does not stop it and
 * the page kept moving behind open overlays. The body rule stays as the
 * fallback for when Lenis is off.
 */
export function lockScroll() {
  document.body.style.overflow = "hidden"
  lenisInstance?.stop()
}

export function unlockScroll() {
  document.body.style.overflow = ""
  lenisInstance?.start()
}

/**
 * Jump to a section by id. Native `scrollIntoView` fights Lenis for control of
 * the scroll position, so route through Lenis whenever it is running.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisInstance) {
    lenisInstance.scrollTo(el)
  } else {
    el.scrollIntoView({ behavior: "smooth" })
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
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

    lenisInstance = lenis

    // In-page anchors are handled here rather than by Lenis: the installed
    // 1.0.x has no `anchors` option, and letting the browser do the jump
    // natively desynchronises Lenis from the real scroll position.
    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const link = (e.target as Element | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null
      if (!link || link.target === "_blank") return

      const id = link.getAttribute("href")?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return

      e.preventDefault()
      lenis.scrollTo(el)
    }

    document.addEventListener("click", onAnchorClick)

    // Lenis moves the real scroll position, so the browser emits native
    // scroll events on its own. Re-dispatching a synthetic one per frame
    // only doubled the work of every scroll listener on the page.
    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time)
      // Reassigning here matters: cancelling the id captured once at setup
      // would only cancel a frame that had already fired, leaving the loop
      // running forever against a destroyed instance.
      frame = requestAnimationFrame(raf)
    })

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("click", onAnchorClick)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return <>{children}</>
}
