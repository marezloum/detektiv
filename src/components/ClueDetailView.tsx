import type { Clue, ClueDetailType } from '../types/game'
import { asset } from '../utils/asset'
import { DialogueSpeechControls } from './DialogueSpeechControls'
import { VoicePhoneRevealList } from './VoicePhoneRevealList'
import { CallLiveNotebook } from './CallLiveNotebook'
import { ClueIcon, iconKindFromClue } from './ClueIcon'

interface ClueDetailViewProps {
  clue: Clue
  onClose: () => void
}

const TYPE_LABEL: Record<ClueDetailType, string> = {
  phone: 'Мобильный телефон',
  ticket: 'Билет',
  note: 'Рукописная записка',
  postcard: 'Открытка',
  voice: 'Голосовое сообщение',
  'business-card': 'Визитная карточка',
  photo: 'Фотография',
  object: 'Вещественная улика',
}

function postcardTone(title: string): 'unknown' | 'ivan' | 'apotheosis' | 'default' {
  if (title.includes('Неизвестн')) return 'unknown'
  if (title.includes('Иван')) return 'ivan'
  if (title.includes('Апофеоз') || title.includes('войн')) return 'apotheosis'
  return 'default'
}

export function ClueDetailView({ clue, onClose }: ClueDetailViewProps) {
  const detail = clue.detail
  const kind = iconKindFromClue(clue)

  if (!detail) {
    return (
      <div className="clue-detail">
        <header className="clue-detail-header">
          <div className="clue-detail-identity">
            <ClueIcon kind={kind} className="clue-icon--detail" />
            <div>
              <p className="clue-detail-eyebrow">Улика</p>
              <h3>{clue.title}</h3>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Закрыть
          </button>
        </header>
        <p className="clue-detail-desc">{clue.description}</p>
      </div>
    )
  }

  return (
    <div className={`clue-detail clue-detail--${detail.type}`}>
      <header className="clue-detail-header">
        <div className="clue-detail-identity">
          <ClueIcon
            kind={kind}
            postcardHint={detail.postcard?.paintingTitle ?? clue.title}
            className="clue-icon--detail"
          />
          <div>
            <p className="clue-detail-eyebrow">{TYPE_LABEL[detail.type]}</p>
            <h3>{clue.title}</h3>
          </div>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
          Закрыть
        </button>
      </header>

      <p className="clue-detail-desc">{clue.description}</p>

      <div className="clue-detail-stage">
        {detail.type === 'phone' && detail.phone && (
          <div className="clue-phone">
            <div className="clue-phone__device" aria-hidden>
              <div className="clue-phone__notch" />
              <div className="clue-phone__screen-label">Журнал</div>
            </div>
            <div className="clue-phone__log">
              <p className="clue-detail-subtitle">Последние 10 звонков</p>
              <ul className="phone-call-list">
                {detail.phone.calls.map((call, idx) => (
                  <li key={idx} className={`phone-call phone-call--${call.direction}`}>
                    <div className="phone-call-top">
                      <span className="phone-call-name">
                        {call.contactName ?? call.number}
                      </span>
                      <span className="phone-call-time">{call.time}</span>
                    </div>
                    {call.contactName && (
                      <span className="phone-call-number">{call.number}</span>
                    )}
                    <span className={`phone-call-badge phone-call-badge--${call.direction}`}>
                      {call.direction === 'incoming'
                        ? 'входящий'
                        : call.direction === 'outgoing'
                          ? 'исходящий'
                          : 'пропущенный'}
                    </span>
                    <span className="phone-call-meta">{call.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {detail.type === 'ticket' && detail.ticket && (
          <div className="theater-ticket">
            <div className="theater-ticket__stub">
              <span className="theater-ticket__admit">ADMIT ONE</span>
              <span className="theater-ticket__stub-seat">
                {detail.ticket.row}/{detail.ticket.seat}
              </span>
            </div>
            <div className="theater-ticket__body">
              <p className="theater-ticket-venue">{detail.ticket.venue}</p>
              <h4 className="theater-ticket-event">{detail.ticket.event}</h4>
              <div className="theater-ticket-grid">
                <div>
                  <span className="theater-ticket-label">Дата</span>
                  <strong>{detail.ticket.date}</strong>
                </div>
                <div>
                  <span className="theater-ticket-label">Время</span>
                  <strong>{detail.ticket.time}</strong>
                </div>
                <div>
                  <span className="theater-ticket-label">Сектор</span>
                  <strong>{detail.ticket.section}</strong>
                </div>
                <div>
                  <span className="theater-ticket-label">Ряд / Место</span>
                  <strong>
                    {detail.ticket.row} / {detail.ticket.seat}
                  </strong>
                </div>
              </div>
              {detail.ticket.holderName && (
                <p className="theater-ticket-holder">Владелец: {detail.ticket.holderName}</p>
              )}
              <p className="theater-ticket-price">{detail.ticket.price}</p>
            </div>
          </div>
        )}

        {detail.type === 'business-card' && detail.businessCard && (
          <div className="business-card-stage">
            <div className="business-card" aria-label="Визитная карточка">
              <div className="business-card__sheen" aria-hidden />
              <div className="business-card__top">
                <div className="business-card__monogram" aria-hidden>
                  {detail.businessCard.name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join('')
                    .toUpperCase()}
                </div>
                {detail.businessCard.company && (
                  <p className="business-card-company">{detail.businessCard.company}</p>
                )}
              </div>

              <p className="business-card-name">{detail.businessCard.name}</p>
              <p className="business-card-title">{detail.businessCard.title}</p>

              <div className="business-card__rule" aria-hidden />

              <div className="business-card-contacts">
                {detail.businessCard.phone && (
                  <p>
                    <span className="business-card-label">тел.</span>
                    {detail.businessCard.phone}
                  </p>
                )}
                {detail.businessCard.email && (
                  <p>
                    <span className="business-card-label">e-mail</span>
                    {detail.businessCard.email}
                  </p>
                )}
                {detail.businessCard.address && (
                  <p>
                    <span className="business-card-label">адрес</span>
                    {detail.businessCard.address}
                  </p>
                )}
              </div>

              <div className="business-card__corner business-card__corner--tl" aria-hidden />
              <div className="business-card__corner business-card__corner--br" aria-hidden />
            </div>
            <p className="business-card-caption">Карточка слегка помята — из кармана пиджака</p>
          </div>
        )}

        {detail.type === 'note' && detail.note && (
          <div className="handwritten-note">
            <div className="handwritten-note__pin" aria-hidden />
            <div className="handwritten-note__lines">
              {detail.note.lines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
            <div className="handwritten-note__meta">
              <p>
                <strong>{detail.note.date}</strong>
                <span> · {detail.note.time}</span>
              </p>
              <p>{detail.note.location}</p>
            </div>
          </div>
        )}

        {detail.type === 'postcard' && detail.postcard && (
          <div className={`postcard postcard--${postcardTone(detail.postcard.paintingTitle)}`}>
            <div className="postcard-art">
              {detail.postcard.imageSrc ? (
                <img
                  src={asset(detail.postcard.imageSrc)}
                  alt={detail.postcard.paintingTitle}
                  className="postcard-art__img"
                  draggable={false}
                />
              ) : (
                <>
                  <span className="postcard-art__glow" aria-hidden />
                  <span className="postcard-art__frame" aria-hidden />
                </>
              )}
            </div>
            <div className="postcard-copy">
              <h4>{detail.postcard.paintingTitle}</h4>
              <p className="postcard-artist">{detail.postcard.artist}</p>
              <p className="postcard-hall">{detail.postcard.galleryHall}</p>
              <p className="postcard-desc">{detail.postcard.description}</p>
            </div>
          </div>
        )}

        {detail.type === 'photo' && detail.photo && (
          <div className="clue-photo">
            <img
              src={asset(detail.photo.imageSrc)}
              alt={clue.title}
              className="clue-photo__img"
              draggable={false}
            />
            <p className="clue-photo-caption">{detail.photo.caption}</p>
          </div>
        )}

        {detail.type === 'object' && detail.object && (
          <div className="clue-object">
            {detail.object.imageSrc && (
              <img
                src={asset(detail.object.imageSrc)}
                alt={clue.title}
                className="clue-object__img"
                draggable={false}
              />
            )}
            {detail.object.caption && (
              <p className="clue-object-caption">{detail.object.caption}</p>
            )}
          </div>
        )}

        {detail.type === 'voice' && detail.voice && (
          <div className="voice-message">
            <div className="voice-message-player" aria-hidden>
              <span className="voice-wave">
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="voice-duration">{detail.voice.duration}</span>
            </div>
            <p className="voice-sender">От: {detail.voice.sender}</p>
            <DialogueSpeechControls
              text={detail.voice.transcript}
              lineKey={`backpack-voice-${clue.id}`}
              audioSrc={detail.voice.audioSrc}
            />
            {detail.voice.phones && detail.voice.phones.length > 0 ? (
              <>
                <CallLiveNotebook />
                <details className="call-reveal-details">
                  <summary>Не успели записать? Открыть номер письменно (+10 сек)</summary>
                  <VoicePhoneRevealList
                    phones={detail.voice.phones}
                    intro={detail.voice.spokenIntro}
                    outro={detail.voice.spokenOutro}
                  />
                </details>
              </>
            ) : (
              <div className="voice-transcript">
                <p className="voice-transcript-label">Расшифровка</p>
                <p>{detail.voice.transcript}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
