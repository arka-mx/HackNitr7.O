import { motion } from 'framer-motion';

interface BodyMapProps {
    affectedOrgans: string[];
}

// Organ Colors - Realistic/Anatomical looking, slightly translucent for overlay
const organStyles: Record<string, { fill: string; stroke: string }> = {
    Brain: { fill: "rgba(236, 72, 153, 0.4)", stroke: "rgba(236, 72, 153, 0.8)" },      // Pinkish/Grey
    Lungs: { fill: "rgba(147, 197, 253, 0.4)", stroke: "rgba(59, 130, 246, 0.8)" },      // Blueish
    Heart: { fill: "rgba(239, 68, 68, 0.5)", stroke: "rgba(220, 38, 38, 0.9)" },         // Deep Red
    Liver: { fill: "rgba(180, 83, 9, 0.5)", stroke: "rgba(180, 83, 9, 0.9)" },           // Brown
    Stomach: { fill: "rgba(251, 191, 36, 0.5)", stroke: "rgba(217, 119, 6, 0.9)" },      // Yellow/Orange
    Kidneys: { fill: "rgba(120, 53, 15, 0.5)", stroke: "rgba(120, 53, 15, 0.9)" },       // Dark Brown
    Intestines: { fill: "rgba(252, 165, 165, 0.5)", stroke: "rgba(248, 113, 113, 0.9)" }, // Pink/Fleshy
    // Skeleton/General
    Limbs: { fill: "rgba(148, 163, 184, 0.2)", stroke: "rgba(148, 163, 184, 0.5)" },
    Bones: { fill: "rgba(203, 213, 225, 0.2)", stroke: "rgba(203, 213, 225, 0.5)" },
    Eyes: { fill: "rgba(56, 189, 248, 0.5)", stroke: "rgba(2, 132, 199, 0.8)" },
};

export default function BodyMap({ affectedOrgans }: BodyMapProps) {
    const isAffected = (organName: string) => {
        return affectedOrgans.some(org => org.toLowerCase() === organName.toLowerCase());
    };

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center bg-slate-100 rounded-3xl border border-slate-200 p-6 overflow-hidden shadow-xl">
            {/* 1. BASE IMAGE */}
            <div className="relative h-full w-auto aspect-[300/700] select-none">
                <img
                    src="/human_body.jpg"
                    alt="Human Anatomy"
                    className="h-full w-full object-contain mix-blend-multiply opacity-80 contrast-125 saturate-50"
                />

                {/* 2. REALISTIC SVG OVERLAY LAYER */}
                {/* 
                   We overlay an SVG perfectly on top of the image.
                   The paths below are approximated to standard anatomical positions for a standing figure.
                   They will act as 'highlighters' for the underlying image.
                */}
                <svg
                    viewBox="0 0 300 700"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="none" // Stretch to match image container exact dimensions
                >
                    <defs>
                        <filter id="glow-real" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* BRAIN */}
                    <motion.path
                        d="M136,35 C136,35 140,25 150,25 C160,25 164,35 164,35 C164,35 170,50 160,65 C150,80 136,80 136,80 C136,80 130,50 136,35 Z"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: isAffected("Brain") ? 1 : 0,
                            scale: isAffected("Brain") ? 1 : 0.95
                        }}
                        fill={organStyles.Brain.fill}
                        stroke={organStyles.Brain.stroke}
                        strokeWidth="1.5"
                        filter="url(#glow-real)"
                        style={{ transformOrigin: "150px 50px" }}
                    />

                    {/* LUNGS */}
                    <motion.path
                        // Two lobes
                        d="M125,130 C120,130 115,140 115,170 C115,200 125,210 145,200 L148,150 L125,130 Z M175,130 C180,130 185,140 185,170 C185,200 175,210 155,200 L152,150 L175,130 Z"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAffected("Lungs") ? 1 : 0 }}
                        fill={organStyles.Lungs.fill}
                        stroke={organStyles.Lungs.stroke}
                        strokeWidth="1.5"
                        filter="url(#glow-real)"
                    />

                    {/* HEART */}
                    <motion.path
                        d="M162,155 C172,150 177,155 177,165 C177,180 162,190 152,190 L150,185 L147,165 C147,160 152,155 162,155"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: isAffected("Heart") ? 1 : 0,
                            scale: isAffected("Heart") ? [1, 1.05, 1] : 1
                        }}
                        transition={{
                            scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } // Heartbeat
                        }}
                        fill={organStyles.Heart.fill}
                        stroke={organStyles.Heart.stroke}
                        strokeWidth="1.5"
                        filter="url(#glow-real)"
                        style={{ transformOrigin: "162px 172px" }}
                    />

                    {/* LIVER */}
                    <motion.path
                        d="M142,210 L177,205 C187,205 192,215 192,225 C192,240 177,245 162,240 L142,230 L142,210 Z"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAffected("Liver") ? 1 : 0 }}
                        fill={organStyles.Liver.fill}
                        stroke={organStyles.Liver.stroke}
                        strokeWidth="1.5"
                        filter="url(#glow-real)"
                    />

                    {/* STOMACH */}
                    <motion.path
                        d="M148,225 C158,225 163,230 158,245 C153,260 143,265 138,255 C133,245 138,225 148,225 Z"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAffected("Stomach") ? 1 : 0 }}
                        fill={organStyles.Stomach.fill}
                        stroke={organStyles.Stomach.stroke}
                        strokeWidth="1.5"
                        filter="url(#glow-real)"
                    />

                    {/* KIDNEYS (Back view approximation) */}
                    <motion.path
                        d="M135,240 C130,240 130,250 135,250 C140,250 140,240 135,240 Z M165,240 C170,240 170,250 165,250 C160,250 160,240 165,240 Z"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAffected("Kidneys") ? 1 : 0 }}
                        fill={organStyles.Kidneys.fill}
                        stroke={organStyles.Kidneys.stroke}
                        strokeWidth="1.5"
                        filter="url(#glow-real)"
                    />

                    {/* INTESTINES */}
                    <motion.path
                        d="M135,260 L165,260 C175,260 175,270 175,290 C175,310 165,315 150,315 C135,315 125,310 125,290 C125,270 125,260 135,260 Z"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAffected("Intestines") ? 1 : 0 }}
                        fill={organStyles.Intestines.fill}
                        stroke={organStyles.Intestines.stroke}
                        strokeWidth="1.5"
                        filter="url(#glow-real)"
                    />
                </svg>

                {/* 3. FLOATING LABELS */}
                {affectedOrgans.map(organ => (
                    isAffected(organ) && (
                        <motion.div
                            key={organ}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="absolute z-10 hidden md:block"
                            style={{
                                top: "10%",
                                right: "-10px",
                                transform: "translateY(100%)" // Just a dummy pos, we need specific pos or just list them
                            }}
                        >
                            {/* We'll actually position them relative to the container for cleanness */}
                        </motion.div>
                    )
                ))}

                {/* List of active organs (Top Right Corner) */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    {affectedOrgans.map(organ => (
                        <motion.div
                            key={organ}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2"
                        >
                            <span className="text-xs font-bold text-slate-700">{organ}</span>
                            <span
                                className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
                                style={{ backgroundColor: organStyles[organ as keyof typeof organStyles]?.stroke || "#ef4444" }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
