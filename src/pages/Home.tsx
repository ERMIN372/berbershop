import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Car, Clock, Coffee, MapPin, Phone, Quote, ShieldCheck, Star, Timer, TrainFront } from 'lucide-react'
import { brand, categories, hours, masters, perks, reviews, serviceById, services, stats, masterById, type ServiceCategory } from '../data/mock'
import { dayMonth, duration, rub } from '../lib/format'
import Avatar from '../components/Avatar'
import { HeroEmblem, MapArt, PoleStripe } from '../components/Illustrations'
import { SectionHead, Stars } from '../components/ui'

function Hero() {
  return (
    <section className="grain relative overflow-hidden pt-28 lg:pt-32">
      {/* фоновые градиенты */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 top-10 h-[900px] w-[900px] rounded-full bg-[radial-gradient(circle,rgba(201,162,90,0.16),transparent_62%)]" />
        <div className="absolute -left-60 bottom-0 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className="container-x grid items-center gap-12 pb-16 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:pb-24 2xl:min-h-[860px]">
        <div className="animate-fade-up">
          <span className="eyebrow">Барбершоп · {brand.city} · с {brand.since}</span>
          <h1 className="h-display mt-8 text-[64px] sm:text-[96px] lg:text-[112px] xl:text-[140px]">
            Точность
            <br />в каждой <span className="text-gold italic">линии</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ash sm:text-xl">
            Стрижки, бороды и королевское бритьё опасной бритвой. Без очередей и спешки — только вы, мастер и чашка
            хорошего кофе.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/booking" className="btn-gold px-9 py-4 text-base">
              Записаться <ArrowRight size={18} />
            </Link>
            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="btn-ghost px-8 py-4 text-base">
              Услуги и цены
            </button>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-6">
            <div className="flex -space-x-3">
              {masters.map((m) => (
                <div key={m.id} className="h-12 w-12 overflow-hidden rounded-full border-2 border-ink ring-1 ring-brass/30">
                  <Avatar look={m.look} className="h-full w-full" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Stars value={5} />
                <span className="font-semibold">4.9</span>
              </div>
              <div className="mt-1 text-sm text-ash">1 200+ отзывов гостей</div>
            </div>
            <div className="hidden h-10 w-px bg-white/10 sm:block" />
            <div className="text-sm text-ash">
              <span className="text-bone">Первый визит −15%</span>
              <br />
              по промокоду <span className="font-semibold tracking-wider text-brass">ПЕРВЫЙ</span>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[640px] animate-fade-up [animation-delay:150ms]">
          <HeroEmblem className="w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]" />
          <div className="absolute bottom-[8%] left-0 hidden rounded-2xl border border-white/10 bg-coal/80 p-4 pr-6 shadow-card backdrop-blur-md sm:flex sm:items-center sm:gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brass/15 text-brass">
              <Timer size={22} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-dust">Ближайшее окно</div>
              <div className="mt-1 font-semibold">Сегодня, 18:30</div>
            </div>
          </div>
          <div className="absolute right-2 top-[12%] hidden rounded-2xl border border-white/10 bg-coal/80 px-5 py-4 shadow-card backdrop-blur-md sm:block">
            <div className="font-display text-4xl font-semibold text-gold">12</div>
            <div className="text-xs text-ash">лет опыта у<br />арт-директора</div>
          </div>
        </div>
      </div>

      <div className="container-x">
        <div className="grid grid-cols-2 border-y border-white/[0.07] lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`py-8 lg:py-10 ${i % 2 ? 'border-l border-white/[0.07] pl-6' : ''} ${i ? 'lg:border-l lg:border-white/[0.07] lg:pl-10' : ''} ${i >= 2 ? 'border-t border-white/[0.07] lg:border-t-0' : ''}`}>
              <div className="font-display text-5xl font-semibold lg:text-6xl">{s.value}</div>
              <div className="mt-2 text-sm text-ash">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services() {
  const [cat, setCat] = useState<ServiceCategory | 'all'>('all')
  const visible = categories.filter((c) => cat === 'all' || c.id === cat)
  return (
    <section id="services" className="scroll-mt-24 py-24 lg:py-36">
      <div className="container-x">
        <SectionHead
          eyebrow="Услуги и цены"
          title={<>Меню <span className="italic text-brass">ремесла</span></>}
          text="Цены фиксированные и не зависят от длины волос. Время указано с учётом консультации и укладки."
          aside={
            <div className="flex flex-wrap gap-2">
              {[{ id: 'all', label: 'Все' } as const, ...categories].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`rounded-full px-5 py-2.5 text-sm transition ${cat === c.id ? 'bg-bone text-ink' : 'border border-white/10 text-ash hover:border-brass/50 hover:text-bone'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          }
        />

        <div className="grid gap-x-20 gap-y-16 lg:grid-cols-2">
          {visible.map((c) => (
            <div key={c.id}>
              <div className="mb-6 flex items-baseline justify-between border-b border-brass/25 pb-4">
                <h3 className="font-display text-4xl font-semibold">{c.label}</h3>
                <span className="hidden text-xs text-dust sm:block">{c.hint}</span>
              </div>
              <ul>
                {services.filter((s) => s.category === c.id).map((s) => (
                  <li key={s.id}>
                    <Link to={`/booking?service=${s.id}`} className="group -mx-4 block rounded-2xl px-4 py-5 transition hover:bg-white/[0.03]">
                      <div className="flex items-baseline">
                        <span className="text-lg font-semibold transition group-hover:text-brass-light sm:text-xl">{s.name}</span>
                        {s.popular && <span className="ml-3 rounded-full bg-brass/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brass">хит</span>}
                        <span className="dotted-leader" />
                        <span className="font-display text-2xl font-semibold tabular-nums text-bone sm:text-3xl">{rub(s.price)}</span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-4 text-sm text-ash">
                        <span>{s.description}</span>
                        <span className="flex shrink-0 items-center gap-1.5 text-dust">
                          <Clock size={13} /> {duration(s.duration)}
                          <ArrowUpRight size={15} className="ml-2 -translate-x-1 text-brass opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {perks.map((p, i) => {
            const Icon = [Coffee, Timer, ShieldCheck][i]
            return (
              <div key={p.title} className="card flex items-center gap-5 p-6">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-brass/25 bg-brass/10 text-brass">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="mt-1 text-sm text-ash">{p.text}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Masters() {
  return (
    <section id="masters" className="scroll-mt-24 border-y border-white/[0.06] bg-coal py-24 lg:py-36">
      <div className="container-x">
        <SectionHead
          eyebrow="Команда"
          title={<>Мастера, к которым <span className="italic text-brass">возвращаются</span></>}
          text="Каждый прошёл внутреннюю школу и сдал экзамен арт-директору. Выбирайте по стилю — или доверьтесь любому."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {masters.map((m) => (
            <article key={m.id} className="group card overflow-hidden p-0 transition duration-500 hover:-translate-y-1.5 hover:border-brass/30">
              <div className="relative aspect-[5/6] overflow-hidden">
                <Avatar look={m.look} className="h-full w-full transition duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-graphite to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                  <Star size={12} className="fill-brass text-brass" />
                  {m.rating.toFixed(2)}
                </div>
                <PoleStripe className="absolute right-5 top-5 h-8 w-2 rounded-full opacity-70" />
              </div>
              <div className="p-6 pt-2">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">{m.role}</div>
                <h3 className="mt-2 font-display text-3xl font-semibold">{m.name}</h3>
                <div className="mt-5 grid grid-cols-2 gap-3 border-y border-white/[0.06] py-4 text-sm">
                  <div>
                    <div className="text-dust">Стаж</div>
                    <div className="mt-0.5 font-semibold">{m.experience} лет</div>
                  </div>
                  <div>
                    <div className="text-dust">Отзывы</div>
                    <div className="mt-0.5 font-semibold">{m.reviews}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {m.specialties.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
                <Link to={`/booking?master=${m.id}`} className="mt-6 flex items-center justify-between rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition group-hover:border-brass/50 group-hover:bg-brass group-hover:text-ink">
                  Записаться к мастеру <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  const [featured, ...rest] = reviews
  const fm = masterById(featured.masterId)!
  return (
    <section id="reviews" className="scroll-mt-24 py-24 lg:py-36">
      <div className="container-x">
        <SectionHead
          eyebrow="Отзывы"
          title={<>Говорят <span className="italic text-brass">гости</span></>}
          aside={
            <div className="flex items-center gap-6">
              <div className="font-display text-7xl font-semibold text-gold">4.9</div>
              <div>
                <Stars value={5} size={18} />
                <div className="mt-2 text-sm text-ash">1 248 оценок за 3 года</div>
              </div>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <figure className="card relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate to-graphite p-8 sm:p-10 lg:row-span-2">
            <Quote className="absolute -right-4 -top-4 h-40 w-40 text-brass/10" strokeWidth={1} />
            <div>
              <Stars value={featured.rating} size={18} />
              <blockquote className="mt-8 font-display text-[28px] font-medium leading-snug sm:text-[32px]">
                «{featured.text}»
              </blockquote>
            </div>
            <figcaption className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-brass text-lg font-bold text-ink">{featured.initials}</div>
              <div>
                <div className="font-semibold">{featured.author}</div>
                <div className="text-sm text-ash">
                  {serviceById(featured.serviceId)?.name} · мастер {fm.name.split(' ')[0]}
                </div>
              </div>
            </figcaption>
          </figure>
          {rest.slice(0, 4).map((r) => (
            <figure key={r.id} className="card flex flex-col justify-between p-7 transition duration-300 hover:border-white/15">
              <div>
                <div className="flex items-center justify-between">
                  <Stars value={r.rating} />
                  <span className="text-xs text-dust">{dayMonth(r.date)}</span>
                </div>
                <blockquote className="mt-5 leading-relaxed text-bone/90">«{r.text}»</blockquote>
              </div>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full border border-brass/30 text-xs font-bold text-brass">{r.initials}</div>
                <div className="text-sm">
                  <div className="font-semibold">{r.author}</div>
                  <div className="text-dust">{serviceById(r.serviceId)?.name}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <section id="contacts" className="scroll-mt-24 pb-24 lg:pb-36">
      <div className="container-x">
        <div className="card grid overflow-hidden p-0 lg:grid-cols-[1fr_1.1fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <span className="eyebrow">Как нас найти</span>
            <h2 className="h-display mt-6 text-5xl sm:text-6xl">
              Заходите <span className="italic text-brass">на огонёк</span>
            </h2>
            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <MapPin className="mt-1 shrink-0 text-brass" size={20} />
                <div>
                  <div className="text-lg font-semibold">{brand.city}, {brand.address}</div>
                  <div className="mt-1 text-sm text-ash">{brand.addressNote}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <TrainFront className="mt-1 shrink-0 text-brass" size={20} />
                <div className="text-ash">{brand.metro}</div>
              </div>
              <div className="flex gap-4">
                <Car className="mt-1 shrink-0 text-brass" size={20} />
                <div className="text-ash">{brand.parking}</div>
              </div>
              <div className="flex gap-4">
                <Phone className="mt-1 shrink-0 text-brass" size={20} />
                <a href={brand.phoneHref} className="text-lg font-semibold tabular-nums transition hover:text-brass-light">{brand.phone}</a>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-white/[0.07] bg-ink/40">
              {hours.map((h, i) => (
                <div key={h.days} className={`flex items-center justify-between gap-4 px-6 py-4 ${i ? 'border-t border-white/[0.06]' : ''}`}>
                  <div>
                    <div className="text-sm">{h.days}</div>
                    {h.note && <div className="text-xs text-dust">{h.note}</div>}
                  </div>
                  <div className="font-semibold tabular-nums text-brass-light">{h.time}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-80 border-t border-white/[0.06] lg:border-l lg:border-t-0">
            <MapArt className="absolute inset-0 h-full w-full" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-ink/80 p-5 backdrop-blur-md">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-dust">Сейчас</div>
                <div className="mt-1 flex items-center gap-2 font-semibold">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Открыто до 22:00
                </div>
              </div>
              <Link to="/booking" className="btn-gold">Записаться <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Cta() {
  return (
    <section className="pb-24 lg:pb-36">
      <div className="container-x">
        <div className="grain relative overflow-hidden rounded-[2rem] border border-brass/25 bg-gradient-to-br from-[#2a2217] via-graphite to-ink px-8 py-16 text-center sm:px-16 lg:py-24">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60%] -translate-x-1/2 rounded-full bg-brass/20 blur-3xl" />
          <span className="eyebrow">Онлайн-запись 24/7</span>
          <h2 className="h-display mx-auto mt-6 max-w-4xl text-5xl sm:text-7xl">
            Кресло уже <span className="text-gold italic">ждёт</span> вас
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-ash">Четыре шага, меньше минуты. Напомним о визите за день и за два часа.</p>
          <Link to="/booking" className="btn-gold mt-10 px-10 py-4 text-base">
            Выбрать время <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Masters />
      <Reviews />
      <Contacts />
      <Cta />
    </>
  )
}
