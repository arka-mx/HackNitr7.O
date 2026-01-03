import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, CheckCircle, AlertCircle, Loader2, LogOut, TrendingUp, ShieldCheck, User, PiggyBank, PieChart, ArrowLeft, Scale, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AnalysisData {
    summary: {
        total_billed: string;
        insurance_paid: string;
        patient_responsibility: string;
        potential_savings: string;
        status: string;
    };
    quick_take: string;
    detailed_report: string;
}

const BillCheck = () => {
    const [hospitalBill, setHospitalBill] = useState<File | null>(null);
    const [insurancePolicy, setInsurancePolicy] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'bill' | 'policy') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'bill') setHospitalBill(e.target.files[0]);
            else setInsurancePolicy(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!hospitalBill) {
            setError("Please upload the hospital bill at least.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        const formData = new FormData();
        formData.append('hospitalBill', hospitalBill);
        if (insurancePolicy) {
            formData.append('insurancePolicy', insurancePolicy);
        }

        try {
            const response = await fetch('http://localhost:5000/api/analyze/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            setAnalysisResult(data.analysis);
        } catch (err) {
            setError("Failed to analyze documents. Please try again.");
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Helper to extract numbers from currency strings for the chart
    const chartData = useMemo(() => {
        if (!analysisResult) return null;
        const parseCurrency = (str: string) => {
            return parseFloat(str.replace(/[^0-9.-]+/g, "")) || 0;
        };

        const total = parseCurrency(analysisResult.summary.total_billed);
        const paid = parseCurrency(analysisResult.summary.insurance_paid);
        const responsibility = parseCurrency(analysisResult.summary.patient_responsibility);
        const savings = parseCurrency(analysisResult.summary.potential_savings);

        // Avoid division by zero
        const safeTotal = total || 1;

        return {
            series: [
                { label: 'Insurance Paid', value: paid, color: '#0F766E', percentage: (paid / safeTotal) * 100 }, // teal-700
                { label: 'Your Responsibility', value: responsibility, color: '#F97316', percentage: (responsibility / safeTotal) * 100 }, // orange-500
                { label: 'Potential Savings', value: savings, color: '#10B981', percentage: (savings / safeTotal) * 100 }, // emerald-500
            ],
            total: total
        };
    }, [analysisResult]);


    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800 selection:bg-teal-100">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Section */}
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Medical Bill Analysis</h1>
                        <p className="text-slate-600 mt-1">Upload your bills to find errors and potential savings.</p>
                    </div>
                </div>

                {/* Upload Section - Collapsible or top section */}
                {!analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid md:grid-cols-2 gap-6 mb-12"
                    >
                        <div className="col-span-full mb-4">
                            <div className="bg-[#F4F7F6] rounded-[2rem] p-8 text-slate-900 border border-slate-100 relative overflow-hidden">
                                <div className="relative z-10 max-w-2xl">
                                    <h2 className="text-2xl font-bold mb-2">Start Your Analysis</h2>
                                    <p className="text-slate-600 mb-6">Upload your documents below to let our AI scan for errors and overcharges instantly.</p>
                                </div>
                                {/* Abstract Shapes matching Landing page feel */}
                                <div className="absolute right-0 top-0 h-64 w-64 bg-teal-50 opacity-50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="absolute right-20 bottom-0 h-32 w-32 bg-teal-100 opacity-20 rounded-full pointer-events-none"></div>
                            </div>
                        </div>

                        <UploadCard
                            title="Hospital Bill"
                            description="Upload your itemized bill (PDF/Image)"
                            file={hospitalBill}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'bill')}
                            accept=".pdf,.jpg,.png,.jpeg"
                            icon={<FileText className="w-8 h-8 text-teal-600" />}
                            activeColor="teal"
                        />

                        <UploadCard
                            title="Insurance Policy"
                            description="Upload policy document (Optional)"
                            file={insurancePolicy}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'policy')}
                            accept=".pdf,.jpg,.png,.jpeg"
                            icon={<CheckCircle className="w-8 h-8 text-purple-600" />}
                            activeColor="purple"
                        />

                        <div className="col-span-full flex justify-center mt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className={`
                                    px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all flex items-center gap-3
                                    ${isAnalyzing
                                        ? 'bg-slate-200 cursor-not-allowed text-slate-400'
                                        : 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-700/20'}
                                `}
                            >
                                {isAnalyzing ? (
                                    <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing...</>
                                ) : (
                                    "Analyze Documents"
                                )}
                            </motion.button>
                        </div>

                        {/* Denial Check Bridge */}
                        <div className="col-span-full mt-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                        <Scale className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-indigo-900 text-sm">Has this bill been denied by insurance?</h3>
                                        <p className="text-indigo-600 text-xs">Don't just check for errors—fight back against bad faith denials.</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => navigate('/policy-trigger')}
                                    size="sm"
                                    className="bg-red-600 hover:bg-orange-700 text-white rounded-lg shadow-sm"
                                >
                                    Check Denial <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Analysis Results View */}
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-slate-800">Overview</h2>
                            <Button variant="outline" size="sm" onClick={() => setAnalysisResult(null)}>New Analysis</Button>
                        </div>

                        {/* Top Cards Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                label="Total Billed"
                                value={analysisResult.summary.total_billed}
                                icon={<FileText className="w-5 h-5" />}
                                color="bg-blue-500"
                                trend="+12% vs avg"
                                trendColor="text-green-600"
                                subtext="Per Invoice"
                            />
                            <StatCard
                                label="Insurance Paid"
                                value={analysisResult.summary.insurance_paid}
                                icon={<ShieldCheck className="w-5 h-5" />}
                                color="bg-purple-500"
                                trend="Verified"
                                trendColor="text-indigo-600"
                                subtext="Verified/Est."
                            />
                            <StatCard
                                label="Your Responsibility"
                                value={analysisResult.summary.patient_responsibility}
                                icon={<User className="w-5 h-5" />}
                                color="bg-orange-500"
                                trend="Due Now"
                                trendColor="text-orange-600"
                                subtext="Current Due"
                            />
                            <StatCard
                                label="Potential Savings"
                                value={analysisResult.summary.potential_savings}
                                icon={<PiggyBank className="w-5 h-5" />}
                                color="bg-emerald-500"
                                trend="Actionable"
                                trendColor="text-emerald-600"
                                subtext="Identified"
                            />
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Breakdown Chart Section */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-slate-900">Cost Allocation</h3>
                                    <button className="text-slate-400 hover:text-slate-600"><PieChart className="w-5 h-5" /></button>
                                </div>
                                <div className="flex items-center justify-center h-64">
                                    {chartData && (
                                        <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                                            {/* Donut Chart Visualization */}
                                            <div className="relative w-48 h-48 flex-shrink-0">
                                                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                                    {/* Background Circle */}
                                                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F1F5F9" strokeWidth="4" />

                                                    <motion.circle
                                                        cx="18" cy="18" r="15.9155" fill="none" stroke="#0F766E" strokeWidth="4"
                                                        strokeDasharray={`${chartData.series[0].percentage} 100`}
                                                        strokeDashoffset="0"
                                                        initial={{ strokeDasharray: "0 100" }}
                                                        animate={{ strokeDasharray: `${chartData.series[0].percentage} 100` }}
                                                    />
                                                    <motion.circle
                                                        cx="18" cy="18" r="15.9155" fill="none" stroke="#F97316" strokeWidth="4"
                                                        strokeDasharray={`${chartData.series[1].percentage} 100`}
                                                        strokeDashoffset={-chartData.series[0].percentage}
                                                        initial={{ strokeDasharray: "0 100" }}
                                                        animate={{ strokeDasharray: `${chartData.series[1].percentage} 100` }}
                                                    />
                                                    <motion.circle
                                                        cx="18" cy="18" r="15.9155" fill="none" stroke="#10B981" strokeWidth="4"
                                                        strokeDasharray={`${chartData.series[2].percentage} 100`}
                                                        strokeDashoffset={-(chartData.series[0].percentage + chartData.series[1].percentage)}
                                                        initial={{ strokeDasharray: "0 100" }}
                                                        animate={{ strokeDasharray: `${chartData.series[2].percentage} 100` }}
                                                    />

                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                    <span className="text-xs text-slate-400 font-medium">Total</span>
                                                    <span className="text-lg font-bold text-slate-900">{analysisResult.summary.total_billed}</span>
                                                </div>
                                            </div>

                                            {/* Legend */}
                                            <div className="flex-1 space-y-4 w-full">
                                                {chartData.series.map((item, idx) => (
                                                    <div key={idx} className="flex flex-col gap-1">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                                                <span className="text-slate-600 font-medium">{item.label}</span>
                                                            </div>
                                                            <span className="font-bold text-slate-800">{Math.round(item.percentage)}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                            <motion.div
                                                                className="h-full rounded-full"
                                                                style={{ backgroundColor: item.color }}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${item.percentage}%` }}
                                                                transition={{ duration: 1, delay: 0.2 }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Take Card */}
                            <div className="bg-teal-50 border border-teal-100 p-6 rounded-2xl text-teal-900 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp className="w-5 h-5 text-teal-600" />
                                        <span className="font-medium text-sm text-teal-700">AI INSIGHT</span>
                                    </div>
                                    <p className="text-xl font-medium leading-relaxed">
                                        "{analysisResult.quick_take}"
                                    </p>
                                </div>
                                <div className="mt-8 pt-6 border-t border-teal-200/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-teal-600 font-medium tracking-wide">ANALYSIS COMPLETE</span>
                                    </div>
                                    <span className="text-xs text-teal-600">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Report */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                    Detailed Breakdown
                                </h3>
                            </div>
                            <div className="p-8">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-slate-800 mb-4 mt-6 first:mt-0 pb-2 border-b border-slate-100" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-teal-900 mb-3 mt-8 pb-2 border-b border-slate-100 flex items-center gap-2" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-slate-700 mb-2 mt-6" {...props} />,
                                        p: ({ node, ...props }) => <div className="text-slate-600 mb-4 leading-relaxed" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-none space-y-2 mb-4" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-600" {...props} />,
                                        li: ({ node, ...props }) => (
                                            <li className="flex gap-2 items-start text-slate-600">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                                                <span className="flex-1">{props.children}</span>
                                            </li>
                                        ),
                                        strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                                        input: ({ node, ...props }) => {
                                            if (props.type === 'checkbox') {
                                                return <input type="checkbox" className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 mt-1 mr-2" {...props} />
                                            }
                                            return <input {...props} />
                                        }
                                    }}
                                >
                                    {analysisResult.detailed_report}
                                </ReactMarkdown>
                            </div>
                        </div>

                    </motion.div>
                )}
            </main>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, trend, trendColor, subtext }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
                <span className="text-slate-500 text-sm font-medium mb-1">{label}</span>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
                <div className={`${color.replace('bg-', 'text-')}`}>
                    {icon}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50">
            <TrendingUp className={`w-3 h-3 ${trendColor}`} />
            <span className={`text-xs font-bold ${trendColor}`}>{trend}</span>
            <span className="text-xs text-slate-400 ml-1">{subtext}</span>
        </div>
    </div>
);

const UploadCard = ({ title, description, file, onChange, accept, icon, activeColor }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="relative group cursor-pointer"
    >
        <div className={`
            relative h-full bg-[#fcfcfc] border-2 border-slate-100 rounded-[2rem] p-8 text-center transition-all
            hover:border-${activeColor}-200 hover:bg-white hover:shadow-lg
            ${file ? `border-${activeColor}-500/50 bg-${activeColor}-50/30` : ''}
        `}>
            <div className="mb-6 flex justify-center">
                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                    {icon}
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 mb-6 text-sm">{description}</p>

            <div className="relative">
                <input
                    type="file"
                    onChange={onChange}
                    accept={accept}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`overflow-hidden
                    py-3 rounded-xl font-medium text-sm transition-colors border max-w-[200px] mx-auto
                    ${file
                        ? `bg-white text-${activeColor}-700 border-${activeColor}-200 shadow-sm`
                        : 'bg-white text-slate-600 border-slate-200 group-hover:bg-slate-50'}
                `}>
                    {file ? file.name : 'Choose File'}
                </div>
            </div>
        </div>
    </motion.div>
);


export default BillCheck;
