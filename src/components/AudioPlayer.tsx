import { useEffect, useId, useRef, useState } from 'react'
import { asset } from '../utils/asset'

function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface AudioPlayerProps {
  src: string
  label?: string
  compact?: boolean
}

export function AudioPlayer({ src, label = 'Прослушать', compact = false }: AudioPlayerProps) {
  const resolvedSrc = asset(src)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressId = useId()
  const volumeId = useId()

  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)

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
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = playbackRate
  }, [playbackRate])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

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

  const playIcon = playing ? '⏸' : started ? '▶' : '🔊'
  const playLabel = playing ? 'Пауза' : started ? 'Продолжить' : label

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
        <input
          id={volumeId}
          type="range"
          className="audio-player-range audio-player-volume"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Громкость"
          title="Громкость"
        />
        <select
          className="audio-player-rate"
          value={playbackRate}
          onChange={(e) => setPlaybackRate(Number(e.target.value))}
          aria-label="Скорость"
          title="Скорость"
        >
          <option value={0.75}>0.75×</option>
          <option value={1}>1×</option>
          <option value={1.25}>1.25×</option>
        </select>
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
      <div className="audio-player-settings">
        <label className="audio-player-setting">
          <span>Громкость</span>
          <input
            type="range"
            className="audio-player-range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </label>
        <label className="audio-player-setting">
          <span>Скорость</span>
          <select
            className="audio-player-rate"
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
          >
            <option value={0.75}>0.75×</option>
            <option value={1}>1×</option>
            <option value={1.25}>1.25×</option>
          </select>
        </label>
      </div>
    </div>
  )
}
