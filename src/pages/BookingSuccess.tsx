import { Link } from 'react-router-dom'
import { ArrowRight, CalendarPlus, Check, Clock, MapPin, UserRound } from 'lucide-react'
import { brand, masterById, masters, serviceById } from '../data/mock'
import { addDays, dayMonth, duration, rub, toISO, today, weekday } from '../lib/format'
import { useStore, type Booking } from '../lib/store'
import Avatar from '../components/Avatar'

/** Пример записи, если открыть страницу напрямую (например, для скриншота). */
const demoBooking = (): Booking => ({
  id: 'BK-DEMO42',
  serviceId: 'combo',
  masterId: masters[0].id,
  date: toISO(addDays(today(), 2)),
  time: '18:30',
  name: 'Артём',
  phone: '+7 (900) 123-45-67',
  status: 'active',
  createdAt: Date.now(),
})

/** Скачивание .ics — работает полностью на фронте. */
function downloadIcs(b: Booking) {
  const service = serviceById(b.serviceId)!
  const [h, m] = b.time.split(':').map(Number)
  const start = new Date(`${b.date}T00:00:00`)
  start.setHours(h, m)
  const end = new Date(start.getTime() + service.duration * 60000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Britva Demo//RU', 'BEGIN:VEVENT',
    `UID:${b.id}@britva-demo`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
    `SUMMARY:${service.name} — ${brand.name}`, `LOCATION:${brand.city}, ${brand.address}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'britva-zapis.ics'
  a.click()
  URL.revokeObjectURL(url)
}

export default function BookingSuccess() {
  const { bookings, lastBookingId, user } = useStore()
  const booking = bookings.find((b) => b.id === lastBookingId) ?? demoBooking()
  const service = serviceById(booking.serviceId)!
  const master = masterById(booking.masterId)!

  return (
    <section className="grain relative overflow-hidden pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[800px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,162,90,0.16),transparent_60%)]" />
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative mx-auto grid h-24 w-24 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-brass/20 [animation-duration:2.4s]" />
            <span className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-brass-light to-brass-dark text-ink shadow-glow">
              <Check size={42} strokeWidth={2.5} />
            </span>
          </div>
          <h1 className="h-display mt-10 text-6xl sm:text-8xl">
            Вы <span className="text-gold italic">записаны</span>
          </h1>
          <p className="mt-6 text-lg text-ash">
            Подтверждение отправили на <span className="text-bone">{booking.phone}</span>. Напомним за день и за два часа до визита.
          </p>
        </div>

        {/* билет */}
        <div className="mx-auto mt-14 max-w-4xl animate-fade-up">
          <div className="card relative grid overflow-hidden p-0 md:grid-cols-[1fr_auto_300px]">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">Бритва и Ко</span>
                <span className="font-mono text-xs text-dust">№ {booking.id}</span>
              </div>
              <div className="mt-8 flex items-end gap-6">
                <div className="font-display text-8xl font-semibold leading-none">{booking.date.slice(8)}</div>
                <div className="pb-2">
                  <div className="text-xl font-semibold">{dayMonth(booking.date).split(' ')[1]}</div>
                  <div className="text-ash first-letter:uppercase">{weekday(booking.date)}</div>
                </div>
                <div className="ml-auto pb-2 text-right">
                  <div className="text-xs uppercase tracking-[0.2em] text-dust">Время</div>
                  <div className="font-display text-5xl font-semibold text-gold tabular-nums">{booking.time}</div>
                </div>
              </div>
              <dl className="mt-10 grid gap-6 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-dust">Услуга</dt>
                  <dd className="mt-2 font-semibold">{service.name}</dd>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm text-ash"><Clock size={13} /> {duration(service.duration)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-dust">Адрес</dt>
                  <dd className="mt-2 font-semibold">{brand.address}</dd>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm text-ash"><MapPin size={13} /> {brand.addressNote}</dd>
                </div>
              </dl>
            </div>

            {/* перфорация */}
            <div className="relative hidden w-px md:block">
              <div className="absolute inset-y-6 left-0 border-l-2 border-dashed border-white/10" />
              <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-ink" />
              <span className="absolute -bottom-4 -left-4 h-8 w-8 rounded-full bg-ink" />
            </div>

            <div className="flex flex-col border-t border-white/[0.06] bg-gradient-to-b from-[#241e16] to-graphite md:border-t-0">
              <div className="relative h-56 overflow-hidden">
                <Avatar look={master.look} align="center" className="h-full w-full" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#221c15] to-transparent" />
              </div>
              <div className="flex-1 px-7 pb-7">
                <div className="text-xs uppercase tracking-[0.2em] text-brass">{master.role}</div>
                <div className="mt-1 font-display text-3xl font-semibold">{master.name}</div>
                <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
                  <span className="text-sm text-dust">К оплате</span>
                  <span className="font-display text-3xl font-semibold">{rub(service.price)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to={user ? '/account' : '/login'} className="btn-gold px-8">
              <UserRound size={16} /> {user ? 'В личный кабинет' : 'Войти и управлять записью'}
            </Link>
            <button onClick={() => downloadIcs(booking)} className="btn-ghost px-7">
              <CalendarPlus size={16} /> Добавить в календарь
            </button>
            <Link to="/" className="btn-quiet">
              На главную <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
