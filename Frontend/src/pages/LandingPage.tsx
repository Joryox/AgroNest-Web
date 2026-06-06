import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuthStore } from '@/features/auth'
import { BackgroundPaths } from '@/components/ui/background-paths'
import { DynamicIsland } from '@/components/ui/dynamic-island'
import { Map, MapMarker, MarkerContent } from '@/components/ui/mapcn-map-route'

// ─── Landing-specific styles ──────────────────────────────────────────────────
const LANDING_STYLES = `
  html { scroll-behavior: smooth; }

  @keyframes ken-burns {
    0%   { transform: scale(1.0)  translate(0px,    0px); }
    100% { transform: scale(1.15) translate(-22px, -10px); }
  }
  .ken-burns-img {
    animation: ken-burns 25s ease-in-out infinite alternate;
    transform-origin: center center;
    will-change: transform;
  }

  @keyframes hero-reveal {
    from { opacity: 0; transform: translateY(28px); filter: blur(10px); }
    to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
  }
  .hr-1 { animation: hero-reveal 1s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
  .hr-2 { animation: hero-reveal 1s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
  .hr-3 { animation: hero-reveal 1s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
  .hr-4 { animation: hero-reveal 1s cubic-bezier(0.16,1,0.3,1) 0.75s both; }
  .hr-5 { animation: hero-reveal 1s cubic-bezier(0.16,1,0.3,1) 0.92s both; }

  .scroll-reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .scroll-reveal.visible { opacity: 1; transform: translateY(0); }
  .d1 { transition-delay: 0.10s; }
  .d2 { transition-delay: 0.20s; }
  .d3 { transition-delay: 0.30s; }
  .d4 { transition-delay: 0.40s; }
  .d5 { transition-delay: 0.50s; }
  .d6 { transition-delay: 0.60s; }

  @keyframes gradient-pan {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .cta-gradient {
    background: linear-gradient(135deg,#052e16 0%,#14532d 25%,#166534 50%,#0f4c2a 75%,#064e3b 100%);
    background-size: 300% 300%;
    animation: gradient-pan 12s ease infinite;
  }

  .card-hover {
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 24px 56px rgba(34,197,94,0.18), 0 8px 20px rgba(0,0,0,0.12);
  }
  .tech-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .tech-card:hover {
    transform: translateY(-4px) scale(1.015);
    box-shadow: 0 0 32px rgba(34,197,94,0.2), 0 8px 24px rgba(0,0,0,0.1);
    border-color: rgba(34,197,94,0.4) !important;
  }
  .sponsor-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .sponsor-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(34,197,94,0.15), 0 4px 14px rgba(0,0,0,0.1);
    border-color: rgba(34,197,94,0.35) !important;
  }
  .team-card {
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
  }
  .team-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 24px 60px rgba(34,197,94,0.2), 0 8px 24px rgba(0,0,0,0.12);
  }
  .btn-glow-green:hover {
    box-shadow: 0 0 28px rgba(34,197,94,0.55), 0 4px 16px rgba(34,197,94,0.3);
  }
  .btn-glow-amber:hover {
    box-shadow: 0 0 28px rgba(234,179,8,0.55), 0 4px 16px rgba(234,179,8,0.3);
  }

  @keyframes light-sweep {
    0%,100% { background-position: 0% 60%; }
    50%     { background-position: 100% 40%; }
  }
  .hero-light-overlay {
    background: linear-gradient(125deg,
      rgba(2,6,23,0.0)  0%,
      rgba(56,189,248,0.05) 20%,
      rgba(16,185,129,0.08) 50%,
      rgba(56,189,248,0.05) 80%,
      rgba(2,6,23,0.0)  100%
    );
    background-size: 250% 250%;
    animation: light-sweep 15s ease infinite;
  }

  .hero-vignette {
    background: radial-gradient(ellipse at center,
      transparent 28%,
      rgba(0,0,0,0.22) 65%,
      rgba(0,0,0,0.58) 100%
    );
  }

  @keyframes particle-float {
    0%   { transform: translateY(0) translateX(0);        opacity: 0; }
    10%  { opacity: 0.85; }
    90%  { opacity: 0.45; }
    100% { transform: translateY(-130px) translateX(18px); opacity: 0; }
  }
  @keyframes particle-float-2 {
    0%   { transform: translateY(0) translateX(0);         opacity: 0; }
    12%  { opacity: 0.65; }
    88%  { opacity: 0.3; }
    100% { transform: translateY(-100px) translateX(-14px); opacity: 0; }
  }
  @keyframes particle-float-3 {
    0%   { transform: translateY(0) translateX(0);       opacity: 0; }
    15%  { opacity: 0.5; }
    85%  { opacity: 0.2; }
    100% { transform: translateY(-80px) translateX(9px);  opacity: 0; }
  }
  .hero-particle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(252,211,77,0.95) 0%, rgba(245,158,11,0.5) 55%, transparent 100%);
    pointer-events: none;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }

  @keyframes shine-sweep {
    0%   { transform: translateX(-180%) skewX(-20deg); }
    100% { transform: translateX(280%)  skewX(-20deg); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);    opacity: 0.65; }
    100% { transform: scale(1.65); opacity: 0; }
  }
  @keyframes house-bounce {
    0%,100% { transform: translateY(0);    }
    50%     { transform: translateY(-4px); }
  }
  @keyframes arrow-slide {
    0%,100% { transform: translateX(0);   }
    50%     { transform: translateX(5px); }
  }
  .btn-hero {
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  }
  .btn-hero .shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.38) 50%, transparent 65%);
    transform: translateX(-180%) skewX(-20deg);
    pointer-events: none;
  }
  .btn-hero:hover .shine { animation: shine-sweep 0.55s ease forwards; }
  .btn-hero:active        { transform: scale(0.97) !important; }
  .btn-hero-green:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 0 40px rgba(16,185,129,0.5), 0 8px 28px rgba(16,185,129,0.25), 0 4px 14px rgba(0,0,0,0.25);
  }
  .btn-hero-amber:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 0 40px rgba(56,189,248,0.4), 0 8px 28px rgba(56,189,248,0.2), 0 4px 14px rgba(0,0,0,0.25);
  }
  .pulse-ring-el {
    position: absolute;
    inset: -5px;
    border-radius: 1.2rem;
    border: 2px solid rgba(255,255,255,0.3);
    animation: pulse-ring 2.2s ease-out infinite;
    pointer-events: none;
  }
  .btn-hero-green:hover .icon-house { animation: house-bounce 0.55s ease infinite; }
  .btn-hero-amber:hover .icon-arrow { animation: arrow-slide  0.55s ease infinite; }

  @keyframes scroll-bounce {
    0%,100% { transform: translateY(0); opacity: 0.8; }
    50%      { transform: translateY(8px); opacity: 0.3; }
  }
  .scroll-dot { animation: scroll-bounce 2s ease-in-out infinite; }

  .video-bg { will-change: transform; }

  @keyframes float-gentle {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-8px); }
  }
  .float-1 { animation: float-gentle 5s ease-in-out infinite; }
  .float-2 { animation: float-gentle 5s ease-in-out 1s infinite; }
  .float-3 { animation: float-gentle 5s ease-in-out 2s infinite; }
`

// ─── Shared hooks ─────────────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) { el.classList.add('visible'); observer.unobserve(el) }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function useCountUp(target: number, suffix = '', prefix = '', duration = 2200) {
  const [display, setDisplay] = useState(prefix + '0' + suffix)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !started.current) {
          started.current = true
          const t0 = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setDisplay(prefix + Math.round(eased * target).toLocaleString() + suffix)
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix, prefix, duration])
  return { display, ref }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center bg-slate-950">
      <BackgroundPaths title="AgroNest" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-20" />
    </section>
  )
}

// ─── Simple Explainer ──────────────────────────────────────────────────────────
type ExplainerItem = { title: string; desc: string; delay: string }

const EXPLAINER_ITEMS: ExplainerItem[] = [
  {
    title: 'Financiamiento directo para el campo',
    desc: 'Registra tu terreno y cosecha futura. Recibe capital de inversores globales sin intermediarios, bancos ni burocracia excesiva.',
    delay: '',
  },
  {
    title: 'Inversión transparente desde $1 USDC',
    desc: 'Apoya el campo real invirtiendo en cosechas verificadas. Obtén rendimientos mientras impactas directamente en la economía local.',
    delay: 'd2',
  },
  {
    title: 'Seguridad basada en Blockchain',
    desc: 'Contratos inteligentes protegen el capital y satélites de la NASA validan el progreso, garantizando transparencia absoluta.',
    delay: 'd4',
  },
]

function ExplainerCard({ item }: { item: ExplainerItem }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`scroll-reveal ${item.delay}`}>
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-700 transition-all duration-300">
        <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

function SimpleExplainer() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-black text-white text-center mb-16">¿Qué es AgroNest?</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {EXPLAINER_ITEMS.map(item => <ExplainerCard key={item.title} item={item} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Video Band ───────────────────────────────────────────────────────────────
function VideoBand() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="relative h-96 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-slate-950/60 z-10" />
      <video ref={videoRef} className="w-full h-full object-cover object-[center_30%]" autoPlay muted loop playsInline>
        <source src="/media/3v.mp4" type="video/mp4" />
      </video>
      {/* Fade from previous section (now dark slate-950) */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-slate-950 to-transparent" />
      {/* Fade to next section (StatsBar — dark slate) */}
      <div className="absolute bottom-0 left-0 right-0 h-28" style={{background: 'linear-gradient(to top, #020617, transparent)'}} />

      {/* Quote text */}
      <div className="relative z-10 h-full flex items-center px-6 sm:px-10 lg:px-16 max-w-5xl mx-auto">
        <div>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg">
            "Del campo al mundo,
            <br />
            <span className="text-emerald-400">sin intermediarios."</span>
          </p>
          <p className="text-white/60 text-base sm:text-lg mt-4 font-medium">
            AgroNest — financiamiento agrícola descentralizado para el siglo XXI.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
type Stat = { value: number; prefix: string; suffix: string; label: string; sub: string }

const STATS: Stat[] = [
  { value: 1,   prefix: '$', suffix: '',  label: 'Inversión mínima',  sub: 'Al alcance de todos' },
  { value: 100, prefix: '',  suffix: '%', label: 'On-chain',           sub: 'Sin backends ocultos' },
  { value: 0,   prefix: '',  suffix: '',  label: 'Intermediarios',     sub: 'Agricultor ↔ Inversor directo' },
  { value: 100, prefix: '',  suffix: '%', label: 'NASA verificado',    sub: 'Por satélite NDVI' },
]

function StatItem({ s }: { s: Stat }) {
  const { display, ref: countRef } = useCountUp(s.value, s.suffix, s.prefix, 2000)
  const revealRef = useScrollReveal()
  return (
    <div ref={revealRef} className="scroll-reveal text-center px-2">
      <div className="text-5xl sm:text-6xl font-black text-white tabular-nums mb-1.5 tracking-tight">
        <span ref={countRef}>{display}</span>
      </div>
      <div className="text-primary-200 font-bold text-base mb-0.5">{s.label}</div>
      <div className="text-primary-400 text-xs uppercase tracking-wider">{s.sub}</div>
    </div>
  )
}

function StatsBar() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-20 border-y border-slate-800">
      <div className="absolute inset-0 pointer-events-none"
        style={{background: 'radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(56,189,248,0.05) 0%, transparent 60%)'}} />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {STATS.map(s => <StatItem key={s.label} s={s} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Problem / Solution ───────────────────────────────────────────────────────
function ProblemSolution() {
  const titleRef = useScrollReveal()
  const leftRef  = useScrollReveal()
  const rightRef = useScrollReveal()

  const checkX = (
    <svg className="w-5 h-5 mt-0.5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
  const checkOk = (
    <svg className="w-5 h-5 mt-0.5 shrink-0 text-accent-300" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="scroll-reveal text-center mb-14">
          <span className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-widest mb-3">El contexto</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Un problema de siglos.{' '}
            <span className="text-primary-600 dark:text-primary-400">Una solución de hoy.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem */}
          <div ref={leftRef} className="scroll-reveal">
            <div className="h-full rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500/70 to-orange-500/60" />
              <div className="inline-flex items-center gap-2 bg-red-900/20 border border-red-800/40 text-red-400 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                El problema
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 leading-snug">
                El campo lleva décadas sin acceso al dinero que merece.
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                El 70% de los pequeños agricultores en Latinoamérica no tiene acceso a financiamiento formal.
                Los que lo consiguen pagan tasas abusivas y quedan atrapados en deudas que duran generaciones.
              </p>
              <ul className="space-y-3">
                {[
                  'Créditos con tasas de 30–60% anual que ahogan al agricultor',
                  'Bancos que piden avales e hipotecas imposibles de cumplir',
                  'Intermediarios que se llevan el 40–60% de las ganancias',
                  'Ciclos de deuda que pasan de padres a hijos, sin salida',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-gray-400 text-sm">
                    {checkX}{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution */}
          <div ref={rightRef} className="scroll-reveal d2">
            <div className="h-full rounded-3xl bg-gradient-to-br from-primary-600 to-emerald-700 p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-400 to-accent-300" />
              <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full bg-white/8 pointer-events-none" />
              <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/25 text-white rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                La solución
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 leading-snug">
                Con AgroNest, el campo tiene voz — y capital directo.
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-8">
                Cualquier agricultor accede a capital global sin bancos, sin avales, sin intermediarios.
                Un contrato automático y los satélites de la NASA garantizan cada centavo.
              </p>
              <ul className="space-y-3">
                {[
                  'Tasas acordadas directamente con quien te financia',
                  'Sin avales — tu cosecha es la garantía, nada más',
                  'El dinero llega automático, sin intermediarios ni demoras',
                  'Satélites de la NASA verifican los resultados sin sesgo',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-white/85 text-sm">
                    {checkOk}{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
type Step = { step: string; icon: React.ReactNode; title: string; subtitle: string; description: string; delay: string }

const STEPS: Step[] = [
  {
    step: '01', delay: '',
    title: 'Registra tu cosecha y obtén tu certificado digital',
    subtitle: 'Certificado digital único — imposible de falsificar',
    description: 'Sube los datos de tu terreno y cosecha futura. Emitimos un certificado digital único que garantiza la propiedad y progreso del cultivo.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    step: '02', delay: 'd2',
    title: 'Personas de todo el mundo invierten en tu cosecha',
    subtitle: 'Inversiones desde $1 USDC — capital asegurado',
    description: 'Cualquier persona puede invertir desde $1 USDC. El dinero entra protegido en un acuerdo automático y se libera en etapas verificadas por satélite.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    step: '03', delay: 'd4',
    title: 'Al cosechar, el pago llega solo — automático',
    subtitle: 'Contrato automático y verificación satelital',
    description: 'Cuando llegue la cosecha, el satélite confirma los resultados y el contrato automático reparte los pagos — sin bancos, sin demoras.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

function StepCard({ item }: { item: Step }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`scroll-reveal ${item.delay}`}>
      <div className="relative group h-full bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-300">
        <div className="absolute -top-4 left-8 bg-gradient-to-r from-primary-600 to-emerald-600 text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg shadow-primary-600/25">
          Paso {item.step}
        </div>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/40 dark:to-emerald-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-5 mt-3 group-hover:scale-110 transition-transform duration-300">
          {item.icon}
        </div>
        <h3 className="text-lg font-black text-white mb-1.5 leading-snug">{item.title}</h3>
        <p className="text-xs text-primary-600 dark:text-primary-400 font-mono mb-3 leading-snug opacity-70">{item.subtitle}</p>
        <p className="text-gray-400 leading-relaxed text-sm">{item.description}</p>
      </div>
    </div>
  )
}

function HowItWorks() {
  const titleRef = useScrollReveal()
  return (
    <section id="how-it-works" className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="scroll-reveal text-center mb-20">
          <span className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-widest mb-3">El proceso</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white">Cómo funciona AgroNest</h2>
          <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
            Tres pasos que conectan campo y capital. Sin complicaciones.
          </p>
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute top-[2.75rem] left-[calc(16.67%+3rem)] right-[calc(16.67%+3rem)] h-0.5 bg-gradient-to-r from-transparent via-primary-300 dark:via-primary-700 to-transparent" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {STEPS.map(item => <StepCard key={item.step} item={item} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Technology ───────────────────────────────────────────────────────────────
type TechFeature = { icon: React.ReactNode; title: string; subtitle: string; description: string; delay: string; accent: string }

const TECH: TechFeature[] = [
  {
    delay: '', accent: 'rgba(99,102,241,0.15)',
    title: 'Transacciones rapidísimas y baratas',
    subtitle: 'Red rápida y segura',
    description: 'Olvídate de pagar comisiones altas. Cada operación en AgroNest cuesta centavos gracias a nuestra infraestructura rápida y segura.',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
  {
    delay: 'd1', accent: 'rgba(34,197,94,0.15)',
    title: 'Tu dinero está blindado desde el día uno',
    subtitle: 'Dinero protegido en etapas',
    description: 'Nadie puede tocar los fondos hasta que la cosecha sea verificada. El contrato automático los libera en etapas objetivas — imparcial e inmutable.',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  },
  {
    delay: 'd2', accent: 'rgba(14,165,233,0.15)',
    title: 'Verificamos tu terreno desde el espacio',
    subtitle: 'Verificación satelital de la NASA',
    description: 'Imágenes satelitales confirman que el terreno existe y la cosecha avanza. Datos objetivos e incorruptibles — sin promesas vacías.',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    delay: 'd4', accent: 'rgba(234,179,8,0.15)',
    title: 'Cosechas convertidas en activos digitales',
    subtitle: 'Certificados únicos fraccionados',
    description: 'Cada cosecha es un certificado único fraccionado en partes accesibles desde $1 USDC. Como acciones de bolsa, pero respaldadas en alimento real.',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  },
  {
    delay: 'd5', accent: 'rgba(34,197,94,0.12)',
    title: 'Todo a la vista, siempre — sin caja negra',
    subtitle: 'Transparencia total on-chain',
    description: 'Cada peso, cada verificación, cada pago — registrado en Ethereum para siempre. Cualquier persona del mundo puede auditarlo. No hay trampa posible.',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  },
]

function TechCard({ feature }: { feature: TechFeature }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`scroll-reveal ${feature.delay} tech-card`}>
      <div className="h-full rounded-2xl p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
          style={{background: `radial-gradient(ellipse at 30% 30%, ${feature.accent}, transparent 70%)`}} />
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-gray-100 dark:border-slate-800 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-5 shadow-sm">
            {feature.icon}
          </div>
          <h3 className="text-lg font-black text-white mb-2 leading-snug">{feature.title}</h3>
          <p className="text-xs text-primary-500 dark:text-primary-400 font-mono mb-2 opacity-70">{feature.subtitle}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </div>
  )
}

function Technology() {
  const titleRef = useScrollReveal()
  return (
    <section id="technology" className="relative py-24 bg-slate-950 overflow-hidden">
      {/* Subtle aerial texture from 4i.jpg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url("/media/4i.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(1)',
          opacity: 0.04,
        }}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="scroll-reveal text-center mb-16">
          <span className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-widest mb-3">Stack técnico</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white">Tecnología de vanguardia</h2>
          <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
            Construido sobre los mejores bloques de Web3 y DeFi — explicados sin jerga.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH.map(f => <TechCard key={f.title} feature={f} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Sponsors ─────────────────────────────────────────────────────────────────
type Sponsor = { name: string; color: string; tagline: string; description: string; delay: string }

const SPONSORS: Sponsor[] = [
  {
    name: 'Arbitrum', color: '#4F85E5', tagline: 'L2 de Ethereum', delay: '',
    description: 'AgroNest está desplegado en Arbitrum para habilitar microtransacciones viables con gas casi nulo — porque el campo no puede pagar $50 en fees.',
  },
  {
    name: 'Bitso', color: '#F7941D', tagline: 'On/Off Ramp', delay: 'd1',
    description: 'Visión de integrar Bitso para que agricultores e inversores conviertan pesos mexicanos ↔ USDC sin salir del ecosistema AgroNest.',
  },
  {
    name: 'Etherfuse', color: '#00C2B3', tagline: 'RWA tokenizados', delay: 'd2',
    description: 'Alineados con la visión de Etherfuse de tokenizar activos del mundo real — AgroNest lleva eso al sector más esencial: el campo.',
  },
  {
    name: 'Eth México', color: '#7B68EE', tagline: 'Comunidad Web3', delay: 'd3',
    description: 'Construido sobre Ethereum, presentado en el hackathon de Ethereum México — donde la comunidad Web3 mexicana innova para el mundo.',
  },
]

function SponsorCard({ s }: { s: Sponsor }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`scroll-reveal ${s.delay} sponsor-card`}>
      <div className="h-full rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1" style={{background: `linear-gradient(to right, ${s.color}cc, ${s.color}44)`}} />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shrink-0"
            style={{background: s.color}}>
            {s.name[0]}
          </div>
          <div>
            <div className="font-bold text-white text-sm">{s.name}</div>
            <div className="text-gray-400 text-xs">{s.tagline}</div>
          </div>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{s.description}</p>
      </div>
    </div>
  )
}

function Sponsors() {
  const titleRef = useScrollReveal()
  return (
    <section id="sponsors" className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="scroll-reveal text-center mb-14">
          <span className="inline-block text-primary-400 font-semibold text-xs uppercase tracking-widest mb-3">Ecosistema</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white">Construido en el ecosistema</h2>
          <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
            AgroNest nace en el cruce entre los mejores proyectos del ecosistema Web3 latinoamericano.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPONSORS.map(s => <SponsorCard key={s.name} s={s} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Team ─────────────────────────────────────────────────────────────────────
type Member = { name: string; role: string; initials: string; gradient: string; delay: string }

const TEAM: Member[] = [
  { name: 'Jorge Raul Ramos', role: 'Frontend & UX',               initials: 'JO', gradient: 'from-primary-500 to-emerald-600', delay: '' },
  { name: 'Oscar Ivan Ramos', role: 'Backend',         initials: 'OR', gradient: 'from-blue-500 to-indigo-600',     delay: 'd1' },
  { name: 'Lizandro Garcia', role: 'Experto en Web3',initials: 'LG', gradient: 'from-violet-500 to-purple-600',   delay: 'd2' },
  { name: 'Carlos Daniel', role: 'Analista Funcional',                        initials: 'CC', gradient: 'from-amber-500 to-orange-600',    delay: 'd3' },
]

function TeamCard({ m }: { m: Member }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`scroll-reveal ${m.delay} team-card`}>
      <div className="h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-7 text-center flex flex-col items-center">
        <div className={`rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center mb-4 shadow-xl text-white font-black text-xl`}
          style={{width: '4.5rem', height: '4.5rem'}}>
          {m.initials}
        </div>
        <h3 className="font-black text-white text-base mb-1">{m.name}</h3>
        <p className="text-gray-400 text-sm">{m.role}</p>
      </div>
    </div>
  )
}

function Team() {
  const titleRef = useScrollReveal()
  return (
    <section id="team" className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="scroll-reveal text-center mb-14">
          <span className="inline-block text-primary-400 font-semibold text-xs uppercase tracking-widest mb-3">Acerca de nosotros</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">El equipo detrás de AgroNest</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Somos un equipo apasionado por usar blockchain para resolver problemas reales del campo en Latinoamérica.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map(m => <TeamCard key={m.name} m={m} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Map ──────────────────────────────────────────────────────────────────────
function MapSection() {
  const titleRef = useScrollReveal()
  const mapRef   = useScrollReveal()
  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="scroll-reveal text-center mb-10">
          <span className="inline-block text-primary-400 font-semibold text-xs uppercase tracking-widest mb-3">Origen</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Hecho en México
          </h2>
          <p className="text-gray-400 text-lg">
            Desarrollado en Ciudad de México.
          </p>
        </div>
        <div ref={mapRef} className="scroll-reveal">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-[420px]">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/96 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-slate-700 flex items-center gap-2.5 max-w-xs">
              <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse shrink-0" />
              <span className="text-gray-200 text-xs font-bold leading-snug">
                Desarrollado en CDMX
              </span>
            </div>
            <Map
              theme="dark"
              viewport={{ center: [-99.1332, 19.4326], zoom: 11 }}
            >
              <MapMarker longitude={-99.1332} latitude={19.4326}>
                <MarkerContent />
              </MapMarker>
            </Map>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  const ref = useScrollReveal()
  return (
    <section className="py-16 bg-slate-950 border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="scroll-reveal relative rounded-3xl overflow-hidden">
          <div className="cta-gradient relative p-12 sm:p-16 lg:p-20 text-center">
            <div className="absolute inset-0 opacity-8 pointer-events-none"
              style={{backgroundImage: 'url("/media/4i.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'}} />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-5 py-2 rounded-full mb-8">
                <svg className="w-4 h-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Revolución agrícola on-chain
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Únete a la revolución del
                <span className="block text-accent-300 mt-1">financiamiento agrícola.</span>
              </h2>
              <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Sin bancos. Sin burocracia. Solo campo, código y capital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/registro"
                  className="inline-flex items-center justify-center gap-2.5 bg-white text-primary-700 font-bold text-lg px-9 py-4 rounded-2xl hover:bg-primary-50 transition-all duration-200 hover:scale-105 shadow-2xl shadow-black/20 btn-glow-green">
                  Crear cuenta gratis
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/login"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:border-white hover:bg-white/10 transition-all duration-200">
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <footer className="bg-gray-950 py-14 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3c-4.5 3-6 6-4 10 1.5 3 4 4 4 4s2.5-1 4-4c2-4 .5-7-4-10z M12 13v8" />
                </svg>
              </div>
              <span className="font-black text-xl text-white">Agro<span className="text-primary-400">Nest</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Financiamiento agrícola descentralizado para el campo del siglo XXI.
            </p>
          </div>

          <div>
            <h4 className="text-gray-300 font-semibold mb-4 text-xs uppercase tracking-widest">Plataforma</h4>
            <ul className="space-y-2.5">
              {( [['Cómo funciona','how-it-works'],['Tecnología','technology'],['Sponsors','sponsors'],['Equipo','team']] as [string, string][] ).map(([l, id]) => (
                <li key={l}>
                  <button onClick={() => go(id)} className="text-gray-400 hover:text-primary-400 transition-colors text-sm text-left">
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-300 font-semibold mb-4 text-xs uppercase tracking-widest">Recursos</h4>
            <ul className="space-y-2.5">
              {['Documentación','Smart Contracts','Auditoría','Whitepaper'].map(l => (
                <li key={l}><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-300 font-semibold mb-4 text-xs uppercase tracking-widest">Acceso</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Iniciar sesión</Link></li>
              <li><Link to="/registro" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Crear cuenta gratis</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-sm">© 2026 AgroNest · Ethereum + Arbitrum Sepolia</p>
          <p className="text-gray-400 text-sm">
            Hecho para el hackathon Ethereum México 2026
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page export ──────────────────────────────────────────────────────────────
export function LandingPage() {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <>
      <style>{LANDING_STYLES}</style>
      <div className="min-h-screen bg-slate-950">
        <DynamicIsland />
        <HeroSection />
        <SimpleExplainer />
        <VideoBand />
        <StatsBar />
        <ProblemSolution />
        <HowItWorks />
        <Technology />
        <Sponsors />
        <Team />
        <MapSection />
        <FinalCTA />
        <Footer />
      </div>
    </>
  )
}
