import { useEffect, useState } from 'react'
import type { SceneId } from '../assets/scenes'
import { sceneFallbackStyle, sceneImageUrl } from '../assets/scenes'

interface SceneBackgroundProps {
  sceneId: SceneId
  className?: string
}

export function SceneBackground({ sceneId, className = '' }: SceneBackgroundProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setFailed(false)
  }, [sceneId])

  const showImage = !failed

  return (
    <div className={`scene-background ${className}`.trim()} style={sceneFallbackStyle(sceneId)}>
      {showImage && (
        <img
          key={sceneId}
          className={`scene-background__img ${loaded ? 'is-loaded' : ''}`}
          src={sceneImageUrl(sceneId)}
          alt=""
          aria-hidden
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
