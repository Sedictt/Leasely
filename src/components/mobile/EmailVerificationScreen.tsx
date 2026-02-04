"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import styles from "./EmailVerificationScreen.module.css";

interface EmailVerificationScreenProps {
    email?: string;
    onVerify?: (code: string) => void;
    onResendCode?: () => void;
    onBack?: () => void;
}

export function EmailVerificationScreen({
    email = "user@example.com",
    onVerify,
    onResendCode,
    onBack
}: EmailVerificationScreenProps) {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullCode = code.join("");
        onVerify?.(fullCode);
    };

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.content}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Back Button */}
                {onBack && (
                    <motion.button
                        className={styles.backButton}
                        onClick={onBack}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </motion.button>
                )}

                {/* Icon */}
                <motion.div
                    className={styles.iconWrapper}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Mail size={48} strokeWidth={1.5} />
                </motion.div>

                {/* Header */}
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className={styles.title}>Verify Your Email</h1>
                    <p className={styles.subtitle}>
                        We've sent a 6-digit verification code to
                    </p>
                    <p className={styles.email}>{email}</p>
                </motion.div>

                {/* Code Input Form */}
                <motion.form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className={styles.codeInputs}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={styles.codeInput}
                            />
                        ))}
                    </div>

                    {/* Verify Button */}
                    <motion.button
                        type="submit"
                        className={styles.verifyButton}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>Verify Email</span>
                        <ArrowRight size={20} strokeWidth={2.5} />
                    </motion.button>
                </motion.form>

                {/* Resend Code */}
                <motion.div
                    className={styles.footer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className={styles.footerText}>
                        Didn't receive the code?{" "}
                        <button
                            type="button"
                            className={styles.resendLink}
                            onClick={onResendCode}
                        >
                            Resend
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
