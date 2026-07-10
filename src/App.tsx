import { useState } from 'react'
import { useHashRoute } from './hooks/useHashRoute'
import {
  BUILT_IN_GAMES,
  loadCustomCards,
  saveCustomCard,
  deleteCustomCard,
  customCardToDefinition
} from './games/registry'
import type { CustomCard, GameDefinition } from './games/registry'
import { HomePage } from './pages/HomePage'
import { CustomCardBuilder } from './pages/CustomCardBuilder'
import { GameScreen } from './pages/GameScreen'

/**
 * App root: routes between the home page, the custom card builder,
 * and the individual game screens via the URL hash
 */
function App() {
  const [route, navigate] = useHashRoute()
  const [customCards, setCustomCards] = useState<CustomCard[]>(loadCustomCards)

  const handleCreateCard = (card: CustomCard) => {
    setCustomCards(saveCustomCard(card))
    navigate(`custom/${card.id}`)
  }

  const handleDeleteCard = (id: string) => {
    const card = customCards.find(c => c.id === id)
    if (!window.confirm(`Delete "${card?.title ?? 'this card'}" and its saved scores?`)) return
    setCustomCards(deleteCustomCard(id))
  }

  if (route === 'custom/new') {
    return <CustomCardBuilder onSave={handleCreateCard} onCancel={() => navigate('')} />
  }

  let game: GameDefinition | undefined
  if (route.startsWith('custom/')) {
    const card = customCards.find(c => c.id === route.slice('custom/'.length))
    game = card ? customCardToDefinition(card) : undefined
  } else if (route) {
    game = BUILT_IN_GAMES.find(g => g.id === route)
  }

  if (!game) {
    return (
      <HomePage
        customCards={customCards}
        onSelectGame={navigate}
        onCreateCard={() => navigate('custom/new')}
        onDeleteCard={handleDeleteCard}
      />
    )
  }

  // key remounts the screen per game so per-game storage is re-read
  return <GameScreen key={game.id} game={game} onBack={() => navigate('')} />
}

export default App
