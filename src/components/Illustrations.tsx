import { useId } from 'react'

/** Главная иллюстрация hero: латунный медальон с опасной бритвой и вращающейся надписью. */
export function HeroEmblem({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const ticks = Array.from({ length: 120 })
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`brass${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dfae" />
          <stop offset="0.45" stopColor="#c9a25a" />
          <stop offset="1" stopColor="#7d5f2c" />
        </linearGradient>
        <linearGradient id={`steel${id}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#f5f1ea" />
          <stop offset="0.35" stopColor="#bdb7ad" />
          <stop offset="0.7" stopColor="#6d6860" />
          <stop offset="1" stopColor="#d9d3c8" />
        </linearGradient>
        <linearGradient id={`handle${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2e2a25" />
          <stop offset="1" stopColor="#0c0b0a" />
        </linearGradient>
        <radialGradient id={`core${id}`} cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor="#2a2622" />
          <stop offset="1" stopColor="#0e0d0c" />
        </radialGradient>
        <radialGradient id={`glow${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c9a25a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#c9a25a" stopOpacity="0" />
        </radialGradient>
        <path id={`ring${id}`} d="M300,300 m-232,0 a232,232 0 1,1 464,0 a232,232 0 1,1 -464,0" />
      </defs>

      <circle cx="300" cy="300" r="300" fill={`url(#glow${id})`} />
      <circle cx="300" cy="300" r="270" fill="none" stroke={`url(#brass${id})`} strokeWidth="1.2" opacity="0.7" />

      <g className="animate-spin-slow" style={{ transformBox: 'view-box', transformOrigin: '300px 300px' }}>
        <text fill="#c9a25a" fontSize="17" letterSpacing="9.6" fontFamily="Manrope, sans-serif" fontWeight="600">
          <textPath href={`#ring${id}`}>БРИТВА И КО · МУЖСКОЙ КЛУБ · СТРИЖКА И БРИТЬЁ · С 2014 ГОДА ·</textPath>
        </text>
      </g>

      <g stroke="#c9a25a">
        {ticks.map((_, i) => {
          const a = (i / ticks.length) * Math.PI * 2
          const long = i % 10 === 0
          const r1 = 205
          const r2 = long ? 190 : 198
          return (
            <line
              key={i}
              x1={300 + Math.cos(a) * r1}
              y1={300 + Math.sin(a) * r1}
              x2={300 + Math.cos(a) * r2}
              y2={300 + Math.sin(a) * r2}
              strokeOpacity={long ? 0.8 : 0.3}
              strokeWidth={long ? 1.6 : 1}
            />
          )
        })}
      </g>

      <circle cx="300" cy="300" r="180" fill={`url(#core${id})`} stroke={`url(#brass${id})`} strokeWidth="2" />
      <circle cx="300" cy="300" r="168" fill="none" stroke="#c9a25a" strokeOpacity="0.25" strokeDasharray="2 6" />

      {/* опасная бритва */}
      <g transform="rotate(-38 300 300)">
        {/* рукоять */}
        <path d="M150 312 C150 296 162 286 178 286 L336 292 C346 293 350 298 350 304 C350 310 346 315 336 316 L178 322 C162 322 150 324 150 312 Z" fill={`url(#handle${id})`} stroke={`url(#brass${id})`} strokeWidth="1.5" />
        <path d="M176 294 L332 298" stroke="#fff" strokeOpacity="0.08" strokeWidth="3" strokeLinecap="round" />
        <circle cx="170" cy="304" r="6" fill={`url(#brass${id})`} />
        <circle cx="332" cy="304" r="7" fill={`url(#brass${id})`} />
        <circle cx="332" cy="304" r="2.5" fill="#0b0a09" />
        {/* лезвие */}
        <path d="M326 300 L352 282 C386 266 436 262 470 270 C474 271 476 275 474 279 L452 314 C450 318 446 320 442 320 L358 318 C344 318 332 312 326 300 Z" fill={`url(#steel${id})`} />
        <path d="M352 290 C388 276 434 272 466 278" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.5" fill="none" />
        <path d="M360 312 L446 313" stroke="#3b3833" strokeOpacity="0.6" strokeWidth="1" />
        <text x="372" y="302" fontSize="9" letterSpacing="2.5" fill="#3b3833" fontFamily="Manrope, sans-serif" fontWeight="700">БРИТВА·КО</text>
        {/* хвостовик */}
        <path d="M326 300 L312 296 C306 295 304 300 306 304 L312 314 C314 318 318 318 322 315 Z" fill={`url(#brass${id})`} />
      </g>

      {/* звёзды-блики */}
      <g fill="#f3dfae">
        <path d="M430 196 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 z" opacity="0.9" />
        <path d="M196 404 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" opacity="0.6" />
      </g>

      <text x="300" y="418" textAnchor="middle" fill="#c9a25a" fontSize="13" letterSpacing="6" fontFamily="Manrope, sans-serif" fontWeight="600" opacity="0.8">
        EST · 2014
      </text>
    </svg>
  )
}

/** Абстрактная карта района с пином — вместо внешних карт. */
export function MapArt({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 640 480" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`mg${id}`} cx="0.55" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#1f1d1a" />
          <stop offset="1" stopColor="#0d0c0b" />
        </radialGradient>
        <radialGradient id={`pinGlow${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c9a25a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#c9a25a" stopOpacity="0" />
        </radialGradient>
        <pattern id={`grid${id}`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0 H0 V32" fill="none" stroke="#fff" strokeOpacity="0.03" />
        </pattern>
      </defs>
      <rect width="640" height="480" fill={`url(#mg${id})`} />
      <rect width="640" height="480" fill={`url(#grid${id})`} />

      {/* река */}
      <path d="M-20 390 C120 350 180 420 300 380 C420 340 470 400 660 350 L660 480 L-20 480 Z" fill="#1c2a2c" opacity="0.55" />
      <path d="M-20 390 C120 350 180 420 300 380 C420 340 470 400 660 350" stroke="#3a5256" strokeOpacity="0.5" fill="none" />

      {/* кварталы */}
      <g fill="#fff" fillOpacity="0.035" stroke="#fff" strokeOpacity="0.05">
        {[
          [40, 40, 120, 80], [180, 40, 90, 80], [290, 40, 140, 60], [450, 30, 150, 90],
          [40, 140, 80, 110], [140, 140, 130, 50], [140, 210, 130, 50], [450, 140, 70, 70], [540, 140, 70, 110],
          [40, 270, 110, 60], [170, 280, 100, 50], [450, 230, 150, 60],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="6" />
        ))}
      </g>
      {/* парк */}
      <rect x="290" y="120" width="140" height="120" rx="10" fill="#27301f" opacity="0.5" />
      <g fill="#3c4a2e" opacity="0.7">
        {[[315, 145], [350, 160], [390, 140], [330, 200], [375, 210], [405, 185]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="9" />
        ))}
      </g>

      {/* улицы */}
      <g stroke="#3a3632" strokeWidth="10" strokeLinecap="round" fill="none">
        <path d="M-10 128 H650" />
        <path d="M280 -10 V350" />
        <path d="M440 -10 V330" />
      </g>
      <g stroke="#c9a25a" strokeOpacity="0.55" strokeWidth="3" strokeDasharray="1 10" strokeLinecap="round" fill="none">
        <path d="M190 128 L280 128 L280 262 L360 262" />
      </g>

      {/* метро */}
      <g transform="translate(190 128)">
        <circle r="15" fill="#0b0a09" stroke="#a39c91" strokeWidth="2" />
        <text y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#efe8dc" fontFamily="Manrope, sans-serif">М</text>
      </g>
      <text x="190" y="100" textAnchor="middle" fontSize="12" fill="#a39c91" fontFamily="Manrope, sans-serif">Кузнечная</text>

      <text x="560" y="120" textAnchor="end" fontSize="11" letterSpacing="2" fill="#6f6a62" fontFamily="Manrope, sans-serif">УЛ. ЛИТЕЙЩИКОВ</text>
      <text x="360" y="232" textAnchor="middle" fontSize="11" letterSpacing="2" fill="#6f6a62" fontFamily="Manrope, sans-serif">СКВЕР</text>

      {/* пин */}
      <circle cx="360" cy="262" r="70" fill={`url(#pinGlow${id})`} />
      <circle cx="360" cy="262" r="22" fill="none" stroke="#c9a25a" strokeOpacity="0.5">
        <animate attributeName="r" values="14;40" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <path d="M360 268 C360 268 336 240 336 224 A24 24 0 0 1 384 224 C384 240 360 268 360 268 Z" fill="#c9a25a" />
      <circle cx="360" cy="224" r="9" fill="#0b0a09" />
    </svg>
  )
}

/** Декоративная полоса «барбер-пол» из латуни. */
export function PoleStripe({ className = '' }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(201,162,90,0.9) 0 10px, transparent 10px 22px)',
      }}
      aria-hidden="true"
    />
  )
}
