"use client";

import { motion } from "framer-motion";
import { Building2, Home } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

export function LoadingScreen({ onLoadingComplete }: { onLoadingComplete?: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onLoadingComplete?.(), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onLoadingComplete]);

    return (
        <div className={styles.container}>
            {/* Background gradient */}
            <div className={styles.background} />

            {/* Animated content */}
            <div className={styles.content}>
                {/* Logo animation */}
                <motion.div
                    className={styles.logoContainer}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Animated building icon */}
                    <motion.div
                        className={styles.iconWrapper}
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Building2 size={48} strokeWidth={1.5} className={styles.icon} />
                    </motion.div>

                    {/* App name */}
                    <motion.h1
                        className={styles.appName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Leasely
                    </motion.h1>

                    <motion.p
                        className={styles.tagline}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        Your home, simplified
                    </motion.p>
                </motion.div>

                {/* Loading bar */}
                <motion.div
                    className={styles.progressContainer}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "80%" }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                >
                    <div className={styles.progressBar}>
                        <motion.div
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                </motion.div>

                {/* Floating home icons */}
                <motion.div
                    className={styles.floatingIcon}
                    style={{ top: "20%", left: "15%" }}
                    animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Home size={24} className={styles.decorIcon} />
                </motion.div>

                <motion.div
                    className={styles.floatingIcon}
                    style={{ top: "70%", right: "20%" }}
                    animate={{
                        y: [0, 20, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                >
                    <Home size={20} className={styles.decorIcon} />
                </motion.div>
            </div>
        </div>
    );
}
