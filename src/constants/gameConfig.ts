import type { Player, ScoreEntry } from '../types'

// Game configuration constants
export const GAME_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYER_NAME_LENGTH: 12,
  BONUS_THRESHOLD: 84,
  BONUS_POINTS: 50,
  STORAGE_KEY: 'yatzy-players',
  CSS_PLAYER_COUNT_VAR: '--player-count'
} as const

export const UPPER_CATEGORIES = [
  'Ones', 
  'Twos', 
  'Threes', 
  'Fours', 
  'Fives', 
  'Sixes'
] as const

export const CALCULATED_ROWS = {
  UPPER_TOTAL: 'TOTAL',
  BONUS: 'BONUS 50 points (at 84)',
  GRAND_TOTAL: 'TOTAL'
} as const

export const DEFAULT_PLAYERS: Player[] = [
  { id: '1', name: 'Player 1', scores: {} },
  { id: '2', name: 'Player 2', scores: {} }
]

// Combinations that require six dice to be achievable
const SIX_DICE_ONLY_PATTERNS = ['three pairs', 'two three', 'royal']

export function filterLowerEntries(entries: ScoreEntry[], numDice: number): ScoreEntry[] {
  if (numDice >= 6) return entries
  return entries.filter(entry => {
    const name = entry.name.toLowerCase()
    return !SIX_DICE_ONLY_PATTERNS.some(pattern => name.includes(pattern))
  })
}