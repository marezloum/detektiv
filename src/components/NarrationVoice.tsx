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
  const [paused, setPaused] = useState(false)

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
    setPaused(false)

    const audio = audioRef.current
    let cancelled = false

    if (audioSrc && audio) {
      audio.pause()
      audio.currentTime = 0

      const onPlay = () => {
        setPlaying(true)
        setPaused(false)
        setBlocked(false)
      }
      const onPause = () => {
        setPlaying(false)
        if (!audio.ended) setPaused(true)
      }
      const onAudioEnded = () => {
        setPlaying(false)
        setPaused(false)
        finish()
      }

      audio.addEventListener('play', onPlay)
      audio.addEventListener('pause', onPause)
      audio.addEventListener('ended', onAudioEnded)

      void audio
        .play()
        .then(() => {
          if (cancelled) return
          setBlocked(false)
          setPlaying(true)
          setPaused(false)
        })
        .catch(() => {
          if (cancelled) return
          setBlocked(true)
          setPlaying(false)
          setPaused(false)
        })

      return () => {
        cancelled = true
        audio.removeEventListener('play', onPlay)
        audio.removeEventListener('pause', onPause)
        audio.removeEventListener('ended', onAudioEnded)
        audio.pause()
      }
    }

    if (!audioSrc && typeof window !== 'undefined' && 'speechSynthesis' in window && text.trim()) {
      speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'ru-RU'
      utter.rate = 1
      utter.onstart = () => {
        if (cancelled) return
        setPlaying(true)
        setPaused(false)
      }
      utter.onend = () => {
        if (cancelled) return
        setPlaying(false)
        setPaused(false)
        finish()
      }
      utter.onerror = () => {
        if (cancelled) return
        setPlaying(false)
        setPaused(false)
        setBlocked(true)
      }
      speechSynthesis.speak(utter)
      setPlaying(true)

      return () => {
        cancelled = true
        speechSynthesis.cancel()
      }
    }

    setBlocked(true)
    return undefined
  }, [lineKey, audioSrc, text])

  const handleStart = async () => {
    const audio = audioRef.current
    if (audioSrc && audio) {
      if (audio.ended) audio.currentTime = 0
      try {
        await audio.play()
        setBlocked(false)
        setPaused(false)
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
      utter.onstart = () => {
        setPlaying(true)
        setPaused(false)
      }
      utter.onend = () => {
        setPlaying(false)
        setPaused(false)
        finish()
      }
      utter.onerror = () => setBlocked(true)
      speechSynthesis.speak(utter)
      setBlocked(false)
      setPaused(false)
      setPlaying(true)
    }
  }

  const togglePlayback = () => {
    const audio = audioRef.current
    if (audioSrc && audio) {
      if (!audio.paused && !audio.ended) {
        audio.pause()
        return
      }
      void handleStart()
      return
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause()
        setPlaying(false)
        setPaused(true)
        return
      }
      if (speechSynthesis.paused) {
        speechSynthesis.resume()
        setPlaying(true)
        setPaused(false)
        return
      }
    }

    void handleStart()
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
          <button
            type="button"
            className={`narration-voice-listening ${playing ? 'is-playing' : ''}`}
            onClick={togglePlayback}
            aria-label={playing ? 'Пауза' : paused ? 'Продолжить' : 'Слушать'}
            title={playing ? 'Пауза' : paused ? 'Продолжить' : 'Слушать'}
          >
            <span className="narration-voice-toggle-icon" aria-hidden>
              {playing ? (
                <span className="narration-voice-pause-glyph" />
              ) : (
                <span className="narration-voice-play-glyph" />
              )}
            </span>
            <span className="narration-voice-listening-copy">
              <span className="narration-voice-bars" aria-hidden>
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="narration-voice-label">
                {playing ? 'Рассказчик…' : paused ? 'Пауза' : 'Готово'}
              </span>
            </span>
          </button>
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
