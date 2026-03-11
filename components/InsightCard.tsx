"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface InsightCardProps {
    insight: string | null;
}

export function InsightCard({ insight }: InsightCardProps) {
    if (!insight) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative overflow-hidden group mb-4"
        >
            <div className="absolute inset-0 bg-primary/10 glow-cyan opacity-50 pointer-events-none rounded-lg" />
            <div className="relative z-10 p-4 border border-primary/30 rounded-lg bg-black/60 shadow-[0_0_15px_rgba(0,255,255,0.1)] flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center glow-cyan self-start">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                </div>
                <div className="flex-1">
                    <h4 className="text-xs font-mono text-primary uppercase tracking-widest mb-1">AI_INSIGHT</h4>
                    <p className="text-white/90 leading-relaxed text-sm md:text-base">
                        {insight}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
