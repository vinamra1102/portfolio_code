"use client"

import { unlockAudio } from "@/lib/sfx"
import { useEffect } from "react"

export function SFXUnlocker() {
  useEffect(() => {
    const unlock = () => {
      unlockAudio()
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
    }
    window.addEventListener("pointerdown", unlock, { once: true })
    window.addEventListener("keydown", unlock, { once: true })
    return () => {
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
    }
  }, [])
  return null
}
