import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [hospitalBill, setHospitalBill] = useState<File | null>(null);
    const [insurancePolicy, setInsurancePolicy] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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
        <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden font-sans selection:bg-orange-500/30">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 py-12 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-100 mb-4">
                        Medical Bill Analysis
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Upload your hospital bills and insurance policy to get AI-powered insights on potential savings and coverage errors.
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
                        icon={<FileText className="w-8 h-8 text-orange-400" />}
                    />

                    {/* Insurance Policy Upload */}
                    <UploadCard
                        title="Insurance Policy"
                        description="Upload your policy document (optional but recommended)."
                        file={insurancePolicy}
                        onChange={(e) => handleFileChange(e, 'policy')}
                        accept=".pdf,.jpg,.png,.jpeg"
                        icon={<CheckCircle className="w-8 h-8 text-blue-400" />}
                    />
                </div>

                <div className="flex justify-center mb-16">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className={`
                        px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all
                        ${isAnalyzing
                                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-orange-500/25'}
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
                            className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-8 flex items-center gap-3 max-w-2xl mx-auto"
                        >
                            <AlertCircle className="w-6 h-6" />
                            {error}
                        </motion.div>
                    )}

                    {analysisResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
                            </div>
                            <div className="prose prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">
                                    {analysisResult}
                                </pre>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const UploadCard = ({ title, description, file, onChange, accept, icon }: {
    title: string,
    description: string,
    file: File | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    accept: string,
    icon: React.ReactNode
}) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="relative group cursor-pointer"
    >
        <div className={`
            absolute inset-0 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl blur-xl transition-all duration-300
            ${file ? 'opacity-100 from-green-500/10 to-blue-500/10' : 'opacity-0 group-hover:opacity-100'}
        `} />

        <div className={`
            relative h-full bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 text-center transition-all
            hover:border-orange-500/30 hover:bg-gray-800/60
            ${file ? 'border-green-500/30' : ''}
        `}>
            <div className="mb-6 flex justify-center">
                <div className="p-4 bg-gray-700/50 rounded-full group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-6 text-sm">{description}</p>

            <div className="relative">
                <input
                    type="file"
                    onChange={onChange}
                    accept={accept}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`
                    py-3 px-4 rounded-lg font-medium text-sm transition-colors
                    ${file
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'}
                `}>
                    {file ? file.name : 'Choose File'}
                </div>
            </div>
        </div>
    </motion.div>
);

export default Dashboard;
