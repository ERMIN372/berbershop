// Все данные на сайте выдуманы. Никакого бэкенда — только этот файл,
// состояние React и localStorage.

export type ServiceCategory = 'haircut' | 'beard' | 'combo' | 'care'

export interface Service {
  id: string
  name: string
  description: string
  duration: number // минуты
  price: number // рубли
  category: ServiceCategory
  popular?: boolean
}

export interface AvatarLook {
  skin: string
  hair: string
  hairStyle: 'undercut' | 'pompadour' | 'buzz' | 'bald' | 'curly'
  beard: 'full' | 'short' | 'moustache' | 'stubble' | 'none'
  bg: [string, string]
  glasses?: boolean
}

export interface Master {
  id: string
  name: string
  role: string
  experience: number // лет
  rating: number
  reviews: number
  specialties: string[]
  quote: string
  look: AvatarLook
}

export interface Review {
  id: string
  author: string
  initials: string
  rating: number
  text: string
  serviceId: string
  masterId: string
  date: string
}

export interface Visit {
  id: string
  date: string // ISO yyyy-mm-dd
  time: string
  serviceId: string
  masterId: string
  price: number
  points: number
}

export const brand = {
  name: 'Бритва и Ко',
  tagline: 'Мужской клуб стрижки и бритья',
  since: 2014,
  phone: '+7 (900) 000-14-14',
  phoneHref: 'tel:+79000001414',
  email: 'hello@britva-demo.ru',
  city: 'Северогорск',
  address: 'ул. Литейщиков, 17, стр. 2',
  addressNote: 'Вход со двора, под латунной вывеской',
  metro: 'ст. «Кузнечная», 4 минуты пешком',
  parking: 'Бесплатная парковка для гостей во дворе',
}

export const hours: { days: string; time: string; note?: string }[] = [
  { days: 'Понедельник — Пятница', time: '10:00 — 22:00' },
  { days: 'Суббота', time: '09:00 — 22:00' },
  { days: 'Воскресенье', time: '10:00 — 20:00', note: 'Последняя запись в 19:00' },
]

export const categories: { id: ServiceCategory; label: string; hint: string }[] = [
  { id: 'haircut', label: 'Стрижки', hint: 'Консультация, мытьё головы и укладка включены' },
  { id: 'beard', label: 'Борода и бритьё', hint: 'Горячие полотенца и уход после бритья' },
  { id: 'combo', label: 'Комплексы', hint: 'Выгоднее, чем по отдельности' },
  { id: 'care', label: 'Уход', hint: 'Можно добавить к любой услуге' },
]

export const services: Service[] = [
  {
    id: 'classic',
    name: 'Мужская стрижка',
    description: 'Классика или современная форма под тип волос и лица',
    duration: 60,
    price: 2200,
    category: 'haircut',
    popular: true,
  },
  {
    id: 'fade',
    name: 'Фейд и андеркат',
    description: 'Плавный переход машинкой от нуля, чёткий контур',
    duration: 60,
    price: 2400,
    category: 'haircut',
  },
  {
    id: 'scissors',
    name: 'Стрижка ножницами',
    description: 'Длинные волосы и текстура без машинки',
    duration: 75,
    price: 2800,
    category: 'haircut',
  },
  {
    id: 'kids',
    name: 'Детская стрижка',
    description: 'Для юных джентльменов до 12 лет',
    duration: 45,
    price: 1500,
    category: 'haircut',
  },
  {
    id: 'beard',
    name: 'Моделирование бороды',
    description: 'Форма, контур опасной бритвой, масло и бальзам',
    duration: 45,
    price: 1700,
    category: 'beard',
    popular: true,
  },
  {
    id: 'royal',
    name: 'Королевское бритьё',
    description: 'Опасная бритва, три горячих полотенца, холодный компресс',
    duration: 60,
    price: 2300,
    category: 'beard',
  },
  {
    id: 'contour',
    name: 'Окантовка',
    description: 'Освежить контур между стрижками',
    duration: 20,
    price: 800,
    category: 'beard',
  },
  {
    id: 'combo',
    name: 'Стрижка + борода',
    description: 'Полный образ за один визит',
    duration: 100,
    price: 3500,
    category: 'combo',
    popular: true,
  },
  {
    id: 'father-son',
    name: 'Отец и сын',
    description: 'Две стрижки в соседних креслах',
    duration: 75,
    price: 3300,
    category: 'combo',
  },
  {
    id: 'camo',
    name: 'Камуфляж седины',
    description: 'Естественное тонирование волос или бороды',
    duration: 30,
    price: 1400,
    category: 'care',
  },
  {
    id: 'spa',
    name: 'Уход для кожи головы',
    description: 'Пилинг, массаж и маска',
    duration: 30,
    price: 1200,
    category: 'care',
  },
]

export const masters: Master[] = [
  {
    id: 'mark',
    name: 'Марк Ветров',
    role: 'Арт-директор',
    experience: 12,
    rating: 4.98,
    reviews: 412,
    specialties: ['Классика', 'Ножницы', 'Обучение'],
    quote: 'Хорошая стрижка видна через две недели, а не в день визита.',
    look: {
      skin: '#d6a47e',
      hair: '#2a1d16',
      hairStyle: 'pompadour',
      beard: 'full',
      bg: ['#3a2f22', '#15120e'],
    },
  },
  {
    id: 'timur',
    name: 'Тимур Галиев',
    role: 'Топ-барбер',
    experience: 8,
    rating: 4.95,
    reviews: 287,
    specialties: ['Фейд', 'Андеркат', 'Контур'],
    quote: 'Переход должен быть таким, чтобы его не было видно.',
    look: {
      skin: '#b98161',
      hair: '#121010',
      hairStyle: 'undercut',
      beard: 'short',
      bg: ['#2c2a28', '#121110'],
    },
  },
  {
    id: 'lev',
    name: 'Лев Сомов',
    role: 'Мастер бритья',
    experience: 10,
    rating: 4.97,
    reviews: 356,
    specialties: ['Опасная бритва', 'Борода', 'Уход'],
    quote: 'Бритьё — это ритуал. Спешить здесь некуда.',
    look: {
      skin: '#e1b894',
      hair: '#5b4636',
      hairStyle: 'bald',
      beard: 'full',
      bg: ['#3b3326', '#14110d'],
      glasses: true,
    },
  },
  {
    id: 'daniil',
    name: 'Даниил Орлов',
    role: 'Барбер',
    experience: 4,
    rating: 4.92,
    reviews: 143,
    specialties: ['Текстура', 'Кудри', 'Детские'],
    quote: 'Слушаю больше, чем говорю — так получается лучше.',
    look: {
      skin: '#c89373',
      hair: '#3b2a1f',
      hairStyle: 'curly',
      beard: 'stubble',
      bg: ['#2d2b27', '#11100f'],
    },
  },
]

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Игорь Беляков',
    initials: 'ИБ',
    rating: 5,
    text: 'Хожу к Марку третий год. Ни разу не пришлось объяснять дважды — он помнит, как я стригся в прошлый раз, и предлагает, что можно улучшить.',
    serviceId: 'classic',
    masterId: 'mark',
    date: '2026-09-12',
  },
  {
    id: 'r2',
    author: 'Никита Радов',
    initials: 'НР',
    rating: 5,
    text: 'Королевское бритьё у Льва — лучшие 60 минут недели. Горячие полотенца, тишина, никакой спешки. Кожа после — как после отпуска.',
    serviceId: 'royal',
    masterId: 'lev',
    date: '2026-09-03',
  },
  {
    id: 'r3',
    author: 'Павел Зорин',
    initials: 'ПЗ',
    rating: 5,
    text: 'Фейд от Тимура держится идеально почти месяц. Записался онлайн за минуту, пришёл — кофе уже ждал. Так и должен работать сервис.',
    serviceId: 'fade',
    masterId: 'timur',
    date: '2026-08-27',
  },
  {
    id: 'r4',
    author: 'Андрей Климов',
    initials: 'АК',
    rating: 5,
    text: 'Привёл сына на «Отец и сын». Даниил нашёл подход к ребёнку за две минуты, а мне сделал лучшую стрижку за последние годы.',
    serviceId: 'father-son',
    masterId: 'daniil',
    date: '2026-08-19',
  },
  {
    id: 'r5',
    author: 'Олег Суворин',
    initials: 'ОС',
    rating: 4,
    text: 'Отличная атмосфера и мастера. Единственное — в субботу вечером всё расписано, бронируйте заранее.',
    serviceId: 'combo',
    masterId: 'timur',
    date: '2026-08-08',
  },
  {
    id: 'r6',
    author: 'Руслан Ермаков',
    initials: 'РЕ',
    rating: 5,
    text: 'Долго не мог найти мастера для бороды, которая растёт как хочет. Лев собрал форму за один визит и объяснил, как ухаживать дома.',
    serviceId: 'beard',
    masterId: 'lev',
    date: '2026-07-30',
  },
]

export const stats = [
  { value: '12', label: 'лет в ремесле' },
  { value: '18 000+', label: 'стрижек в год' },
  { value: '4.9', label: 'средняя оценка' },
  { value: '73%', label: 'гостей возвращаются' },
]

export const perks = [
  { title: 'Кофе и чай', text: 'Свежеобжаренный кофе, пока вы ждёте' },
  { title: 'Точно по времени', text: 'Мастер начинает минута в минуту' },
  { title: 'Гарантия 7 дней', text: 'Бесплатно поправим, если что-то не так' },
]

// ----- Клиент для личного кабинета -----

export const demoClient = {
  name: 'Артём',
  fullName: 'Артём Корнилов',
  memberSince: '2023-03-14',
  points: 740,
  // уровни программы лояльности
  tiers: [
    { points: 0, label: 'Гость', discount: 0 },
    { points: 500, label: 'Завсегдатай', discount: 5 },
    { points: 1000, label: 'Член клуба', discount: 10 },
    { points: 2000, label: 'Почётный гость', discount: 15 },
  ],
}

export const visitHistory: Visit[] = [
  { id: 'v1', date: '2026-09-02', time: '19:00', serviceId: 'combo', masterId: 'mark', price: 3500, points: 175 },
  { id: 'v2', date: '2026-08-05', time: '18:30', serviceId: 'classic', masterId: 'mark', price: 2200, points: 110 },
  { id: 'v3', date: '2026-07-08', time: '12:00', serviceId: 'royal', masterId: 'lev', price: 2300, points: 115 },
  { id: 'v4', date: '2026-06-10', time: '20:00', serviceId: 'classic', masterId: 'timur', price: 2200, points: 110 },
  { id: 'v5', date: '2026-05-13', time: '11:30', serviceId: 'beard', masterId: 'lev', price: 1700, points: 85 },
  { id: 'v6', date: '2026-04-15', time: '19:30', serviceId: 'combo', masterId: 'mark', price: 3500, points: 145 },
]

// ----- Расписание -----

export const WORK_START = 10 // 10:00
export const WORK_END = 21 // последний слот начинается в 21:00
export const SLOT_STEP = 30 // минут

export function allSlots(): string[] {
  const res: string[] = []
  for (let m = WORK_START * 60; m <= WORK_END * 60; m += SLOT_STEP) {
    res.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return res
}

// Детерминированный «рандом», чтобы занятость слотов не прыгала между перерисовками.
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Занятые слоты для мастера на дату (yyyy-mm-dd). Около 40% слотов заняты, вечером — больше. */
export function busySlots(date: string, masterId: string): Set<string> {
  const busy = new Set<string>()
  for (const slot of allSlots()) {
    const hour = Number(slot.slice(0, 2))
    const threshold = hour >= 18 ? 55 : hour < 12 ? 25 : 38
    if (hash(`${date}|${masterId}|${slot}`) % 100 < threshold) busy.add(slot)
  }
  return busy
}

export const serviceById = (id: string) => services.find((s) => s.id === id)
export const masterById = (id: string) => masters.find((m) => m.id === id)
