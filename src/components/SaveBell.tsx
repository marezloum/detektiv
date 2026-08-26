/** Компактный колокольчик «только что сохранено» — без текста */
export function SaveBell() {
  return (
    <span className="save-bell" aria-label="Сохранено" role="status">
      <svg className="save-bell__icon" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M12 22a2.2 2.2 0 0 0 2.2-2.2h-4.4A2.2 2.2 0 0 0 12 22Zm6.6-6.2V10.6a6.6 6.6 0 1 0-13.2 0v5.2L3.5 17.7v1.1h17v-1.1l-1.9-1.9Z"
        />
      </svg>
    </span>
  )
}
