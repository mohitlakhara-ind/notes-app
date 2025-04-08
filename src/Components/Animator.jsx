import React from "react";
import { motion } from "framer-motion";

// Reusable Animator Component
const Animator = ({
    children,
    initial = { opacity: 0, scale: 0.9 },
    animate = { opacity: 1, scale: 1 },
    exit = { opacity: 0, scale: 0.9 },
    transition = { duration: 0.5, ease: "easeOut" }
}) => {
    return (
        <motion.div
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
        >
            {React.Children.map(children, (child) => (
                <motion.div>{child}</motion.div>
            ))}
        </motion.div>
    );
};
export default Animator;