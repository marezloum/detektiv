import type { ReactNode } from 'react'
import { BackButton } from './BackButton'

interface ScreenTopBarProps {
  onBack: () => void
  backLabel?: string
  /** Правая кнопка — обычно «На карту» */
  onMap?: () => void
  mapLabel?: string
  children?: ReactNode
}

export function ScreenTopBar({
  onBack,
  backLabel,
  onMap,
  mapLabel = 'На карту',
  children,
}: ScreenTopBarProps) {
  return (
    <div className="screen-top-bar">
      <BackButton onClick={onBack} label={backLabel} />
      {children}
      {onMap ? (
        <button type="button" className="map-nav-btn" onClick={onMap} aria-label={mapLabel}>
          {mapLabel} →
        </button>
      ) : (
        <span className="screen-top-bar__spacer" aria-hidden />
      )}
    </div>
  )
}

interface OverlayPanelHeaderProps {
  title: string
  onBack: () => void
}

export function OverlayPanelHeader({ title, onBack }: OverlayPanelHeaderProps) {
  return (
    <div className="panel-header">
      <BackButton onClick={onBack} />
      <h3>{title}</h3>
      <span className="panel-header-spacer" aria-hidden />
    </div>
  )
}
