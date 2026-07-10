import React from 'react'
import type { Player, ScoreEntry, ScoreSectionRowConfig } from '../types'
import { ScoreSection } from '../components/ScoreSection'

export const SIMPLE_SHEET_TOTAL_ROW = 'TOTAL'

/**
 * Generic score sheet: a list of input rows plus an auto-calculated TOTAL row.
 * Powers mini golf, disc golf, 500 and user-created custom cards.
 */
export function SimpleSheetSection({
  title,
  rowNames,
  players,
  onScoreChange,
  tableRef,
  hideTotals
}: {
  title: string
  rowNames: string[]
  players: Player[]
  onScoreChange: (playerId: string, category: string, value: string) => void
  tableRef?: React.RefObject<HTMLDivElement>
  hideTotals?: boolean
}) {
  const entries: ScoreEntry[] = [
    ...rowNames.map(name => ({ name, max_point: null })),
    { name: SIMPLE_SHEET_TOTAL_ROW, max_point: null }
  ]

  const rowConfig: Record<string, ScoreSectionRowConfig> = {}
  for (const name of rowNames) {
    rowConfig[name] = { type: 'normal', isCalculated: false }
  }
  rowConfig[SIMPLE_SHEET_TOTAL_ROW] = {
    type: 'grand-total',
    isCalculated: true,
    isGrandTotal: true,
    calculateValue: (player: Player) =>
      rowNames.reduce((sum, name) => sum + (player.scores[name] ?? 0), 0)
  }

  return (
    <div>
      <ScoreSection
        title={title}
        entries={entries}
        players={players}
        onScoreChange={onScoreChange}
        rowConfigByEntryName={rowConfig}
        tableRef={tableRef}
        hideTotals={hideTotals}
      />
    </div>
  )
}
