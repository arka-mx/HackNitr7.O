import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

const BillSimplifier = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md text-center"
            >
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 text-teal-600">
                    <Wand2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Bill Simplifier</h1>
                <p className="text-slate-600 mb-8">
                    We're building a tool to translate complex medical codes into plain English language anyone can understand.
                </p>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                    <div className="h-2 w-full bg-slate-100 rounded-full mb-4 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "60%" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-teal-500 rounded-full"
                        />
                    </div>
                    <p className="text-sm font-medium text-slate-500">Development Progress</p>
                </div>
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="rounded-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </motion.div>
        </div>
    );
};

export default BillSimplifier;
