import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Sun, Sunset, Moon } from 'lucide-react'
import { allSlots, busySlots, masters } from '../data/mock'
import { MONTHS, WEEKDAYS_SHORT, addDays, fromISO, fullDate, slotPassed, toISO, today } from '../lib/format'

const HORIZON = 45 // запись открыта на 45 дней вперёд

/** Свободные слоты. masterId === 'any' → слот свободен, если свободен хотя бы у одного мастера. */
export function freeSlots(date: string, masterId: string): { slot: string; free: boolean }[] {
  const ids = masterId === 'any' ? masters.map((m) => m.id) : [masterId]
  const busy = ids.map((id) => busySlots(date, id))
  const sunday = fromISO(date).getDay() === 0
  return allSlots()
    .filter((slot) => !sunday || slot <= '19:00') // в воскресенье последняя запись в 19:00
    .map((slot) => ({
    slot,
    free: !slotPassed(date, slot) && busy.some((set) => !set.has(slot)),
  }))
}

export function Calendar({ value, onChange }: { value: string | null; onChange: (iso: string) => void }) {
  const start = today()
  const end = addDays(start, HORIZON)
  const [cursor, setCursor] = useState(() => {
    const d = value ? fromISO(value) : start
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const cells = useMemo(() => {
    const first = new Date(cursor)
    const offset = (first.getDay() + 6) % 7 // понедельник — первый
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    const res: (Date | null)[] = Array(offset).fill(null)
    for (let d = 1; d <= daysInMonth; d++) res.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
    return res
  }, [cursor])

  const canPrev = cursor > new Date(start.getFullYear(), start.getMonth(), 1)
  const canNext = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) <= end
  const shift = (n: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="font-display text-3xl font-semibold">
          {MONTHS[cursor.getMonth()]} <span className="text-dust">{cursor.getFullYear()}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => shift(-1)} disabled={!canPrev} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ash transition enabled:hover:border-brass/60 enabled:hover:text-bone disabled:opacity-30" aria-label="Предыдущий месяц">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => shift(1)} disabled={!canNext} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ash transition enabled:hover:border-brass/60 enabled:hover:text-bone disabled:opacity-30" aria-label="Следующий месяц">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS_SHORT.map((w) => (
          <div key={w} className="pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-dust">{w}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />
          const iso = toISO(d)
          const disabled = d < start || d > end
          const selected = iso === value
          const isToday = iso === toISO(start)
          const weekend = d.getDay() === 0 || d.getDay() === 6
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              className={`relative aspect-square rounded-2xl text-[15px] font-medium transition-all duration-200 ${
                selected
                  ? 'bg-gradient-to-br from-brass-light to-brass-dark text-ink shadow-glow'
                  : disabled
                    ? 'text-smoke'
                    : `border border-white/[0.06] bg-white/[0.02] hover:border-brass/50 hover:bg-brass/10 ${weekend ? 'text-brass-light' : 'text-bone'}`
              }`}
            >
              {d.getDate()}
              {isToday && !selected && <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brass" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const GROUPS = [
  { label: 'Утро', icon: Sun, test: (h: number) => h < 13 },
  { label: 'День', icon: Sunset, test: (h: number) => h >= 13 && h < 18 },
  { label: 'Вечер', icon: Moon, test: (h: number) => h >= 18 },
]

export function SlotGrid({ date, masterId, value, onChange }: {
  date: string | null
  masterId: string
  value: string | null
  onChange: (slot: string) => void
}) {
  if (!date) {
    return (
      <div className="grid h-full min-h-64 place-items-center rounded-3xl border border-dashed border-white/10 p-8 text-center text-ash">
        Выберите дату в календаре — покажем свободное время
      </div>
    )
  }
  const slots = freeSlots(date, masterId)
  const freeCount = slots.filter((s) => s.free).length

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div className="font-display text-3xl font-semibold first-letter:uppercase">{fullDate(date)}</div>
        <div className="text-sm text-ash">
          {freeCount ? <>Свободно: <span className="text-brass-light">{freeCount}</span></> : 'Мест нет'}
        </div>
      </div>
      {freeCount === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-ash">
          На этот день всё расписано. Попробуйте другую дату или любого мастера.
        </div>
      ) : (
        <div className="space-y-6">
          {GROUPS.map((g) => {
            const items = slots.filter((s) => g.test(Number(s.slot.slice(0, 2))))
            if (!items.length) return null
            return (
              <div key={g.label}>
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-dust">
                  <g.icon size={14} /> {g.label}
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 xl:grid-cols-6">
                  {items.map(({ slot, free }) => {
                    const selected = slot === value
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!free}
                        onClick={() => onChange(slot)}
                        className={`rounded-xl py-3 text-sm font-semibold tabular-nums transition-all duration-200 ${
                          selected
                            ? 'bg-gradient-to-br from-brass-light to-brass-dark text-ink shadow-glow'
                            : free
                              ? 'border border-white/10 bg-white/[0.02] text-bone hover:-translate-y-0.5 hover:border-brass/60 hover:text-brass-light'
                              : 'border border-transparent bg-white/[0.02] text-smoke line-through decoration-smoke/60'
                        }`}
                        title={free ? 'Свободно' : 'Занято'}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
          <div className="flex items-center gap-5 pt-2 text-xs text-dust">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded border border-white/20" /> Свободно</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-white/[0.06]" /> Занято</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-brass" /> Выбрано</span>
          </div>
        </div>
      )}
    </div>
  )
}
