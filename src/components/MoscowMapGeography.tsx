/** Упрощённая географическая подложка Москвы: река, парки, центр */
export function MoscowMapGeography() {
  return (
    <g className="map-geography" aria-hidden>
      {/* Зелёные зоны — парки */}
      <ellipse className="map-park" cx="88" cy="44" rx="9" ry="7" />
      <ellipse className="map-park map-park-sm" cx="72" cy="58" rx="4" ry="3" />

      {/* Москва-река */}
      <path
        className="map-river"
        d="M 18 52
           C 28 48, 35 55, 42 52
           C 50 49, 58 58, 68 54
           C 78 50, 85 46, 95 48"
      />
      <path
        className="map-river map-river-branch"
        d="M 42 52 C 46 46, 52 44, 58 48"
      />

      {/* Условная Садовое кольцо */}
      <ellipse className="map-ring" cx="76" cy="54" rx="14" ry="11" />

      {/* Центр — Кремль */}
      <rect className="map-kremlin" x="73.5" y="54.5" width="4" height="3.5" rx="0.3" />

      {/* Север — аэропорт (подпись района) */}
      <text className="map-geo-label" x="12" y="8">
        Моск. обл.
      </text>
      <text className="map-geo-label" x="74" y="66">
        ЦАО
      </text>
    </g>
  )
}
