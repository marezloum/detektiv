export interface SiteRoomNavItem {
  id: string
  shortLabel: string
}

interface SiteRoomNavProps<T extends string> {
  rooms: SiteRoomNavItem[]
  currentId: T
  onSelect: (id: T) => void
  talkableIds: Set<T>
  ariaLabel: string
}

export function SiteRoomNav<T extends string>({
  rooms,
  currentId,
  onSelect,
  talkableIds,
  ariaLabel,
}: SiteRoomNavProps<T>) {
  return (
    <nav className="gallery-hall-nav" aria-label={ariaLabel}>
      <div className="gallery-hall-nav__list" role="list">
        {rooms.map((room) => {
          const isActive = room.id === currentId
          const hasTalk = talkableIds.has(room.id as T)
          return (
            <button
              key={room.id}
              type="button"
              role="listitem"
              className={[
                'gallery-hall-nav__btn',
                isActive ? 'is-active' : '',
                hasTalk ? 'has-talk' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isActive ? 'location' : undefined}
              aria-label={
                hasTalk ? `${room.shortLabel}, здесь можно поговорить` : room.shortLabel
              }
              onClick={() => onSelect(room.id as T)}
            >
              <span className="gallery-hall-nav__short">{room.shortLabel}</span>
              {hasTalk && <span className="gallery-hall-nav__dot" aria-hidden />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
