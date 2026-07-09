import React from 'react'
import sheetData from '../assets/sheet-reference.json'
import type { GameData, Player, ScoreEntry, ScoreSectionRowConfig } from '../types'
import { CALCULATED_ROWS, filterLowerEntries } from '../constants/gameConfig'
import { ScoreSection } from '../components/ScoreSection'
import { useScoreCalculations } from '../hooks/useScoreCalculations'
// Yatzy rendering only; settings are handled at App level

const gameData = sheetData as GameData

export function YatzySections({
  players,
  onScoreChange,
  upperTableRef,
  lowerTableRef,
  hideTotals,
  bonusThreshold,
  bonusPoints,
  numDice
}: {
  players: Player[]
  onScoreChange: (playerId: string, category: string, value: string) => void
  upperTableRef?: React.RefObject<HTMLDivElement>
  lowerTableRef?: React.RefObject<HTMLDivElement>
  hideTotals?: boolean
  bonusThreshold: number
  bonusPoints: number
  numDice: number
}) {
  const { calculateUpperTotal, calculateBonus, calculateGrandTotal } = useScoreCalculations({ bonusThreshold, bonusPoints, numDice })

  // Bonus row is calculated (no stored score keyed by its name), so its label
  // can safely reflect the configured threshold/points
  const bonusLabel = `BONUS ${bonusPoints} points (at ${bonusThreshold})`
  const upperEntries: ScoreEntry[] = gameData.upper_section.map(entry =>
    entry.name === CALCULATED_ROWS.BONUS
      ? { ...entry, name: bonusLabel, max_point: bonusPoints }
      : entry
  )

  // Upper and lower sections each get their own config: both contain a row
  // named "TOTAL", so a shared map would let one overwrite the other
  const upperRowConfig: Record<string, ScoreSectionRowConfig> = {}
  for (const entry of upperEntries) {
    if (entry.name === CALCULATED_ROWS.UPPER_TOTAL) {
      upperRowConfig[entry.name] = { type: 'total', isCalculated: true, calculateValue: calculateUpperTotal }
    } else if (entry.name === bonusLabel) {
      upperRowConfig[entry.name] = { type: 'bonus', isCalculated: true, calculateValue: calculateBonus }
    } else {
      upperRowConfig[entry.name] = { type: 'normal', isCalculated: false }
    }
  }

  const lowerEntries = filterLowerEntries(gameData.lower_section, numDice)
  const lowerRowConfig: Record<string, ScoreSectionRowConfig> = {}
  for (const entry of lowerEntries) {
    if (entry.name === CALCULATED_ROWS.GRAND_TOTAL) {
      lowerRowConfig[entry.name] = { type: 'grand-total', isCalculated: true, isGrandTotal: true, calculateValue: calculateGrandTotal }
    } else {
      lowerRowConfig[entry.name] = { type: 'normal', isCalculated: false }
    }
  }

  return (
    <div>
      <ScoreSection
        title="Upper Section"
        entries={upperEntries}
        players={players}
        onScoreChange={onScoreChange}
        rowConfigByEntryName={upperRowConfig}
        tableRef={upperTableRef}
        hideTotals={hideTotals}
      />
      <ScoreSection
        title="Lower Section"
        entries={lowerEntries}
        players={players}
        onScoreChange={onScoreChange}
        rowConfigByEntryName={lowerRowConfig}
        tableRef={lowerTableRef}
        hideTotals={hideTotals}
      />
    </div>
  )
}
