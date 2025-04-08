import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description }) => {
    return (
        <motion.div
            className="p-6 bg-primary-bg dark:bg-light-primary-bg rounded-xl shadow-lg border border-border dark:border-light-border text-center transition-all duration-300 hover:shadow-xl hover:scale-105"
            whileHover={{ scale: 1.05 }}
        >
            <div className="text-5xl text-accent dark:text-light-accent mb-4">{icon}</div>
            <h2 className="text-xl font-semibold text-primary-text dark:text-light-primary-text">
                {title}
            </h2>
            <p className="text-secondary-text dark:text-light-secondary-text mt-2">
                {description}
            </p>
        </motion.div>
    );
};

export default FeatureCard;
