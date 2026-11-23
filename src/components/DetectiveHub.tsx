import { useEffect, useState } from 'react'
import { GameTimer } from './GameTimer'
import { ToolBar } from './ToolBar'
import { SceneBackground } from './SceneBackground'
import { useGameContext } from '../context/GameContext'
import { DeskPhones } from './DeskPhones'
import { DialogueSpeechControls } from './DialogueSpeechControls'
import { VoicePhoneRevealList } from './VoicePhoneRevealList'
import { PhoneMatchPuzzle } from './PhoneMatchPuzzle'
import { HintScrap } from './HintScrap'
import {
  DAY2_URGENT_CALL,
  DIRECTOR_PHONES_CALL,
  AIRPORT_POLICE_CALL,
} from '../data/hubCalls'

const DEVICE_READY_DELAY_MS = 1200

type HubCallKind = 'director-phones' | 'day2-urgent' | 'airport-out'

export function DetectiveHub() {
  const {
    state,
    unreadHubMessages,
    showAdvanceDay,
    hasPendingOpeningSms,
    pendingDirectorCall,
    pendingDay2Call,
    pendingAirportCall,
    pendingPhoneMatch,
    directorVoiceClue,
    readHubMessage,
    collectHubClue,
    advanceDay,
    fillSpecialistPhonesFromVoice,
    answerDirectorCall,
    answerDay2Call,
    answerPhoneMatch,
    placeAirportCall,
    ensureSpecialistsRowsForCall,
    revealDay2CallText,
    dismissHint,
    HINT_PENALTY_SECONDS,
    scenario,
    openPhone,
    openPanel,
    openingMessageReady,
  } = useGameContext()

  const [openMessageId, setOpenMessageId] = useState<string | null>(null)
  const [phoneVibrationStopped, setPhoneVibrationStopped] = useState(false)

  const [hubCallKind, setHubCallKind] = useState<HubCallKind | null>(null)
  const [mobileCallReady, setMobileCallReady] = useState(false)
  const [callModalOpen, setCallModalOpen] = useState(false)
  const [callAnswered, setCallAnswered] = useState(false)

  useEffect(() => {
    if (!hasPendingOpeningSms) {
      setPhoneVibrationStopped(false)
    }
  }, [hasPendingOpeningSms])

  useEffect(() => {
    const hasIncoming = pendingDirectorCall || pendingDay2Call
    if (!hasIncoming) {
      setMobileCallReady(false)
      return
    }

    setMobileCallReady(false)
    setCallModalOpen(false)
    setCallAnswered(false)
    setHubCallKind(null)

    const timer = window.setTimeout(() => {
      setMobileCallReady(true)
    }, DEVICE_READY_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [pendingDirectorCall, pendingDay2Call, state.phase])

  const openMessage =
    unreadHubMessages.find((m) => m.id === openMessageId) ??
    state.hubMessages.find((m) => m.id === openMessageId)

  const voiceTranscript = directorVoiceClue?.detail?.voice?.transcript ?? ''
  const voiceDuration = directorVoiceClue?.detail?.voice?.duration ?? '0:42'

  const openHubCall = (kind: HubCallKind, autoAnswer = false) => {
    setHubCallKind(kind)
    setCallAnswered(autoAnswer)
    setCallModalOpen(true)
    if (autoAnswer) {
      if (kind === 'director-phones') {
        answerDirectorCall()
        ensureSpecialistsRowsForCall()
      } else if (kind === 'day2-urgent') {
        answerDay2Call()
      } else if (kind === 'airport-out') {
        placeAirportCall()
      }
    }
  }

  const handleMobileClick = () => {
    if (pendingDirectorCall && mobileCallReady) {
      openHubCall('director-phones')
      return
    }
    if (pendingDay2Call && mobileCallReady) {
      openHubCall('day2-urgent')
      return
    }
    if (pendingAirportCall && !pendingDay2Call && !pendingDirectorCall) {
      openHubCall('airport-out')
      return
    }
    if (phoneVibrating) {
      setPhoneVibrationStopped(true)
      openPhone('lock')
      return
    }
    openPhone(messageOnPhone ? 'lock' : 'home')
  }

  const handleAnswerCall = () => {
    setCallAnswered(true)
    if (hubCallKind === 'day2-urgent') {
      answerDay2Call()
    } else if (hubCallKind === 'airport-out') {
      placeAirportCall()
    } else {
      ensureSpecialistsRowsForCall()
      answerDirectorCall()
      setCallModalOpen(false)
      setCallAnswered(false)
      setHubCallKind(null)
      openPanel('notebook')
    }
  }

  const handleCloseCall = () => {
    setCallModalOpen(false)
  }

  const messageOnPhone = hasPendingOpeningSms && openingMessageReady
  const phoneVibrating = messageOnPhone && !phoneVibrationStopped

  const mobileRinging =
    (pendingDirectorCall || pendingDay2Call) && mobileCallReady && !callModalOpen
  const mobileOutgoing =
    Boolean(pendingAirportCall) &&
    !pendingDay2Call &&
    !pendingDirectorCall &&
    !callModalOpen

  const hasDeskAlerts =
    unreadHubMessages.length > 0 ||
    showAdvanceDay ||
    Boolean(openMessage) ||
    mobileRinging ||
    mobileOutgoing ||
    pendingPhoneMatch ||
    state.hubCluesAvailable.size > 0

  let deskPrompt = 'Рабочий стол. Карта, рюкзак и блокнот — внизу.'
  if (hasPendingOpeningSms && !openingMessageReady) {
    deskPrompt = 'Ожидание сигнала…'
  } else if (phoneVibrating) {
    deskPrompt = 'Смартфон вибрирует — нажмите на него'
  } else if (mobileRinging && pendingDirectorCall) {
    deskPrompt = DIRECTOR_PHONES_CALL.ringingLabel
  } else if (mobileRinging) {
    deskPrompt = DAY2_URGENT_CALL.ringingLabel
  } else if (mobileOutgoing) {
    deskPrompt = AIRPORT_POLICE_CALL.ringingLabel
  } else if (pendingPhoneMatch) {
    deskPrompt = 'Проверьте телефон погибшего в рюкзаке — затем ответьте на вопрос'
  }

  const caseCode = '01'
  const isDay2Call = hubCallKind === 'day2-urgent'
  const isAirportCall = hubCallKind === 'airport-out'
  const isDirectorPhonesCall = hubCallKind === 'director-phones'
  const directorCallWithNotebook =
    callModalOpen && callAnswered && isDirectorPhonesCall
  const callContact = isAirportCall
    ? AIRPORT_POLICE_CALL
    : isDay2Call
      ? DAY2_URGENT_CALL
      : DIRECTOR_PHONES_CALL

  return (
    <div className="screen hub-screen hub-screen--noir hub-screen--locker">
      <SceneBackground sceneId="detective-room" className="hub-bg" />
      <div className="hub-vignette" aria-hidden />
      <div className="hub-grain" aria-hidden />
      <div className="hub-letterbox hub-letterbox--top" aria-hidden />
      <div className="hub-letterbox hub-letterbox--bottom" aria-hidden />

      <aside className="hub-dossier" aria-label="Карточка дела">
        <p className="hub-dossier-kicker">Дело №{caseCode}</p>
        <h1 className="hub-dossier-title">{scenario.title}</h1>
        <div className="hub-dossier-meta">
          <span>Москва</span>
          <span>День {state.gameDay}</span>
        </div>
        <p className="hub-dossier-status">
          {hasPendingOpeningSms
            ? 'Входящий сигнал'
            : mobileRinging
              ? 'Входящий звонок'
              : mobileOutgoing
                ? 'Исходящий вызов'
                : 'Кабинет открыт'}
        </p>
        <div className="hub-dossier-timer">
          <GameTimer />
        </div>
      </aside>

      {callModalOpen && (
        <div
          className={[
            'sms-modal-backdrop',
            directorCallWithNotebook ? 'sms-modal-backdrop--notebook-call' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          role="presentation"
          onClick={
            callAnswered && !directorCallWithNotebook ? handleCloseCall : undefined
          }
        >
          <div
            className={[
              'call-modal',
              directorCallWithNotebook ? 'call-modal--notebook-dock' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            role="dialog"
            aria-modal={!directorCallWithNotebook}
            aria-labelledby="call-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {!callAnswered ? (
              <>
                <p className="call-modal-label">
                  {isAirportCall ? 'Исходящий вызов · смартфон' : 'Входящий звонок · смартфон'}
                </p>
                <h2 id="call-modal-title">{callContact.contactName}</h2>
                <p className="call-modal-role">{callContact.role}</p>
                <p className="call-modal-hint">{callContact.answerHint}</p>
                <div className="sms-modal-actions">
                  <button type="button" className="btn btn-primary" onClick={handleAnswerCall}>
                    {isAirportCall ? 'Соединить →' : 'Ответить →'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleCloseCall}
                  >
                    Позже
                  </button>
                </div>
              </>
            ) : isAirportCall ? (
              <>
                <p className="call-modal-label">Звонок</p>
                <h2 id="call-modal-title">{AIRPORT_POLICE_CALL.contactName}</h2>
                <p className="call-modal-role">{AIRPORT_POLICE_CALL.role}</p>
                <p className="voice-phone-intro">{AIRPORT_POLICE_CALL.body}</p>
                <div className="sms-modal-actions call-modal-actions">
                  <button type="button" className="btn btn-primary" onClick={handleCloseCall}>
                    Завершить вызов
                  </button>
                </div>
              </>
            ) : isDay2Call ? (
              <>
                <p className="call-modal-label">Звонок</p>
                <h2 id="call-modal-title">{DAY2_URGENT_CALL.contactName}</h2>
                <p className="call-modal-role">{DAY2_URGENT_CALL.role}</p>
                <div className="call-voice-box">
                  <DialogueSpeechControls
                    text={DAY2_URGENT_CALL.body}
                    lineKey="day2-director-call"
                    audioSrc={DAY2_URGENT_CALL.audioSrc}
                  />
                  <p className="call-voice-tip">Сначала только голос — слушайте.</p>
                  {state.revealedDay2CallText ? (
                    <p className="voice-phone-intro">{DAY2_URGENT_CALL.body}</p>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={revealDay2CallText}
                    >
                      Показать текст письменно (+{HINT_PENALTY_SECONDS} сек)
                    </button>
                  )}
                </div>
                <div className="sms-modal-actions call-modal-actions">
                  <button type="button" className="btn btn-primary" onClick={handleCloseCall}>
                    Завершить вызов
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="call-modal-label">Звонок · смартфон</p>
                <h2 id="call-modal-title">Анна Сергеевна Захарова</h2>
                <p className="call-modal-role">Директор ГТГ · {voiceDuration}</p>

                <div className="call-voice-box call-voice-box--live">
                  <DialogueSpeechControls
                    text={voiceTranscript}
                    lineKey="director-call-voice"
                    audioSrc={directorVoiceClue?.detail?.voice?.audioSrc}
                    autoPlay
                  />
                  <p className="call-voice-tip">
                    Слушайте номера и сразу вписывайте их в таблицу блокнота.
                  </p>
                </div>

                {directorVoiceClue?.detail?.voice?.phones && (
                  <details className="call-reveal-details">
                    <summary>Не успели записать? Открыть номер письменно (+10 сек)</summary>
                    <VoicePhoneRevealList phones={directorVoiceClue.detail.voice.phones} />
                    {state.revealedDirectorPhones.size > 0 && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => fillSpecialistPhonesFromVoice()}
                      >
                        Подставить открытые номера в таблицу
                      </button>
                    )}
                  </details>
                )}

                <div className="sms-modal-actions call-modal-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleCloseCall}
                  >
                    Завершить вызов
                  </button>
                </div>
                <p className="call-modal-saved">
                  Блокнот открыт с таблицей специалистов. Когда все три номера записаны —
                  на столе появится вопрос про телефон погибшего.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <main className="hub-main">
        <div className="hub-desk-stage">
          <div className="hub-lamp-glow" aria-hidden />

          {hasDeskAlerts && (
            <div className="hub-desk-view">
              {mobileOutgoing && (
                <div className="hub-call-banner" role="status">
                  <span className="hub-call-pulse" aria-hidden />
                  <div className="hub-call-copy">
                    <strong>Можно звонить</strong>
                    <span>{AIRPORT_POLICE_CALL.ringingLabel}</span>
                  </div>
                </div>
              )}

              {pendingPhoneMatch && !callModalOpen && (
                <div className="hub-phone-match">
                  <PhoneMatchPuzzle
                    solved={state.phoneMatchSolved}
                    onAnswer={answerPhoneMatch}
                    compact
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => openPanel('backpack')}
                  >
                    Открыть рюкзак — телефон погибшего
                  </button>
                </div>
              )}

              {(unreadHubMessages.length > 0 || showAdvanceDay) && (
                <div className="hub-inbox">
                  {unreadHubMessages.length > 0 && (
                    <h3 className="hub-inbox-title">Сообщения</h3>
                  )}
                  {unreadHubMessages.map((msg) => (
                    <button
                      key={msg.id}
                      type="button"
                      className="hub-message-btn"
                      onClick={() => {
                        setOpenMessageId(msg.id)
                        readHubMessage(msg.id)
                      }}
                    >
                      <strong>{msg.title}</strong>
                      <span>{msg.preview}</span>
                    </button>
                  ))}

                  {showAdvanceDay && (
                    <button
                      type="button"
                      className="btn btn-primary hub-advance-day"
                      onClick={advanceDay}
                    >
                      Закончить день — лечь спать
                    </button>
                  )}
                </div>
              )}

              {openMessage && (
                <div className="hub-message-detail">
                  <h4>{openMessage.title}</h4>
                  <p className="hub-message-body">{openMessage.body}</p>
                  {openMessage.clueId && state.hubCluesAvailable.has(openMessage.clueId) && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        collectHubClue(openMessage.clueId!)
                        setOpenMessageId(null)
                      }}
                    >
                      Сохранить голосовое в рюкзак
                    </button>
                  )}
                  {openMessage.clueId &&
                    state.backpack.some((c) => c.id === openMessage.clueId) && (
                      <p className="hub-clue-saved">Голосовое сообщение уже в рюкзаке</p>
                    )}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setOpenMessageId(null)}
                  >
                    Закрыть
                  </button>
                </div>
              )}

              {state.hubCluesAvailable.size > 0 &&
                !openMessage &&
                !pendingDirectorCall &&
                !pendingDay2Call &&
                scenario.hubClues?.map((clue) =>
                  state.hubCluesAvailable.has(clue.id) ? (
                    <p key={clue.id} className="hub-clue-hint">
                      Новая улика: {clue.title}
                    </p>
                  ) : null,
                )}
            </div>
          )}

          <p
            className={[
              'hub-desk-prompt',
              phoneVibrating || mobileRinging || mobileOutgoing
                ? 'hub-desk-prompt--alert'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {deskPrompt}
          </p>

          <DeskPhones
            mobileHasSms={messageOnPhone}
            mobileVibrating={phoneVibrating}
            mobileRinging={mobileRinging}
            mobileOutgoing={mobileOutgoing}
            mobileActive
            onMobileClick={handleMobileClick}
          />
        </div>
      </main>

      <div className="hub-dock">
        <ToolBar />
      </div>

      {state.showHint && state.currentHint && (
        <HintScrap text={state.currentHint} onDismiss={dismissHint} />
      )}
    </div>
  )
}
