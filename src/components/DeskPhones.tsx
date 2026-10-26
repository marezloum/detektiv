import { useEffect, useState } from 'react'

interface DeskPhonesProps {
  mobileHasSms: boolean
  mobileVibrating: boolean
  mobileActive: boolean
  onMobileClick: () => void
  landlineRinging?: boolean
  landlineOutgoing?: boolean
  landlineActive?: boolean
  onLandlineClick?: () => void
}

export function DeskPhones({
  mobileHasSms,
  mobileVibrating,
  mobileActive,
  onMobileClick,
  landlineRinging = false,
  landlineOutgoing = false,
  landlineActive = false,
  onLandlineClick,
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

  return (
    <div className="hub-desk-phones" aria-label="Телефоны на столе">
      <button
        type="button"
        className={[
          'desk-phone',
          'desk-phone--landline',
          landlineRinging ? 'desk-phone--landline-ring' : '',
          landlineOutgoing ? 'desk-phone--landline-out' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onLandlineClick}
        disabled={!landlineActive}
        title={
          landlineRinging
            ? 'Входящий звонок — снимите трубку'
            : landlineOutgoing
              ? 'Позвонить в полицию аэропорта'
              : 'Городской телефон с диском'
        }
        aria-label={
          landlineRinging
            ? 'Городской телефон — входящий звонок от директора'
            : landlineOutgoing
              ? 'Городской телефон — позвонить в аэропорт'
              : 'Городской телефон на столе'
        }
      >
        <div className="landline-phone" aria-hidden>
          <div className="landline-phone-handset" />
          <div className="landline-phone-base">
            <div className="landline-phone-dial" />
          </div>
        </div>
        <span className="desk-phone-label">
          {landlineRinging
            ? 'Городской — звонит!'
            : landlineOutgoing
              ? 'Городской — позвонить'
              : 'Городской'}
        </span>
      </button>

      <button
        type="button"
        className={[
          'desk-phone',
          'desk-phone--mobile',
          mobileHasSms ? 'desk-phone--mobile-alert' : '',
          mobileVibrating ? 'desk-phone--mobile-vibrate' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onMobileClick}
        disabled={!mobileActive}
        title={mobileHasSms ? 'Новое сообщение — нажмите' : 'Смартфон'}
        aria-label={
          mobileHasSms ? 'Смартфон — новое сообщение' : 'Смартфон на столе'
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
                  {mobileHasSms ? (
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
          {mobileHasSms ? 'Новое сообщение' : 'Смартфон'}
        </span>
      </button>
    </div>
  )
}
