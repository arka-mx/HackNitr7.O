import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, FileText, ArrowRight, Wand2, Stethoscope, BookOpenCheck, Gauge } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            navigate("/landing");
            await logout();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const models = [
        {
            id: 'bill-check',
            title: 'Medical Bill Check',
            description: 'AI-powered analysis to find errors and overcharges in your hospital bills.',
            icon: <FileText className="w-8 h-8 text-teal-600" />,
            color: 'teal',
            path: '/bill-check',
            status: 'Active'
        },
        {
            id: 'bill-simplifier',
            title: 'Bill Simplifier',
            description: 'Turn complex medical codes (CPT/ICD) into plain English you can actually understand.',
            icon: <Wand2 className="w-8 h-8 text-blue-600" />,
            color: 'blue',
            path: '/bill-simplifier',
            status: 'Active'
        },
        {
            id: 'necessity-detector',
            title: 'Necessity Detector',
            description: 'Scan clinical notes to find missing "medical necessity" language that causes denials.',
            icon: <Stethoscope className="w-8 h-8 text-pink-600" />,
            color: 'pink',
            path: '/necessity-detector',
            status: 'Beta'
        },
        {
            id: 'policy-trigger',
            title: 'Policy Clause Identifier',
            description: 'Identify the exact fine print in your insurance policy that triggered a denial.',
            icon: <BookOpenCheck className="w-8 h-8 text-indigo-600" />,
            color: 'indigo',
            path: '/policy-trigger',
            status: 'Coming Soon'
        },
        {
            id: 'cost-meter',
            title: 'Cost of No Action',
            description: 'A reverse-psychology meter showing how much money you lose by ignoring this bill.',
            icon: <Gauge className="w-8 h-8 text-orange-600" />,
            color: 'orange',
            path: '/cost-meter',
            status: 'Coming Soon'
        }
    ];

    const stats = null; // Removed unused stats array

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/landing')}>
                            <img src="/logo.jpg" alt="Overbilled Logo" className="h-10 w-auto" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-600 hidden sm:block">
                                    {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Our Models</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Choose a specialized AI agent to dismantle your medical bill and find the savings you deserve.
                    </p>
                </div>

                {/* Models Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {models.map((model, index) => (
                        <motion.div
                            key={model.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(model.path)}
                            className={`
                                relative group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all
                                hover:shadow-xl hover:-translate-y-1 cursor-pointer hover:border-${model.color}-200
                            `}
                        >
                            <div className={`mb-6 p-4 rounded-2xl w-fit bg-${model.color}-50 text-${model.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                                {model.icon}
                            </div>

                            <div className="absolute top-8 right-8">
                                <span className={`
                                    text-xs font-bold px-3 py-1 rounded-full border
                                    ${model.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                                        model.status === 'Beta' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-slate-50 text-slate-500 border-slate-200'}
                                `}>
                                    {model.status}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                                {model.title}
                            </h3>
                            <p className="text-slate-500 mb-8 leading-relaxed h-14">
                                {model.description}
                            </p>

                            <div className="flex items-center gap-2 font-bold text-sm text-slate-300 group-hover:text-teal-600 transition-colors">
                                <span>Launch Tool</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden">
                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-teal-300 font-bold text-sm mb-6 backdrop-blur-sm"
                            >
                                THE REALITY CHECK
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                The System is <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">Broken by Design.</span>
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
                                Medical billing errors aren't accidents—they're systemic.
                                Hospitals and insurers rely on complexity to hide overcharges.
                                We're here to even the playing field.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {/* Card 1: Donut Chart Animation */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-6"
                            >
                                <div className="relative w-20 h-20 flex-shrink-0">
                                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#334155" strokeWidth="3" />
                                        <motion.path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="3"
                                            strokeDasharray="0 100"
                                            animate={{ strokeDasharray: "80 100" }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">80%</div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">Error Rate</h4>
                                    <p className="text-slate-400 text-sm">Of all hospital bills contain errors.</p>
                                </div>
                            </motion.div>

                            {/* Card 2: Denial Rate (Grid) */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-6"
                            >
                                <div className="grid grid-cols-4 gap-1">
                                    {[...Array(7)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ delay: 0.5 + (i * 0.1) }}
                                            className={`w-3 h-3 rounded-sm ${i === 6 ? 'bg-orange-500' : 'bg-slate-700'}`}
                                        />
                                    ))}
                                    <div className="w-3 h-3 bg-transparent" /> {/* Spacer */}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">1 in 7 Denied</h4>
                                    <p className="text-slate-400 text-sm">Claims rejected on first submission.</p>
                                </div>
                            </motion.div>

                            {/* Card 3: Big Number */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10"
                            >
                                <div className="text-4xl font-black text-green-400 mb-1">$210 Billion</div>
                                <p className="text-slate-400 text-sm">Wasted annually due to claim denial mismanagement.</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none"></div>
                </div>

                {/* Market Insights Section */}
                <div className="mt-12 grid lg:grid-cols-2 gap-8">
                    {/* Chart 1: Hospital Data */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                            Hospital Data: Billing Breakdown
                        </h3>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative w-48 h-48 flex-shrink-0">
                                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                                    {/* Inflated/Erroneous - 65% */}
                                    <motion.circle
                                        cx="18" cy="18" r="15.9155" fill="none" stroke="#F87171" strokeWidth="4"
                                        strokeDasharray="65 100" strokeDashoffset="0"
                                        initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: "65 100" }} viewport={{ once: true }} transition={{ duration: 1 }}
                                    />
                                    {/* Hidden Fees - 10% */}
                                    <motion.circle
                                        cx="18" cy="18" r="15.9155" fill="none" stroke="#FBBF24" strokeWidth="4"
                                        strokeDasharray="10 100" strokeDashoffset="-65"
                                        initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: "10 100" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
                                    />
                                    {/* Accurate - 25% */}
                                    <motion.circle
                                        cx="18" cy="18" r="15.9155" fill="none" stroke="#0F766E" strokeWidth="4"
                                        strokeDasharray="25 100" strokeDashoffset="-75"
                                        initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: "25 100" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.6 }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-800">
                                    <span className="text-3xl font-bold">75%</span>
                                    <span className="text-xs font-medium text-slate-400">Inflated</span>
                                </div>
                            </div>
                            <div className="space-y-3 w-full">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <span className="text-sm font-medium text-slate-700">Upcoding & Errors</span>
                                    </div>
                                    <span className="font-bold text-slate-800">65%</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <span className="text-sm font-medium text-slate-700">Hidden Fees</span>
                                    </div>
                                    <span className="font-bold text-slate-800">10%</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-teal-50/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                                        <span className="text-sm font-medium text-slate-700">Accurate Charges</span>
                                    </div>
                                    <span className="font-bold text-slate-800">25%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Chart 2: Patient Data */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col"
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                            Patient Data: Cost Burden
                        </h3>
                        <p className="text-slate-500 mb-8 max-w-sm">
                            The average patient overpays significantly when they don't audit their bills.
                        </p>
                        <div className="flex-1 flex items-end justify-center gap-12 sm:gap-24 px-4 pb-4">
                            {/* Bar 1: Fair Cost */}
                            <div className="flex flex-col items-center gap-2 group">
                                <span className="font-bold text-teal-600 mb-1">$500</span>
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: '60px' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1 }}
                                    className="w-16 sm:w-20 bg-teal-500/20 rounded-t-xl border-t-2 border-r-2 border-l-2 border-teal-500 dotted-bg relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-teal-500 opacity-20"></div>
                                </motion.div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Fair Cost</span>
                            </div>

                            {/* Bar 2: Patient Pays */}
                            <div className="flex flex-col items-center gap-2 relative">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="absolute -top-12 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm"
                                >
                                    AVG OVERPAYMENT
                                </motion.div>
                                <span className="font-bold text-red-600 mb-1 text-2xl">$2,500</span>
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: '220px' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, type: 'spring' }}
                                    className="w-16 sm:w-20 bg-gradient-to-t from-red-500 to-blue-600 rounded-t-xl shadow-lg relative overflow-hidden"
                                >
                                    {/* Stripes effect */}
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
                                </motion.div>
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Patient Bill</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
