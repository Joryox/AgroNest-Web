"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { GlassFilter } from "@/components/ui/liquid-glass";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

// ─── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: "hero",         label: "Inicio" },
  { id: "how-it-works", label: "Cómo funciona" },
  { id: "technology",   label: "Tecnología" },
  { id: "sponsors",     label: "Sponsors" },
  { id: "team",         label: "Equipo" },
];

// ─── Active section via scroll (robust forward-iteration) ────────────────────
function useActiveSection() {
  const [active, setActive] = useState("Inicio");

  useEffect(() => {
    const updateActive = () => {
      let currentLabel = SECTIONS[0]?.label ?? "Inicio";
      const threshold = window.innerHeight * 0.45; // top 45% of viewport

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const { top } = el.getBoundingClientRect();
        if (top <= threshold) {
          currentLabel = section.label;
        }
      }
      setActive(currentLabel);
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    // Delay initial check to ensure DOM is ready
    const frame = requestAnimationFrame(() => setTimeout(updateActive, 100));

    return () => {
      window.removeEventListener("scroll", updateActive);
      cancelAnimationFrame(frame);
    };
  }, []);

  return active;
}

// ─── Scroll progress ring ─────────────────────────────────────────────────────
function ScrollCircle({ size = 20 }: { size?: number }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90 shrink-0">
      <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,0.18)" strokeWidth="14" fill="none" />
      <motion.circle
        cx="50" cy="50" r="38"
        stroke="rgba(134,239,172,0.95)"
        strokeWidth="14" fill="none"
        style={{ pathLength: progress }}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── GlowLink — Link with mouse-tracking glow (for navbar auth buttons) ─────
function GlowLink({
  to,
  children,
  glowColor = "rgba(34,197,94,0.5)",
  className = "",
  style,
}: {
  to: string;
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 140,
          height: 140,
          left: pos.x - 70,
          top: pos.y - 70,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transform: `scale(${hovered ? 1.3 : 0})`,
          transition: "opacity 0.3s ease, transform 0.4s ease",
        }}
      />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function DynamicIsland() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [islandOpen, setIslandOpen] = useState(false);
  const activeSection = useActiveSection();
  const islandRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setIslandOpen(false);
    if (id === "hero") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Close island popup on outside click
  useEffect(() => {
    if (!islandOpen) return;
    const handler = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIslandOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [islandOpen]);

  const NAV_LINKS = SECTIONS.slice(1);

  return (
    <>
      <GlassFilter />

      {/* ══════════════════════ TOP BAR ══════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-[72px]"
        style={{
          backdropFilter: "blur(20px) saturate(1.8) brightness(1.05)",
          WebkitBackdropFilter: "blur(20px) saturate(1.8) brightness(1.05)",
          background: "linear-gradient(180deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.68) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.35)",
        }}
      >
        {/* LEFT: Logo — 70% bigger than original h-11 = ~75px */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-3 shrink-0 group"
        >
          <img
            src="/media/Nest.png"
            alt="AgroNest"
            className="h-[75px] w-[75px] object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-200"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <span className="font-black text-2xl text-white tracking-tight leading-none select-none">
            Agro<span className="text-emerald-400">Nest</span>
          </span>
        </button>

        {/* CENTER: Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="relative px-4 py-2 rounded-xl text-sm font-semibold text-white/75 hover:text-white hover:bg-white/10 transition-all duration-200 group"
            >
              {label}
              <span className="absolute bottom-1 left-4 right-4 h-px bg-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
            </button>
          ))}
        </nav>

        {/* RIGHT: Auth buttons with glow */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <GlowLink
            to="/login"
            glowColor="rgba(255,255,255,0.30)"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-200"
          >
            Iniciar sesión
          </GlowLink>
          <GlowLink
            to="/registro"
            glowColor="rgba(34,197,94,0.55)"
            className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)",
              boxShadow: "0 2px 16px rgba(22,101,52,0.55)",
            }}
          >
            Registro
          </GlowLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-0 right-0 z-50 flex flex-col p-3 gap-1"
            style={{
              background: "rgba(2,6,23,0.95)",
              backdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left px-4 py-3 text-white/80 hover:text-white font-medium text-sm rounded-xl hover:bg-white/8 transition-colors"
              >
                {label}
              </button>
            ))}
            <div className="h-px bg-white/10 my-1" />
            <div className="px-4 py-2">
              <ThemeToggle showLabel />
            </div>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-white/70 font-semibold text-sm rounded-xl hover:bg-white/8 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-center text-white font-bold text-sm rounded-xl mt-1"
              style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)" }}
            >
              Crear cuenta gratis
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════ BOTTOM DYNAMIC ISLAND ═══════════════ */}
      <div
        ref={islandRef}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
      >
        {/* Popup nav menu — opens above the island */}
        <AnimatePresence>
          {islandOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.92 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mb-2 flex flex-col gap-0.5 p-2 rounded-2xl min-w-[185px]"
              style={{
                background: "rgba(2,6,23,0.94)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 -8px 40px rgba(0,0,0,0.45), 0 2px 0 rgba(255,255,255,0.06) inset",
              }}
            >
              {SECTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    activeSection === label
                      ? "text-emerald-400 bg-emerald-400/10 font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {activeSection === label && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 mb-0.5" />
                  )}
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Island pill */}
        <motion.div
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full cursor-pointer select-none"
          onClick={() => setIslandOpen((v) => !v)}
          style={{
            backdropFilter: "blur(18px) saturate(1.8)",
            WebkitBackdropFilter: "blur(18px) saturate(1.8)",
            background: islandOpen
              ? "linear-gradient(135deg, rgba(22,101,52,0.60) 0%, rgba(15,23,42,0.85) 100%)"
              : "linear-gradient(135deg, rgba(2,6,23,0.88) 0%, rgba(15,23,42,0.80) 100%)",
            border: `1px solid ${islandOpen ? "rgba(134,239,172,0.30)" : "rgba(255,255,255,0.14)"}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.40), 0 1px 0 rgba(255,255,255,0.10) inset",
            transition: "background 0.3s, border-color 0.3s",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.06 }}
        >
          <ScrollCircle size={18} />

          <AnimatePresence mode="wait">
            <motion.span
              key={activeSection}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-white/90 text-xs font-semibold tracking-wide whitespace-nowrap"
            >
              {activeSection}
            </motion.span>
          </AnimatePresence>

          {/* Chevron arrow */}
          <motion.svg
            className="w-3 h-3 text-white/50"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
            animate={{ rotate: islandOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </motion.svg>
        </motion.div>
      </div>
    </>
  );
}
