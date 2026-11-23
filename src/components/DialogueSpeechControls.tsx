import { useEffect, useState } from 'react'
import { AudioPlayer } from './AudioPlayer'

type SpeechStatus = 'idle' | 'playing' | 'paused'

interface DialogueSpeechControlsProps {
  text: string
  lineKey: string
  /** Pre-recorded MP3 — same quality path as rules narrator */
  audioSrc?: string
  /** Compact loudspeaker next to a dialogue line */
  variant?: 'bar' | 'inline'
  /** Auto-start recorded audio (e.g. director phone call) */
  autoPlay?: boolean
}

function LoudspeakerIcon({ playing }: { playing?: boolean }) {
  return (
    <svg
      className="dialogue-speech-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M3.5 9.5v5h3.2L12 19.2V4.8L6.7 9.5H3.5zm11.2 1.1a2.7 2.7 0 0 1 0 2.8l1.3 1.1a4.5 4.5 0 0 0 0-5l-1.3 1.1zm2.2-3.1a6.4 6.4 0 0 1 0 9l1.35 1.15a8.1 8.1 0 0 0 0-11.3L16.9 7.5z"
      />
      {playing ? (
        <circle cx="20.2" cy="12" r="1.35" fill="currentColor" opacity="0.85" />
      ) : null}
    </svg>
  )
}

export function DialogueSpeechControls({
  text,
  lineKey,
  audioSrc,
  variant = 'bar',
  autoPlay = false,
}: DialogueSpeechControlsProps) {
  const [status, setStatus] = useState<SpeechStatus>('idle')
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const inline = variant === 'inline'

  useEffect(() => {
    if (!supported || audioSrc) return
    speechSynthesis.cancel()
    setStatus('idle')
    return () => {
      speechSynthesis.cancel()
    }
  }, [lineKey, supported, audioSrc])

  if (audioSrc) {
    return (
      <div
        className={[
          'dialogue-speech',
          'dialogue-speech--recorded',
          inline ? 'dialogue-speech--inline' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Озвучка реплики"
      >
        <AudioPlayer src={audioSrc} label="Прослушать" compact autoPlay={autoPlay} />
      </div>
    )
  }

  if (!supported || !text.trim()) return null

  const startSpeech = () => {
    speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'ru-RU'
    utter.rate = 1
    utter.onstart = () => setStatus('playing')
    utter.onend = () => setStatus('idle')
    utter.onerror = () => setStatus('idle')
    speechSynthesis.speak(utter)
    setStatus('playing')
  }

  const togglePlay = () => {
    if (status === 'playing') {
      speechSynthesis.pause()
      setStatus('paused')
      return
    }
    if (status === 'paused') {
      speechSynthesis.resume()
      setStatus('playing')
      return
    }
    startSpeech()
  }

  const stopSpeech = () => {
    speechSynthesis.cancel()
    setStatus('idle')
  }

  if (inline) {
    return (
      <button
        type="button"
        className={`dialogue-speech-inline ${status === 'playing' ? 'is-playing' : ''}`}
        onClick={togglePlay}
        aria-label={
          status === 'playing' ? 'Пауза' : status === 'paused' ? 'Продолжить' : 'Прослушать'
        }
        title={status === 'playing' ? 'Пауза' : status === 'paused' ? 'Продолжить' : 'Прослушать'}
      >
        <LoudspeakerIcon playing={status === 'playing'} />
      </button>
    )
  }

  return (
    <div className="dialogue-speech" aria-label="Озвучка реплики">
      <button
        type="button"
        className={`dialogue-speech-play ${status === 'playing' ? 'is-playing' : ''}`}
        onClick={togglePlay}
        aria-label={
          status === 'playing' ? 'Пауза' : status === 'paused' ? 'Продолжить' : 'Прослушать'
        }
        title={status === 'playing' ? 'Пауза' : status === 'paused' ? 'Продолжить' : 'Прослушать'}
      >
        <LoudspeakerIcon playing={status === 'playing'} />
      </button>

      <button
        type="button"
        className="dialogue-speech-stop"
        onClick={stopSpeech}
        disabled={status === 'idle'}
        aria-label="Стоп"
        title="Стоп"
      >
        ⏹
      </button>

      <div className="dialogue-speech-meta">
        <span className="dialogue-speech-status">
          {status === 'playing' ? 'Идёт озвучка' : status === 'paused' ? 'Пауза' : 'Голос'}
        </span>
      </div>
    </div>
  )
}
