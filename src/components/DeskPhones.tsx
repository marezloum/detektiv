interface DeskPhonesProps {
  mobileHasSms: boolean
  mobileVibrating: boolean
  mobileActive: boolean
  onMobileClick: () => void
  landlineRinging?: boolean
  landlineActive?: boolean
  onLandlineClick?: () => void
}

export function DeskPhones({
  mobileHasSms,
  mobileVibrating,
  mobileActive,
  onMobileClick,
  landlineRinging = false,
  landlineActive = false,
  onLandlineClick,
}: DeskPhonesProps) {
  return (
    <div className="hub-desk-phones" aria-label="Телефоны на столе">
      <button
        type="button"
        className={[
          'desk-phone',
          'desk-phone--landline',
          landlineRinging ? 'desk-phone--landline-ring' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onLandlineClick}
        disabled={!landlineActive}
        title={landlineRinging ? 'Входящий звонок — снимите трубку' : 'Городской телефон с диском'}
        aria-label={
          landlineRinging
            ? 'Городской телефон — входящий звонок от директора'
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
          {landlineRinging ? 'Городской — звонит!' : 'Городской'}
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
        title={mobileHasSms ? 'Новое SMS — нажмите' : 'Кнопочный телефон'}
        aria-label={
          mobileHasSms ? 'Кнопочный телефон — новое SMS' : 'Кнопочный телефон на столе'
        }
      >
        <div className="feature-phone" aria-hidden>
          <div className="feature-phone-antenna" />
          <div className="feature-phone-body">
            <div className={`feature-phone-screen ${mobileHasSms ? 'feature-phone-screen--lit' : ''}`}>
              {mobileHasSms ? (
                <>
                  <span className="feature-phone-sms-icon">✉</span>
                  <span className="feature-phone-sms-text">SMS</span>
                </>
              ) : (
                <span className="feature-phone-clock">12:34</span>
              )}
            </div>
            <div className="feature-phone-keypad">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="feature-phone-key" />
              ))}
            </div>
          </div>
        </div>
        <span className="desk-phone-label">
          {mobileHasSms ? 'Кнопочный — SMS!' : 'Кнопочный'}
        </span>
      </button>
    </div>
  )
}
