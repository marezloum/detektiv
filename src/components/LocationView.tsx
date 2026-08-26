import { useGameContext } from '../context/GameContext'
import { SceneBackground } from './SceneBackground'
import { ScreenTopBar } from './ScreenTopBar'
import { SiteRoomNav } from './GalleryHallNav'
import { LOCATIONS } from '../data/locations'
import {
  DEFAULT_MUSEUM_HALL,
  getTretyakovHall,
  museumSceneForHall,
  TRETYAKOV_HALLS,
  type MuseumHallId,
} from '../data/tretyakovHalls'
import {
  DEFAULT_THEATER_ROOM,
  getTheaterRoom,
  theaterSceneForRoom,
  THEATER_ROOMS,
  type TheaterRoomId,
} from '../data/theaterRooms'
import { getAvailableDialogues, getDialogueLabel } from '../utils/scenarioProgress'
import type { SceneId } from '../assets/scenes'
import { asset } from '../utils/asset'

const NPC_PORTRAIT_SRC: Record<string, string> = {
  'forensic-doctor': asset('/images/npcs/forensic-doctor.png'),
  'buffet-clerk': asset('/images/npcs/buffet-clerk.png'),
  'cloakroom-attendant': asset('/images/npcs/cloakroom-attendant.png'),
  'theater-guard': asset('/images/npcs/theater-guard.png'),
  'hotel-clerk': asset('/images/npcs/hotel-clerk.png'),
  'airport-clerk': asset('/images/npcs/airport-clerk.png'),
}

export function LocationView() {
  const {
    scenario,
    currentLocation,
    state,
    startDialogue,
    requestHint,
    dismissHint,
    HINT_PENALTY_SECONDS,
    goBack,
    openPanel,
    setMuseumHall,
    setTheaterRoom,
  } = useGameContext()

  if (!currentLocation || !state.currentLocationId) return null

  const meta = LOCATIONS[state.currentLocationId]
  const availableDialogues = getAvailableDialogues(scenario, currentLocation.locationId, state)

  const isGallery =
    state.currentLocationId === 'museum' && scenario.id === 'stolen-painting'
  const isTheater =
    state.currentLocationId === 'theater' && scenario.id === 'stolen-painting'
  const isSite = isGallery || isTheater

  const currentHall = isGallery
    ? getTretyakovHall(state.currentMuseumHallId ?? DEFAULT_MUSEUM_HALL)
    : null
  const currentRoom = isTheater
    ? getTheaterRoom(state.currentTheaterRoomId ?? DEFAULT_THEATER_ROOM)
    : null

  const sceneId: SceneId = isGallery
    ? museumSceneForHall(currentHall?.id)
    : isTheater
      ? theaterSceneForRoom(currentRoom?.id)
      : state.currentLocationId

  const talkableHallIds = new Set<MuseumHallId>()
  if (isGallery) {
    for (const hall of TRETYAKOV_HALLS) {
      if (hall.dialogueIndex !== null && availableDialogues.includes(hall.dialogueIndex)) {
        talkableHallIds.add(hall.id)
      }
    }
  }

  const talkableRoomIds = new Set<TheaterRoomId>()
  if (isTheater) {
    for (const room of THEATER_ROOMS) {
      if (availableDialogues.includes(room.dialogueIndex)) {
        talkableRoomIds.add(room.id)
      }
    }
  }

  const siteDialogueIndex = isGallery
    ? (currentHall?.dialogueIndex ?? null)
    : isTheater
      ? currentRoom?.dialogueIndex ?? null
      : null
  const siteDialogueAvailable =
    siteDialogueIndex !== null && availableDialogues.includes(siteDialogueIndex)

  const otherTalkHalls = isGallery
    ? TRETYAKOV_HALLS.filter((h) => talkableHallIds.has(h.id) && h.id !== currentHall?.id)
    : []
  const otherTalkRooms = isTheater
    ? THEATER_ROOMS.filter((r) => talkableRoomIds.has(r.id) && r.id !== currentRoom?.id)
    : []

  const siteAlreadyDone =
    isSite &&
    siteDialogueIndex !== null &&
    state.completedDialogues.has(`${state.currentLocationId}-${siteDialogueIndex}`)

  const npcName = isGallery && siteDialogueIndex !== null
    ? galleryNpcName(siteDialogueIndex)
    : isTheater && siteDialogueIndex !== null
      ? theaterNpcName(siteDialogueIndex)
      : currentLocation.npc.name
  const npcRole = isGallery && siteDialogueIndex !== null
    ? galleryNpcRole(siteDialogueIndex)
    : isTheater && siteDialogueIndex !== null
      ? theaterNpcRole(siteDialogueIndex)
      : currentLocation.npc.role
  const portraitKey = isTheater && siteDialogueIndex !== null
    ? theaterPortraitKey(siteDialogueIndex)
    : currentLocation.npc.portraitKey
  const portraitSrc = NPC_PORTRAIT_SRC[portraitKey]

  const placeStatus = isSite
    ? siteDialogueAvailable
      ? 'Ждёт разговор'
      : siteAlreadyDone
        ? 'Уже говорили'
        : otherTalkHalls.length + otherTalkRooms.length > 0
          ? 'Есть метка'
          : 'Можно осмотреть'
    : availableDialogues.length > 0
      ? 'Можно осмотреть'
      : 'Осмотрено'

  const hudTitle = isGallery && currentHall
    ? currentHall.title
    : isTheater && currentRoom
      ? currentRoom.title
      : meta.name
  const hudKicker = isGallery || isTheater ? meta.name : 'Место'

  return (
    <div
      className={[
        'screen',
        'location-screen',
        isGallery ? 'location-screen--gallery' : '',
        isTheater ? 'location-screen--theater' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <SceneBackground sceneId={sceneId} className="location-bg" />
      <div className="location-vignette" aria-hidden />

      <ScreenTopBar
        onBack={goBack}
        backLabel="В кабинет"
        onMap={() => openPanel('map')}
        mapLabel="На карту"
      />

      <aside
        className="location-hud"
        aria-label={`${meta.name}${hudTitle !== meta.name ? `, ${hudTitle}` : ''}. ${placeStatus}`}
      >
        <p className="location-hud-kicker">
          {hudKicker}
          {state.gameDay > 1 && <span> · День {state.gameDay}</span>}
        </p>
        <h2 className="location-hud-title">{hudTitle}</h2>
        <p className="location-hud-status">{placeStatus}</p>
      </aside>

      {isGallery && currentHall && (
        <SiteRoomNav
          rooms={TRETYAKOV_HALLS}
          currentId={currentHall.id}
          onSelect={setMuseumHall}
          talkableIds={talkableHallIds}
          ariaLabel="Залы Третьяковской галереи"
        />
      )}

      {isTheater && currentRoom && (
        <SiteRoomNav
          rooms={THEATER_ROOMS}
          currentId={currentRoom.id}
          onSelect={setTheaterRoom}
          talkableIds={talkableRoomIds}
          ariaLabel="Точки Большого театра"
        />
      )}

      <div className="location-dock">
        {isSite && siteDialogueAvailable && siteDialogueIndex !== null && (
          <NpcCard name={npcName} role={npcRole} portraitSrc={portraitSrc} />
        )}

        {!isSite && (
          <NpcCard
            name={currentLocation.npc.name}
            role={currentLocation.npc.role}
            portraitSrc={NPC_PORTRAIT_SRC[currentLocation.npc.portraitKey]}
          />
        )}

        <div className="location-actions">
          {isSite ? (
            siteDialogueAvailable && siteDialogueIndex !== null ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => startDialogue(siteDialogueIndex)}
              >
                {getDialogueLabel(scenario, currentLocation.locationId, siteDialogueIndex)}
              </button>
            ) : otherTalkHalls.length > 0 ? (
              <>
                <p className="dialogue-explore-msg">Разговор в другом зале:</p>
                {otherTalkHalls.map((hall) => (
                  <button
                    key={hall.id}
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setMuseumHall(hall.id)}
                  >
                    Войти: {hall.shortLabel}
                  </button>
                ))}
              </>
            ) : otherTalkRooms.length > 0 ? (
              <>
                <p className="dialogue-explore-msg">Разговор в другой точке:</p>
                {otherTalkRooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setTheaterRoom(room.id)}
                  >
                    Войти: {room.shortLabel}
                  </button>
                ))}
              </>
            ) : siteAlreadyDone ? (
              <p className="dialogue-done-msg">✓ Уже говорили здесь.</p>
            ) : (
              <p className="dialogue-explore-msg">Можно осмотреть.</p>
            )
          ) : availableDialogues.length > 0 ? (
            availableDialogues.map((idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-primary"
                onClick={() => startDialogue(idx)}
              >
                {getDialogueLabel(scenario, currentLocation.locationId, idx)}
              </button>
            ))
          ) : (
            <p className="dialogue-done-msg">✓ Это место уже осмотрено.</p>
          )}
          <button type="button" className="btn btn-hint" onClick={requestHint}>
            Подсказка (+{HINT_PENALTY_SECONDS} сек)
          </button>
        </div>
      </div>

      {state.showHint && state.currentHint && (
        <div className="hint-toast">
          <p>{state.currentHint}</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={dismissHint}>
            Понятно
          </button>
        </div>
      )}
    </div>
  )
}

function NpcCard({
  name,
  role,
  portraitSrc,
}: {
  name: string
  role: string
  portraitSrc?: string
}) {
  return (
    <div className="npc-card">
      <div className="npc-portrait">
        {portraitSrc ? (
          <img src={portraitSrc} alt={name} className="npc-portrait-img" draggable={false} />
        ) : (
          <span className="npc-initial">{name.charAt(0)}</span>
        )}
      </div>
      <div className="npc-info">
        <h3>{name}</h3>
        <p className="npc-role">{role}</p>
      </div>
    </div>
  )
}

function galleryNpcName(dialogueIndex: number): string {
  switch (dialogueIndex) {
    case 0:
    case 4:
      return 'Анна Сергеевна Захарова'
    case 1:
      return 'Марина Козлова'
    case 2:
      return 'Пётр Сергеев'
    case 3:
      return 'Дмитрий Орлов'
    default:
      return 'Сотрудник ГТГ'
  }
}

function galleryNpcRole(dialogueIndex: number): string {
  switch (dialogueIndex) {
    case 0:
    case 4:
      return 'Директор галереи'
    case 1:
      return 'Реставратор'
    case 2:
      return 'Искусствовед'
    case 3:
      return 'Специалист по безопасности залов'
    default:
      return 'Сотрудник галереи'
  }
}

function theaterNpcName(dialogueIndex: number): string {
  switch (dialogueIndex) {
    case 0:
      return 'Ирина Белова'
    case 1:
      return 'Нина Петровна'
    case 2:
      return 'Сергей Ковалёв'
    default:
      return 'Сотрудник театра'
  }
}

function theaterNpcRole(dialogueIndex: number): string {
  switch (dialogueIndex) {
    case 0:
      return 'Буфетчица'
    case 1:
      return 'Гардеробщица'
    case 2:
      return 'Охранник'
    default:
      return 'Сотрудник театра'
  }
}

function theaterPortraitKey(dialogueIndex: number): string {
  switch (dialogueIndex) {
    case 0:
      return 'buffet-clerk'
    case 1:
      return 'cloakroom-attendant'
    case 2:
      return 'theater-guard'
    default:
      return 'buffet-clerk'
  }
}
