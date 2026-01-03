import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, FileText, ArrowRight, Zap, Shield } from "lucide-react";
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
            id: 'policy-scan',
            title: 'Policy Scanner',
            description: 'Deep dive into your insurance policy to understand coverage limits.',
            icon: <Shield className="w-8 h-8 text-purple-600" />,
            color: 'purple',
            path: '#',
            status: 'Coming Soon'
        },
        {
            id: 'claim-helper',
            title: 'Claim Assistant',
            description: 'Automated help with filing and tracking your insurance claims.',
            icon: <Zap className="w-8 h-8 text-orange-600" />,
            color: 'orange',
            path: '#',
            status: 'Coming Soon'
        }
    ];

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
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Models</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Choose a specialized  model to assist with your medical billing needs.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {models.map((model, index) => (
                        <motion.div
                            key={model.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => model.status === 'Active' && navigate(model.path)}
                            className={`
                                relative group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm transition-all
                                ${model.status === 'Active'
                                    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer hover:border-teal-200'
                                    : 'opacity-80 cursor-not-allowed'}
                            `}
                        >
                            <div className={`mb-6 p-4 rounded-xl w-fit ${model.color === 'teal' ? 'bg-teal-50' :
                                model.color === 'purple' ? 'bg-purple-50' : 'bg-orange-50'
                                }`}>
                                {model.icon}
                            </div>

                            <div className="absolute top-8 right-8">
                                <span className={`
                                    text-xs font-bold px-3 py-1 rounded-full border
                                    ${model.status === 'Active'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-slate-50 text-slate-500 border-slate-200'}
                                `}>
                                    {model.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                                {model.title}
                            </h3>
                            <p className="text-slate-500 mb-6 leading-relaxed">
                                {model.description}
                            </p>

                            <div className={`flex items-center gap-2 font-semibold text-sm ${model.status === 'Active' ? 'text-teal-600 group-hover:underline' : 'text-slate-400'
                                }`}>
                                {model.status === 'Active' ? 'Launch Model' : 'Notify me'}
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Promo/Stats Section */}
                <div className="mt-20 bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6">Join 10,000+ others saving money</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">
                            Stop overpaying for medical care. Our tools are helping patients reclaim millions in erroneous charges.
                        </p>
                        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-slate-800 pt-8">
                            <div>
                                <div className="text-3xl font-bold text-teal-400 mb-1">$2.5M+</div>
                                <div className="text-slate-400 text-sm">Savings Identified</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-purple-400 mb-1">98%</div>
                                <div className="text-slate-400 text-sm">Accuracy Rate</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-orange-400 mb-1">15k+</div>
                                <div className="text-slate-400 text-sm">Bills Analyzed</div>
                            </div>
                        </div>
                    </div>
                    {/* Background Glows */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 blur-3xl rounded-full -ml-32 -mt-32"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full -mr-32 -mb-32"></div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
