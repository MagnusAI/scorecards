import { useState } from 'react'
import type { CustomCard } from '../games/registry'
import { SIMPLE_SHEET_TOTAL_ROW } from './SimpleSheetPage'
import styles from './styles/Home.module.css'
import controls from '../components/styles/Controls.module.css'

/**
 * Form for creating a user-defined score card: a title plus the rows to score.
 * A TOTAL row is always added automatically by the sheet engine.
 */
export function CustomCardBuilder({
  onSave,
  onCancel
}: {
  onSave: (card: CustomCard) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [rows, setRows] = useState<string[]>(['', '', ''])

  const updateRow = (index: number, value: string) => {
    setRows(prev => prev.map((row, i) => (i === index ? value : row)))
  }

  const removeRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index))
  }

  const addRow = () => setRows(prev => [...prev, ''])

  // TOTAL is reserved for the calculated row; duplicates would share one score
  const cleanedRows = [...new Set(
    rows.map(row => row.trim()).filter(row => row && row.toUpperCase() !== SIMPLE_SHEET_TOTAL_ROW)
  )]
  const canSave = title.trim().length > 0 && cleanedRows.length > 0

  const handleSave = () => {
    onSave({
      id: Date.now().toString(36),
      title: title.trim(),
      emoji: '📋',
      rows: cleanedRows
    })
  }

  return (
    <div className={styles.home}>
      <header className={styles.homeHeader}>
        <h1>New custom card</h1>
        <p className={styles.subtitle}>Name your card and add the rows you want to score</p>
      </header>

      <div className={styles.builderForm}>
        <div className={styles.builderField}>
          <label htmlFor="card-title">Card name</label>
          <input
            id="card-title"
            type="text"
            value={title}
            placeholder="e.g. Backyard minigolf"
            maxLength={30}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.builderField}>
          <label>Rows</label>
          <span className={styles.hint}>One row per thing you score. A TOTAL row is added automatically.</span>
          {rows.map((row, index) => (
            <div key={index} className={styles.builderRow}>
              <input
                type="text"
                value={row}
                placeholder={`Row ${index + 1}`}
                maxLength={40}
                onChange={(e) => updateRow(index, e.target.value)}
              />
              <button
                className={styles.removeRowButton}
                onClick={() => removeRow(index)}
                disabled={rows.length <= 1}
                title="Remove row"
              >
                ✕
              </button>
            </div>
          ))}
          <button className={controls.addPlayerButton} onClick={addRow}>+ Add row</button>
        </div>

        <div className={styles.builderActions}>
          <button className={controls.toggleTotalsButtonHidden + ' ' + controls.toggleTotalsButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={controls.addPlayerButton} onClick={handleSave} disabled={!canSave}>
            Save card
          </button>
        </div>
      </div>
    </div>
  )
}
