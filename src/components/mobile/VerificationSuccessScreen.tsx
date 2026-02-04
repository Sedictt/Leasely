"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import styles from "./VerificationSuccessScreen.module.css";

interface VerificationSuccessScreenProps {
    onContinue?: () => void;
}

export function VerificationSuccessScreen({ onContinue }: VerificationSuccessScreenProps) {
    return (
        <div className={styles.container}>
            <motion.div
                className={styles.content}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Success Icon */}
                <motion.div
                    className={styles.iconWrapper}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                    }}
                >
                    <Check size={48} strokeWidth={3} className={styles.checkIcon} />
                </motion.div>

                {/* Text Content */}
                <motion.div
                    className={styles.textWrapper}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h1 className={styles.title}>Email Verified!</h1>
                    <p className={styles.description}>
                        Your account has been successfully created and verified.
                    </p>
                </motion.div>

                {/* Continue Button */}
                <motion.button
                    className={styles.continueButton}
                    onClick={onContinue}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <span>Continue to Login</span>
                    <ArrowRight size={20} />
                </motion.button>
            </motion.div>
        </div>
    );
}
