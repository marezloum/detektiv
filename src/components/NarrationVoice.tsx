import { useEffect, useRef, useState } from 'react'
import { asset } from '../utils/asset'

interface NarrationVoiceProps {
  text: string
  lineKey: string
  audioSrc?: string
  canBack: boolean
  isLast: boolean
  onBack: () => void
  onSkip: () => void
  onEnded: () => void
}

export function NarrationVoice({
  text,
  lineKey,
  audioSrc: audioSrcProp,
  canBack,
  isLast,
  onBack,
  onSkip,
  onEnded,
}: NarrationVoiceProps) {
  const audioSrc = audioSrcProp ? asset(audioSrcProp) : undefined
  const audioRef = useRef<HTMLAudioElement>(null)
  const finishedRef = useRef(false)
  const onEndedRef = useRef(onEnded)
  const [blocked, setBlocked] = useState(false)
  const [playing, setPlaying] = useState(false)

  onEndedRef.current = onEnded

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    onEndedRef.current()
  }

  useEffect(() => {
    finishedRef.current = false
    setBlocked(false)
    setPlaying(false)

    const audio = audioRef.current

    if (audioSrc && audio) {
      audio.pause()
      audio.currentTime = 0

      const onPlay = () => setPlaying(true)
      const onPause = () => setPlaying(false)
      const onAudioEnded = () => {
        setPlaying(false)
        finish()
      }

      audio.addEventListener('play', onPlay)
      audio.addEventListener('pause', onPause)
      audio.addEventListener('ended', onAudioEnded)

      void audio
        .play()
        .then(() => {
          setBlocked(false)
          setPlaying(true)
        })
        .catch(() => {
          setBlocked(true)
          setPlaying(false)
        })

      return () => {
        audio.pause()
        audio.removeEventListener('play', onPlay)
        audio.removeEventListener('pause', onPause)
        audio.removeEventListener('ended', onAudioEnded)
      }
    }

    if (!audioSrc && typeof window !== 'undefined' && 'speechSynthesis' in window && text.trim()) {
      speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'ru-RU'
      utter.rate = 1
      utter.onstart = () => setPlaying(true)
      utter.onend = () => {
        setPlaying(false)
        finish()
      }
      utter.onerror = () => {
        setPlaying(false)
        setBlocked(true)
      }
      speechSynthesis.speak(utter)
      setPlaying(true)

      return () => {
        speechSynthesis.cancel()
      }
    }

    setBlocked(true)
    return undefined
  }, [lineKey, audioSrc, text])

  const handleStart = async () => {
    const audio = audioRef.current
    if (audioSrc && audio) {
      try {
        await audio.play()
        setBlocked(false)
        setPlaying(true)
      } catch {
        setBlocked(true)
      }
      return
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && text.trim()) {
      speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'ru-RU'
      utter.rate = 1
      utter.onstart = () => setPlaying(true)
      utter.onend = () => {
        setPlaying(false)
        finish()
      }
      utter.onerror = () => setBlocked(true)
      speechSynthesis.speak(utter)
      setBlocked(false)
      setPlaying(true)
    }
  }

  const handleSkip = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    finishedRef.current = true
    onSkip()
  }

  return (
    <div className="narration-voice" role="status" aria-live="polite">
      {audioSrc && <audio ref={audioRef} src={audioSrc} preload="auto" />}

      <div className="narration-voice-stage">
        {blocked ? (
          <button
            type="button"
            className="narration-voice-start"
            onClick={handleStart}
            aria-label="Слушать рассказчика"
          >
            <span className="narration-voice-start-icon" aria-hidden>
              ▶
            </span>
            <span>Слушать</span>
          </button>
        ) : (
          <div className={`narration-voice-listening ${playing ? 'is-playing' : ''}`}>
            <span className="narration-voice-bars" aria-hidden>
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="narration-voice-label">
              {playing ? 'Рассказчик…' : 'Готово'}
            </span>
          </div>
        )}
      </div>

      <p className="narration-voice-text">{text}</p>

      <div className="narration-voice-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onBack}
          disabled={!canBack}
        >
          ← Назад
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleSkip}>
          {isLast ? 'Завершить' : 'Пропустить →'}
        </button>
      </div>
    </div>
  )
}
