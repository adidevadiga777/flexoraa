import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_MESSAGES = [
    "Preparing your workspace...",
    "Securing connection...",
    "Arranging pixels...",
    "Almost there..."
];

export default function LoadingScreen() {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f5f0eb] font-['Inter',sans-serif]">
            {/* Background elegant gradient blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#e4dfd8] blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#d0c9c0] blur-[120px]" />
            </div>

            <div className="relative flex flex-col items-center z-10">
                {/* Brand Logo Container with Breathing Pulse and Glow */}
                <div className="relative mb-8">
                    {/* Pulsing ring outer effect */}
                    <motion.div
                        className="absolute inset-0 rounded-2xl bg-[#1a1a1a] opacity-10"
                        animate={{
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Main Logo Box */}
                    <motion.div
                        className="relative w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center shadow-lg shadow-black/10"
                        animate={{
                            scale: [1, 1.05, 1],
                            y: [0, -4, 0]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" />
                        </svg>
                    </motion.div>
                </div>

                {/* Brand Name */}
                <motion.h1
                    className="text-[20px] font-bold text-[#1a1a1a] tracking-[0.15em] mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Flexoraa
                </motion.h1>

                {/* Progress bar line */}
                <div className="w-36 h-[2px] bg-[#e4dfd8] rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="h-full bg-[#1a1a1a] rounded-full"
                        animate={{
                            left: ["-100%", "100%"]
                        }}
                        style={{ position: 'relative' }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Dynamic Message Text */}
                <div className="h-6 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={messageIndex}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="text-[13px] font-medium text-[#6b6b6b] tracking-wide"
                        >
                            {LOADING_MESSAGES[messageIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
