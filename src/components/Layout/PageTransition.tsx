import React from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

const pageVariants = {
    initial: {
        opacity: 0,
        x: -20, // Slide from right (RTL friendly-ish, or just generic slide)
    },
    in: {
        opacity: 1,
        x: 0,
    },
    out: {
        opacity: 0,
        x: 20, // Slide to left
    },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
};

const PageTransition: React.FC<PageTransitionProps> = ({
    children,
    className = "",
}) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className={`w-full h-full ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
