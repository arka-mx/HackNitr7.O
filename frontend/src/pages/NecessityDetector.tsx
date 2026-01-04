import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Stethoscope, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NecessityDetector = () => {
    const navigate = useNavigate();
    const [clinicalNotes, setClinicalNotes] = useState<File[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setClinicalNotes(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleAnalyze = async () => {
        if (clinicalNotes.length === 0) {
            setError("Please upload at least one Clinical Note.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        const formData = new FormData();
        clinicalNotes.forEach(doc => formData.append('clinicalNotes', doc));

        try {
            const response = await fetch('http://localhost:5000/api/analyze/necessity-check', {
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
                            <Stethoscope className="w-5 h-5 text-teal-600" />
                            Necessity Detector
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
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Validate Your Medical Necessity</h2>
                            <p className="text-slate-500 max-w-xl mx-auto">
                                Ensure your clinical notes explicitly prove why you needed care. We scan for the "magic words" insurers require.
                            </p>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <div className={`
                                border-2 border-dashed rounded-3xl p-12 text-center transition-all bg-white relative overflow-hidden group
                                ${clinicalNotes.length > 0 ? 'border-teal-500 bg-teal-50/30' : 'border-slate-200 hover:border-teal-300'}
                            `}>
                                <div className="absolute inset-0 bg-teal-50 opacity-0 group-hover:opacity-10 transition-opacity"></div>

                                <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Clinical Notes</h3>
                                <p className="text-slate-500 mb-8">Discharge summary, doctor's notes, or procedure records (PDF/Image)</p>

                                {clinicalNotes.length > 0 ? (
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {clinicalNotes.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-teal-700 font-medium bg-white py-2 px-4 rounded-full border border-teal-100 shadow-sm">
                                                <CheckCircle className="w-4 h-4" />
                                                {file.name.substring(0, 20)}...
                                            </div>
                                        ))}
                                        <label className="relative flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-100/50 py-2 px-4 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                multiple
                                                accept=".pdf,.jpg,.png"
                                                onChange={handleFileChange}
                                            />
                                            + Add More
                                        </label>
                                    </div>
                                ) : (
                                    <label className="relative inline-block px-8 py-3 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-slate-800 font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            multiple
                                            accept=".pdf,.jpg,.png"
                                            onChange={handleFileChange}
                                        />
                                        Select Files
                                    </label>
                                )}
                            </div>

                            <div className="flex justify-center mt-12">
                                <Button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || clinicalNotes.length === 0}
                                    size="lg"
                                    className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-12 h-14 text-lg shadow-xl shadow-teal-200 transition-all hover:scale-105 active:scale-95"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Scanning Documentation...
                                        </>
                                    ) : (
                                        <>
                                            <Stethoscope className="w-5 h-5 mr-2" />
                                            Check Necessity
                                        </>
                                    )}
                                </Button>
                            </div>
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
                        {/* Summary Card */}
                        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Prescription Audit Results</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                {result.summary}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {result.symptoms_identified?.map((sym: string, i: number) => (
                                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {sym}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Audit Columns */}
                        <div className="grid md:grid-cols-3 gap-6">

                            {/* Necessary */}
                            <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
                                <div className="flex items-center gap-2 mb-6 text-teal-800">
                                    <ShieldCheck className="w-5 h-5" />
                                    <h3 className="font-bold">Necessary</h3>
                                    <span className="ml-auto bg-teal-200 text-teal-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {result.medication_audit?.necessary?.length || 0}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {result.medication_audit?.necessary?.length > 0 ? (
                                        result.medication_audit.necessary.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-white p-4 rounded-xl border border-teal-100 shadow-sm">
                                                <div className="font-bold text-slate-900 text-sm mb-1">{item.name}</div>
                                                <div className="text-xs text-teal-600 font-medium">{item.reason}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-400 italic text-sm">No verified necessary meds found.</div>
                                    )}
                                </div>
                            </div>

                            {/* Extra / Unnecessary */}
                            <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                                <div className="flex items-center gap-2 mb-6 text-red-800">
                                    <AlertTriangle className="w-5 h-5" />
                                    <h3 className="font-bold">Extra / Check</h3>
                                    <span className="ml-auto bg-red-200 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {result.medication_audit?.extra?.length || 0}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {result.medication_audit?.extra?.length > 0 ? (
                                        result.medication_audit.extra.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                                                <div className="font-bold text-slate-900 text-sm mb-1">{item.name}</div>
                                                <div className="text-xs text-red-600 font-medium">{item.reason}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-400 italic text-sm">No unnecessary meds detected.</div>
                                    )}
                                </div>
                            </div>

                            {/* Missing */}
                            <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100">
                                <div className="flex items-center gap-2 mb-6 text-amber-800">
                                    <AlertCircle className="w-5 h-5" />
                                    <h3 className="font-bold">Missing</h3>
                                    <span className="ml-auto bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {result.medication_audit?.missing?.length || 0}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {result.medication_audit?.missing?.length > 0 ? (
                                        result.medication_audit.missing.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                                                <div className="font-bold text-slate-900 text-sm mb-1">{item.condition}</div>
                                                <div className="text-xs text-amber-600 font-medium">{item.suggestion}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-400 italic text-sm">No coverage gaps found.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Doctor Feedback */}
                        {result.doctor_feedback?.length > 0 && (
                            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                                    <Stethoscope className="w-5 h-5 text-teal-400" />
                                    Doctor's Review Notes
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4 relative z-10">
                                    {result.doctor_feedback.map((note: string, idx: number) => (
                                        <div key={idx} className="bg-white/10 p-4 rounded-xl border border-white/10 text-sm text-slate-200">
                                            "{note}"
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center pt-8">
                            <Button onClick={() => setResult(null)} variant="outline" className="rounded-full h-12 px-8">
                                Check Another Prescription
                            </Button>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default NecessityDetector;
