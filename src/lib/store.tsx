import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { demoClient, masters, services } from '../data/mock'
import { addDays, toISO, today } from './format'

export interface Booking {
  id: string
  serviceId: string
  masterId: string
  date: string
  time: string
  name: string
  phone: string
  comment?: string
  status: 'active' | 'cancelled'
  createdAt: number
}

export interface User {
  phone: string
  name: string
}

interface Toast {
  id: number
  text: string
}

interface Store {
  user: User | null
  bookings: Booking[]
  lastBookingId: string | null
  toasts: Toast[]
  login: (phone: string) => void
  logout: () => void
  addBooking: (b: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Booking
  cancelBooking: (id: string) => void
  rescheduleBooking: (id: string, date: string, time: string) => void
  toast: (text: string) => void
}

const Ctx = createContext<Store | null>(null)

const KEYS = { user: 'britva.user', bookings: 'britva.bookings', last: 'britva.lastBooking' }

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* приватный режим — просто живём в памяти */
  }
}

const uid = () => `BK-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`

/** Демо-запись, чтобы кабинет не был пустым при первом входе. */
function seedBooking(phone: string): Booking {
  return {
    id: 'BK-7Q2M4X',
    serviceId: services.find((s) => s.id === 'combo')!.id,
    masterId: masters[0].id,
    date: toISO(addDays(today(), 3)),
    time: '19:00',
    name: demoClient.name,
    phone,
    status: 'active',
    createdAt: Date.now(),
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => read(KEYS.user, null))
  const [bookings, setBookings] = useState<Booking[]>(() => read(KEYS.bookings, []))
  const [lastBookingId, setLast] = useState<string | null>(() => read(KEYS.last, null))
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => write(KEYS.user, user), [user])
  useEffect(() => write(KEYS.bookings, bookings), [bookings])
  useEffect(() => write(KEYS.last, lastBookingId), [lastBookingId])

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600)
  }, [])

  const login = useCallback((phone: string) => {
    setUser({ phone, name: demoClient.name })
    setBookings((list) => (list.some((b) => b.status === 'active') ? list : [seedBooking(phone), ...list]))
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const addBooking = useCallback<Store['addBooking']>((b) => {
    const booking: Booking = { ...b, id: uid(), status: 'active', createdAt: Date.now() }
    setBookings((list) => [booking, ...list])
    setLast(booking.id)
    return booking
  }, [])

  const cancelBooking = useCallback((id: string) => {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)))
  }, [])

  const rescheduleBooking = useCallback((id: string, date: string, time: string) => {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, date, time } : b)))
  }, [])

  const value = useMemo(
    () => ({ user, bookings, lastBookingId, toasts, login, logout, addBooking, cancelBooking, rescheduleBooking, toast }),
    [user, bookings, lastBookingId, toasts, login, logout, addBooking, cancelBooking, rescheduleBooking, toast],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore вне StoreProvider')
  return ctx
}
