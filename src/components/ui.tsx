import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Star, X } from 'lucide-react'
import { useStore } from '../lib/store'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-3" aria-label="Бритва и Ко — на главную">
      <span className="relative grid h-11 w-11 place-items-center rounded-full border border-brass/40 bg-gradient-to-br from-slate to-ink transition group-hover:border-brass">
        <RazorMark className="h-6 w-6" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[26px] font-semibold tracking-tight text-bone">
            Бритва <span className="italic text-brass">и</span> Ко
          </span>
          <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.34em] text-dust">barbershop · 2014</span>
        </span>
      )}
    </Link>
  )
}

export function RazorMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M6 25 L21 7 a3.6 3.6 0 0 1 5.2 5 L11 28 Z" fill="#c9a25a" />
      <path d="M21 7 a3.6 3.6 0 0 1 5.2 5 L22 16 Z" fill="#e6c98c" />
      <circle cx="8" cy="25.5" r="2.6" fill="#0b0a09" stroke="#c9a25a" strokeWidth="1.4" />
    </svg>
  )
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Оценка ${value} из 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i <= Math.round(value) ? 'fill-brass text-brass' : 'fill-transparent text-smoke'}
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}

export function SectionHead({ eyebrow, title, text, align = 'left', aside }: {
  eyebrow: string
  title: ReactNode
  text?: string
  align?: 'left' | 'center'
  aside?: ReactNode
}) {
  return (
    <div className={`mb-14 flex flex-col gap-8 lg:mb-20 ${align === 'center' ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between'}`}>
      <div className={align === 'center' ? 'max-w-3xl' : 'max-w-3xl'}>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h-display mt-6 text-5xl sm:text-6xl lg:text-7xl xl:text-[84px]">{title}</h2>
        {text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-ash">{text}</p>}
      </div>
      {aside}
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide = false }: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-label="Закрыть" />
      <div
        className={`animate-fade-up relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-coal p-6 shadow-2xl sm:rounded-3xl sm:p-10 ${wide ? 'sm:max-w-4xl' : 'sm:max-w-lg'}`}
      >
        <div className="mb-8 flex items-start justify-between gap-6">
          <h3 className="h-display text-4xl">{title}</h3>
          <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-ash transition hover:border-brass/50 hover:text-bone" aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-3">
      {toasts.map((t) => (
        <div key={t.id} className="animate-fade-up flex items-center gap-3 rounded-2xl border border-brass/30 bg-coal/95 px-5 py-4 text-sm text-bone shadow-2xl backdrop-blur">
          <span className="h-2 w-2 shrink-0 rounded-full bg-brass shadow-glow" />
          {t.text}
        </div>
      ))}
    </div>
  )
}

export function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" aria-hidden="true" />
}
