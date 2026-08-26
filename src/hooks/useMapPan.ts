import { useCallback, useEffect, useRef, useState } from 'react'

interface Pan {
  x: number
  y: number
}

const MIN_ZOOM = 0.65
const MAX_ZOOM = 3.5
const ZOOM_STEP = 0.2
const DRAG_THRESHOLD_PX = 6

function clampPan(
  pan: Pan,
  viewportW: number,
  viewportH: number,
  layerW: number,
  layerH: number,
  scale: number,
): Pan {
  const scaledW = layerW * scale
  const scaledH = layerH * scale
  const minX = Math.min(0, viewportW - scaledW)
  const maxX = Math.max(0, viewportW - scaledW)
  const minY = Math.min(0, viewportH - scaledH)
  const maxY = Math.max(0, viewportH - scaledH)

  return {
    x: Math.max(minX, Math.min(maxX, pan.x)),
    y: Math.max(minY, Math.min(maxY, pan.y)),
  }
}

export function useMapPan() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [dragging, setDragging] = useState(false)

  const dragOrigin = useRef<{ px: number; py: number; panX: number; panY: number } | null>(null)
  const dragMoved = useRef(false)
  const panRef = useRef(pan)
  const zoomRef = useRef(zoom)

  panRef.current = pan
  zoomRef.current = zoom

  const applyTransform = useCallback((nextPan: Pan, nextZoom: number) => {
    const vp = viewportRef.current
    const layer = layerRef.current
    if (!vp || !layer) {
      setPan(nextPan)
      setZoom(nextZoom)
      return
    }
    const clamped = clampPan(
      nextPan,
      vp.clientWidth,
      vp.clientHeight,
      layer.offsetWidth,
      layer.offsetHeight,
      nextZoom,
    )
    setPan(clamped)
    setZoom(nextZoom)
  }, [])

  const centerMap = useCallback(
    (scale = zoomRef.current) => {
      const vp = viewportRef.current
      const layer = layerRef.current
      if (!vp || !layer) return
      applyTransform(
        {
          x: (vp.clientWidth - layer.offsetWidth * scale) / 2,
          y: (vp.clientHeight - layer.offsetHeight * scale) / 2,
        },
        scale,
      )
    },
    [applyTransform],
  )

  const zoomAtPoint = useCallback(
    (nextZoom: number, clientX: number, clientY: number) => {
      const vp = viewportRef.current
      if (!vp) return
      const rect = vp.getBoundingClientRect()
      const mx = clientX - rect.left
      const my = clientY - rect.top
      const currentZoom = zoomRef.current
      const currentPan = panRef.current
      const ratio = nextZoom / currentZoom

      applyTransform(
        {
          x: mx - (mx - currentPan.x) * ratio,
          y: my - (my - currentPan.y) * ratio,
        },
        nextZoom,
      )
    },
    [applyTransform],
  )

  const zoomIn = useCallback(() => {
    const vp = viewportRef.current
    if (!vp) return
    const rect = vp.getBoundingClientRect()
    const next = Math.min(MAX_ZOOM, zoomRef.current + ZOOM_STEP)
    if (next === zoomRef.current) return
    zoomAtPoint(next, rect.left + rect.width / 2, rect.top + rect.height / 2)
  }, [zoomAtPoint])

  const zoomOut = useCallback(() => {
    const vp = viewportRef.current
    if (!vp) return
    const rect = vp.getBoundingClientRect()
    const next = Math.max(MIN_ZOOM, zoomRef.current - ZOOM_STEP)
    if (next === zoomRef.current) return
    zoomAtPoint(next, rect.left + rect.width / 2, rect.top + rect.height / 2)
  }, [zoomAtPoint])

  const resetView = useCallback(() => {
    centerMap(1)
  }, [centerMap])

  const panBy = useCallback(
    (dx: number, dy: number) => {
      const current = panRef.current
      applyTransform({ x: current.x + dx, y: current.y + dy }, zoomRef.current)
    },
    [applyTransform],
  )

  useEffect(() => {
    centerMap(1)
    const vp = viewportRef.current
    if (!vp) return

    const ro = new ResizeObserver(() => {
      applyTransform(panRef.current, zoomRef.current)
    })
    ro.observe(vp)

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const factor = Math.exp(-e.deltaY * 0.0015)
      const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomRef.current * factor))
      if (Math.abs(next - zoomRef.current) < 0.001) return
      zoomAtPoint(next, e.clientX, e.clientY)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 80 : 40
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          panBy(step, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          panBy(-step, 0)
          break
        case 'ArrowUp':
          e.preventDefault()
          panBy(0, step)
          break
        case 'ArrowDown':
          e.preventDefault()
          panBy(0, -step)
          break
        case '+':
        case '=':
          e.preventDefault()
          zoomIn()
          break
        case '-':
          e.preventDefault()
          zoomOut()
          break
        case '0':
          e.preventDefault()
          resetView()
          break
        default:
          break
      }
    }

    vp.addEventListener('wheel', onWheel, { passive: false })
    vp.addEventListener('keydown', onKeyDown)
    return () => {
      ro.disconnect()
      vp.removeEventListener('wheel', onWheel)
      vp.removeEventListener('keydown', onKeyDown)
    }
  }, [centerMap, applyTransform, zoomAtPoint, panBy, zoomIn, zoomOut, resetView])

  const canStartDrag = (target: HTMLElement, button: number) => {
    if (target.closest('.map-zoom-controls') || target.closest('.map-pan-controls')) return false
    if (target.closest('.map-legend') || target.closest('.map-legend-panel')) return false
    if (target.closest('.map-marker-html')) return false
    return button === 0 || button === 1 || button === 2
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!canStartDrag(e.target as HTMLElement, e.button)) return

    dragOrigin.current = {
      px: e.clientX,
      py: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    }
    dragMoved.current = false
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !dragOrigin.current) return
    const dx = e.clientX - dragOrigin.current.px
    const dy = e.clientY - dragOrigin.current.py

    if (!dragMoved.current && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return

    dragMoved.current = true
    applyTransform(
      {
        x: dragOrigin.current.panX + dx,
        y: dragOrigin.current.panY + dy,
      },
      zoomRef.current,
    )
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return
    setDragging(false)
    dragOrigin.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return {
    viewportRef,
    layerRef,
    pan,
    zoom,
    dragging,
    zoomIn,
    zoomOut,
    resetView,
    panBy,
    canZoomIn: zoom < MAX_ZOOM - 0.01,
    canZoomOut: zoom > MIN_ZOOM + 0.01,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave: onPointerUp,
  }
}
