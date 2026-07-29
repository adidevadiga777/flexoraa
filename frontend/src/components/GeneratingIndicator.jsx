import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
    "Reading your resume...",
    "Extracting your experience...",
    "Writing your portfolio copy...",
    "Almost done..."
];

function GeneratingIndicator() {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % steps.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3">
            <motion.div
                className="w-5 h-5 border-2 border-slate-300 border-t-[#1a1a1a] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <AnimatePresence mode="wait">
                <motion.span
                    key={stepIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#6b6b6b] text-[13px]"
                >
                    {steps[stepIndex]}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}

export default GeneratingIndicator;
