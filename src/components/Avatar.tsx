import { useId } from 'react'
import type { AvatarLook } from '../data/mock'

/** Стилизованный SVG-портрет мастера. Никаких внешних картинок. */
export default function Avatar({ look, className = '', align = 'bottom' }: { look: AvatarLook; className?: string; align?: 'bottom' | 'center' }) {
  const id = useId().replace(/:/g, '')
  const { skin, hair, hairStyle, beard, bg, glasses } = look

  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-hidden="true" preserveAspectRatio={align === 'center' ? 'xMidYMid slice' : 'xMidYMax slice'}>
      <defs>
        <linearGradient id={`bg${id}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={bg[0]} />
          <stop offset="1" stopColor={bg[1]} />
        </linearGradient>
        <radialGradient id={`halo${id}`} cx="0.5" cy="0.38" r="0.5">
          <stop offset="0" stopColor="#c9a25a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#c9a25a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`skin${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={skin} stopOpacity="0.82" />
          <stop offset="0.55" stopColor={skin} />
          <stop offset="1" stopColor="#f3d7b6" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`jacket${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#23211e" />
          <stop offset="1" stopColor="#0d0c0b" />
        </linearGradient>
      </defs>

      <rect width="200" height="240" fill={`url(#bg${id})`} />
      <circle cx="100" cy="92" r="92" fill={`url(#halo${id})`} />
      {/* тонкие латунные дуги на фоне */}
      <circle cx="100" cy="96" r="78" fill="none" stroke="#c9a25a" strokeOpacity="0.18" />
      <circle cx="100" cy="96" r="64" fill="none" stroke="#c9a25a" strokeOpacity="0.08" />

      {/* плечи и пиджак */}
      <path d="M14 240 C18 196 52 172 100 170 C148 172 182 196 186 240 Z" fill={`url(#jacket${id})`} />
      <path d="M84 168 L100 204 L116 168 Z" fill="#e9e1d3" />
      <path d="M95 190 L100 184 L105 190 L101 214 L99 214 Z" fill="#8f6f36" />
      <path d="M84 167 L66 178 L94 234 L100 204 Z" fill="#171614" />
      <path d="M116 167 L134 178 L106 234 L100 204 Z" fill="#171614" />
      <path d="M66 178 L94 234" stroke="#c9a25a" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M134 178 L106 234" stroke="#c9a25a" strokeOpacity="0.35" strokeWidth="1" />

      {/* шея */}
      <path d="M86 128 L86 164 C92 172 108 172 114 164 L114 128 Z" fill={skin} />
      <path d="M86 150 C94 158 106 158 114 150 L114 140 L86 140 Z" fill="#000" opacity="0.18" />

      {/* уши */}
      <ellipse cx="64" cy="104" rx="6.5" ry="11" fill={skin} />
      <ellipse cx="136" cy="104" rx="6.5" ry="11" fill={skin} />

      {/* голова */}
      <ellipse cx="100" cy="98" rx="36" ry="45" fill={`url(#skin${id})`} />

      {/* волосы */}
      {hairStyle === 'pompadour' && (
        <>
          <path d="M63 98 C58 60 76 34 106 34 C134 35 146 58 138 98 C136 82 131 72 120 67 C104 62 82 64 70 76 C66 82 64 90 63 98 Z" fill={hair} />
          <path d="M72 62 C86 40 118 36 134 52 C120 44 96 44 78 58 Z" fill="#fff" opacity="0.12" />
        </>
      )}
      {hairStyle === 'undercut' && (
        <>
          <path d="M64 92 C62 64 82 46 106 46 C128 47 140 62 137 90 C132 78 124 70 110 67 C92 64 74 72 64 92 Z" fill={hair} />
          <path d="M64 92 C64 100 64 106 65 112 L68 112 C67 104 67 96 70 88 Z" fill={hair} opacity="0.45" />
          <path d="M136 90 C136 100 136 106 135 112 L132 112 C133 104 133 96 130 88 Z" fill={hair} opacity="0.45" />
          <path d="M84 54 C98 46 118 48 130 60" stroke="#fff" strokeOpacity="0.14" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {hairStyle === 'buzz' && <path d="M64 96 C62 66 80 52 100 52 C120 52 138 66 136 96 C126 80 74 80 64 96 Z" fill={hair} opacity="0.7" />}
      {hairStyle === 'bald' && (
        <>
          <path d="M64 108 C63 96 64 90 66 86 L70 88 C68 96 68 102 69 110 Z" fill={hair} opacity="0.8" />
          <path d="M136 108 C137 96 136 90 134 86 L130 88 C132 96 132 102 131 110 Z" fill={hair} opacity="0.8" />
          <ellipse cx="112" cy="66" rx="12" ry="6" fill="#fff" opacity="0.18" transform="rotate(-20 112 66)" />
        </>
      )}
      {hairStyle === 'curly' && (
        <g fill={hair}>
          <path d="M64 96 C60 70 78 50 100 50 C122 50 140 70 136 96 C128 80 72 80 64 96 Z" />
          {[
            [70, 70, 11], [82, 56, 12], [98, 50, 13], [114, 54, 12], [128, 64, 11], [134, 80, 9], [66, 84, 9],
            [90, 62, 9], [108, 62, 9],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
          <circle cx="96" cy="46" r="5" fill="#fff" opacity="0.1" />
        </g>
      )}

      {/* брови и глаза */}
      <path d="M78 90 Q86 85 94 89" stroke={hair} strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M106 89 Q114 85 122 90" stroke={hair} strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <ellipse cx="86" cy="100" rx="3.2" ry="2.6" fill="#1a1411" />
      <ellipse cx="114" cy="100" rx="3.2" ry="2.6" fill="#1a1411" />
      {/* нос */}
      <path d="M101 102 Q97 114 98 116 Q101 118 104 116" stroke="#000" strokeOpacity="0.22" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* борода */}
      {beard === 'full' && (
        <>
          <path d="M63 102 C62 138 80 162 100 164 C120 162 138 138 137 102 C132 116 126 124 116 126 C108 121 92 121 84 126 C74 124 68 116 63 102 Z" fill={hair} />
          <path d="M84 124 C92 118 108 118 116 124 C110 122 90 122 84 124 Z" fill={hair} />
          <path d="M92 131 Q100 134 108 131" stroke="#000" strokeOpacity="0.45" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M80 144 C90 156 110 156 120 144" stroke="#fff" strokeOpacity="0.08" strokeWidth="3" fill="none" />
        </>
      )}
      {beard === 'short' && (
        <>
          <path d="M65 104 C66 132 82 150 100 151 C118 150 134 132 135 104 C130 118 124 124 116 126 C108 122 92 122 84 126 C76 124 70 118 65 104 Z" fill={hair} opacity="0.92" />
          <path d="M92 131 Q100 133 108 131" stroke="#000" strokeOpacity="0.4" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      {beard === 'stubble' && (
        <>
          <path d="M66 106 C68 132 82 148 100 149 C118 148 132 132 134 106 C128 120 120 126 100 126 C80 126 72 120 66 106 Z" fill={hair} opacity="0.35" />
          <path d="M91 130 Q100 134 109 130" stroke="#6b3c30" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      )}
      {beard === 'moustache' && (
        <>
          <path d="M84 124 C92 118 108 118 116 124 C110 126 104 124 100 122 C96 124 90 126 84 124 Z" fill={hair} />
          <path d="M92 131 Q100 134 108 131" stroke="#6b3c30" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      )}
      {beard === 'none' && <path d="M91 128 Q100 133 109 128" stroke="#6b3c30" strokeWidth="2.2" fill="none" strokeLinecap="round" />}

      {glasses && (
        <g stroke="#c9a25a" strokeWidth="2" fill="#c9a25a" fillOpacity="0.06">
          <circle cx="86" cy="100" r="10" />
          <circle cx="114" cy="100" r="10" />
          <path d="M96 99 Q100 96 104 99" fill="none" />
          <path d="M76 98 L66 96 M124 98 L134 96" fill="none" />
        </g>
      )}

      {/* контровой свет */}
      <path d="M132 70 C140 86 140 112 130 132" stroke="#e6c98c" strokeOpacity="0.35" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}
