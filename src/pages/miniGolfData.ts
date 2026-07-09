import type { GameData } from '../types'

// Simple minigolf definition: N holes with a TOTAL row at the end
export function createMiniGolfData(holes: number): GameData {
  const entries = Array.from({ length: holes }, (_, i) => ({ name: `Hole ${i + 1}`, max_point: null }))
  entries.push({ name: 'TOTAL', max_point: null })
  return {
    title: `Mini Golf - ${holes} holes`,
    upper_section: entries,
    lower_section: []
  }
}
