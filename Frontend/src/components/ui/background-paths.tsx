"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";
import { ShiningText } from "@/components/ui/shining-text";
import { HoverButton } from "@/components/ui/hover-glow-button";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full text-white" viewBox="0 0 696 316" fill="none">
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.08 + path.id * 0.018}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.25, 0.65, 0.25],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({ title = "AgroNest" }: { title?: string }) {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden">
            {/* Background Video — 45% opacity */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                <video
                    autoPlay muted loop playsInline preload="metadata"
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.45 }}
                >
                    <source src="/media/2v.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/45 via-slate-950/60 to-slate-950/90 pointer-events-none" />

            {/* Animated white paths */}
            <div className="absolute inset-0 z-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {/* Hero content */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto flex flex-col items-center justify-center"
                >
                    {/* Title — underline hidden */}
                    <AnimatedText
                        text="AgroNest"
                        textClassName="text-7xl sm:text-8xl md:text-9xl font-black text-white drop-shadow-lg"
                        underlineClassName="opacity-0 pointer-events-none"
                        className="mb-12"
                    />

                    <ShiningText
                        text="El campo cultiva. Nosotros financiamos."
                        className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mb-14 drop-shadow-md"
                    />

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {/* Soy Agricultor — dark green glow */}
                        <HoverButton
                            onClick={() => navigate('/registro')}
                            glowColor="rgba(34,197,94,0.70)"
                            backgroundColor="#14532d"
                            textColor="#ffffff"
                            hoverTextColor="#86efac"
                            className="px-8 py-4 rounded-full text-base font-bold"
                            style={{
                                boxShadow: "0 0 28px rgba(22,101,52,0.55), 0 4px 16px rgba(0,0,0,0.30)",
                                border: "1px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            Soy Agricultor
                        </HoverButton>

                        {/* Soy Inversor — glass glow */}
                        <HoverButton
                            onClick={() => navigate('/registro')}
                            glowColor="rgba(255,255,255,0.35)"
                            backgroundColor="rgba(255,255,255,0.08)"
                            textColor="#ffffff"
                            hoverTextColor="#e2e8f0"
                            className="px-8 py-4 rounded-full text-base font-bold"
                            style={{
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                border: "1px solid rgba(255,255,255,0.28)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                            }}
                        >
                            Soy Inversor
                        </HoverButton>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
