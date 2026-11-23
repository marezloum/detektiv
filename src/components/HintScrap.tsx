interface HintScrapProps {
  text: string
  onDismiss: () => void
  className?: string
}

export function HintScrap({ text, onDismiss, className = '' }: HintScrapProps) {
  return (
    <div
      className={['hint-scrap-backdrop', className].filter(Boolean).join(' ')}
      role="presentation"
      onClick={onDismiss}
    >
      <div
        className="hint-scrap"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hint-scrap-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="hint-scrap-label" id="hint-scrap-title">
          Подсказка
        </p>
        <p className="hint-scrap-text">{text}</p>
        <button type="button" className="hint-scrap-dismiss" onClick={onDismiss}>
          Понятно
        </button>
      </div>
    </div>
  )
}
