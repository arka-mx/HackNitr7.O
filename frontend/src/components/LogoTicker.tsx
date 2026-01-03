import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const partners = [
    { name: "HDFC ERGO", icon: "/insurance_icon_shield.png" },
    { name: "ICICI Lombard", icon: "/insurance_icon_heart.png" },
    { name: "Bajaj Allianz", icon: "/insurance_icon_cross.png" },
    { name: "SBI General", icon: "/insurance_icon_hands.png" },
    { name: "Cholamandalam MS", icon: "/insurance_icon_shield.png" },
    { name: "Go Digit", icon: "/insurance_icon_heart.png" },
    { name: "IFFCO Tokio", icon: "/insurance_icon_cross.png" },
    { name: "Reliance General", icon: "/insurance_icon_hands.png" },
    { name: "Tata AIG", icon: "/insurance_icon_shield.png" },
    { name: "New India Assurance", icon: "/insurance_icon_heart.png" },
    { name: "National Insurance", icon: "/insurance_icon_cross.png" },
    { name: "Oriental Insurance", icon: "/insurance_icon_hands.png" },
    { name: "United India", icon: "/insurance_icon_shield.png" },
    { name: "Care Health", icon: "/insurance_icon_heart.png" },
    { name: "Niva Bupa", icon: "/insurance_icon_cross.png" },
    { name: "Star Health", icon: "/insurance_icon_hands.png" },
    { name: "Aditya Birla", icon: "/insurance_icon_shield.png" },
];

export default function LogoTicker() {
    const tickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (tickerRef.current) {
                const totalWidth = tickerRef.current.scrollWidth / 2;

                gsap.to(tickerRef.current, {
                    x: -totalWidth,
                    duration: 40,
                    ease: "none",
                    repeat: -1,
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="py-8 bg-slate-50 border-y border-slate-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-4 text-center">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider"></p>
            </div>
            <div className="flex overflow-hidden relative w-full mask-gradient">
                {/* Wrapper for smooth scrolling */}
                <div ref={tickerRef} className="flex gap-12 whitespace-nowrap px-4 items-center w-max">
                    {/* First Loop */}
                    {partners.map((partner, index) => (
                        <div key={`p1-${index}`} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 p-1.5 flex items-center justify-center">
                                {/* Use generated generic icons, rotated for variety if needed, but here just mapping */}
                                <img src={partner.icon} alt="" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-semibold text-slate-700 text-lg">{partner.name}</span>
                        </div>
                    ))}

                    {/* Second Loop for Infinite Effect */}
                    {partners.map((partner, index) => (
                        <div key={`p2-${index}`} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 p-1.5 flex items-center justify-center">
                                <img src={partner.icon} alt="" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-semibold text-slate-700 text-lg">{partner.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Add this style to index.css or use inline styles for the mask if tailwind-merge issue
// .mask-gradient {
//   mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
// }
