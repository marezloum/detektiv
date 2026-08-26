import { useGameContext } from '../context/GameContext'
import { MapPanel } from './MapPanel'
import { BackpackPanel } from './BackpackPanel'
import { NotebookPanel } from './NotebookPanel'
import { EvidenceBoardPanel } from './EvidenceBoardPanel'

export function GameOverlayPanels() {
  const { activePanel } = useGameContext()

  if (activePanel === 'none') return null

  return (
    <>
      {activePanel === 'map' && <MapPanel />}
      {activePanel === 'backpack' && <BackpackPanel />}
      {activePanel === 'notebook' && <NotebookPanel />}
      {activePanel === 'board' && <EvidenceBoardPanel />}
    </>
  )
}
