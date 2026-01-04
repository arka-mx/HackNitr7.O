import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, ShieldAlert, Gavel, FileSearch, Loader2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PolicyTrigger = () => {
    const navigate = useNavigate();
    const [policyFile, setPolicyFile] = useState<File | null>(null);
    const [medicalDocs, setMedicalDocs] = useState<File[]>([]);
    const [denialDocs, setDenialDocs] = useState<File[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'policy' | 'medical' | 'denial') => {
        if (e.target.files && e.target.files.length > 0) {
            if (type === 'policy') setPolicyFile(e.target.files[0]);
            else if (type === 'medical') setMedicalDocs(prev => [...prev, ...Array.from(e.target.files!)]);
            else setDenialDocs(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleAnalyze = async () => {
        if (!policyFile || medicalDocs.length === 0) {
            setError("Please upload both the Insurance Policy and at least one Medical Document.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        const formData = new FormData();
        formData.append('policyFile', policyFile);
        medicalDocs.forEach(doc => formData.append('medicalDocs', doc));
        denialDocs.forEach(doc => formData.append('denialDocs', doc));

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze/policy-check`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Analysis failed');

            setResult(data.analysis);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to analyze documents. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-100">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-teal-600" />
                            Denial & Policy Review
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">

                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100"
                        >
                            <AlertTriangle className="w-5 h-5" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Upload Section */}
                {!result && (
                    <div className="space-y-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Forensic Denial Audit</h2>
                            <p className="text-slate-500 max-w-xl mx-auto">
                                Validate your claim denial against your specific policy terms. We identify discrepancies and wrongful rejections.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Policy Upload */}
                            <div className={`
                                border-2 border-dashed rounded-2xl p-6 text-center transition-all bg-white
                                ${policyFile ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'}
                            `}>
                                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">1. Insurance Policy</h3>
                                <p className="text-xs text-slate-500 mb-4">The full PDF contract</p>

                                <input type="file" id="policy-upload" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(e, 'policy')} />

                                {policyFile ? (
                                    <div className="flex items-center justify-center gap-2 text-sm text-teal-700 font-medium bg-white py-2 px-3 rounded-lg border border-teal-100">
                                        <CheckCircle className="w-4 h-4" />
                                        {policyFile.name.substring(0, 15)}...
                                    </div>
                                ) : (
                                    <label htmlFor="policy-upload" className="block w-full py-2 bg-slate-900 text-white rounded-lg cursor-pointer hover:bg-slate-800 text-sm font-medium transition-colors">
                                        Select PDF
                                    </label>
                                )}
                            </div>

                            {/* Medical Docs Upload */}
                            <div className={`
                                border-2 border-dashed rounded-2xl p-6 text-center transition-all bg-white
                                ${medicalDocs.length > 0 ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}
                            `}>
                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">2. Medical Records</h3>
                                <p className="text-xs text-slate-500 mb-4">Bill, Notes, or Discharge Summary</p>

                                <input type="file" id="medical-upload" className="hidden" multiple accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, 'medical')} />

                                {medicalDocs.length > 0 ? (
                                    <div className="flex items-center justify-center gap-2 text-sm text-blue-700 font-medium bg-white py-2 px-3 rounded-lg border border-blue-100">
                                        <CheckCircle className="w-4 h-4" />
                                        {medicalDocs.length} File(s) Added
                                    </div>
                                ) : (
                                    <label htmlFor="medical-upload" className="block w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 text-sm font-medium transition-colors">
                                        Add Files
                                    </label>
                                )}
                            </div>

                            {/* Denial Docs Upload */}
                            <div className={`
                                border-2 border-dashed rounded-2xl p-6 text-center transition-all bg-white
                                ${denialDocs.length > 0 ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-300'}
                            `}>
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">3. Denial Letter</h3>
                                <p className="text-xs text-slate-500 mb-4">Rejection note or EOB (Optional)</p>

                                <input type="file" id="denial-upload" className="hidden" multiple accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, 'denial')} />

                                {denialDocs.length > 0 ? (
                                    <div className="flex items-center justify-center gap-2 text-sm text-orange-700 font-medium bg-white py-2 px-3 rounded-lg border border-orange-100">
                                        <CheckCircle className="w-4 h-4" />
                                        {denialDocs.length} File(s) Added
                                    </div>
                                ) : (
                                    <label htmlFor="denial-upload" className="block w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 text-sm font-medium transition-colors">
                                        Add Files
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center mt-12">
                            <Button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !policyFile || medicalDocs.length === 0}
                                size="lg"
                                className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-12 h-14 text-lg shadow-xl shadow-teal-200"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Analyzing Policy Coverage...
                                    </>
                                ) : (
                                    <>
                                        <FileSearch className="w-5 h-5 mr-2" />
                                        Start Review
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Top Summary Card */}
                        <div className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold uppercase mb-6">
                                        <FileSearch className="w-3 h-3" />
                                        Review Complete
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4 leading-tight">{result.verdict_summary}</h2>

                                    <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <h3 className="text-teal-300 font-bold mb-2 flex items-center gap-2">
                                            <Gavel className="w-4 h-4" />
                                            RECOMMENDED REBUTTAL
                                        </h3>
                                        <p className="text-lg leading-relaxed font-medium text-slate-200">
                                            "{result.slam_counter}"
                                        </p>
                                    </div>
                                </div>

                                {/* Modern Donut Chart - Discrepancy Score */}
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative w-64 h-64 flex items-center justify-center">
                                        {/* Outer Glow Ring */}
                                        <div className="absolute inset-0 rounded-full border border-white/5"></div>

                                        <svg className="w-full h-full transform -rotate-90">
                                            {/* Background Circle */}
                                            <circle cx="128" cy="128" r="110" fill="none" stroke="#1e293b" strokeWidth="12" />
                                            {/* Value Circle */}
                                            <motion.circle
                                                cx="128" cy="128" r="110" fill="none"
                                                stroke={result.scam_score > 70 ? "#ef4444" : result.scam_score > 40 ? "#f59e0b" : "#14b8a6"}
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                strokeDasharray="691"
                                                initial={{ strokeDashoffset: 691 }}
                                                animate={{
                                                    strokeDashoffset: 691 - (691 * (result.scam_score / 100))
                                                }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-7xl font-bold tracking-tighter">{result.scam_score}</span>
                                            <span className="text-xs font-medium uppercase tracking-widest text-slate-400 mt-2">Discrepancy Score</span>
                                        </div>
                                    </div>

                                    <div className="w-full max-w-xs mt-8 flex justify-between items-center px-4">
                                        <span className="text-sm text-slate-400 font-medium">Win Probability</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1 h-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0.2 }}
                                                        animate={{ opacity: i < (result.fightability_score / 20) ? 1 : 0.2 }}
                                                        className={`w-2 h-full rounded-full ${i < (result.fightability_score / 20) ? 'bg-teal-400' : 'bg-slate-700'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-white font-bold text-sm ml-2">{result.fightability_score}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Background Glows */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 blur-3xl rounded-full -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 blur-3xl rounded-full -ml-20 -mb-20"></div>
                        </div>

                        {/* Analysis Findings */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-teal-600" />
                                Analysis Findings
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {result.evidence_map.map((item: any, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (idx * 0.1) }}
                                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                                {item.crime}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Source Text</p>
                                            <div className="bg-slate-50 p-3 rounded-lg text-slate-700 font-mono text-sm border-l-4 border-slate-300 italic">
                                                "{item.quote}"
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Assessment</p>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                {item.analysis}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center pt-8">
                            <Button onClick={() => setResult(null)} variant="outline" className="rounded-full">
                                Analyze Another Case
                            </Button>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default PolicyTrigger;
