import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, CheckCircle, AlertCircle, Loader2, LogOut } from 'lucide-react';
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

const Dashboard = () => {
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
            const response = await fetch('http://localhost:5000/api/analyze/upload', {
                method: 'POST',
                body: formData, // fetch automatically sets Content-Type to multipart/form-data
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

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800 selection:bg-teal-100">

            {/* Header */}
            <header className="container mx-auto flex items-center justify-between py-6 px-4 md:px-6 mb-8 border-b border-slate-100">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/landing')}>
                    <div className="h-8 w-8 bg-teal-700 rounded-md flex items-center justify-center text-white font-bold text-xl">
                        O
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900">Overbilled</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium hidden md:inline-block text-slate-600">
                        {currentUser?.displayName || currentUser?.email}
                    </span>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>

            <div className="container mx-auto px-6 max-w-6xl pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Medical Bill Analysis
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Upload your hospital bills and insurance policy. <br />
                        <span className="text-teal-700 font-medium">Identify overcharges and save money.</span>
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Hospital Bill Upload */}
                    <UploadCard
                        title="Hospital Bill"
                        description="Upload your itemized hospital bill or statement."
                        file={hospitalBill}
                        onChange={(e) => handleFileChange(e, 'bill')}
                        accept=".pdf,.jpg,.png,.jpeg"
                        icon={<FileText className="w-8 h-8 text-teal-600" />}
                        activeColor="teal"
                    />

                    {/* Insurance Policy Upload */}
                    <UploadCard
                        title="Insurance Policy"
                        description="Upload your policy document (optional but recommended)."
                        file={insurancePolicy}
                        onChange={(e) => handleFileChange(e, 'policy')}
                        accept=".pdf,.jpg,.png,.jpeg"
                        icon={<CheckCircle className="w-8 h-8 text-purple-600" />}
                        activeColor="purple"
                    />
                </div>

                <div className="flex justify-center mb-16">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className={`
                        px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all
                        ${isAnalyzing
                                ? 'bg-slate-200 cursor-not-allowed text-slate-400'
                                : 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-700/20'}
                        flex items-center gap-3
                    `}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Analyzing Documents...
                            </>
                        ) : (
                            <>
                                Start Analysis
                            </>
                        )}
                    </motion.button>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3 max-w-2xl mx-auto"
                        >
                            <AlertCircle className="w-6 h-6" />
                            {error}
                        </motion.div>
                    )}

                    {analysisResult && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Executive Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <SummaryCard
                                    label="Total Billed"
                                    value={analysisResult.summary.total_billed}
                                    icon="📄"
                                    subtext="Per Invoice"
                                />
                                <SummaryCard
                                    label="Insurance Paid"
                                    value={analysisResult.summary.insurance_paid}
                                    icon="🛡️"
                                    subtext="Verified/Est."
                                />
                                <SummaryCard
                                    label="Your Responsibility"
                                    value={analysisResult.summary.patient_responsibility}
                                    icon="👤"
                                    subtext="Current Due"
                                    highlight="orange"
                                />
                                <SummaryCard
                                    label="Potential Savings"
                                    value={analysisResult.summary.potential_savings}
                                    icon="💰"
                                    subtext="Identified"
                                    highlight="green"
                                />
                            </div>

                            {/* Quick Take */}
                            <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl text-teal-900 flex items-start gap-3">
                                <span className="text-xl">💡</span>
                                <p className="font-medium text-lg">{analysisResult.quick_take}</p>
                            </div>

                            {/* Detailed Report */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl"
                            >
                                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-3 bg-teal-50 rounded-lg">
                                        <CheckCircle className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Detailed Analysis</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                    >
                                        {analysisResult.detailed_report}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const UploadCard = ({ title, description, file, onChange, accept, icon, activeColor }: {
    title: string,
    description: string,
    file: File | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    accept: string,
    icon: React.ReactNode,
    activeColor: 'teal' | 'purple'
}) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="relative group cursor-pointer"
    >
        <div className={`
            relative h-full bg-[#F4F7F6] border-2 border-transparent rounded-[2rem] p-8 text-center transition-all
            hover:border-${activeColor}-200 hover:bg-white hover:shadow-lg
            ${file ? `border-${activeColor}-500/50 bg-${activeColor}-50/30` : ''}
        `}>
            <div className="mb-6 flex justify-center">
                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
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
                <div className={`
                    py-3 px-4 rounded-xl font-medium text-sm transition-colors border
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

const SummaryCard = ({ label, value, icon, subtext, highlight }: {
    label: string,
    value: string,
    icon: string,
    subtext: string,
    highlight?: 'green' | 'orange'
}) => (
    <div className={`p-6 rounded-2xl border transition-all hover:shadow-md ${highlight === 'green' ? 'bg-green-50 border-green-200' :
        highlight === 'orange' ? 'bg-orange-50 border-orange-200' :
            'bg-white border-slate-200'
        }`}>
        <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium text-sm">{label}</span>
            <span className="text-2xl">{icon}</span>
        </div>
        <div className={`text-2xl font-bold mb-1 ${highlight === 'green' ? 'text-green-700' :
            highlight === 'orange' ? 'text-orange-700' :
                'text-slate-900'
            }`}>
            {value}
        </div>
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">
            {subtext}
        </div>
    </div>
);

export default Dashboard;
