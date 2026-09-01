"use client"

import { useState, useEffect } from "react"
import { isSFXEnabled, setSFXEnabled, playSFX } from "@/lib/sfx"

export function SFXToggle() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setEnabled(isSFXEnabled())
  }, [])

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    setSFXEnabled(next)
    if (next) playSFX("toggle")
  }

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Disable sound effects" : "Enable sound effects"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "transparent",
        border: "0.5px solid #262626",
        borderRadius: "100px",
        padding: "6px 14px",
        fontSize: "11px",
        color: enabled ? "#999999" : "#444444",
        cursor: "none",
        transition: "all 0.2s",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginTop: "24px",
      }}
    >
      <span style={{ fontSize: "13px" }}>{enabled ? "\u266A" : "\u266A"}</span>
      {enabled ? "Sound on" : "Sound off"}
    </button>
  )
}
