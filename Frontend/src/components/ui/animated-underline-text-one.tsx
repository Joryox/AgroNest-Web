import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  textClassName?: string;
  underlineClassName?: string;
  underlinePath?: string;
  underlineHoverPath?: string;
  underlineDuration?: number;
}

// Wave amplitude is ~30% larger than original (Q control points at ±13 vs original ±10)
const DEFAULT_PATH       = "M 0,15 Q 75,2 150,15 Q 225,28 300,15";
const DEFAULT_HOVER_PATH = "M 0,15 Q 75,28 150,15 Q 225,2 300,15";

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      textClassName,
      underlineClassName,
      underlinePath = DEFAULT_PATH,
      underlineHoverPath = DEFAULT_HOVER_PATH,
      underlineDuration = 1.5,
      ...props
    },
    ref
  ) => {
    const pathVariants: Variants = {
      hidden: {
        pathLength: 0,
        opacity: 0,
      },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: underlineDuration,
          ease: "easeInOut",
        },
      },
    };

    // Continuous wave oscillation after the draw-in completes
    const waveVariants: Variants = {
      rest: {
        d: underlinePath,
      },
      wave: {
        d: [underlinePath, underlineHoverPath, underlinePath],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        },
      },
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center gap-2", props.className)}
      >
        <div className="relative">
          <motion.h1
            className={cn("text-4xl font-bold text-center", textClassName)}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {text}
          </motion.h1>

          {/* SVG viewBox taller (30px) to avoid clipping the bigger wave */}
          <svg
            width="100%"
            height="30"
            viewBox="0 0 300 30"
            className={cn("absolute -bottom-6 left-0", underlineClassName)}
          >
            <motion.path
              d={underlinePath}
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Second path that starts waving once the first draw-in is done */}
            <motion.path
              d={underlinePath}
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeOpacity={0}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                d: [underlinePath, underlineHoverPath, underlinePath],
              }}
              transition={{
                opacity: { delay: underlineDuration, duration: 0.01 },
                d: {
                  delay: underlineDuration,
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop",
                },
              }}
            />
          </svg>
        </div>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
