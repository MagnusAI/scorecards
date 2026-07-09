import type { Player } from '../types'
import { GAME_CONFIG, DEFAULT_PLAYERS } from '../constants/gameConfig'
import { useLocalStorage } from './useLocalStorage'

/**
 * Custom hook for managing players state and operations
 */
export function usePlayerManagement() {
  const [players, setPlayers] = useLocalStorage<Player[]>(
    GAME_CONFIG.STORAGE_KEY,
    DEFAULT_PLAYERS
  )

  const addPlayer = () => {
    const newId = Date.now().toString()
    const newPlayer: Player = {
      id: newId,
      name: `Player ${players.length + 1}`,
      scores: {}
    }
    setPlayers(prev => [...prev, newPlayer])
  }

  const removeLatestPlayer = () => {
    if (players.length > GAME_CONFIG.MIN_PLAYERS) {
      setPlayers(prev => prev.slice(0, -1))
    }
  }

  const updatePlayerName = (playerId: string, newName: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, name: newName }
        : player
    ))
  }

  const updateScore = (playerId: string, category: string, value: string) => {
    const numValue = value === '' ? null : Number(value)
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, scores: { ...player.scores, [category]: numValue } }
        : player
    ))
  }

  // Clear all scores but keep the players and their names
  const resetScores = () => {
    setPlayers(prev => prev.map(player => ({ ...player, scores: {} })))
  }

  const canRemovePlayer = players.length > GAME_CONFIG.MIN_PLAYERS

  return {
    players,
    addPlayer,
    removeLatestPlayer,
    updatePlayerName,
    updateScore,
    resetScores,
    canRemovePlayer
  }
}