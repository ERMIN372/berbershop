import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarClock, CalendarX2, Clock, Crown, Gift, LogOut, MapPin, Phone, RotateCcw, Sparkles, Star } from 'lucide-react'
import { brand, demoClient, masterById, serviceById, visitHistory } from '../data/mock'
import { dayMonth, duration, fromISO, fullDate, greeting, plural, rub, slotPassed, today, weekday } from '../lib/format'
import { useStore, type Booking } from '../lib/store'
import Avatar from '../components/Avatar'
import { Calendar, SlotGrid } from '../components/Scheduler'
import { Modal } from '../components/ui'

function daysUntil(iso: string): string {
  const diff = Math.round((fromISO(iso).getTime() - today().getTime()) / 86400000)
  if (diff === 0) return 'сегодня'
  if (diff === 1) return 'завтра'
  return `через ${diff} ${plural(diff, 'день', 'дня', 'дней')}`
}

export default function Account() {
  const { user, bookings, logout, cancelBooking, rescheduleBooking, toast } = useStore()
  const navigate = useNavigate()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const [newDate, setNewDate] = useState<string | null>(null)
  const [newTime, setNewTime] = useState<string | null>(null)

  if (!user) return <Navigate to="/login" replace state={{ from: '/account' }} />

  const upcoming = bookings
    .filter((b) => b.status === 'active' && !slotPassed(b.date, b.time))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const next = upcoming[0]

  const openMove = () => {
    setNewDate(null)
    setNewTime(null)
    setMoveOpen(true)
  }

  const confirmMove = () => {
    if (!next || !newDate || !newTime) return
    rescheduleBooking(next.id, newDate, newTime)
    setMoveOpen(false)
    toast(`Запись перенесена на ${dayMonth(newDate)}, ${newTime}`)
  }

  const confirmCancel = () => {
    if (!next) return
    cancelBooking(next.id)
    setCancelOpen(false)
    toast('Запись отменена. Будем рады видеть вас снова')
  }

  const totalSpent = visitHistory.reduce((s, v) => s + v.price, 0)

  return (
    <section className="relative pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="pointer-events-none absolute -top-40 left-1/3 -z-10 h-[700px] w-[900px] rounded-full bg-[radial-gradient(circle,rgba(201,162,90,0.09),transparent_60%)]" />
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow">Личный кабинет</span>
            <h1 className="h-display mt-6 text-5xl sm:text-7xl lg:text-8xl">
              {greeting()}, <span className="italic text-brass">{user.name}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 px-5 py-3 text-sm text-ash">
              <span className="tabular-nums text-bone">{user.phone}</span>
            </div>
            <button
              onClick={() => { logout(); toast('Вы вышли из аккаунта'); navigate('/') }}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-ash transition hover:border-red-400/50 hover:text-red-300"
              aria-label="Выйти"
              title="Выйти"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* ближайшая запись */}
          <div className="lg:col-span-8">
            {next ? (
              <UpcomingCard booking={next} onMove={openMove} onCancel={() => setCancelOpen(true)} />
            ) : (
              <div className="card grain flex h-full flex-col items-start justify-center gap-6 p-10 sm:p-14">
                <span className="grid h-16 w-16 place-items-center rounded-2xl border border-brass/30 bg-brass/10 text-brass"><CalendarClock size={26} /></span>
                <div>
                  <h2 className="h-display text-5xl">Записей пока нет</h2>
                  <p className="mt-3 max-w-md text-ash">Самое время освежить стрижку. Последний визит был {dayMonth(visitHistory[0].date)}.</p>
                </div>
                <Link to="/booking" className="btn-gold px-8">Записаться <ArrowRight size={16} /></Link>
              </div>
            )}
          </div>

          {/* бонусы */}
          <div className="lg:col-span-4">
            <BonusCard />
          </div>

          {/* история */}
          <div className="card p-6 sm:p-10 lg:col-span-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-4xl font-semibold">История посещений</h2>
                <p className="mt-1 text-sm text-ash">{visitHistory.length} визитов за полгода · {rub(totalSpent)}</p>
              </div>
            </div>
            <ul className="divide-y divide-white/[0.06]">
              {visitHistory.map((v) => {
                const s = serviceById(v.serviceId)!
                const m = masterById(v.masterId)!
                return (
                  <li key={v.id} className="group flex flex-wrap items-center gap-x-6 gap-y-3 py-5 sm:flex-nowrap">
                    <div className="w-16 shrink-0 text-center">
                      <div className="font-display text-3xl font-semibold leading-none">{v.date.slice(8)}</div>
                      <div className="mt-1 text-xs text-dust">{dayMonth(v.date).split(' ')[1].slice(0, 3)}</div>
                    </div>
                    <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg">
                      <Avatar look={m.look} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-sm text-ash">{m.name} · {v.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold tabular-nums">{rub(v.price)}</div>
                      <div className="text-xs text-brass">+{v.points} баллов</div>
                    </div>
                    <Link
                      to={`/booking?service=${v.serviceId}&master=${v.masterId}`}
                      className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-ash transition hover:border-brass/60 hover:text-brass-light"
                    >
                      <RotateCcw size={13} /> Повторить
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* любимый мастер */}
          <FavoriteCard />
        </div>
      </div>

      {/* перенос */}
      <Modal open={moveOpen} onClose={() => setMoveOpen(false)} title="Перенести запись" wide>
        {next && (
          <>
            <p className="-mt-4 mb-8 text-ash">
              Сейчас: <span className="text-bone">{fullDate(next.date)}, {next.time}</span> · {masterById(next.masterId)?.name}
            </p>
            <div className="grid gap-10 md:grid-cols-2">
              <Calendar value={newDate} onChange={(d) => { setNewDate(d); setNewTime(null) }} />
              <SlotGrid date={newDate} masterId={next.masterId} value={newTime} onChange={setNewTime} />
            </div>
            <div className="mt-10 flex flex-wrap justify-end gap-3 border-t border-white/[0.06] pt-6">
              <button onClick={() => setMoveOpen(false)} className="btn-quiet">Оставить как есть</button>
              <button onClick={confirmMove} disabled={!newDate || !newTime} className="btn-gold px-8">
                Перенести{newDate && newTime ? ` на ${dayMonth(newDate)}, ${newTime}` : ''}
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* отмена */}
      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Отменить запись?">
        {next && (
          <>
            <p className="text-ash">
              {serviceById(next.serviceId)?.name} у мастера {masterById(next.masterId)?.name.split(' ')[0]} — {fullDate(next.date)}, {next.time}.
              Слот сразу станет доступен другим гостям.
            </p>
            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-ink/50 p-4 text-sm text-ash">
              Может, удобнее <button onClick={() => { setCancelOpen(false); openMove() }} className="text-brass underline-offset-4 hover:underline">перенести</button>? Это бесплатно.
            </div>
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button onClick={() => setCancelOpen(false)} className="btn-ghost">Не отменять</button>
              <button onClick={confirmCancel} className="btn border border-red-400/40 bg-red-500/10 text-red-200 hover:bg-red-500/20">
                Да, отменить
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}

function UpcomingCard({ booking, onMove, onCancel }: { booking: Booking; onMove: () => void; onCancel: () => void }) {
  const s = serviceById(booking.serviceId)!
  const m = masterById(booking.masterId)!
  return (
    <div className="card grain relative h-full overflow-hidden p-0">
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brass/10 blur-3xl" />
      <div className="grid h-full md:grid-cols-[1fr_260px]">
        <div className="flex flex-col p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-brass/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass" /> Ближайшая запись
            </span>
            <span className="text-sm text-ash">{daysUntil(booking.date)}</span>
          </div>

          <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
            <div className="flex items-end gap-4">
              <div className="font-display text-8xl font-semibold leading-[0.8] sm:text-9xl">{booking.date.slice(8)}</div>
              <div className="pb-1">
                <div className="text-xl font-semibold">{dayMonth(booking.date).split(' ')[1]}</div>
                <div className="text-ash first-letter:uppercase">{weekday(booking.date)}</div>
              </div>
            </div>
            <div className="h-16 w-px bg-white/10" />
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-dust">Начало</div>
              <div className="font-display text-6xl font-semibold leading-none text-gold tabular-nums">{booking.time}</div>
            </div>
          </div>

          <dl className="mt-10 grid gap-5 border-t border-white/[0.06] pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-dust">Услуга</dt>
              <dd className="mt-1.5 font-semibold">{s.name}</dd>
              <dd className="mt-0.5 flex items-center gap-1.5 text-sm text-ash"><Clock size={12} /> {duration(s.duration)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-dust">Стоимость</dt>
              <dd className="mt-1.5 font-semibold">{rub(s.price)}</dd>
              <dd className="mt-0.5 text-sm text-brass">+{Math.round(s.price * 0.05)} баллов</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-dust">Адрес</dt>
              <dd className="mt-1.5 font-semibold">{brand.address}</dd>
              <dd className="mt-0.5 flex items-center gap-1.5 text-sm text-ash"><MapPin size={12} /> {brand.metro.split(',')[0]}</dd>
            </div>
          </dl>

          <div className="mt-auto flex flex-wrap gap-3 pt-10">
            <button onClick={onMove} className="btn-gold px-7">
              <CalendarClock size={16} /> Перенести
            </button>
            <button onClick={onCancel} className="btn-ghost px-7 hover:border-red-400/50 hover:text-red-300">
              <CalendarX2 size={16} /> Отменить
            </button>
            <a href={brand.phoneHref} className="btn-quiet"><Phone size={15} /> Позвонить</a>
          </div>
        </div>

        <div className="hidden flex-col border-l border-white/[0.06] bg-ink/40 md:flex">
          <div className="relative aspect-[5/6]">
            <Avatar look={m.look} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0f0e0d] to-transparent" />
          </div>
          <div className="flex flex-1 flex-col justify-end p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-brass">Ваш мастер</div>
            <div className="mt-1 font-display text-3xl font-semibold">{m.name}</div>
            <div className="mt-1 text-sm text-ash">{m.role} · {m.experience} лет</div>
            <div className="mt-3 flex items-center gap-2 text-sm"><Star size={13} className="fill-brass text-brass" /> {m.rating.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BonusCard() {
  const points = demoClient.points
  const tiers = demoClient.tiers
  const nextTier = tiers.find((t) => t.points > points) ?? tiers[tiers.length - 1]
  const current = [...tiers].reverse().find((t) => t.points <= points)!
  const pct = Math.min(100, (points / nextTier.points) * 100)
  const left = nextTier.points - points

  return (
    <div className="grain relative flex h-full flex-col overflow-hidden rounded-3xl border border-brass/30 bg-gradient-to-br from-[#2d2518] via-[#1d1a15] to-graphite p-8 shadow-card sm:p-10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border border-brass/20" />
      <div className="pointer-events-none absolute -right-2 -top-2 h-32 w-32 rounded-full border border-brass/10" />
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-brass/15 text-brass"><Gift size={22} /></span>
        <span className="flex items-center gap-1.5 rounded-full border border-brass/30 px-3 py-1 text-xs font-semibold text-brass-light">
          <Crown size={12} /> {current.label}
        </span>
      </div>
      <div className="mt-8 text-xs uppercase tracking-[0.2em] text-dust">Бонусные баллы</div>
      <div className="mt-2 font-display text-7xl font-semibold leading-none text-gold tabular-nums">{points}</div>

      <div className="mt-10">
        <div className="mb-3 flex justify-between text-sm">
          <span className="text-ash">До скидки {nextTier.discount}%</span>
          <span className="font-semibold tabular-nums">{points} / {nextTier.points}</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-ink/70 ring-1 ring-white/5">
          <div className="h-full rounded-full bg-gradient-to-r from-brass-dark via-brass to-brass-light shadow-glow transition-all duration-1000" style={{ width: `${pct}%` }} />
          <span className="absolute inset-y-0 left-1/2 w-px bg-ink/80" />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-dust">
          <span>0</span>
          <span>500 · 5%</span>
          <span>1000 · 10%</span>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-2xl bg-ink/50 p-4 text-sm">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-brass" />
        <span className="text-ash">
          Ещё <span className="font-semibold text-bone">{left} {plural(left, 'балл', 'балла', 'баллов')}</span> — и скидка {nextTier.discount}% на все услуги навсегда. Это примерно два визита.
        </span>
      </div>
      <div className="mt-auto pt-6 text-xs text-dust">1 балл = 1 ₽ · списывайте до 30% стоимости визита</div>
    </div>
  )
}

function FavoriteCard() {
  const m = masterById('mark')!
  const since = fromISO(demoClient.memberSince)
  return (
    <div className="flex flex-col gap-6 lg:col-span-4">
      <div className="card overflow-hidden p-0">
        <div className="flex items-center gap-5 p-6">
          <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl">
            <Avatar look={m.look} className="h-full w-full" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-dust">Любимый мастер</div>
            <div className="mt-1 font-display text-2xl font-semibold">{m.name}</div>
            <div className="text-sm text-ash">3 из 6 последних визитов</div>
          </div>
        </div>
        <Link to={`/booking?master=${m.id}`} className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4 text-sm font-semibold text-brass transition hover:bg-brass/[0.06]">
          Записаться к Марку <ArrowRight size={16} />
        </Link>
      </div>
      <div className="card grid grid-cols-2 divide-x divide-white/[0.06] p-0">
        <div className="p-6">
          <div className="font-display text-5xl font-semibold">14</div>
          <div className="mt-1 text-sm text-ash">визитов всего</div>
        </div>
        <div className="p-6">
          <div className="font-display text-5xl font-semibold">{today().getFullYear() - since.getFullYear()}</div>
          <div className="mt-1 text-sm text-ash">{plural(today().getFullYear() - since.getFullYear(), 'год', 'года', 'лет')} в клубе</div>
        </div>
      </div>
      <div className="card p-6 text-sm text-ash">
        <div className="mb-2 font-semibold text-bone">Заметка мастера</div>
        «Сверху оставляем 5 см, виски на тройку с переходом. Бороду — чуть короче по скулам.»
      </div>
    </div>
  )
}
