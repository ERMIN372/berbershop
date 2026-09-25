import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Clock, MessageSquare, Phone, Shuffle, Tag, User } from 'lucide-react'
import { busySlots, categories, masterById, masters, serviceById, services } from '../data/mock'
import { duration, formatPhone, fullDate, phoneComplete, rub } from '../lib/format'
import { useStore } from '../lib/store'
import Avatar from '../components/Avatar'
import { Calendar, SlotGrid } from '../components/Scheduler'
import { Spinner, Stars } from '../components/ui'

const STEPS = ['Услуга', 'Мастер', 'Дата и время', 'Контакты']
const PROMO = 'ПЕРВЫЙ'

export default function Booking() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user, addBooking, toast } = useStore()

  const initialService = serviceById(params.get('service') ?? '')?.id ?? null
  const initialMaster = masterById(params.get('master') ?? '')?.id ?? null

  const [step, setStep] = useState(initialService ? 1 : 0)
  const [serviceId, setServiceId] = useState<string | null>(initialService)
  const [masterId, setMasterId] = useState<string | null>(initialMaster)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [comment, setComment] = useState('')
  const [promo, setPromo] = useState('')
  const [agree, setAgree] = useState(true)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)

  const service = serviceId ? serviceById(serviceId) : undefined
  const master = masterId && masterId !== 'any' ? masterById(masterId) : undefined
  const promoOk = promo.trim().toUpperCase() === PROMO
  const total = service ? Math.round(service.price * (promoOk ? 0.85 : 1)) : 0

  const canNext = [!!serviceId, !!masterId, !!date && !!time, name.trim().length > 1 && phoneComplete(phone) && agree][step]

  const next = () => {
    if (step < 3) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else submit()
  }

  const submit = () => {
    setTouched(true)
    if (!canNext || !service || !masterId || !date || !time) return
    setLoading(true)
    // Имитация запроса к серверу
    setTimeout(() => {
      const finalMaster = masterId === 'any' ? pickMaster(date, time) : masterId
      addBooking({ serviceId: service.id, masterId: finalMaster, date, time, name: name.trim(), phone, comment: comment.trim() || undefined })
      toast('Запись подтверждена — ждём вас!')
      navigate('/booking/success')
    }, 1200)
  }

  const progress = ((step + (canNext ? 1 : 0.5)) / STEPS.length) * 100

  return (
    <section className="relative pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="pointer-events-none absolute -top-40 right-0 -z-10 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(201,162,90,0.1),transparent_60%)]" />
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow">Онлайн-запись</span>
            <h1 className="h-display mt-6 text-5xl sm:text-7xl lg:text-8xl">
              Ваш визит <span className="italic text-brass">за минуту</span>
            </h1>
          </div>
          <div className="text-sm text-ash">
            Шаг <span className="font-semibold text-bone">{step + 1}</span> из {STEPS.length}
          </div>
        </div>

        {/* прогресс */}
        <div className="mt-12">
          <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-gradient-to-r from-brass-dark via-brass to-brass-light transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <ol className="mt-5 grid grid-cols-4 gap-2">
            {STEPS.map((s, i) => {
              const done = i < step
              const active = i === step
              return (
                <li key={s}>
                  <button
                    type="button"
                    disabled={i > step}
                    onClick={() => setStep(i)}
                    className={`flex items-center gap-3 text-left text-sm transition ${active ? 'text-bone' : done ? 'text-ash hover:text-bone' : 'text-dust'}`}
                  >
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition ${done ? 'bg-brass text-ink' : active ? 'border border-brass text-brass' : 'border border-white/10'}`}>
                      {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                    </span>
                    <span className="hidden font-medium sm:inline">{s}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          <div key={step} className="card animate-fade-up p-6 sm:p-10">
            {step === 0 && <StepService value={serviceId} onChange={setServiceId} />}
            {step === 1 && <StepMaster value={masterId} onChange={(id) => { setMasterId(id); setTime(null) }} />}
            {step === 2 && (
              <div className="grid gap-10 xl:grid-cols-[1fr_1.1fr]">
                <Calendar value={date} onChange={(d) => { setDate(d); setTime(null) }} />
                <SlotGrid date={date} masterId={masterId ?? 'any'} value={time} onChange={setTime} />
              </div>
            )}
            {step === 3 && (
              <div>
                <StepTitle title="Как с вами связаться" text="Пришлём подтверждение и напомним о визите. Никакого спама." />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Имя" icon={<User size={16} />} error={touched && name.trim().length < 2 ? 'Как к вам обращаться?' : undefined}>
                    <input className="input pl-12" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, Артём" autoComplete="given-name" />
                  </Field>
                  <Field label="Телефон" icon={<Phone size={16} />} error={touched && !phoneComplete(phone) ? 'Введите номер полностью' : undefined}>
                    <input className="input pl-12 tabular-nums" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} onFocus={() => !phone && setPhone('+7')} placeholder="+7 (___) ___-__-__" inputMode="tel" autoComplete="tel" />
                  </Field>
                  <Field label="Пожелания мастеру" icon={<MessageSquare size={16} />} className="sm:col-span-2">
                    <textarea className="input min-h-28 resize-none pl-12" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Хочу оставить длину сверху, убрать виски…" />
                  </Field>
                  <Field label="Промокод" icon={<Tag size={16} />}>
                    <input className={`input pl-12 uppercase ${promoOk ? 'border-emerald-400/50' : ''}`} value={promo} onChange={(e) => setPromo(e.target.value)} placeholder={PROMO} />
                    {promoOk && <span className="mt-2 block text-xs text-emerald-400">Скидка 15% на первый визит применена</span>}
                  </Field>
                </div>
                <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm text-ash">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#c9a25a]" />
                  Согласен на обработку персональных данных и получение напоминаний о записи
                </label>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-8">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="btn-quiet">
                  <ArrowLeft size={16} /> Назад
                </button>
              ) : (
                <Link to="/" className="btn-quiet"><ArrowLeft size={16} /> На главную</Link>
              )}
              <button type="button" onClick={next} disabled={(!canNext && step < 3) || loading} className="btn-gold px-8">
                {loading ? <><Spinner /> Подтверждаем…</> : step === 3 ? <>Подтвердить запись <Check size={16} /></> : <>Далее <ArrowRight size={16} /></>}
              </button>
            </div>
          </div>

          <Summary service={service} masterId={masterId} master={master} date={date} time={time} total={total} discount={promoOk} />
        </div>
      </div>
    </section>
  )
}

/** Для «любого мастера» — первый, у кого свободен слот. */
function pickMaster(date: string, time: string): string {
  return masters.find((m) => !busySlots(date, m.id).has(time))?.id ?? masters[0].id
}

function StepTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-4xl font-semibold sm:text-5xl">{title}</h2>
      <p className="mt-2 text-ash">{text}</p>
    </div>
  )
}

function Field({ label, icon, error, className = '', children }: { label: string; icon: ReactNode; error?: string; className?: string; children: ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dust">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-5 top-[1.15rem] text-dust">{icon}</span>
        {children}
      </span>
      {error && <span className="mt-2 block text-xs text-red-400">{error}</span>}
    </label>
  )
}

function StepService({ value, onChange }: { value: string | null; onChange: (id: string) => void }) {
  return (
    <div>
      <StepTitle title="Выберите услугу" text="Можно добавить уход на месте — мастер подскажет." />
      <div className="space-y-8">
        {categories.map((c) => (
          <div key={c.id}>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-dust">{c.label}</div>
            <div className="grid gap-3 md:grid-cols-2">
              {services.filter((s) => s.category === c.id).map((s) => {
                const selected = s.id === value
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onChange(s.id)}
                    className={`group relative flex items-start justify-between gap-4 rounded-2xl border p-5 text-left transition-all duration-200 ${
                      selected ? 'border-brass bg-brass/[0.08] shadow-glow' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-semibold">
                        {s.name}
                        {s.popular && <span className="rounded-full bg-brass/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-brass">хит</span>}
                      </div>
                      <div className="mt-1 text-sm text-ash">{s.description}</div>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-dust"><Clock size={12} /> {duration(s.duration)}</div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="whitespace-nowrap font-display text-2xl font-semibold tabular-nums">{rub(s.price)}</span>
                      <span className={`grid h-6 w-6 place-items-center rounded-full border transition ${selected ? 'border-brass bg-brass text-ink' : 'border-white/20'}`}>
                        {selected && <Check size={13} strokeWidth={3} />}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepMaster({ value, onChange }: { value: string | null; onChange: (id: string) => void }) {
  return (
    <div>
      <StepTitle title="Выберите мастера" text="Все мастера работают по единому стандарту. Разница — в почерке." />
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange('any')}
          className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all sm:gap-5 sm:p-5 md:col-span-2 ${
            value === 'any' ? 'border-brass bg-brass/[0.08] shadow-glow' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'
          }`}
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-brass/30 bg-brass/10 text-brass sm:h-16 sm:w-16"><Shuffle size={22} /></span>
          <span className="flex-1">
            <span className="block text-lg font-semibold">Любой свободный мастер</span>
            <span className="mt-1 block text-sm text-ash">Покажем больше свободного времени — подберём мастера под слот</span>
          </span>
          <Radio on={value === 'any'} />
        </button>
        {masters.map((m) => {
          const selected = value === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className={`flex items-center gap-5 rounded-2xl border p-4 text-left transition-all ${
                selected ? 'border-brass bg-brass/[0.08] shadow-glow' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <span className="h-24 w-20 shrink-0 overflow-hidden rounded-xl">
                <Avatar look={m.look} className="h-full w-full" />
              </span>
              <span className="flex-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brass">{m.role}</span>
                <span className="mt-1 block text-lg font-semibold">{m.name}</span>
                <span className="mt-2 flex items-center gap-2 text-sm text-ash">
                  <Stars value={m.rating} size={12} /> {m.rating.toFixed(2)} · {m.experience} лет
                </span>
              </span>
              <Radio on={selected} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Radio({ on }: { on: boolean }) {
  return (
    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition ${on ? 'border-brass bg-brass text-ink' : 'border-white/20'}`}>
      {on && <Check size={13} strokeWidth={3} />}
    </span>
  )
}

function Summary({ service, masterId, master, date, time, total, discount }: {
  service?: ReturnType<typeof serviceById>
  masterId: string | null
  master?: ReturnType<typeof masterById>
  date: string | null
  time: string | null
  total: number
  discount: boolean
}) {
  const rows = useMemo(
    () => [
      { label: 'Услуга', value: service ? `${service.name}` : null, sub: service ? duration(service.duration) : null },
      { label: 'Мастер', value: master ? master.name : masterId === 'any' ? 'Любой свободный' : null, sub: master?.role ?? null },
      { label: 'Дата', value: date ? fullDate(date) : null, sub: null },
      { label: 'Время', value: time, sub: null },
    ],
    [service, master, masterId, date, time],
  )
  return (
    <aside className="card sticky top-28 overflow-hidden p-0">
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[#2a2217] to-graphite">
        {master && <Avatar look={master.look} className="absolute -right-4 -top-6 h-44 w-36 opacity-90" />}
        <div className="absolute bottom-5 left-7">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">Ваша запись</div>
          <div className="mt-1 font-display text-3xl font-semibold">Бритва и Ко</div>
        </div>
      </div>
      <dl className="divide-y divide-white/[0.06] px-7">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-4 py-4">
            <dt className="text-sm text-dust">{r.label}</dt>
            <dd className="text-right">
              {r.value ? <span className="font-semibold first-letter:uppercase">{r.value}</span> : <span className="text-smoke">—</span>}
              {r.sub && <span className="block text-xs text-ash">{r.sub}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mx-7 mb-7 mt-2 flex items-end justify-between rounded-2xl bg-ink/60 p-5">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-dust">Итого</div>
          {discount && service && <div className="mt-1 text-sm text-dust line-through">{rub(service.price)}</div>}
        </div>
        <div className="font-display text-4xl font-semibold text-gold">{total ? rub(total) : '—'}</div>
      </div>
      <div className="border-t border-white/[0.06] px-7 py-5 text-xs leading-relaxed text-dust">
        Оплата в барбершопе картой или наличными. Бесплатная отмена за 3 часа до визита.
      </div>
    </aside>
  )
}
