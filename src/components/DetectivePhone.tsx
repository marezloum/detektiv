import { useEffect, useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { shotsForScene } from '../data/cameraShots'
import type { DetectivePhoneScreen } from '../hooks/useGame'
import type { PhonePhoto } from '../types/game'
import { playScene } from '../utils/playScene'

const DUTY_TEXT =
  'Убийство недалеко от Третьяковской галереи. Труп перевезли в морг. Там тебя ждут. Немедленно уезжай.'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 10000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className="dphone-status">
      <span className="dphone-status-time">{time}</span>
      <span className="dphone-status-icons" aria-hidden>
        <span className="dphone-signal">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="dphone-battery">
          <span />
        </span>
      </span>
    </div>
  )
}

export function DetectivePhone() {
  const {
    phoneOpen,
    phoneEntry,
    closePhone,
    hasPendingOpeningSms,
    openingMessageReady,
    state,
    scenario,
    acceptOpeningSms,
    capturePhonePhoto,
  } = useGameContext()

  const now = useClock()
  const [screen, setScreen] = useState<DetectivePhoneScreen>(phoneEntry)
  const [flash, setFlash] = useState(false)
  const [viewerId, setViewerId] = useState<string | null>(null)
  const [shotId, setShotId] = useState<string | null>(null)

  const place = playScene(state)
  const shots = shotsForScene(place.sceneId, place.label)
  const shot = shots.find((item) => item.id === shotId) ?? shots[0]

  useEffect(() => {
    if (!phoneOpen) return
    setScreen(phoneEntry)
    setViewerId(null)
  }, [phoneOpen, phoneEntry])

  useEffect(() => {
    setShotId(null)
  }, [place.sceneId])

  if (!phoneOpen) return null

  const photos = state.phonePhotos ?? []
  const messageReady = hasPendingOpeningSms && openingMessageReady
  const dutyKnown =
    scenario.id === 'stolen-painting' &&
    (messageReady || state.completedDialogues.has('detective-room-0'))
  const showHeadsUp = messageReady && screen === 'home'
  const time = formatTime(now)
  const dateLabel = now.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const shoot = () => {
    if (flash || !shot) return
    setFlash(true)
    capturePhonePhoto(shot)
    window.setTimeout(() => setFlash(false), 320)
  }

  const dismiss = () => {
    const shouldAccept = messageReady
    closePhone()
    if (shouldAccept) acceptOpeningSms()
  }

  return (
    <div className="dphone-stage" role="presentation" onClick={dismiss}>
      <div
        className="dphone"
        role="dialog"
        aria-modal="true"
        aria-label="Телефон детектива"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="dphone-side dphone-side--vol" aria-hidden />
        <span className="dphone-side dphone-side--power" aria-hidden />
        <div className="dphone-glass">
          <div className={`dphone-screen dphone-screen--${screen}`}>
            <span className="dphone-punch" aria-hidden />
            <StatusBar time={time} />

            {showHeadsUp && (
              <button type="button" className="dphone-headsup" onClick={() => setScreen('messages')}>
                <span className="dphone-app-icon dphone-app-icon--msg" aria-hidden />
                <span className="dphone-headsup-copy">
                  <strong>Шеф</strong>
                  <span>Убийство недалеко от галереи. Труп в морге…</span>
                </span>
              </button>
            )}

            {screen === 'lock' && (
              <div className="dphone-lock">
                <p className="dphone-lock-time">{time}</p>
                <p className="dphone-lock-date">{dateLabel}</p>
                {messageReady ? (
                  <button
                    type="button"
                    className="dphone-note"
                    onClick={() => setScreen('messages')}
                  >
                    <span className="dphone-app-icon dphone-app-icon--msg" aria-hidden />
                    <span className="dphone-note-copy">
                      <span className="dphone-note-top">
                        <strong>Сообщения</strong>
                        <span>сейчас</span>
                      </span>
                      <span className="dphone-note-name">Шеф</span>
                      <span className="dphone-note-preview">
                        Убийство недалеко от Третьяковской галереи…
                      </span>
                    </span>
                  </button>
                ) : (
                  <p className="dphone-lock-empty">Нет уведомлений</p>
                )}
              </div>
            )}

            {screen === 'home' && (
              <div className="dphone-home">
                <p className="dphone-home-time">{time}</p>
                <p className="dphone-home-date">{dateLabel}</p>
                <div className="dphone-apps">
                  <button type="button" className="dphone-app" onClick={() => setScreen('messages')}>
                    <span className="dphone-app-icon dphone-app-icon--msg">
                      {messageReady && <span className="dphone-app-badge">1</span>}
                    </span>
                    <span>Сообщения</span>
                  </button>
                  <button type="button" className="dphone-app" onClick={() => setScreen('camera')}>
                    <span className="dphone-app-icon dphone-app-icon--cam" />
                    <span>Камера</span>
                  </button>
                  <button type="button" className="dphone-app" onClick={() => setScreen('gallery')}>
                    <span className="dphone-app-icon dphone-app-icon--gal" />
                    <span>Галерея</span>
                  </button>
                </div>
                <p className="dphone-home-hint">Камера снимает то, что выбрано для этого места.</p>
              </div>
            )}

            {screen === 'messages' && (
              <div className="dphone-thread">
                <header className="dphone-appbar">
                  <button type="button" className="dphone-back" onClick={() => setScreen('home')}>
                    ←
                  </button>
                  <span className="dphone-avatar" aria-hidden>
                    Ш
                  </span>
                  <span className="dphone-appbar-name">
                    <strong>Шеф</strong>
                    <span>Москва</span>
                  </span>
                </header>
                {dutyKnown ? (
                  <div className="dphone-chat">
                    <p className="dphone-chat-day">Сегодня</p>
                    <div className="dphone-bubble dphone-bubble--in">
                      <p>{DUTY_TEXT}</p>
                      <time>{time}</time>
                    </div>
                    {!messageReady && (
                      <div className="dphone-bubble dphone-bubble--out">
                        <p>Еду в морг.</p>
                        <time>{time}</time>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="dphone-empty">Сообщений нет</p>
                )}
                <div className="dphone-composer" aria-hidden>
                  <span className="dphone-composer-field">Сообщение</span>
                </div>
              </div>
            )}

            {screen === 'camera' && shot && (
              <div className="dphone-cam">
                <img
                  className="dphone-viewfinder"
                  src={shot.imageSrc}
                  alt=""
                />
                <div className="dphone-cam-top">
                  <button type="button" className="dphone-back dphone-back--light" onClick={() => setScreen('home')}>
                    ←
                  </button>
                  <span>{shot.label}</span>
                </div>
                {shots.length > 1 && (
                  <div className="dphone-cam-subjects" role="tablist" aria-label="Что снимать">
                    {shots.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={item.id === shot.id}
                        className={
                          item.id === shot.id
                            ? 'dphone-cam-subject dphone-cam-subject--on'
                            : 'dphone-cam-subject'
                        }
                        onClick={() => setShotId(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
                {flash && <div className="dphone-flash" aria-hidden />}
                <div className="dphone-cam-bar">
                  <button
                    type="button"
                    className="dphone-cam-thumb"
                    onClick={() => setScreen('gallery')}
                    aria-label="Галерея"
                  >
                    {photos[0] ? <img src={photos[0].imageSrc} alt="" /> : <span />}
                  </button>
                  <button type="button" className="dphone-shutter" onClick={shoot} aria-label="Снять фото">
                    <span />
                  </button>
                  <span className="dphone-cam-spacer" aria-hidden />
                </div>
              </div>
            )}

            {screen === 'gallery' && (
              <Gallery
                photos={photos}
                viewerId={viewerId}
                onOpen={setViewerId}
                onBack={() => {
                  setViewerId(null)
                  setScreen('home')
                }}
              />
            )}

            {screen !== 'camera' && (
              <button
                type="button"
                className="dphone-gesture"
                aria-label="На главный экран"
                onClick={() => setScreen('home')}
              />
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="dphone-dismiss"
        onClick={(event) => {
          event.stopPropagation()
          dismiss()
        }}
      >
        Убрать телефон
      </button>
    </div>
  )
}

function Gallery({
  photos,
  viewerId,
  onOpen,
  onBack,
}: {
  photos: PhonePhoto[]
  viewerId: string | null
  onOpen: (id: string | null) => void
  onBack: () => void
}) {
  const open = photos.find((photo) => photo.id === viewerId)

  return (
    <div className="dphone-gallery">
      <header className="dphone-appbar">
        <button type="button" className="dphone-back" onClick={open ? () => onOpen(null) : onBack}>
          ←
        </button>
        <span className="dphone-appbar-name">
          <strong>{open ? open.label : 'Галерея'}</strong>
          {!open && <span>{photos.length === 0 ? 'пусто' : `${photos.length}`}</span>}
        </span>
      </header>
      {open ? (
        <figure className="dphone-viewer">
          <img src={open.imageSrc} alt={open.label} />
          <figcaption>
            {open.label}
            <span>{open.takenAtLabel}</span>
          </figcaption>
        </figure>
      ) : photos.length === 0 ? (
        <p className="dphone-empty">Снимков пока нет. Откройте камеру на месте.</p>
      ) : (
        <div className="dphone-grid">
          {photos.map((photo) => (
            <button key={photo.id} type="button" className="dphone-grid-item" onClick={() => onOpen(photo.id)}>
              <img src={photo.imageSrc} alt={photo.label} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
