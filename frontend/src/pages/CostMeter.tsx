import { useState } from 'react';

import { FileText, AlertCircle, Loader2, ArrowLeft, TrendingDown, DollarSign, Clock, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CostMeter = () => {
    const [hospitalBill, setHospitalBill] = useState<File | null>(null);
    const [policyFile, setPolicyFile] = useState<File | null>(null);
    const [annualIncome, setAnnualIncome] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { currentUser } = useAuth();
    const navigate = useNavigate();



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'bill' | 'policy') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'bill') setHospitalBill(e.target.files[0]);
            else setPolicyFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!hospitalBill) {
            setError("Please upload the hospital bill to proceed.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        const formData = new FormData();
        formData.append('hospitalBill', hospitalBill);
        if (policyFile) formData.append('policyFile', policyFile);
        formData.append('annualIncome', annualIncome);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze/cost-analysis`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            if (data.analysis && data.analysis.error) {
                setError(data.analysis.error);
            } else {
                setAnalysisResult(data.analysis);
            }
        } catch (err) {
            setError("Failed to analyze cost of inaction. Please try again.");
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F5F3] font-sans text-slate-800 selection:bg-red-100">
            {/* Navbar */}
            <nav className="bg-[#F0F5F3] border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <img src="/logo.jpg" alt="Overbilled Logo" className="h-10 w-auto" />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-600 hidden sm:block">
                                {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Cost of No Action</h1>
                        <p className="text-slate-600 mt-1">See what you lose by waiting. A financial reality check.</p>
                    </div>
                </div>

                {/* Input Section */}
                {!analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid md:grid-cols-2 gap-8 mb-12"
                    >
                        <div className="col-span-full bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                            <div className="max-w-2xl mx-auto space-y-8">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Your Bill</h2>
                                    <p className="text-slate-500">We'll show you the hidden cost of "thinking about it later".</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Bill Upload */}
                                    <div className={`
                                        relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                                        ${hospitalBill ? 'border-teal-500 bg-teal-50/30' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                                    `}>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'bill')}
                                            accept=".pdf,.jpg,.png,.jpeg"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center">
                                            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                                <FileText className={`w-6 h-6 ${hospitalBill ? 'text-teal-600' : 'text-slate-400'}`} />
                                            </div>
                                            <span className="font-semibold text-slate-700">{hospitalBill ? hospitalBill.name : "Hospital Bill"}</span>
                                            <span className="text-xs text-slate-400 mt-1">Required</span>
                                        </div>
                                    </div>

                                    {/* Policy Upload */}
                                    <div className={`
                                        relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                                        ${policyFile ? 'border-purple-500 bg-purple-50/30' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                                    `}>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'policy')}
                                            accept=".pdf,.jpg,.png,.jpeg"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center">
                                            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                                <ShieldAlert className={`w-6 h-6 ${policyFile ? 'text-purple-600' : 'text-slate-400'}`} />
                                            </div>
                                            <span className="font-semibold text-slate-700">{policyFile ? policyFile.name : "Policy / Denial"}</span>
                                            <span className="text-xs text-slate-400 mt-1">Optional</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Annual Income Input */}
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Annual Family Income <span className="text-slate-400 font-normal">(Optional context)</span>
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={annualIncome}
                                            onChange={(e) => setAnnualIncome(e.target.value)}
                                            placeholder="e.g. 75,000"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 font-medium"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        We use this to estimate the relative financial impact of inaction on your household.
                                    </p>
                                </div>

                                <Button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                    className="w-full py-6 rounded-xl text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10"
                                >
                                    {isAnalyzing ? (
                                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Calculating Costs...</>
                                    ) : (
                                        "Calculate Cost of Inaction"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Error State */}
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

                {/* Results View */}
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Top Summary: Potential Loss */}
                        <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-red-900 font-medium mb-1">VALUE LEFT ON THE TABLE</h3>
                                <div className="text-4xl md:text-6xl font-bold text-red-600 mb-4 tracking-tight">
                                    {analysisResult.value_left_on_the_table.estimated_range}
                                </div>
                                <p className="text-red-700/80 max-w-xl mx-auto text-lg leading-relaxed">
                                    {analysisResult.value_left_on_the_table.why}
                                </p>
                            </div>
                            {/* Background Decor */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-50 -z-0"></div>
                        </div>

                        {/* Behavioral Insight */}
                        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="bg-white/10 p-3 rounded-full mb-4 backdrop-blur-sm">
                                    <TrendingDown className="w-6 h-6 text-white" />
                                </div>
                                <blockquote className="text-xl md:text-2xl font-serif italic opacity-90 mb-4">
                                    "{analysisResult.behavioral_insight}"
                                </blockquote>
                                <div className="text-sm font-medium opacity-50 uppercase tracking-widest">
                                    Behavioral Pattern Detected
                                </div>
                            </div>
                        </div>

                        {/* Timeline of Decay */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {['30_days', '60_days', '90_plus_days'].map((key, idx) => {
                                const labels = ["30 Days", "60 Days", "90+ Days"];
                                const colors = ["bg-emerald-50 border-emerald-100 text-emerald-900", "bg-yellow-50 border-yellow-100 text-yellow-900", "bg-orange-50 border-orange-100 text-orange-900"];
                                const titles = ["Still Time", "Leverage Fading", "Hardened"];

                                return (
                                    <div key={key} className={`border rounded-2xl p-6 ${colors[idx]} flex flex-col`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Clock className="w-5 h-5 opacity-50" />
                                            <span className="font-bold uppercase tracking-wider text-sm opacity-70">{labels[idx]}</span>
                                        </div>
                                        <h4 className="text-xl font-bold mb-3">{titles[idx]}</h4>
                                        <p className="text-sm opacity-90 leading-relaxed flex-1">
                                            {analysisResult.what_changes_if_you_wait[key]}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Tradeoffs List */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Key Trade-offs of Inaction</h3>
                            <ul className="space-y-4">
                                {analysisResult.key_tradeoffs_of_inaction.map((item: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-xs">
                                            {idx + 1}
                                        </div>
                                        <span className="text-slate-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                                <Button
                                    onClick={() => setAnalysisResult(null)}
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    Start New Analysis
                                </Button>
                            </div>
                        </div>

                        <p className="text-center text-xs text-slate-400 max-w-md mx-auto">
                            {analysisResult.confidence_note}
                        </p>

                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default CostMeter;
