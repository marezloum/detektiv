import { GameProvider, useGameContext } from './context/GameContext'
import { CoverScreen } from './components/CoverScreen'
import { GameHall } from './components/GameHall'
import { RulesScreen } from './components/RulesScreen'
import { DetectiveHub } from './components/DetectiveHub'
import { LocationView } from './components/LocationView'
import { DialogueView } from './components/DialogueView'
import { SolveModal } from './components/SolveModal'
import { EndScreen } from './components/EndScreen'
import { GameTimer } from './components/GameTimer'
import { ToolBar } from './components/ToolBar'
import { GameOverlayPanels } from './components/GameOverlayPanels'

function GameRouter() {
  const { state } = useGameContext()

  switch (state.phase) {
    case 'cover':
      return <CoverScreen />
    case 'hall':
      return <GameHall />
    case 'rules':
      return <RulesScreen />
    case 'hub':
      return <DetectiveHub />
    case 'location':
      return (
        <div className="game-play-layout">
          <LocationView />
          <div className="game-dock">
            <div className="game-dock-bar">
              <GameTimer />
            </div>
            <ToolBar />
          </div>
        </div>
      )
    case 'dialogue':
      return (
        <div className="game-play-layout">
          <DialogueView />
          <div className="game-dock">
            <div className="game-dock-bar">
              <GameTimer />
            </div>
            <ToolBar />
          </div>
        </div>
      )
    case 'solve':
      return <SolveModal />
    case 'victory':
    case 'defeat':
      return <EndScreen />
    default:
      return <CoverScreen />
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className="app">
        <GameRouter />
        <GameOverlayPanels />
      </div>
    </GameProvider>
  )
}
