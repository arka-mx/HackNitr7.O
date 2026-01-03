import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();
    const [hue, setHue] = useState(140); // Default green-ish

    // Simple grid representation of "404"
    // 1 = block, 0 = empty space
    const number4 = [
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1],
    ];

    const number0 = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
    ];

    const renderDigit = (matrix: number[][], keyPrefix: string) => (
        <div className="grid grid-cols-3 gap-2">
            {matrix.flat().map((pixel, i) => (
                <motion.div
                    key={`${keyPrefix}-${i}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: pixel ? 1 : 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: i * 0.05
                    }}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl transition-colors duration-200`}
                    style={{
                        backgroundColor: pixel ? `hsl(${hue}, 70%, 50%)` : 'transparent',
                        opacity: pixel ? 1 : 0,
                        boxShadow: pixel ? `0 10px 20px -5px hsl(${hue}, 70%, 80%)` : 'none'
                    }}
                >
                    {/* Inner detail for texture */}
                    {pixel === 1 && (
                        <div className="w-full h-full flex items-center justify-center">
                            <div
                                className="w-4 h-4 rounded-full bg-white opacity-20"
                            ></div>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500"
            style={{ backgroundColor: `hsl(${hue}, 70%, 98%)` }}
        >
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black mb-4 transition-colors duration-200"
                    style={{ color: `hsl(${hue}, 50%, 20%)` }}
                >
                    Whoops, that page is gone.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-slate-500 max-w-md mx-auto"
                >
                    While you're here, slide to find your favorite color mood for this visual treat.
                </motion.p>
            </div>

            <div className="flex gap-4 sm:gap-8 mb-20 scale-75 sm:scale-100">
                {renderDigit(number4, '4-1')}
                {renderDigit(number0, '0')}
                {renderDigit(number4, '4-2')}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <label className="block text-sm font-medium mb-4 text-center text-slate-500">
                        Adjust Color Hue: <span className="font-mono font-bold" style={{ color: `hsl(${hue}, 70%, 40%)` }}>{hue}°</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={hue}
                        onChange={(e) => setHue(parseInt(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, 
                                hsl(0, 70%, 50%), 
                                hsl(60, 70%, 50%), 
                                hsl(120, 70%, 50%), 
                                hsl(180, 70%, 50%), 
                                hsl(240, 70%, 50%), 
                                hsl(300, 70%, 50%), 
                                hsl(360, 70%, 50%))`
                        }}
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                        style={{
                            backgroundColor: `hsl(${hue}, 70%, 45%)`,
                            boxShadow: `0 10px 25px -5px hsl(${hue}, 70%, 80%)`
                        }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
