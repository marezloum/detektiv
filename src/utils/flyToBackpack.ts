const BACKPACK_SELECTOR = '[data-tool-target="backpack"]'
const FLY_MS = 620

export function flyToBackpack(source: HTMLElement | null): Promise<void> {
  if (!source || typeof document === 'undefined') return Promise.resolve()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return Promise.resolve()
  }

  const target = document.querySelector(BACKPACK_SELECTOR)
  if (!(target instanceof HTMLElement)) return Promise.resolve()

  const glyph = source.querySelector('.home-app__glyph, .home-app__icon')
  const fromEl = glyph instanceof HTMLElement ? glyph : source
  const from = fromEl.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  if (from.width < 2 || from.height < 2 || to.width < 2 || to.height < 2) {
    return Promise.resolve()
  }

  const ghost = fromEl.cloneNode(true) as HTMLElement
  ghost.classList.add('clue-fly-ghost')
  ghost.setAttribute('aria-hidden', 'true')
  ghost.style.position = 'fixed'
  ghost.style.left = `${from.left}px`
  ghost.style.top = `${from.top}px`
  ghost.style.width = `${from.width}px`
  ghost.style.height = `${from.height}px`
  ghost.style.margin = '0'
  ghost.style.zIndex = '120'
  ghost.style.pointerEvents = 'none'
  ghost.style.transformOrigin = 'center center'
  document.body.appendChild(ghost)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  target.classList.add('is-catching')

  const animation = ghost.animate(
    [
      {
        transform: 'translate(0, 0) scale(1) rotate(-2deg)',
        opacity: 1,
        offset: 0,
      },
      {
        transform: `translate(${dx * 0.45}px, ${dy * 0.35 - 36}px) scale(0.92) rotate(4deg)`,
        opacity: 1,
        offset: 0.45,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.22) rotate(-8deg)`,
        opacity: 0.15,
        offset: 1,
      },
    ],
    {
      duration: FLY_MS,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    },
  )

  return animation.finished
    .catch(() => undefined)
    .then(() => {
      ghost.remove()
      window.setTimeout(() => target.classList.remove('is-catching'), 280)
    })
}

export const BACKPACK_FLY_MS = FLY_MS
