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
                    duration: 80,
                    ease: "none",
                    repeat: -1,
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="py-12 bg-slate-50 border-y border-slate-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trusted By Policyholders From</p>
            </div>

            {/* Carousel Container with Margins */}
            <div className="max-w-7xl mx-auto px-4 md:px-12 relative">
                <div className="flex overflow-hidden relative w-full mask-gradient">
                    {/* Wrapper for smooth scrolling */}
                    <div ref={tickerRef} className="flex gap-16 whitespace-nowrap px-4 items-center w-max">
                        {/* First Loop */}
                        {partners.map((partner, index) => (
                            <div key={`p1-${index}`} className="flex flex-col items-center gap-4 mx-4 opacity-60 hover:opacity-100 transition-all grayscale hover:grayscale-0 cursor-pointer group">
                                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-5 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1">
                                    <img src={partner.icon} alt="" className="w-full h-full object-contain" />
                                </div>
                                <span className="font-semibold text-slate-600 group-hover:text-slate-900 text-sm text-center tracking-tight transition-colors">{partner.name}</span>
                            </div>
                        ))}

                        {/* Second Loop for Infinite Effect */}
                        {partners.map((partner, index) => (
                            <div key={`p2-${index}`} className="flex flex-col items-center gap-4 mx-4 opacity-60 hover:opacity-100 transition-all grayscale hover:grayscale-0 cursor-pointer group">
                                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-5 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1">
                                    <img src={partner.icon} alt="" className="w-full h-full object-contain" />
                                </div>
                                <span className="font-semibold text-slate-600 group-hover:text-slate-900 text-sm text-center tracking-tight transition-colors">{partner.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add this style to index.css or use inline styles for the mask if tailwind-merge issue
// .mask-gradient {
//   mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
// }
