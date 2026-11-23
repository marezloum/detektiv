import { useEffect, useState } from 'react'
import { asset } from '../utils/asset'

interface DeskPhonesProps {
  mobileHasSms: boolean
  mobileVibrating: boolean
  mobileRinging?: boolean
  mobileOutgoing?: boolean
  mobileActive: boolean
  onMobileClick: () => void
}

export function DeskPhones({
  mobileHasSms,
  mobileVibrating,
  mobileRinging = false,
  mobileOutgoing = false,
  mobileActive,
  onMobileClick,
}: DeskPhonesProps) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 10000)
    return () => window.clearInterval(id)
  }, [])
  const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  const dateLabel = now.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const mobileLabel = mobileRinging
    ? 'Входящий звонок'
    : mobileOutgoing
      ? 'Позвонить'
      : mobileHasSms
        ? 'Новое сообщение'
        : 'Смартфон'

  return (
    <div className="hub-desk-phones" aria-label="Смартфон на столе">
      <button
        type="button"
        className={[
          'desk-phone',
          'desk-phone--mobile',
          mobileHasSms ? 'desk-phone--mobile-alert' : '',
          mobileVibrating || mobileRinging ? 'desk-phone--mobile-vibrate' : '',
          mobileRinging ? 'desk-phone--mobile-ring' : '',
          mobileOutgoing ? 'desk-phone--mobile-out' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onMobileClick}
        disabled={!mobileActive}
        title={
          mobileRinging
            ? 'Входящий звонок — ответьте'
            : mobileOutgoing
              ? 'Позвонить в полицию аэропорта'
              : mobileHasSms
                ? 'Новое сообщение — нажмите'
                : 'Смартфон'
        }
        aria-label={
          mobileRinging
            ? 'Смартфон — входящий звонок'
            : mobileOutgoing
              ? 'Смартфон — позвонить в аэропорт'
              : mobileHasSms
                ? 'Смартфон — новое сообщение'
                : 'Смартфон на столе'
        }
      >
        <span className="desk-phone-scale" aria-hidden>
          <span className="dphone">
            <span className="dphone-side dphone-side--vol" />
            <span className="dphone-side dphone-side--power" />
            <span className="dphone-glass">
              <span className="dphone-screen dphone-screen--lock">
                <span className="dphone-punch" />
                <span className="dphone-status">
                  <span className="dphone-status-time">{time}</span>
                  <span className="dphone-status-icons">
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
                </span>
                <span className="dphone-lock">
                  <span className="dphone-lock-time">{time}</span>
                  <span className="dphone-lock-date">{dateLabel}</span>
                  {mobileRinging ? (
                    <span className="dphone-note dphone-note--call">
                      <span className="dphone-app-icon dphone-app-icon--call" />
                      <span className="dphone-note-copy">
                        <span className="dphone-note-top">
                          <strong>Входящий</strong>
                          <span>сейчас</span>
                        </span>
                        <span className="dphone-note-name">Директор ГТГ</span>
                        <span className="dphone-note-preview">Нажмите, чтобы ответить</span>
                      </span>
                    </span>
                  ) : mobileOutgoing ? (
                    <span className="dphone-note dphone-note--call">
                      <span className="dphone-app-icon dphone-app-icon--call" />
                      <span className="dphone-note-copy">
                        <span className="dphone-note-top">
                          <strong>Вызов</strong>
                          <span>готово</span>
                        </span>
                        <span className="dphone-note-name">Шереметьево</span>
                        <span className="dphone-note-preview">Позвонить в полицию аэропорта</span>
                      </span>
                    </span>
                  ) : mobileHasSms ? (
                    <span className="dphone-note">
                      <span className="dphone-app-icon dphone-app-icon--msg" />
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
                    </span>
                  ) : (
                    <span className="dphone-lock-empty">Нет уведомлений</span>
                  )}
                </span>
                <span className="dphone-gesture" />
              </span>
            </span>
          </span>
        </span>
        <span className="desk-phone-label">
          <img
            src={asset('/images/ui/paperclip.svg')}
            alt=""
            className="locker-paperclip desk-phone-clip"
            aria-hidden
          />
          <span>{mobileLabel}</span>
        </span>
      </button>
    </div>
  )
}
