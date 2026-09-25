import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Gift, History, MessageSquareText, ShieldCheck, Smartphone } from 'lucide-react'
import { formatPhone, phoneComplete } from '../lib/format'
import { useStore } from '../lib/store'
import { HeroEmblem } from '../components/Illustrations'
import { Spinner } from '../components/ui'

const CODE_LEN = 4

export default function Login() {
  const { login, toast } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/account'

  const [phone, setPhone] = useState('')
  const [stage, setStage] = useState<'phone' | 'code'>('phone')
  const [code, setCode] = useState<string[]>(Array(CODE_LEN).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timer <= 0) return
    const t = setTimeout(() => setTimer(timer - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  const sendCode = (e?: FormEvent) => {
    e?.preventDefault()
    if (!phoneComplete(phone)) {
      setError('Введите номер телефона полностью')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStage('code')
      setTimer(59)
      setCode(Array(CODE_LEN).fill(''))
      toast('Код отправлен. В демо подойдёт любой')
      setTimeout(() => refs.current[0]?.focus(), 50)
    }, 900)
  }

  const verify = () => {
    setLoading(true)
    // Имитация проверки: любой код подходит
    setTimeout(() => {
      login(phone)
      toast('Добро пожаловать в клуб!')
      navigate(from, { replace: true })
    }, 800)
  }

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/\D/g, '')
    const next = [...code]
    if (clean.length > 1) {
      // вставка кода целиком
      clean.slice(0, CODE_LEN).split('').forEach((d, k) => (next[k] = d))
      setCode(next)
      if (next.every(Boolean)) verify()
      else refs.current[Math.min(clean.length, CODE_LEN - 1)]?.focus()
      return
    }
    next[i] = clean
    setCode(next)
    if (clean && i < CODE_LEN - 1) refs.current[i + 1]?.focus()
    if (next.every(Boolean)) verify()
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      <div className="container-x grid min-h-[calc(100vh-6rem)] items-center gap-16 py-12 lg:grid-cols-2 lg:py-20">
        {/* левая колонка — промо */}
        <div className="relative hidden lg:block">
          <div className="pointer-events-none absolute -left-40 -top-20 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(201,162,90,0.14),transparent_62%)]" />
          <span className="eyebrow">Клуб «Бритва и Ко»</span>
          <h1 className="h-display mt-6 text-7xl xl:text-8xl">
            С возвращением,
            <br />
            <span className="text-gold italic">джентльмен</span>
          </h1>
          <ul className="mt-12 space-y-6">
            {[
              { icon: History, title: 'История визитов', text: 'Мастер видит, как вы стриглись в прошлый раз' },
              { icon: Gift, title: 'Бонусные баллы', text: '5% от каждого визита возвращаются баллами' },
              { icon: ShieldCheck, title: 'Перенос в один клик', text: 'Без звонков и ожидания на линии' },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-brass/25 bg-brass/10 text-brass"><Icon size={22} /></span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="text-sm text-ash">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <HeroEmblem className="pointer-events-none absolute -bottom-40 -right-24 w-80 opacity-30" />
        </div>

        {/* форма */}
        <div className="mx-auto w-full max-w-lg">
          <div className="card grain relative overflow-hidden p-8 sm:p-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass to-transparent" />
            <div className="mb-10 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brass-light to-brass-dark text-ink shadow-glow">
              {stage === 'phone' ? <Smartphone size={26} /> : <MessageSquareText size={26} />}
            </div>

            {stage === 'phone' ? (
              <form onSubmit={sendCode} className="animate-fade-up">
                <h2 className="h-display text-5xl">Вход</h2>
                <p className="mt-3 text-ash">Введите номер — пришлём код в SMS. Пароль не нужен.</p>
                <label className="mt-10 block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-dust">Номер телефона</span>
                  <input
                    className="input text-xl tabular-nums tracking-wide"
                    value={phone}
                    onChange={(e) => { setPhone(formatPhone(e.target.value)); setError('') }}
                    onFocus={() => !phone && setPhone('+7')}
                    placeholder="+7 (___) ___-__-__"
                    inputMode="tel"
                    autoComplete="tel"
                    autoFocus
                  />
                </label>
                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                <button type="submit" disabled={loading} className="btn-gold mt-8 w-full py-4 text-base">
                  {loading ? <><Spinner /> Отправляем…</> : <>Получить код <ArrowRight size={18} /></>}
                </button>
                <button type="button" onClick={() => setPhone('+7 (900) 123-45-67')} className="mt-4 w-full text-center text-sm text-dust transition hover:text-brass-light">
                  Заполнить демо-номер
                </button>
              </form>
            ) : (
              <div className="animate-fade-up">
                <h2 className="h-display text-5xl">Код из SMS</h2>
                <p className="mt-3 text-ash">
                  Отправили на <span className="text-bone tabular-nums">{phone}</span>
                </p>
                <div className="mt-10 flex justify-between gap-3">
                  {code.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { refs.current[i] = el }}
                      value={d}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => e.key === 'Backspace' && !d && i > 0 && refs.current[i - 1]?.focus()}
                      inputMode="numeric"
                      autoComplete={i === 0 ? 'one-time-code' : 'off'}
                      maxLength={CODE_LEN}
                      disabled={loading}
                      aria-label={`Цифра ${i + 1}`}
                      className={`h-20 w-full rounded-2xl border bg-ink/60 text-center font-display text-4xl font-semibold transition focus:border-brass focus:outline-none focus:ring-4 focus:ring-brass/10 ${d ? 'border-brass/60 text-brass-light' : 'border-white/10'}`}
                    />
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-brass/20 bg-brass/[0.06] px-4 py-3 text-sm text-brass-light">
                  Демо-режим: подойдёт любой код из 4 цифр
                </div>
                {loading && (
                  <div className="mt-6 flex items-center justify-center gap-3 text-sm text-ash">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-brass/30 border-t-brass" /> Проверяем код…
                  </div>
                )}
                <div className="mt-8 flex items-center justify-between text-sm">
                  <button onClick={() => setStage('phone')} className="flex items-center gap-2 text-ash transition hover:text-bone">
                    <ArrowLeft size={15} /> Изменить номер
                  </button>
                  {timer > 0 ? (
                    <span className="tabular-nums text-dust">Повторно через 0:{String(timer).padStart(2, '0')}</span>
                  ) : (
                    <button onClick={() => sendCode()} className="text-brass transition hover:text-brass-light">Отправить ещё раз</button>
                  )}
                </div>
              </div>
            )}
          </div>
          <p className="mt-6 text-center text-xs text-dust">Продолжая, вы соглашаетесь с правилами клуба и политикой конфиденциальности</p>
        </div>
      </div>
    </section>
  )
}
