# Бритва и Ко — демо-сайт барбершопа

Демо-проект для портфолио: сайт выдуманного барбершопа «Бритва и Ко» с онлайн-записью и личным кабинетом.
Бэкенда нет — все данные фейковые (`src/data/mock.ts`), вход, запись, перенос и отмена имитируются
на фронте через состояние React и `localStorage`.

**Демо:** https://ERMIN372.github.io/berbershop/

## Стек

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- react-router-dom с `HashRouter` — GitHub Pages не умеет серверный роутинг, поэтому маршруты живут после `#`
- lucide-react (иконки), шрифты Cormorant Garamond и Manrope через `@fontsource` (без внешних запросов)
- Все иллюстрации — SVG и CSS-градиенты, внешних картинок нет

## Страницы

| Страница | Адрес |
| --- | --- |
| Главная | `/#/` |
| Онлайн-запись (4 шага) | `/#/booking` |
| Запись с выбранной услугой / мастером | `/#/booking?service=combo`, `/#/booking?master=mark` |
| Экран успеха | `/#/booking/success` |
| Вход по телефону | `/#/login` |
| Личный кабинет | `/#/account` (нужен вход, подходит любой код) |

## Запуск локально

```bash
npm install
npm run dev       # http://localhost:5173/berbershop/
npm run build     # проверка типов + сборка в dist/
npm run preview   # http://localhost:4173/berbershop/
```

## Деплой на GitHub Pages

1. В репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Запушить в `main` — workflow `.github/workflows/deploy.yml` соберёт проект и выложит `dist/`.
3. Сайт появится по адресу `https://ERMIN372.github.io/berbershop/`.

Если переименуете репозиторий — поменяйте `base` в `vite.config.ts` на `'/<новое-имя>/'`.

## Структура

```
src/
  data/mock.ts          # все фейковые данные: услуги, мастера, отзывы, история, генератор занятых слотов
  lib/store.tsx         # «бэкенд»: авторизация, записи, тосты (React context + localStorage)
  lib/format.ts         # даты, цены, маска телефона
  components/           # лейаут, SVG-аватары и иллюстрации, календарь и сетка слотов
  pages/                # Home, Booking, BookingSuccess, Login, Account
```

Сбросить демо-данные: очистить `localStorage` сайта (ключи `britva.*`).

---

Все имена, адреса, телефоны и название заведения выдуманы. Демо-проект.
