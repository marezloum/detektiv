export interface GameAd {
  id: string
  title: string
  text: string
  cta: string
  href: string
  tone: 'gold' | 'blue' | 'wine' | 'green'
}

export const GAME_ADS: GameAd[] = [
  {
    id: 'night-shift',
    title: 'Кофейня «Ночная смена»',
    text: 'Эспрессо до рассвета — для тех, кто не спит',
    cta: 'Зайти',
    href: 'https://example.com/night-shift',
    tone: 'gold',
  },
  {
    id: 'black-exit',
    title: 'Такси «Чёрный ход»',
    text: 'По Москве без лишних вопросов',
    cta: 'Вызвать',
    href: 'https://example.com/black-exit',
    tone: 'blue',
  },
  {
    id: 'clue-books',
    title: 'Книжная «Улика»',
    text: 'Редкие тома, архивы и старые карты',
    cta: 'Смотреть',
    href: 'https://example.com/clue-books',
    tone: 'wine',
  },
  {
    id: 'metropol',
    title: 'Отель «Метрополь»',
    text: 'Тихий номер в центре города',
    cta: 'Номера',
    href: 'https://example.com/metropol',
    tone: 'green',
  },
]
