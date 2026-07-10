import { BUILT_IN_GAMES } from '../games/registry'
import type { CustomCard } from '../games/registry'
import styles from './styles/Home.module.css'

/**
 * Front page: pick a built-in game, open a saved custom card, or create a new one
 */
export function HomePage({
  customCards,
  onSelectGame,
  onCreateCard,
  onDeleteCard
}: {
  customCards: CustomCard[]
  onSelectGame: (route: string) => void
  onCreateCard: () => void
  onDeleteCard: (id: string) => void
}) {
  return (
    <div className={styles.home}>
      <header className={styles.homeHeader}>
        <h1>Score Cards</h1>
        <p className={styles.subtitle}>Pick a game to keep score</p>
      </header>

      <h2 className={styles.sectionTitle}>Games</h2>
      <div className={styles.cardGrid}>
        {BUILT_IN_GAMES.map(game => (
          <button key={game.id} className={styles.gameCard} onClick={() => onSelectGame(game.id)}>
            <span className={styles.cardEmoji}>{game.emoji}</span>
            <span className={styles.cardTitle}>{game.title}</span>
            <span className={styles.cardDescription}>{game.description}</span>
          </button>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Your cards</h2>
      <div className={styles.cardGrid}>
        {customCards.map(card => (
          <div key={card.id} className={styles.customCardWrapper}>
            <button className={styles.gameCard} onClick={() => onSelectGame(`custom/${card.id}`)}>
              <span className={styles.cardEmoji}>{card.emoji || '📋'}</span>
              <span className={styles.cardTitle}>{card.title}</span>
              <span className={styles.cardDescription}>{card.rows.length} rows + total</span>
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => onDeleteCard(card.id)}
              title={`Delete ${card.title}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button className={`${styles.gameCard} ${styles.createCard}`} onClick={onCreateCard}>
          <span className={styles.cardEmoji}>➕</span>
          <span className={styles.cardTitle}>Custom card</span>
          <span className={styles.cardDescription}>Make your own score card with the rows you need</span>
        </button>
      </div>
    </div>
  )
}
