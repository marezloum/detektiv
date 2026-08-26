interface BackButtonProps {
  onClick: () => void
  label?: string
}

export function BackButton({ onClick, label = 'Назад' }: BackButtonProps) {
  return (
    <button type="button" className="back-btn" onClick={onClick} aria-label={label}>
      ← {label}
    </button>
  )
}
