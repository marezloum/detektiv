import { useMemo } from 'react'
import { useGameContext } from '../context/GameContext'
import { SceneBackground } from './SceneBackground'
import { OverlayPanelHeader } from './ScreenTopBar'
import { MoscowMapGeography } from './MoscowMapGeography'
import { MapMarkersOverlay, useMarkerScreenPositions } from './MapMarkersOverlay'
import { MapLegend } from './MapLegend'
import { useMapPan } from '../hooks/useMapPan'

export function MapPanel() {
  const {
    mapPoints,
    travelTo,
    goBack,
    state,
    showMapLockedHint,
    dismissHint,
  } = useGameContext()
  const {
    viewportRef,
    layerRef,
    pan,
    zoom,
    dragging,
    zoomIn,
    zoomOut,
    resetView,
    panBy,
    canZoomIn,
    canZoomOut,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
  } = useMapPan()

  const markerPositions = useMarkerScreenPositions(
    mapPoints,
    pan,
    zoom,
    layerRef,
    state.currentLocationId,
  )

  const legendItems = useMemo(
    () =>
      mapPoints.map((p) => ({
        id: p.id,
        mapCode: p.mapCode,
        label: p.label,
        realName: p.realName,
        district: p.district,
        unlocked: p.unlocked,
        visited: p.visited,
      })),
    [mapPoints],
  )

  const forensicOpen =
    mapPoints.some((p) => p.id === 'forensic' && p.unlocked && !p.visited)

  return (
    <div className="overlay-panel map-panel">
      <OverlayPanelHeader title="Карта Москвы" onBack={goBack} />

      {forensicOpen && (
        <p className="map-mission-banner" role="status">
          Следующая точка: <strong>А2 — Морг</strong>. Нажмите красный пин на карте.
        </p>
      )}

      <div
        ref={viewportRef}
        className={`map-viewport${dragging ? ' map-viewport--dragging' : ''}`}
        tabIndex={0}
        role="application"
        aria-label="Интерактивная карта Москвы"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        onPointerCancel={onPointerUp}
      >
        <div className="map-zoom-controls">
          <MapLegend
            items={legendItems}
            onTravel={travelTo}
            onLockedSelect={showMapLockedHint}
          />
          <button type="button" className="map-zoom-btn" onClick={zoomIn} disabled={!canZoomIn} aria-label="Увеличить">
            +
          </button>
          <button type="button" className="map-zoom-btn" onClick={zoomOut} disabled={!canZoomOut} aria-label="Уменьшить">
            −
          </button>
          <button type="button" className="map-zoom-btn map-zoom-reset" onClick={resetView} aria-label="Сбросить масштаб">
            ⟲
          </button>
        </div>

        <div className="map-pan-controls" aria-hidden>
          <button type="button" className="map-pan-btn" onClick={() => panBy(0, 48)} title="Вверх">
            ↑
          </button>
          <div className="map-pan-controls-row">
            <button type="button" className="map-pan-btn" onClick={() => panBy(48, 0)} title="Влево">
              ←
            </button>
            <button type="button" className="map-pan-btn" onClick={() => panBy(-48, 0)} title="Вправо">
              →
            </button>
          </div>
          <button type="button" className="map-pan-btn" onClick={() => panBy(0, -48)} title="Вниз">
            ↓
          </button>
        </div>

        <div
          ref={layerRef}
          className="map-pan-layer"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          <SceneBackground sceneId="map" className="map-bg-pan" />
          <div className="map-overlay map-overlay--light" aria-hidden />

          <svg viewBox="0 0 100 70" className="map-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
            <MoscowMapGeography />
          </svg>
        </div>

        <MapMarkersOverlay
          markers={markerPositions}
          zoom={zoom}
          onTravel={(id) => travelTo(id)}
          onLockedSelect={showMapLockedHint}
        />
      </div>

      <p className="map-hint">
        {forensicOpen
          ? 'Нажмите красный пин А2 — откроется экран морга.'
          : 'Коды мест — в легенде (?). Серые пины ещё закрыты.'}
      </p>

      {state.showHint && state.currentHint && (
        <div className="hint-toast map-locked-toast">
          <p>{state.currentHint}</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={dismissHint}>
            Понятно
          </button>
        </div>
      )}
    </div>
  )
}
