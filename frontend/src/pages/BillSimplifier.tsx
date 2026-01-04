import { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

import BodyMap from '@/components/BodyMap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface HumanBillCategory {
    category: string;
    items: {
        original_name: string;
        simple_name: string;
        cost: number;
        advisor_note: string;
    }[];
}

interface SimplifierResult {
    summary: string;
    human_bill: HumanBillCategory[];
    affected_organs: string[];
    red_flags: string[];
    suggested_questions: string[];
}

export default function BillSimplifier() {

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SimplifierResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('hospitalBill', file);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze/simplify`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.analysis) {
                setResult(data.analysis);
            }
        } catch (error) {
            console.error("Error simplifying bill:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Bill Simplifier</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We translate medical jargon into plain English and map it to your body.
                    </p>
                </div>

                {!result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
                    >
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors">
                            <input
                                type="file"
                                id="bill-upload"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="bill-upload" className="cursor-pointer flex flex-col items-center w-full">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <span className="text-lg font-semibold text-slate-900 mb-2">Upload your Hospital Bill</span>
                                <span className="text-slate-500 text-sm mb-6">PDF format supported</span>
                                {file ? (
                                    <div className="flex items-center gap-2 text-teal-600 font-medium bg-teal-50 px-4 py-2 rounded-full">
                                        <CheckCircle2 className="w-4 h-4" />
                                        {file.name}
                                    </div>
                                ) : (
                                    <div className="bg-slate-100 text-slate-600 px-6 py-2 rounded-full font-medium hover:bg-slate-200 transition-colors">Select PDF</div>
                                )}
                            </label>
                        </div>

                        <div className="mt-6">
                            <Button
                                className="w-full h-12 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={!file || loading}
                                onClick={handleAnalyze}
                            >
                                {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                                {loading ? 'Analyzing...' : 'Simplify My Bill'}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {result && (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* LEFT: Body Map */}
                        <div className="lg:col-span-5 sticky top-8 h-fit space-y-6">
                            <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Affected Areas</h3>
                                <BodyMap affectedOrgans={result.affected_organs || []} />
                            </div>

                            {result.red_flags && result.red_flags.length > 0 && (
                                <div className="bg-red-50 rounded-3xl p-6 border border-red-100">
                                    <h3 className="text-red-800 font-bold mb-3 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Red Flags Detected
                                    </h3>
                                    <ul className="space-y-2">
                                        {result.red_flags.map((flag, i) => (
                                            <li key={i} className="text-red-700 text-sm leading-relaxed">• {flag}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Content */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Summary</h3>
                                <div className="prose prose-slate max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.summary}</ReactMarkdown>
                                </div>
                            </div>

                            {/* Simple List for Bill Items */}
                            <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Itemized Breakdown</h3>
                                <div className="space-y-8">
                                    {result.human_bill.map((category, idx) => (
                                        <div key={idx}>
                                            <h4 className="font-bold text-lg text-slate-800 mb-3 pb-2 border-b border-slate-100">{category.category}</h4>
                                            <div className="space-y-4">
                                                {category.items.map((item, i) => (
                                                    <div key={i} className="bg-slate-50 p-4 rounded-xl">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-semibold text-slate-900">{item.simple_name}</span>
                                                            <span className="font-mono text-slate-600 font-bold">${item.cost}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-500 mb-2">{item.original_name}</p>
                                                        <div className="text-sm bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100">
                                                            <strong>Note:</strong> {item.advisor_note}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
