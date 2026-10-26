import { useEffect, useState } from 'react'
import { GameTimer } from './GameTimer'
import { ToolBar } from './ToolBar'
import { SceneBackground } from './SceneBackground'
import { useGameContext } from '../context/GameContext'
import { DeskPhones } from './DeskPhones'
import { DialogueSpeechControls } from './DialogueSpeechControls'
import { VoicePhoneRevealList } from './VoicePhoneRevealList'
import { CallLiveNotebook } from './CallLiveNotebook'
import {
  DAY2_URGENT_CALL,
  DIRECTOR_PHONES_CALL,
  AIRPORT_POLICE_CALL,
} from '../data/hubCalls'

const LANDLINE_CALL_DELAY_MS = 1200

type LandlineCallKind = 'director-phones' | 'day2-urgent' | 'airport-out'

export function DetectiveHub() {
  const {
    state,
    unreadHubMessages,
    showAdvanceDay,
    hasPendingOpeningSms,
    pendingDirectorCall,
    pendingDay2Call,
    pendingAirportCall,
    directorVoiceClue,
    readHubMessage,
    collectHubClue,
    advanceDay,
    fillSpecialistPhonesFromVoice,
    answerDirectorCall,
    answerDay2Call,
    placeAirportCall,
    ensureSpecialistsRowsForCall,
    revealDay2CallText,
    dismissHint,
    HINT_PENALTY_SECONDS,
    scenario,
    openPhone,
    openingMessageReady,
  } = useGameContext()

  const [openMessageId, setOpenMessageId] = useState<string | null>(null)
  const [phoneVibrationStopped, setPhoneVibrationStopped] = useState(false)

  const [landlineCallKind, setLandlineCallKind] = useState<LandlineCallKind | null>(null)
  const [landlineReady, setLandlineReady] = useState(false)
  const [callModalOpen, setCallModalOpen] = useState(false)
  const [callAnswered, setCallAnswered] = useState(false)

  const pendingLandline = pendingDirectorCall || pendingDay2Call
  const activeLandlineKind: LandlineCallKind | null = pendingDirectorCall
    ? 'director-phones'
    : pendingDay2Call
      ? 'day2-urgent'
      : null

  useEffect(() => {
    if (!hasPendingOpeningSms) {
      setPhoneVibrationStopped(false)
    }
  }, [hasPendingOpeningSms])

  useEffect(() => {
    if (!pendingLandline) {
      setLandlineReady(false)
      return
    }

    setLandlineReady(false)
    setCallModalOpen(false)
    setCallAnswered(false)
    setLandlineCallKind(null)

    const timer = window.setTimeout(() => {
      setLandlineReady(true)
    }, LANDLINE_CALL_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [pendingLandline, pendingDirectorCall, pendingDay2Call, state.phase])

  const openMessage =
    unreadHubMessages.find((m) => m.id === openMessageId) ??
    state.hubMessages.find((m) => m.id === openMessageId)

  const voiceTranscript = directorVoiceClue?.detail?.voice?.transcript ?? ''
  const voiceDuration = directorVoiceClue?.detail?.voice?.duration ?? '0:42'

  const handleMobileClick = () => {
    if (phoneVibrating) {
      setPhoneVibrationStopped(true)
      openPhone('lock')
      return
    }
    openPhone(messageOnPhone ? 'lock' : 'home')
  }

  const handleLandlineClick = () => {
    if (pendingLandline && landlineReady && activeLandlineKind) {
    setLandlineCallKind(activeLandlineKind)
    setCallAnswered(false)
    setCallModalOpen(true)
    return
  }
  if (pendingAirportCall && !pendingLandline) {
    setLandlineCallKind('airport-out')
    setCallAnswered(false)
    setCallModalOpen(true)
    }
  }

  const handleAnswerCall = () => {
    setCallAnswered(true)
    if (landlineCallKind === 'day2-urgent') {
      answerDay2Call()
    } else if (landlineCallKind === 'airport-out') {
      placeAirportCall()
    } else {
      answerDirectorCall()
      ensureSpecialistsRowsForCall()
    }
  }

  const handleCloseCall = () => {
    setCallModalOpen(false)
  }

  const messageOnPhone = hasPendingOpeningSms && openingMessageReady
  const phoneVibrating = messageOnPhone && !phoneVibrationStopped

  const landlineRinging = pendingLandline && landlineReady && !callModalOpen
  const landlineOutgoing = Boolean(pendingAirportCall) && !pendingLandline && !callModalOpen

  const hasDeskAlerts =
    unreadHubMessages.length > 0 ||
    showAdvanceDay ||
    Boolean(openMessage) ||
    landlineRinging ||
    landlineOutgoing ||
    state.hubCluesAvailable.size > 0

  let deskPrompt = 'Рабочий стол. Карта, рюкзак и блокнот — внизу.'
  if (hasPendingOpeningSms && !openingMessageReady) {
    deskPrompt = 'Ожидание сигнала…'
  } else if (phoneVibrating) {
    deskPrompt = 'Смартфон вибрирует — нажмите на него'
  } else if (landlineRinging) {
    deskPrompt =
      activeLandlineKind === 'day2-urgent'
        ? DAY2_URGENT_CALL.ringingLabel
        : 'Городской телефон звонит — снимите трубку слева'
  } else if (landlineOutgoing) {
    deskPrompt = AIRPORT_POLICE_CALL.ringingLabel
  }

  const caseCode = '01'
  const isDay2Call = landlineCallKind === 'day2-urgent'
  const isAirportCall = landlineCallKind === 'airport-out'
  const callContact = isAirportCall
    ? AIRPORT_POLICE_CALL
    : isDay2Call
      ? DAY2_URGENT_CALL
      : DIRECTOR_PHONES_CALL

  return (
    <div className="screen hub-screen hub-screen--noir">
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
            : landlineRinging
              ? 'Входящий звонок'
              : landlineOutgoing
                ? 'Исходящий вызов'
                : 'Кабинет открыт'}
        </p>
        <div className="hub-dossier-timer">
          <GameTimer />
        </div>
      </aside>

      {callModalOpen && (
        <div
          className="sms-modal-backdrop"
          role="presentation"
          onClick={callAnswered ? handleCloseCall : undefined}
        >
          <div
            className="call-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="call-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {!callAnswered ? (
              <>
                <p className="call-modal-label">
                  {isAirportCall ? 'Исходящий вызов · городской' : 'Входящий звонок · городской'}
                </p>
                <h2 id="call-modal-title">{callContact.contactName}</h2>
                <p className="call-modal-role">{callContact.role}</p>
                <p className="call-modal-hint">
                  {isAirportCall
                    ? AIRPORT_POLICE_CALL.answerHint
                    : isDay2Call
                      ? 'Срочный вызов с утра. Снимите трубку.'
                      : DIRECTOR_PHONES_CALL.answerHint}
                </p>
                <div className="sms-modal-actions">
                  <button type="button" className="btn btn-primary" onClick={handleAnswerCall}>
                    {isAirportCall ? 'Соединить →' : 'Снять трубку →'}
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
                <p className="call-modal-label">Городской звонок</p>
                <h2 id="call-modal-title">{AIRPORT_POLICE_CALL.contactName}</h2>
                <p className="call-modal-role">{AIRPORT_POLICE_CALL.role}</p>
                <p className="voice-phone-intro">{AIRPORT_POLICE_CALL.body}</p>
                <div className="sms-modal-actions call-modal-actions">
                  <button type="button" className="btn btn-primary" onClick={handleCloseCall}>
                    Положить трубку
                  </button>
                </div>
              </>
            ) : isDay2Call ? (
              <>
                <p className="call-modal-label">Городской звонок</p>
                <h2 id="call-modal-title">{DAY2_URGENT_CALL.contactName}</h2>
                <p className="call-modal-role">{DAY2_URGENT_CALL.role}</p>
                <div className="call-voice-box">
                  <DialogueSpeechControls
                    text={DAY2_URGENT_CALL.body}
                    lineKey="day2-director-call"
                    audioSrc={DAY2_URGENT_CALL.audioSrc}
                  />
                  <p className="call-voice-tip">Сначала только голос — слушайте трубку.</p>
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
                    Положить трубку
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="call-modal-label">Голосовое сообщение</p>
                <h2 id="call-modal-title">Анна Сергеевна Захарова</h2>
                <p className="call-modal-role">Директор ГТГ · {voiceDuration}</p>

                <div className="call-modal-layout">
                  <div className="call-voice-box">
                    <DialogueSpeechControls
                      text={voiceTranscript}
                      lineKey="director-call-voice"
                      audioSrc={directorVoiceClue?.detail?.voice?.audioSrc}
                    />
                    {directorVoiceClue?.detail?.voice?.spokenIntro && (
                      <p className="voice-phone-intro">
                        {directorVoiceClue.detail.voice.spokenIntro}
                      </p>
                    )}
                    {directorVoiceClue?.detail?.voice?.spokenOutro && (
                      <p className="voice-phone-outro">
                        {directorVoiceClue.detail.voice.spokenOutro}
                      </p>
                    )}
                    <p className="call-voice-tip">
                      Нажмите 🔊 и одновременно вписывайте номера справа в блокнот.
                    </p>
                  </div>

                  <CallLiveNotebook />
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
                    Положить трубку
                  </button>
                </div>
                <p className="call-modal-saved">
                  Голосовое сохранено в рюкзак — можно переслушать позже.
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
              {landlineOutgoing && (
                <div className="hub-call-banner" role="status">
                  <span className="hub-call-pulse" aria-hidden />
                  <div className="hub-call-copy">
                    <strong>Можно звонить</strong>
                    <span>{AIRPORT_POLICE_CALL.ringingLabel}</span>
                  </div>
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
                !pendingLandline &&
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
              phoneVibrating || landlineRinging || landlineOutgoing
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
            mobileActive
            onMobileClick={handleMobileClick}
            landlineRinging={landlineRinging}
            landlineOutgoing={landlineOutgoing}
            landlineActive={landlineRinging || landlineOutgoing}
            onLandlineClick={handleLandlineClick}
          />
        </div>
      </main>

      <div className="hub-dock">
        <ToolBar />
      </div>

      {state.showHint && state.currentHint && (
        <div className="hint-toast hub-hint-toast">
          <p>{state.currentHint}</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={dismissHint}>
            Понятно
          </button>
        </div>
      )}
    </div>
  )
}
