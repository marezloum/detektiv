"""Generate male Russian narrator MP3s via edge-tts (ru-RU-DmitryNeural)."""

from __future__ import annotations

import asyncio
from pathlib import Path

import edge_tts

VOICE = "ru-RU-DmitryNeural"
OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "audio" / "male"

# filename -> text
CLIPS: dict[str, str] = {
    # Narrator — forensic
    "narrator-morgue-intro.mp3": (
        "Холодный морг. Белая простыня на смотровом столе. "
        "Доктор Морозова ждёт вас у двери."
    ),
    "narrator-morgue-items.mp3": (
        "На столе: телефон, визитка, сложенная записка, три открытки с репродукциями картин "
        "Третьяковской галереи и билет в театр."
    ),
    # Narrator — gallery
    "narrator-gallery-intro.mp3": (
        "Лаврушинский переулок, 10. Государственная Третьяковская галерея. "
        "Директор Анна Сергеевна Захарова принимает вас в кабинете."
    ),
    "narrator-marina-room.mp3": "Соседний кабинет. Марина Козлова поднимается из-за стола.",
    "narrator-petr-room.mp3": "Кабинет искусствоведов. Пётр Сергеев листает каталог.",
    "narrator-dmitry-room.mp3": "Коридор охраны. Дмитрий Орлов проверяет рацию.",
    "narrator-gallery-done.mp3": (
        "Опросы в галерее закончены. Пора вернуться в кабинет следователя — "
        "директор позвонит на городской телефон и надиктует номера."
    ),
    "narrator-day2-intro.mp3": (
        "Второй день. У входа в галерею — полиция и сотрудники в шоке. "
        "Анна Сергеевна Захарова бледна."
    ),
    "narrator-day2-outro.mp3": (
        "Вы собрали ключевые улики. Связь между картиной, специалистом и иностранным покупателем "
        "становится яснее — но кто стоит за двумя смертями? Это следующая глава дела..."
    ),
    # Male NPCs
    "npc-petr-1.mp3": (
        "Пётр Сергеев, искусствовед. Специализируюсь на портретах XIX века — "
        "в том числе «Неизвестная» Крамского. Погибшего не знаю."
    ),
    "npc-petr-2.mp3": (
        "Да, дежурил в зале 20. Готовил экспертное заключение для иностранного покупателя. "
        "Телефон не дам — обратитесь к директору."
    ),
    "npc-dmitry-1.mp3": (
        "Дмитрий Орлов, служба безопасности залов. 23 марта патрулировал коридоры. "
        "Мужчину из вашего дела не видел."
    ),
    "npc-dmitry-2.mp3": "Только через директора. Таков порядок.",
    # Player (detective) — male voice
    "player-morgue-id.mp3": "Доктор, вы уже идентифицировали погибшего?",
    "player-morgue-bag.mp3": "Заберу всё в рюкзак. Осмотрю позже в кабинете.",
    "player-gallery-body.mp3": (
        "Анна Сергеевна, мы нашли тело арт-дилера Александра Волкова. "
        "При нём были открытки ваших картин и записка о встрече здесь, 23 марта в 18:00."
    ),
    "player-gallery-staff.mp3": "Кто из ваших сотрудников был на смене в это время?",
    "player-marina-phone.mp3": "Можете назвать ваш телефон для протокола?",
    "player-petr-shift.mp3": "Вы были в галерее 23 марта в 18:00?",
    "player-dmitry-phone.mp3": "Номер телефона?",
    "player-day2-link.mp3": (
        "Его номер был в списке вчерашних звонков Волкова. "
        "И в записке — встреча у «Неизвестной», зал 20."
    ),
}


async def generate_one(name: str, text: str) -> None:
    path = OUT_DIR / name
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(str(path))
    print(f"OK  {path.name}  ({len(text)} chars)")


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, text in CLIPS.items():
        await generate_one(name, text)
    print(f"\nDone: {len(CLIPS)} clips → {OUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
