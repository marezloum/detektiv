import { useGameContext } from '../context/GameContext'
import { MapPanel } from './MapPanel'
import { BackpackPanel } from './BackpackPanel'
import { NotebookPanel } from './NotebookPanel'

export function GameOverlayPanels() {
  const { activePanel } = useGameContext()

  if (activePanel === 'none') return null

  return (
    <>
      {activePanel === 'map' && <MapPanel />}
      {activePanel === 'backpack' && <BackpackPanel />}
      {activePanel === 'notebook' && <NotebookPanel />}
    </>
  )
}
