// Game definitions for the home page and the generic sheet engine

export interface SimpleSheetConfig {
  rowLabel: string // e.g. 'Hole', 'Round' — used to generate row names
  defaultRows: number
  maxRows: number
  lowestWins?: boolean
  customRows?: string[] // fixed row names (custom cards); overrides generated rows
}

export interface GameDefinition {
  id: string
  title: string
  emoji: string
  description: string
  kind: 'yatzy' | 'simple'
  sheet?: SimpleSheetConfig
}

export const BUILT_IN_GAMES: GameDefinition[] = [
  {
    id: 'yatzy',
    title: 'Yatzy',
    emoji: '🎲',
    description: 'Six-dice Yatzy with upper-section bonus and all combinations',
    kind: 'yatzy'
  },
  {
    id: 'minigolf',
    title: 'Mini Golf',
    emoji: '⛳',
    description: 'Strokes per hole — lowest total wins',
    kind: 'simple',
    sheet: { rowLabel: 'Hole', defaultRows: 9, maxRows: 36, lowestWins: true }
  },
  {
    id: 'discgolf',
    title: 'Disc Golf',
    emoji: '🥏',
    description: 'Throws per hole — lowest total wins',
    kind: 'simple',
    sheet: { rowLabel: 'Hole', defaultRows: 18, maxRows: 36, lowestWins: true }
  },
  {
    id: 'five-hundred',
    title: '500',
    emoji: '🃏',
    description: 'Card game — points per round, first to 500 wins',
    kind: 'simple',
    sheet: { rowLabel: 'Round', defaultRows: 10, maxRows: 50 }
  }
]

// Custom score cards created by the user, persisted in localStorage

export interface CustomCard {
  id: string
  title: string
  emoji: string
  rows: string[]
}

const CUSTOM_CARDS_KEY = 'scorecards-custom-cards'

export function loadCustomCards(): CustomCard[] {
  try {
    const item = localStorage.getItem(CUSTOM_CARDS_KEY)
    return item ? JSON.parse(item) : []
  } catch (error) {
    console.warn('Error reading custom cards:', error)
    return []
  }
}

export function saveCustomCard(card: CustomCard): CustomCard[] {
  const cards = [...loadCustomCards(), card]
  localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(cards))
  return cards
}

export function deleteCustomCard(id: string): CustomCard[] {
  const cards = loadCustomCards().filter(card => card.id !== id)
  localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(cards))
  // Clean up the card's players/scores and settings as well
  const definitionId = `custom-${id}`
  localStorage.removeItem(`scorecards-${definitionId}-players`)
  localStorage.removeItem(`scorecards-settings-${definitionId}`)
  return cards
}

export function customCardToDefinition(card: CustomCard): GameDefinition {
  return {
    id: `custom-${card.id}`,
    title: card.title,
    emoji: card.emoji || '📋',
    description: `Custom card — ${card.rows.length} rows`,
    kind: 'simple',
    sheet: {
      rowLabel: 'Row',
      defaultRows: card.rows.length,
      maxRows: card.rows.length,
      customRows: card.rows
    }
  }
}
