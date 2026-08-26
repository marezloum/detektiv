import { createContext, useContext, type ReactNode } from 'react'
import { useGame, type GameContext } from '../hooks/useGame'

const GameCtx = createContext<GameContext | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const game = useGame()
  return <GameCtx.Provider value={game}>{children}</GameCtx.Provider>
}

export function useGameContext() {
  const ctx = useContext(GameCtx)
  if (!ctx) throw new Error('useGameContext must be used within GameProvider')
  return ctx
}
