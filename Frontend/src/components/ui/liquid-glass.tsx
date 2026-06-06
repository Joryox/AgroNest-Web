"use client";

import React, { useRef } from "react";

/* ─── CSS keyframes injected once ─── */
const LIQUID_GLASS_STYLES = `
  @keyframes moveBackground {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .liquid-glass-animated {
    background-size: 200% 200%;
    animation: moveBackground 8s ease infinite;
  }
  .glass-distortion {
    backdrop-filter: blur(16px) saturate(1.8) brightness(1.05);
    -webkit-backdrop-filter: blur(16px) saturate(1.8) brightness(1.05);
  }
`;

/* ─── SVG distortion filter (inject once into DOM) ─── */
export function GlassFilter() {
  return (
    <>
      <style>{LIQUID_GLASS_STYLES}</style>
      <svg
        style={{ position: "fixed", width: 0, height: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="liquid-glass-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.012"
              numOctaves="3"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
        </defs>
      </svg>
    </>
  );
}

/* ─── Main glass wrapper ─── */
interface GlassEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: "low" | "medium" | "high";
  tint?: string;
  useFilter?: boolean;
  className?: string;
}

export function GlassEffect({
  children,
  intensity = "medium",
  tint,
  useFilter = true,
  className = "",
  style,
  ...props
}: GlassEffectProps) {
  const blurMap = { low: "8px", medium: "16px", high: "28px" };
  const blur = blurMap[intensity];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backdropFilter: `blur(${blur}) saturate(1.8) brightness(1.06)`,
        WebkitBackdropFilter: `blur(${blur}) saturate(1.8) brightness(1.06)`,
        background:
          tint ??
          "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.28), 0 1.5px 0 rgba(255,255,255,0.18) inset, 0 -1px 0 rgba(0,0,0,0.12) inset",
        filter: useFilter ? "url(#liquid-glass-filter)" : undefined,
        ...style,
      }}
      {...props}
    >
      {/* Inner highlight rim */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ─── Glass Button ─── */
interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "ghost" | "solid";
  accentColor?: string;
}

export function GlassButton({
  children,
  variant = "ghost",
  accentColor = "rgba(34,197,94,0.85)",
  className = "",
  style,
  ...props
}: GlassButtonProps) {
  return (
    <button
      className={`relative overflow-hidden font-semibold transition-all duration-200 active:scale-95 ${className}`}
      style={{
        backdropFilter: "blur(12px) saturate(1.6)",
        WebkitBackdropFilter: "blur(12px) saturate(1.6)",
        background:
          variant === "solid"
            ? accentColor
            : "rgba(255,255,255,0.08)",
        border:
          variant === "solid"
            ? "1px solid rgba(255,255,255,0.25)"
            : "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          variant === "solid"
            ? "0 4px 20px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.2) inset"
            : "0 2px 12px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.15) inset",
        ...style,
      }}
      {...props}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </button>
  );
}

/* ─── Glass Dock (horizontal pill container) ─── */
interface GlassDockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassDock({ children, className = "", style, ...props }: GlassDockProps) {
  return (
    <GlassEffect
      useFilter={false}
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${className}`}
      style={style}
      {...props}
    >
      {children}
    </GlassEffect>
  );
}
