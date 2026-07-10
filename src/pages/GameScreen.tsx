import React, { useState } from 'react'
import styles from '../App.module.css'
import controls from '../components/styles/Controls.module.css'
import settingsStyles from '../components/styles/Settings.module.css'
import { PlayerNameHeader, SettingsModal, SettingsButton } from '../components'
import { usePlayerManagement } from '../hooks/usePlayerManagement'
import { useSynchronizedScroll } from '../hooks/useSynchronizedScroll'
import { useDynamicGrid } from '../hooks/useDynamicGrid'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { YatzySections } from './YatzyPage'
import { SimpleSheetSection } from './SimpleSheetPage'
import type { GameDefinition } from '../games/registry'
import { GAME_CONFIG } from '../constants/gameConfig'

interface GameSettings {
  dice: number
  bonusThreshold: number
  bonusPoints: number
  rows: number
}

function defaultSettings(game: GameDefinition): GameSettings {
  return {
    dice: 6,
    bonusThreshold: GAME_CONFIG.BONUS_THRESHOLD,
    bonusPoints: GAME_CONFIG.BONUS_POINTS,
    rows: game.sheet?.defaultRows ?? 0
  }
}

/**
 * One running game: sticky player header, the game's score sheet, and settings.
 * Players/scores and settings are persisted per game.
 */
export function GameScreen({ game, onBack }: { game: GameDefinition; onBack: () => void }) {
  // Default to hiding totals for suspense
  const [hideTotals, setHideTotals] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Yatzy keeps its original key so existing saved games survive the update
  const storageKey = game.id === 'yatzy' ? GAME_CONFIG.STORAGE_KEY : `scorecards-${game.id}-players`
  const {
    players,
    addPlayer,
    removeLatestPlayer,
    updatePlayerName,
    updateScore,
    resetScores,
    canRemovePlayer
  } = usePlayerManagement(storageKey)

  const [settings, setSettings] = useLocalStorage<GameSettings>(
    `scorecards-settings-${game.id}`,
    defaultSettings(game)
  )

  const { playerHeaderRef, upperTableRef, lowerTableRef } = useSynchronizedScroll()
  useDynamicGrid(players.length)

  const sheet = game.sheet
  const rowNames = sheet
    ? sheet.customRows ?? Array.from({ length: settings.rows }, (_, i) => `${sheet.rowLabel} ${i + 1}`)
    : []

  return (
    <div className={styles.yatzySheet}>
      <header className={styles.sheetHeader}>
        <div className={controls.topLeftControls}>
          <button className={controls.resetButton} onClick={onBack} title="All games">← Games</button>
        </div>
        <h1>{game.emoji} {game.title}</h1>
        <div className={controls.headerControls}>
          <button
            className={`${controls.toggleTotalsButton} ${hideTotals ? controls.toggleTotalsButtonHidden : ''}`}
            onClick={() => setHideTotals(prev => !prev)}
            title={hideTotals ? 'Show totals' : 'Hide totals'}
          >
            {hideTotals ? '👁️ Show' : '🙈 Hide'}
          </button>
        </div>
        <SettingsButton onClick={() => setSettingsOpen(true)} />
      </header>

      <div className={styles.stickyPlayerHeader} ref={playerHeaderRef}>
        <PlayerNameHeader
          players={players}
          onPlayerNameChange={updatePlayerName}
        />
      </div>

      <div className={styles.sheetSections}>
        {game.kind === 'yatzy' ? (
          <YatzySections
            players={players}
            onScoreChange={updateScore}
            upperTableRef={upperTableRef as React.RefObject<HTMLDivElement>}
            lowerTableRef={lowerTableRef as React.RefObject<HTMLDivElement>}
            hideTotals={hideTotals}
            bonusThreshold={settings.bonusThreshold}
            bonusPoints={settings.bonusPoints}
            numDice={settings.dice}
          />
        ) : (
          <SimpleSheetSection
            title={game.title}
            rowNames={rowNames}
            players={players}
            onScoreChange={updateScore}
            tableRef={lowerTableRef as React.RefObject<HTMLDivElement>}
            hideTotals={hideTotals}
          />
        )}

        <SettingsModal open={settingsOpen} title="Settings" onClose={() => setSettingsOpen(false)}>
          <div className={settingsStyles.content}>
            <div className={settingsStyles.grid}>
              {game.kind === 'yatzy' && (
                <>
                  <div className={settingsStyles.row}><label>Dice</label><input type="number" min={1} max={6} value={settings.dice} onChange={(e) => setSettings(prev => ({ ...prev, dice: Number(e.target.value) }))} /></div>
                  <div className={settingsStyles.row}><label>Bonus threshold</label><input type="number" value={settings.bonusThreshold} onChange={(e) => setSettings(prev => ({ ...prev, bonusThreshold: Number(e.target.value) }))} /></div>
                  <div className={settingsStyles.row}><label>Bonus points</label><input type="number" value={settings.bonusPoints} onChange={(e) => setSettings(prev => ({ ...prev, bonusPoints: Number(e.target.value) }))} /></div>
                </>
              )}
              {sheet && !sheet.customRows && (
                <div className={settingsStyles.row}><label>{sheet.rowLabel}s</label><input type="number" min={1} max={sheet.maxRows} value={settings.rows} onChange={(e) => setSettings(prev => ({ ...prev, rows: Number(e.target.value) }))} /></div>
              )}
              <div className={settingsStyles.row}>
                <label>Players</label>
                <div className={settingsStyles.playerStepper}>
                  <button className={settingsStyles.stepButton} onClick={removeLatestPlayer} disabled={!canRemovePlayer}>-</button>
                  <span className={settingsStyles.stepValue}>{players.length}</span>
                  <button className={settingsStyles.stepButton} onClick={addPlayer}>+</button>
                </div>
              </div>
            </div>
            <div className={settingsStyles.actions}>
              <button className={controls.resetButton} onClick={() => {
                if (window.confirm('Start a new game? This clears all scores (player names are kept).')) {
                  resetScores()
                  setSettingsOpen(false)
                }
              }}>New game</button>
              <button className={controls.resetButton} onClick={() => setSettings(defaultSettings(game))}>Reset settings</button>
              <button className={controls.addPlayerButton} onClick={() => setSettingsOpen(false)}>Close</button>
            </div>
          </div>
        </SettingsModal>
      </div>
    </div>
  )
}
