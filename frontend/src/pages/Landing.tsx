import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800">
            {/* Header */}
            <header className="container mx-auto flex items-center justify-between py-6 px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-teal-700 rounded-md flex items-center justify-center text-white font-bold text-xl">
                        O
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Overbilled</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#" className="bg-teal-50 px-3 py-1 rounded-full text-teal-700 font-semibold">Home</a>
                    <a href="#" className="hover:text-teal-700 transition-colors">How It Works</a>
                    <a href="#" className="hover:text-teal-700 transition-colors">Pricing</a>
                    <a href="#" className="hover:text-teal-700 transition-colors">About</a>
                </nav>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium hidden md:inline-block">
                        Hi, {currentUser?.displayName || currentUser?.email}
                    </span>
                    <Button
                        className="rounded-full bg-teal-700 hover:bg-teal-800 text-white px-6"
                        onClick={() => navigate('/')}
                    >
                        Get Started →
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 py-8">
                <div className="grid lg:grid-cols-12 gap-6">

                    {/* Hero Text Section */}
                    <div className="lg:col-span-7 bg-[#F4F7F6] rounded-[2rem] p-12 flex flex-col justify-center relative overflow-hidden">
                        <div className="z-10 relative">
                            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6 text-slate-900">
                                Stop Overpaying. <br />
                                Understand Your Bills <br />
                                <span className="text-purple-400 italic font-serif font-light">with AI Analysis</span>
                            </h1>

                            <p className="text-slate-600 max-w-lg mb-8 text-lg">
                                Our AI-powered platform analyzes your insurance policies and hospital bills
                                to find hidden savings, overcharges, and exclusions.
                            </p>

                            <div className="flex flex-wrap gap-4 items-center">
                                <Button
                                    className="rounded-full bg-teal-700 hover:bg-teal-800 text-white pl-6 pr-8 h-12 text-base group"
                                    onClick={() => navigate('/')}
                                >
                                    Analyze My Bill
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="rounded-full bg-white hover:bg-slate-50 text-slate-800 h-12 px-6 text-base shadow-sm border border-slate-100"
                                >
                                    Upload Policy
                                </Button>
                            </div>

                            <div className="mt-12 flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                    <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                    <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                </div>
                                <span className="font-semibold text-slate-800">Trusted by 10,000+ Users</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image Section */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="bg-slate-800 rounded-[2rem] overflow-hidden relative h-[400px] group">
                            <img
                                src="https://img.freepik.com/free-photo/portrait-successful-mid-adult-doctor-with-crossed-arms_1262-12865.jpg"
                                alt="Analysis Dashboard"
                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Overlay Card */}
                            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-3 text-white border border-white/10 w-48">
                                <div className="flex gap-2 mb-2">
                                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                    <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                                    <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                                <div className="w-8 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-[#F4F7F6] rounded-[2rem] p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Total Savings Found</h3>
                                <p className="text-teal-600 font-bold text-lg">$1,250,000+</p>
                            </div>
                            <div className="h-10 w-10 bg-teal-700 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-teal-800 transition-colors">
                                ↗
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer/About Placeholder */}
            <div className="container mx-auto px-4 md:px-6 py-8 mt-4 md:mt-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <Button variant="secondary" className="rounded-full px-6 bg-slate-100 hover:bg-slate-200 text-slate-600">
                        About Us
                    </Button>

                    <p className="text-xl md:text-2xl text-slate-800 max-w-2xl text-center md:text-right font-medium">
                        We provide comprehensive <span className="text-teal-700">bill analysis</span> to help you
                        save money on <span className="text-teal-700">Medical & Auto expenses</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
