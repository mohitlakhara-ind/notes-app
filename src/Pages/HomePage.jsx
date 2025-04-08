import React from "react";
import { motion } from "framer-motion";
import { FaStickyNote, FaLock, FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Animator from "../Components/Animator";
import Hero from "../Components/Hero";
import Features from "../Components/Features.jsx";
import SampleNotes from "../Components/SampleNotes.jsx";

export default function NotesAppHome() {
    return (
        <Animator>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center">
                {/* Hero Section */}

                <Hero />
                <Features />
            </div>
        </Animator>
    );
}

