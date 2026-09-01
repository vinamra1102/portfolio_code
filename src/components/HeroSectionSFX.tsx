"use client"

import { playSFX } from "@/lib/sfx"
import HeroSection from "./HeroSection"

export default function HeroSectionSFX() {
  const handlePointerOver = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest("a[href='#contact']")
    if (link) playSFX("hover")
  }

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest("a[href='#contact']")
    if (link) playSFX("select")
  }

  return (
    <div onPointerOver={handlePointerOver} onClick={handleClick}>
      <HeroSection />
    </div>
  )
}
