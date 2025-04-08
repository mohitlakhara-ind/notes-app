import React from "react";
import { motion } from "framer-motion";

const SampleNotes = ({ notes }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
            {notes.map((note, index) => (
                <motion.div
                    key={index}
                    className="p-5 bg-primary-bg dark:bg-light-primary-bg rounded-xl shadow-lg border border-border dark:border-light-border transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]"
                    whileHover={{ scale: 1.03 }}
                >
                    <h2 className="text-lg font-semibold text-primary-text dark:text-light-primary-text">
                        {note.title}
                    </h2>
                    <p className="text-secondary-text dark:text-light-secondary-text mt-2">
                        {note.content}
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

const SampleNotesComp = () => {
    const notesData = [
        { title: "React Basics", content: "Understanding JSX, Components, and Props." },
        { title: "State & Hooks", content: "Using useState and useEffect effectively." },
        { title: "Tailwind Magic", content: "Creating responsive designs in seconds!" },
    ];

    return (
        <div className="min-h-screen bg-primary-bg dark:bg-light-primary-bg flex justify-center items-center">
            <SampleNotes notes={notesData} />
        </div>
    );
};

export default SampleNotesComp;
