import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User, Users, HeartHandshake, Activity, Building2, Baby } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const types = [
    { name: "Individual Health Insurance", icon: <User size={32} />, color: "bg-teal-100 text-teal-700" },
    { name: "Family Floater Policy", icon: <Users size={32} />, color: "bg-purple-100 text-purple-700" },
    { name: "Senior Citizen Health Insurance", icon: <HeartHandshake size={32} />, color: "bg-orange-100 text-orange-700" },
    { name: "Critical Illness Policy", icon: <Activity size={32} />, color: "bg-red-100 text-red-700" },
    { name: "Corporate Health Insurance", icon: <Building2 size={32} />, color: "bg-blue-100 text-blue-700" },
    { name: "Maternity Insurance", icon: <Baby size={32} />, color: "bg-pink-100 text-pink-700" },
];

export default function InsuranceTypes() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = document.querySelectorAll(".insurance-card");

            cards.forEach((card, index) => {
                const isEven = index % 2 === 0;
                // Start from sides, but not too extreme
                const xStart = isEven ? -300 : 300;

                gsap.fromTo(card,
                    {
                        width: "80px",
                        height: "80px",
                        opacity: 0,
                        borderRadius: "100%", // Start as circle
                        x: xStart,
                    },
                    {
                        width: "100%",
                        height: "auto",
                        minHeight: "100px",
                        opacity: 1,
                        borderRadius: "16px", // Soft rounded corners instead of sharp 0px
                        x: 0,
                        duration: 1.5,
                        ease: "power3.out", // Smoother easing
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%", // Start earlier
                            end: "top 40%",   // End later for longer scroll duration
                            scrub: 2,         // Increased scrub for smoother catch-up
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="coverage" ref={containerRef} className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Coverage for Everyone</h2>
                    <p className="text-slate-600 text-lg">
                        Whatever your life stage, we help you understand your policy.
                    </p>
                </div>

                {/* Wider container for less side margins */}
                <div className="flex flex-col gap-8 max-w-6xl mx-auto">
                    {types.map((type, index) => (
                        <div key={index} className="flex justify-center">
                            {/* Card Container */}
                            <div
                                className={`insurance-card ${type.color} flex items-center overflow-hidden shadow-lg mx-auto relative`}
                                style={{ width: "80px", height: "80px", borderRadius: "100%" }} // Initial state styles for SSR limits
                            >
                                {/* Inner Content Layout */}
                                <div className="flex items-center gap-6 px-8 py-4 w-full whitespace-nowrap">
                                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white/50 rounded-full backdrop-blur-sm">
                                        {type.icon}
                                    </div>
                                    <span className="text-xl md:text-2xl font-bold opacity-0 fade-text">
                                        {type.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional CSS for text fade-in tied to the container width expansion if needed, 
                but GSAP scrubbing width might be enough. 
                Let's add a small tweener for the text opacity inside the same timeline if possible 
                or just CSS transition. A CSS transition is safer for the child element.
            */}
            <style>{`
                .insurance-card {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start; /* Aligns left as it expands */
                }
                .insurance-card .fade-text {
                    transition: opacity 0.5s ease-in-out;
                    opacity: 1; /* By default visible, but container width hides it initially */
                }
            `}</style>
        </section>
    );
}
