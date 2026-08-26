import { useLayoutEffect, useState, type RefObject } from 'react'
import type { LocationId } from '../types/game'

export interface MapPointOnScreen {
  id: LocationId
  mapCode: string
  label: string
  realName: string
  district: string
  icon: string
  unlocked: boolean
  visited: boolean
  isCurrent: boolean
  left: number
  top: number
}

interface MapPointInput {
  id: LocationId
  mapCode: string
  label: string
  realName: string
  district: string
  icon: string
  x: number
  y: number
  unlocked: boolean
  visited: boolean
}

export function useMarkerScreenPositions(
  points: MapPointInput[],
  pan: { x: number; y: number },
  zoom: number,
  layerRef: RefObject<HTMLDivElement | null>,
  currentLocationId: LocationId | null,
): MapPointOnScreen[] {
  const [layerSize, setLayerSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const el = layerRef.current
    if (!el) return

    const updateSize = () => {
      const width = el.offsetWidth
      const height = el.offsetHeight
      setLayerSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      )
    }

    updateSize()
    const ro = new ResizeObserver(updateSize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [layerRef])

  if (!layerSize.width) return []

  return points.map((p) => ({
    id: p.id,
    mapCode: p.mapCode,
    label: p.label,
    realName: p.realName,
    district: p.district,
    icon: p.icon,
    unlocked: p.unlocked,
    visited: p.visited,
    isCurrent: currentLocationId === p.id,
    left: pan.x + (p.x / 100) * layerSize.width * zoom,
    top: pan.y + (p.y / 70) * layerSize.height * zoom,
  }))
}

interface MapMarkersOverlayProps {
  markers: MapPointOnScreen[]
  zoom: number
  onTravel: (id: LocationId) => void
  onLockedSelect?: (id: LocationId) => void
}

export function MapMarkersOverlay({
  markers,
  zoom,
  onTravel,
  onLockedSelect,
}: MapMarkersOverlayProps) {
  const showLabels = zoom <= 1.35

  return (
    <div className="map-markers-overlay">
      {markers.map((m) => {
        const stateClass = [
          'map-marker-html',
          m.unlocked ? 'unlocked' : 'locked',
          m.visited ? 'visited' : '',
          m.isCurrent ? 'current' : '',
          showLabels ? 'show-labels' : 'hide-labels',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={m.id}
            type="button"
            className={stateClass}
            style={{
              left: m.left,
              top: m.top,
              zIndex: m.unlocked && !m.visited ? 3 : m.unlocked ? 2 : 1,
            }}
            title={
              m.unlocked
                ? `${m.mapCode} — ${m.realName}\nНажмите, чтобы поехать`
                : `${m.mapCode} — ${m.realName}\nЕщё закрыто`
            }
            aria-label={
              m.unlocked
                ? `${m.mapCode}. ${m.label}. Нажмите, чтобы открыть`
                : `${m.mapCode}. ${m.label}. Закрыто`
            }
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              if (m.unlocked) onTravel(m.id)
              else onLockedSelect?.(m.id)
            }}
          >
            <span className="map-marker-html-pin" aria-hidden>
              <span className="map-marker-html-code">{m.mapCode}</span>
            </span>
            <span className="map-marker-html-label">{m.label}</span>
          </button>
        )
      })}
    </div>
  )
}
