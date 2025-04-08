import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";

// Random thoughts for diary entries
const diaryEntries = [
    "Some thoughts are too precious to be spoken...",
    "A secret lost is a secret kept forever...",
    "Not all words are meant to be heard...",
    "Shadows whisper the loudest when no one listens...",
    "In the quiet, ideas bloom like midnight roses...",
];

export default function Hero() {
    const navigate = useNavigate();
    const [currentEntry, setCurrentEntry] = useState("");

    useEffect(() => {
        // Randomly pick a diary entry
        setCurrentEntry(diaryEntries[Math.floor(Math.random() * diaryEntries.length)]);
    }, []);

    return (
        <section className="relative w-full text-center  overflow-hidden h-screen flex flex-col justify-center items-center  text-white">
            {/* Background effects */}
            <div className=" z-0 inset-0">
                <div className="absolute top-10 left-20 w-40 h-40 bg-purple-700 blur-3xl opacity-30 rounded-full" />
                <div className="absolute bottom-10 right-20 w-40 h-40 bg-blue-500 blur-3xl opacity-30 rounded-full" />
                <div className="absolute top-10 left-20 w-40 h-40 bg-purple-700 blur-3xl opacity-30 rounded-full" />
                <div className="absolute bottom-20 right-40 w-40 h-40 bg-blue-500 blur-3xl opacity-30 rounded-full" />

            </div>

            {/* Secret Diary Header */}
            <motion.h1
                className="text-5xl font-bold text-white tracking-wide drop-shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <span className="text-purple-500">I'm</span> Your
                <Typewriter
                    options={{
                        strings: ["Encrypted Thoughts", "Secret Journal", "Hidden Diary"],
                        autoStart: true,
                        loop: true,
                        delay: 75,
                        deleteSpeed: 40,
                    }}
                />
            </motion.h1>

            {/* Dynamic Thought Entry */}
            <motion.p
                className="text-lg mt-4 text-gray-300 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                {currentEntry}
            </motion.p>

            {/* Mysterious Blurred Reveal Section */}
            <div className="relative mt-6 bg-gray-900 text-gray-400 text-sm px-6 py-3 rounded-lg">
                <span className="blur-sm hover:blur-none transition-all duration-500 cursor-pointer">
                    "Your next thought is waiting to be written..."
                </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4 justify-center">
                <motion.button
                    className="relative px-6 py-3 bg-gradient-to-r from-purple-700 to-blue-700 text-white rounded-lg shadow-lg transition-transform duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/create-note")}
                >
                    Write Secret
                </motion.button>

                <motion.button
                    className="relative px-6 py-3 bg-gray-700 text-gray-300 rounded-lg shadow-lg transition-transform duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/all-notes")}
                >
                    Unlock Thoughts
                </motion.button>
            </div>
        </section>
    );
}
