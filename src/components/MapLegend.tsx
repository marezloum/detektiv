import { useId, useState } from 'react'
import type { LocationId } from '../types/game'

export interface MapLegendItem {
  id: LocationId
  mapCode: string
  label: string
  realName: string
  district: string
  unlocked: boolean
  visited: boolean
}

interface MapLegendProps {
  items: MapLegendItem[]
  onTravel: (id: LocationId) => void
  onLockedSelect?: (id: LocationId) => void
}

export function MapLegend({ items, onTravel, onLockedSelect }: MapLegendProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="map-legend">
      <button
        type="button"
        className={`map-zoom-btn map-legend-toggle${open ? ' active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Закрыть легенду карты' : 'Открыть легенду карты'}
        title="Легенда"
      >
        ?
      </button>

      {open && (
        <div
          id={panelId}
          className="map-legend-panel"
          role="dialog"
          aria-label="Легенда карты"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <header className="map-legend-header">
            <h3>Легенда</h3>
            <button
              type="button"
              className="map-legend-close"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
          </header>

          <ul className="map-legend-list">
            {items.map((item) => {
              const rowClass = [
                'map-legend-row',
                item.unlocked ? 'unlocked' : 'locked',
                item.visited ? 'visited' : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={rowClass}
                    onClick={() => {
                      if (item.unlocked) {
                        onTravel(item.id)
                        setOpen(false)
                        return
                      }
                      onLockedSelect?.(item.id)
                    }}
                    title={
                      item.unlocked
                        ? `Открыть: ${item.realName}`
                        : 'Ещё закрыто — нажмите, чтобы узнать почему'
                    }
                  >
                    <span className="map-legend-code" aria-hidden>
                      {item.mapCode}
                    </span>
                    <span className="map-legend-text">
                      <strong>{item.label}</strong>
                      <span className="map-legend-address">{item.realName}</span>
                      <span className="map-legend-district">{item.district}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
