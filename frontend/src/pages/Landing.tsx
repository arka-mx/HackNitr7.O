import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import LogoTicker from "@/components/LogoTicker";
import InsuranceTypes from "@/components/InsuranceTypes";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Brain, FileSearch, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');
    const headerRef = useRef<HTMLElement>(null);
    const howItWorksRef = useRef<HTMLDivElement>(null);

    // Scroll Spy & Sticky Header
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'coverage', 'how-it-works', 'pricing'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section);
                }
            }

            if (headerRef.current) {
                if (window.scrollY > 50) {
                    headerRef.current.classList.add('shadow-sm', 'bg-white/90');
                    headerRef.current.classList.remove('bg-[#FDFDFD]');
                } else {
                    headerRef.current.classList.remove('shadow-sm', 'bg-white/90');
                    headerRef.current.classList.add('bg-[#FDFDFD]');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // GSAP Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = document.querySelectorAll('.feature-card');

            cards.forEach((card, index) => {
                const direction = index % 2 === 0 ? -100 : 100; // Alternating Left/Right

                gsap.fromTo(card,
                    {
                        opacity: 0,
                        x: direction,
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 2.6,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 95%", // Start almost immediately when entering viewport
                            end: "bottom 15%", // Spread over a much longer distance
                            scrub: 2.7,          // Maximum smoothness/inertia
                        }
                    }
                );
            });
        }, howItWorksRef);

        return () => ctx.revert();
    }, []);

    const scrollToSection = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800 selection:bg-teal-100">
            {/* Sticky Header */}
            <header
                ref={headerRef}
                className="sticky top-0 z-50 transition-all duration-300 py-4 px-4 md:px-6 backdrop-blur-md bg-[#F0F5F3]"
            >
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src="/logo.jpg" alt="Overbilled Logo" className="h-10 w-auto" />
                    </div>

                    <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full backdrop-blur-sm border border-slate-200/50 relative z-0">
                        {['Home', 'Coverage', 'How It Works', 'Pricing'].map((item) => {
                            const id = item.toLowerCase().replace(/\s+/g, '-');
                            const isActive = activeSection === id;
                            return (
                                <button
                                    key={item}
                                    onClick={(e) => scrollToSection(id, e)}
                                    className={`
                                        relative px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-300
                                        ${isActive ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'}
                                    `}
                                    style={{ WebkitTapHighlightColor: 'transparent' }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-0 bg-white rounded-full shadow-sm"
                                            style={{ zIndex: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{item}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium hidden lg:inline-block text-slate-500">
                            {currentUser ? `Hi, ${currentUser.displayName?.split(' ')[0]}` : ''}
                        </span>
                        <Button
                            className="rounded-full bg-teal-700 hover:bg-teal-800 text-white px-6 shadow-lg shadow-teal-700/20 transition-all hover:scale-105"
                            onClick={() => navigate(currentUser ? '/dashboard' : '/')}
                        >
                            {currentUser ? 'Dashboard' : 'Get Started'} →
                        </Button>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section id="home" className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                    <div className="grid lg:grid-cols-12 gap-8 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-7 bg-[#F4F7F6] rounded-[2.5rem] p-8 md:p-16 flex flex-col justify-center relative overflow-hidden group">
                            {/* Abstract Background Shapes */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-200/50 transition-colors duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-200/50 transition-colors duration-700"></div>

                            <div className="z-10 relative">
                                <h1 className="text-4xl md:text-6xl md:leading-[1.1] font-bold text-slate-900 mb-6 tracking-tight">
                                    Stop Overpaying. <br />
                                    Understand Your Bills <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-purple-600 italic font-serif">with AI Analysis</span>
                                </h1>

                                <p className="text-slate-600 max-w-lg mb-8 text-lg leading-relaxed">
                                    Our AI-powered platform analyzes your insurance policies and hospital bills
                                    to find hidden savings, overcharges, and exclusions.
                                </p>

                                <div className="flex flex-wrap gap-4 items-center">
                                    <Button
                                        className="rounded-full bg-teal-700 hover:bg-teal-800 text-white pl-8 pr-10 h-14 text-lg font-semibold shadow-xl shadow-teal-900/10 hover:shadow-teal-900/20 transition-all hover:-translate-y-1"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        Analyze My Bill
                                    </Button>

                                </div>

                                <div className="mt-12 flex items-center gap-4">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex text-yellow-500 text-xs mb-0.5">★★★★★</div>
                                        <span className="font-semibold text-slate-800 text-sm">Trusted by 10,000+ Users</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden relative h-[500px] group shadow-2xl">
                                <img
                                    src="/hero_patient.png"
                                    alt="Happy Patient"
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex text-yellow-500">★★★★★</div>
                                            <span className="text-white/60 text-sm font-medium">Verified User</span>
                                        </div>
                                        <p className="text-white text-xl font-bold leading-relaxed">
                                            "I saved $3,000 using this web service."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Insurance Partners Carousel */}
                <LogoTicker />

                {/* Insurance Types Animation Section */}
                <InsuranceTypes />

                {/* How It Works Section */}
                <section id="how-it-works" ref={howItWorksRef} className="container mx-auto px-4 md:px-6 py-20 bg-white">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">How It Works</h2>
                        <p className="text-slate-600 text-lg">
                            We use advanced AI to audit every line item of your medical bill against your insurance policy.
                        </p>
                    </div>

                    <div className="space-y-24">
                        {/* Feature 1 */}
                        <div className="feature-card grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-teal-100 rounded-[2rem] transform rotate-3"></div>
                                <div className="relative bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl">
                                    <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                                        <Brain size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Language Detector</h3>
                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            <span className="text-sm font-medium text-red-700">Missing "Clinical Justification"</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-sm font-medium text-green-700">Added: "Medically Necessary per LCD..."</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2">
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                                    Missing Medical Necessity <br />
                                    <span className="text-teal-600">Language Detector</span>
                                </h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    Automatically detects when a hospital bill or summary lacks the clinical justification insurers require.
                                    Helps prevent claim rejections caused not by treatment, but by missing or weak medical explanation.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-card grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                                    Policy Clause <br />
                                    <span className="text-purple-600">Trigger Identifier</span>
                                </h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    Identifies the exact insurance policy clauses that are activated by specific bill items.
                                    Shows users which rules are working against them and how those clauses impact claim approval.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-bl from-blue-100 to-indigo-100 rounded-[2rem] transform -rotate-3"></div>
                                <div className="relative bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl">
                                    <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                                        <FileSearch size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Clause Matcher</h3>
                                    <div className="space-y-3 mt-4">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Triggered Clause</div>
                                            <div className="font-medium text-slate-900">Section 4.2.1: Experimental Treatments</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-card grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-orange-100 rounded-[2rem] transform rotate-3"></div>
                                <div className="relative bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl">
                                    <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-red-600">
                                        <TrendingDown size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Cost Meter</h3>
                                    <div className="mt-6 text-center">
                                        <div className="text-sm text-slate-500 mb-2">Estimated Loss</div>
                                        <div className="text-5xl font-bold text-red-600 mb-2">$4,250</div>
                                        <div className="text-sm font-medium text-red-800 bg-red-100 inline-block px-3 py-1 rounded-full">
                                            If no action taken
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2">
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                                    What-If-No-Action <br />
                                    <span className="text-red-500">Cost Meter</span>
                                </h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    Predicts how much money a user is likely to lose if they submit the bill without corrections.
                                    Transforms hidden insurance risks into a clear, actionable financial consequence.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="container mx-auto px-4 md:px-6 py-24 bg-[#FDFDFD]">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Simple Pricing</h2>
                        <p className="text-slate-600 text-lg">
                            Pay only when you save. No hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-shadow flex flex-col">
                            <div className="mb-6">
                                <div className="text-lg font-semibold text-slate-900 mb-2">Basic Audit</div>
                                <div className="text-4xl font-bold text-slate-900">$0<span className="text-lg font-normal text-slate-500">/mo</span></div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <Check size={18} className="text-teal-600" /> 1 Bill Analysis / Month
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <Check size={18} className="text-teal-600" /> Basic Error Detection
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <Check size={18} className="text-teal-600" /> Export to PDF
                                </li>
                            </ul>
                            <Button variant="outline" className="w-full rounded-xl h-12 font-semibold">Get Started</Button>
                        </div>

                        {/* Pro Tier */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl scale-105 relative flex flex-col">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                                Most Popular
                            </div>
                            <div className="mb-6">
                                <div className="text-lg font-semibold text-white mb-2">Pro Advocate</div>
                                <div className="text-4xl font-bold text-white">$29<span className="text-lg font-normal text-slate-400">/mo</span></div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <Check size={18} className="text-teal-400" /> Unlimited Analysis
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <Check size={18} className="text-teal-400" /> Advanced Policy Matching
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <Check size={18} className="text-teal-400" /> Negotiation Email Generator
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <Check size={18} className="text-teal-400" /> Priority Support
                                </li>
                            </ul>
                            <Button className="w-full rounded-xl h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold border-0">
                                Start Free Trial
                            </Button>
                        </div>

                        {/* Enterprise Tier */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-shadow flex flex-col">
                            <div className="mb-6">
                                <div className="text-lg font-semibold text-slate-900 mb-2">Family Plan</div>
                                <div className="text-4xl font-bold text-slate-900">$79<span className="text-lg font-normal text-slate-500">/mo</span></div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <Check size={18} className="text-teal-600" /> Up to 5 Family Members
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <Check size={18} className="text-teal-600" /> Dedicated Case Manager
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <Check size={18} className="text-teal-600" /> Legal Appeal Support
                                </li>
                            </ul>
                            <Button variant="outline" className="w-full rounded-xl h-12 font-semibold">Contact Sales</Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
