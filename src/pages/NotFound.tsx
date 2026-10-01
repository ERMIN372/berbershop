import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center pt-24">
      <div className="container-x text-center">
        <div className="font-display text-[160px] font-semibold leading-none text-gold sm:text-[220px]">404</div>
        <h1 className="h-display mt-4 text-4xl sm:text-5xl">Здесь пока никого не стригут</h1>
        <Link to="/" className="btn-gold mt-10">
          <ArrowLeft size={16} /> На главную
        </Link>
      </div>
    </section>
  )
}
