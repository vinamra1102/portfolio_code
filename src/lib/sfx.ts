/*
  UI SFX -- Pack: scifi

  Hero CTA hover:          hover
  Hero CTA click:          select
  Specialization arm click: select
  Specialization open:     expand
  Specialization close:    close
  Project row click:       select
  Project overlay open:    expand
  Project overlay close:   close
  GitHub link click:       navigate
  Form field focus:        focus
  Form send success:       success
  Form send error:         error
  Form validation error:   error
  Scroll dot click:        navigate
  Sound toggle on:         toggle
*/

"use client"

import { createUISFX } from "uisfx"

let player: ReturnType<typeof createUISFX> | null = null
let audioUnlocked = false

function getSavedPreference(): boolean {
  if (typeof window === "undefined") return true
  const saved = localStorage.getItem("sfx-enabled")
  return saved === null ? true : saved === "true"
}

function getSavedVolume(): number {
  if (typeof window === "undefined") return 0.6
  const saved = localStorage.getItem("sfx-volume")
  return saved === null ? 0.6 : parseFloat(saved)
}

export function getPlayer() {
  if (typeof window === "undefined") return null
  if (!player) {
    player = createUISFX({
      pack: "scifi",
      volume: getSavedVolume(),
      enabled: getSavedPreference(),
    })
  }
  return player
}

export function unlockAudio() {
  audioUnlocked = true
}

export function isAudioUnlocked() {
  return audioUnlocked
}

export function playSFX(cue: string) {
  if (typeof window === "undefined") return
  if (!audioUnlocked) return
  const ui = getPlayer()
  if (!ui) return
  try {
    ui.play(cue as Parameters<ReturnType<typeof createUISFX>["play"]>[0])
  } catch {
    // suppress errors silently
  }
}

export function setSFXEnabled(enabled: boolean) {
  const ui = getPlayer()
  if (!ui) return
  if (!enabled) {
    ui.stopAll()
  }
  ui.setEnabled(enabled)
  localStorage.setItem("sfx-enabled", String(enabled))
}

export function setSFXVolume(volume: number) {
  const ui = getPlayer()
  if (!ui) return
  ui.setVolume(volume)
  localStorage.setItem("sfx-volume", String(volume))
}

export function isSFXEnabled(): boolean {
  return getSavedPreference()
}
