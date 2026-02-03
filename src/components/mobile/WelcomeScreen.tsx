"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./WelcomeScreen.module.css";

export function WelcomeScreen({ onGetStarted }: { onGetStarted?: () => void }) {
    return (
        <div className={styles.container}>
            {/* App name - Top left */}
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className={styles.appName}>Leasely</h2>
            </motion.div>

            {/* Main content - Center */}
            <div className={styles.content}>
                <motion.div
                    className={styles.heroSection}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Catch phrase */}
                    <h1 className={styles.catchPhrase}>
                        Find your perfect{" "}
                        <span className={styles.highlight}>home</span>,
                        <br />
                        effortlessly
                    </h1>

                    {/* Sub text */}
                    <p className={styles.subText}>
                        Discover apartments, manage leases, and connect with
                        landlords all in one place. Your housing journey starts here.
                    </p>
                </motion.div>

                {/* Decorative element */}
                <motion.div
                    className={styles.decorCircle}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                />
            </div>

            {/* Get Started button - Bottom */}
            <motion.div
                className={styles.footer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <button className={styles.getStartedButton} onClick={onGetStarted}>
                    <span>Get Started</span>
                    <ArrowRight size={20} strokeWidth={2.5} />
                </button>
            </motion.div>
        </div>
    );
}
