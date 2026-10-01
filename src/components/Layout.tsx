import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Clock, Mail, MapPin, Menu, Phone, UserRound, X } from 'lucide-react'
import { brand, hours } from '../data/mock'
import { useStore } from '../lib/store'
import { Logo, Toasts } from './ui'

const anchors = [
  { id: 'services', label: 'Услуги' },
  { id: 'masters', label: 'Мастера' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'contacts', label: 'Контакты' },
]

/** Прокрутка к секции главной. С HashRouter обычные #якоря не работают — идём через state. */
function useScrollTo() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (id: string) => {
    if (pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    else navigate('/', { state: { scrollTo: id } })
  }
}

function Header() {
  const { user } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const scrollTo = useScrollTo()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const go = (id: string) => {
    setOpen(false)
    scrollTo(id)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || open ? 'border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-6 lg:h-24">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          {anchors.map((a) => (
            <button key={a.id} onClick={() => go(a.id)} className="rounded-full px-4 py-2 text-sm text-ash transition hover:text-bone">
              {a.label}
            </button>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={brand.phoneHref} className="mr-2 text-sm font-medium tabular-nums text-ash transition hover:text-brass-light">
            {brand.phone}
          </a>
          <NavLink
            to={user ? '/account' : '/login'}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-ash transition hover:border-brass/60 hover:text-brass-light"
            aria-label={user ? 'Личный кабинет' : 'Войти'}
            title={user ? 'Личный кабинет' : 'Войти'}
          >
            <UserRound size={18} />
          </NavLink>
          <Link to="/booking" className="btn-gold px-7">
            Записаться
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 lg:hidden" aria-label="Меню" aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="container-x animate-fade-up pb-8 lg:hidden">
          <div className="flex flex-col border-t border-white/[0.06] pt-4">
            {anchors.map((a) => (
              <button key={a.id} onClick={() => go(a.id)} className="py-3 text-left font-display text-3xl">
                {a.label}
              </button>
            ))}
            <Link to={user ? '/account' : '/login'} className="py-3 font-display text-3xl text-ash">
              {user ? 'Личный кабинет' : 'Войти'}
            </Link>
            <Link to="/booking" className="btn-gold mt-6">
              Записаться онлайн
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  const scrollTo = useScrollTo()
  return (
    <footer className="border-t border-white/[0.06] bg-coal">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-ash">
            {brand.tagline}. Стрижём, бреем и наливаем кофе с {brand.since} года.
          </p>
        </div>
        <div>
          <div className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-dust">Разделы</div>
          <ul className="space-y-3 text-sm">
            {anchors.map((a) => (
              <li key={a.id}>
                <button onClick={() => scrollTo(a.id)} className="text-ash transition hover:text-brass-light">{a.label}</button>
              </li>
            ))}
            <li><Link to="/booking" className="text-ash transition hover:text-brass-light">Онлайн-запись</Link></li>
            <li><Link to="/account" className="text-ash transition hover:text-brass-light">Личный кабинет</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-dust">Контакты</div>
          <ul className="space-y-3 text-sm text-ash">
            <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-brass" />{brand.city}, {brand.address}</li>
            <li><a href={brand.phoneHref} className="flex gap-3 transition hover:text-brass-light"><Phone size={16} className="mt-0.5 shrink-0 text-brass" />{brand.phone}</a></li>
            <li className="flex gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-brass" />{brand.email}</li>
          </ul>
        </div>
        <div>
          <div className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-dust">Часы работы</div>
          <ul className="space-y-3 text-sm text-ash">
            {hours.map((h) => (
              <li key={h.days} className="flex gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-brass" />
                <span>{h.days}<br /><span className="text-bone tabular-nums">{h.time}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-dust sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} «{brand.name}». Название, люди и адреса выдуманы.</span>
          <span className="text-[11px] tracking-wide">Демо-проект</span>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  const { pathname, state } = useLocation()

  useEffect(() => {
    const target = (state as { scrollTo?: string } | null)?.scrollTo
    if (target) {
      requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }))
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [pathname, state])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toasts />
    </div>
  )
}
