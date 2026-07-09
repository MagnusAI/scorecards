import { useState } from 'react'
import styles from './App.module.css'
import sheetData from './assets/sheet-reference.json'
import type { GameData } from './types'
import { PlayerNameHeader, SettingsModal, SettingsButton } from './components'
import settingsStyles from './components/styles/Settings.module.css'
import { usePlayerManagement } from './hooks/usePlayerManagement'
import { useSynchronizedScroll } from './hooks/useSynchronizedScroll'
import { useDynamicGrid } from './hooks/useDynamicGrid'
import { YatzySections } from './pages/YatzyPage'
import { MiniGolfSection } from './pages/MiniGolfPage'
import { createMiniGolfData } from './pages/miniGolfData'
import controls from './components/styles/Controls.module.css'

// Type assertion for sheet data
const gameData = sheetData as GameData

/**
 * Main App component - now focused only on composition and coordination
 * Follows Single Responsibility Principle by delegating specific concerns to hooks and components
 */
function App() {
  // Local state for UI preferences - default to hiding totals for suspense
  const [hideTotals, setHideTotals] = useState(true)

  // Custom hooks handle specific concerns
  const {
    players,
    addPlayer,
    removeLatestPlayer,
    updatePlayerName,
    updateScore,
    resetScores,
    canRemovePlayer
  } = usePlayerManagement()

  const { playerHeaderRef, upperTableRef, lowerTableRef } = useSynchronizedScroll()
  const [sheetType, setSheetType] = useState<'yatzy' | 'minigolf'>('yatzy')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [miniGolfHoles, setMiniGolfHoles] = useState(9)
  const miniGolfData = createMiniGolfData(miniGolfHoles)
  const pageTitle = sheetType === 'yatzy' ? gameData.title : miniGolfData.title
  const [yatzyDice, setYatzyDice] = useState(6)
  const [yatzyBonusThreshold, setYatzyBonusThreshold] = useState(84)
  const [yatzyBonusPoints, setYatzyBonusPoints] = useState(50)
  
  // Update CSS grid columns based on player count
  useDynamicGrid(players.length)

  // Removed unused toggle for now; reintroduce when adding header toggle

  return (
    <div className={styles.yatzySheet}>
      <header className={styles.sheetHeader}>
        <h1>{pageTitle}</h1>
        <div className={controls.headerControls}>
          <button
            className={`${controls.toggleTotalsButton} ${sheetType !== 'yatzy' ? controls.toggleTotalsButtonHidden : ''}`}
            onClick={() => setSheetType('yatzy')}
          >
            Yatzy
          </button>
          <button
            className={`${controls.toggleTotalsButton} ${sheetType !== 'minigolf' ? controls.toggleTotalsButtonHidden : ''}`}
            onClick={() => setSheetType('minigolf')}
          >
            Mini Golf
          </button>
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
        {sheetType === 'yatzy' ? (
          <YatzySections
            players={players}
            onScoreChange={(playerId, category, value) => updateScore(playerId, category, value)}
            upperTableRef={upperTableRef as React.RefObject<HTMLDivElement>}
            lowerTableRef={lowerTableRef as React.RefObject<HTMLDivElement>}
            hideTotals={hideTotals}
            bonusThreshold={yatzyBonusThreshold}
            bonusPoints={yatzyBonusPoints}
            numDice={yatzyDice}
          />
        ) : (
          <MiniGolfSection
            data={miniGolfData}
            players={players}
            onScoreChange={(playerId, category, value) => updateScore(playerId, category, value)}
            tableRef={lowerTableRef as React.RefObject<HTMLDivElement>}
            hideTotals={hideTotals}
          />
        )}

        <SettingsModal open={settingsOpen} title="Settings" onClose={() => setSettingsOpen(false)}>
          <div className={settingsStyles.content}>
            <div className={settingsStyles.grid}>
              {sheetType === 'minigolf' ? (
                <div className={settingsStyles.row}><label>Holes</label><input type="number" min={1} max={36} value={miniGolfHoles} onChange={(e) => setMiniGolfHoles(Number(e.target.value))} /></div>
              ) : (
                <>
                  <div className={settingsStyles.row}><label>Dice</label><input type="number" min={1} max={6} value={yatzyDice} onChange={(e) => setYatzyDice(Number(e.target.value))} /></div>
                  <div className={settingsStyles.row}><label>Bonus threshold</label><input type="number" value={yatzyBonusThreshold} onChange={(e) => setYatzyBonusThreshold(Number(e.target.value))} /></div>
                  <div className={settingsStyles.row}><label>Bonus points</label><input type="number" value={yatzyBonusPoints} onChange={(e) => setYatzyBonusPoints(Number(e.target.value))} /></div>
                </>
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
                  resetScores();
                  setSettingsOpen(false);
                }
              }}>New game</button>
              <button className={controls.resetButton} onClick={() => {
                setMiniGolfHoles(9);
                setYatzyDice(6);
                setYatzyBonusThreshold(84);
                setYatzyBonusPoints(50);
              }}>Reset settings</button>
              <button className={controls.addPlayerButton} onClick={() => setSettingsOpen(false)}>Close</button>
            </div>
          </div>
        </SettingsModal>
      </div>
    </div>
  )
}

export default App
