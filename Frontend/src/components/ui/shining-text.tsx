"use client" 

import * as React from "react"
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
 
export function ShiningText({ text, className }: { text: string, className?: string }) {
  return (
    <motion.h1
      className={cn("bg-[linear-gradient(110deg,#a3a3a3,35%,#fff,50%,#a3a3a3,75%,#a3a3a3)] bg-[length:200%_100%] bg-clip-text text-transparent", className)}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.h1>
  );
}
