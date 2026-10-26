import { useEffect, useId, useRef, useState } from 'react'
import { asset } from '../utils/asset'

function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function GrungeMeter({
  id,
  label,
  max,
  step,
  value,
  onChange,
  ariaLabel,
}: {
  id?: string
  label?: string
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  ariaLabel: string
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <label className="grunge-meter">
      {label ? <span className="grunge-meter-label">{label}</span> : null}
      <span className="grunge-meter-bar">
        <span className="grunge-meter-lines" aria-hidden />
        <span className="grunge-meter-fill" style={{ width: `${pct}%` }} aria-hidden />
        <span className="grunge-meter-head" style={{ left: `${pct}%` }} aria-hidden />
        <input
          id={id}
          type="range"
          className="grunge-meter-input"
          min={0}
          max={max || 0}
          step={step}
          value={Math.min(value, max || 0)}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={ariaLabel}
        />
      </span>
    </label>
  )
}

function createAudioContext() {
  const Ctx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  return Ctx ? new Ctx() : null
}

interface AudioPlayerProps {
  src: string
  label?: string
  compact?: boolean
  grunge?: boolean
}

export function AudioPlayer({
  src,
  label = 'Прослушать',
  compact = false,
  grunge = false,
}: AudioPlayerProps) {
  const resolvedSrc = asset(src)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const progressId = useId()

  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const applyVolume = (level: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = 1

    try {
      if (!gainRef.current) {
        const ctx = createAudioContext()
        if (!ctx) throw new Error('AudioContext unavailable')
        const source = ctx.createMediaElementSource(audio)
        const gain = ctx.createGain()
        source.connect(gain)
        gain.connect(ctx.destination)
        audioCtxRef.current = ctx
        gainRef.current = gain
      }
      gainRef.current.gain.value = level
      audio.volume = 1
      void audioCtxRef.current?.resume()
    } catch {
      audio.volume = level
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration)
    const onEnded = () => {
      setPlaying(false)
      setStarted(false)
    }
    const onPlay = () => {
      setPlaying(true)
      setStarted(true)
    }
    const onPause = () => setPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('durationchange', onLoaded)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.playbackRate = 1

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('durationchange', onLoaded)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [resolvedSrc])

  useEffect(() => {
    setPlaying(false)
    setStarted(false)
    setCurrentTime(0)
    setDuration(0)
  }, [resolvedSrc])

  useEffect(() => {
    return () => {
      void audioCtxRef.current?.close()
      audioCtxRef.current = null
      gainRef.current = null
    }
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    applyVolume(volume)

    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setPlaying(false)
      }
    } else {
      audio.pause()
    }
  }

  const handleSeek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTime(value)
  }

  const handleVolume = (level: number) => {
    setVolume(level)
    applyVolume(level)
  }

  const playIcon = playing ? '⏸' : started ? '▶' : '🔊'
  const playLabel = playing ? 'Пауза' : started ? 'Продолжить' : label

  const volumeControl = (
    <label className="audio-player-setting">
      <span>Громкость</span>
      <input
        type="range"
        className="audio-player-range audio-player-volume"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => handleVolume(Number(e.target.value))}
        aria-label="Громкость"
      />
    </label>
  )

  if (compact) {
    return (
      <div className="audio-player audio-player--compact">
        <audio ref={audioRef} src={resolvedSrc} preload="metadata" />
        <button
          type="button"
          className={`audio-player-play ${playing ? 'is-playing' : ''}`}
          onClick={togglePlay}
          aria-label={playLabel}
          title={playLabel}
        >
          {playIcon}
        </button>
        <div className="audio-player-compact-controls">
          <input
            id={progressId}
            type="range"
            className="audio-player-range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => handleSeek(Number(e.target.value))}
            aria-label="Позиция воспроизведения"
          />
          <span className="audio-player-time">
            {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
          </span>
        </div>
        {volumeControl}
      </div>
    )
  }

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={resolvedSrc} preload="metadata" />
      <div className="audio-player-main">
        <button
          type="button"
          className={`btn btn-secondary audio-player-toggle ${playing ? 'is-playing' : ''}`}
          onClick={togglePlay}
        >
          {playing ? '⏸ Пауза' : started ? '▶ Продолжить' : `🔊 ${label}`}
        </button>
        <span className="audio-player-time">
          {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
        </span>
      </div>
      {grunge ? (
        <GrungeMeter
          id={progressId}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          ariaLabel="Позиция воспроизведения"
        />
      ) : (
        <input
          type="range"
          className="audio-player-range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => handleSeek(Number(e.target.value))}
          aria-label="Позиция воспроизведения"
        />
      )}
      <div className="audio-player-settings">
        {grunge ? (
          <GrungeMeter
            label="Громкость"
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolume}
            ariaLabel="Громкость"
          />
        ) : (
          volumeControl
        )}
      </div>
    </div>
  )
}
