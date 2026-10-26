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
import { AdBanner } from './components/AdBanner'
import { DetectivePhone } from './components/DetectivePhone'

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
          <div className="game-dock game-dock--tools">
            <ToolBar />
          </div>
        </div>
      )
    case 'dialogue': {
      const morgueDialogue = state.currentLocationId === 'forensic'
      return (
        <div className="game-play-layout">
          <DialogueView />
          <div className={morgueDialogue ? 'game-dock game-dock--tools' : 'game-dock'}>
            {!morgueDialogue && (
              <div className="game-dock-bar">
                <GameTimer />
              </div>
            )}
            <ToolBar />
          </div>
        </div>
      )
    }
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
        <div className="app-stage">
          <GameRouter />
          <GameOverlayPanels />
          <DetectivePhone />
        </div>
        <AdBanner />
      </div>
    </GameProvider>
  )
}
