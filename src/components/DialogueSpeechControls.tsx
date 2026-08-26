import { useEffect, useState } from 'react'
import { AudioPlayer } from './AudioPlayer'

type SpeechStatus = 'idle' | 'playing' | 'paused'

interface DialogueSpeechControlsProps {
  text: string
  lineKey: string
  /** Pre-recorded MP3 — same quality path as rules narrator */
  audioSrc?: string
}

export function DialogueSpeechControls({
  text,
  lineKey,
  audioSrc,
}: DialogueSpeechControlsProps) {
  const [status, setStatus] = useState<SpeechStatus>('idle')
  const [rate, setRate] = useState(0.9)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

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
      <div className="dialogue-speech dialogue-speech--recorded" aria-label="Озвучка реплики">
        <AudioPlayer src={audioSrc} label="Прослушать" compact />
      </div>
    )
  }

  if (!supported || !text.trim()) return null

  const startSpeech = (nextRate = rate) => {
    speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'ru-RU'
    utter.rate = nextRate
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

  const changeRate = (next: number) => {
    setRate(next)
    if (status === 'playing' || status === 'paused') {
      startSpeech(next)
    }
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
        {status === 'playing' ? '⏸' : status === 'paused' ? '▶' : '🔊'}
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
        <label className="dialogue-speech-rate">
          <span className="visually-hidden">Скорость</span>
          <select
            value={rate}
            onChange={(e) => changeRate(Number(e.target.value))}
            aria-label="Скорость озвучки"
            title="Скорость"
          >
            <option value={0.75}>0.75×</option>
            <option value={0.9}>0.9×</option>
            <option value={1}>1×</option>
            <option value={1.25}>1.25×</option>
          </select>
        </label>
      </div>
    </div>
  )
}
