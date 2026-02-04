"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle2 } from "lucide-react";
import styles from "./SignUpScreen.module.css";

interface SignUpScreenProps {
    onSignUp?: (email: string, password: string) => void;
    onLoginClick?: () => void;
}

export function SignUpScreen({ onSignUp, onLoginClick }: SignUpScreenProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignUp?.(email, password);
    };

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Sign up to get started</p>
            </motion.div>

            <motion.form
                className={styles.form}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onSubmit={handleSubmit}
            >
                {/* Email Input */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email</label>
                    <div className={styles.inputWrapper}>
                        <Mail className={styles.inputIcon} size={20} />
                        <input
                            type="email"
                            placeholder="hello@example.com"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Password</label>
                    <div className={styles.inputWrapper}>
                        <Lock className={styles.inputIcon} size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "1rem",
                                background: "none",
                                border: "none",
                                color: "var(--primary)",
                                cursor: "pointer",
                                padding: 0,
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Password Requirements */}
                    <div className={styles.passwordRequirements}>
                        <ul className={styles.requirementsList}>
                            <li>At least 8 characters long</li>
                            <li>Uppercase letters (A-Z)</li>
                            <li>Lowercase letters (a-z)</li>
                            <li>Numbers (0-9)</li>
                            <li>Special characters (!@#$%^&*)</li>
                        </ul>
                    </div>

                    {/* Confirm Password Input */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Confirm Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} size={20} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className={styles.eyeButton}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: "absolute",
                                    right: "1rem",
                                    background: "none",
                                    border: "none",
                                    color: "var(--primary)",
                                    cursor: "pointer",
                                    padding: 0,
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <motion.div
                    className={styles.terms}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    By signing up, you agree to our{" "}
                    <button type="button" className={styles.link}>
                        Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className={styles.link}>
                        Privacy Policy
                    </button>
                    .
                </motion.div>

                <motion.button
                    type="submit"
                    className={styles.submitButton}
                    whileTap={{ scale: 0.98 }}
                >
                    <span>Create Account</span>
                    <ArrowRight size={20} strokeWidth={2.5} />
                </motion.button>

                <div className={styles.divider}>
                    <span className={styles.dividerText}>or</span>
                </div>

                <motion.button
                    type="button"
                    className={styles.googleButton}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => console.log("Google Sign In")}
                >
                    <svg className={styles.googleIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Sign up with Google</span>
                </motion.button>
            </motion.form>

            <motion.div
                className={styles.footer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <span className={styles.loginText}>Already have an account? </span>
                <button
                    className={styles.loginLink}
                    onClick={onLoginClick}
                    type="button"
                >
                    Log In
                </button>
            </motion.div>
        </div>
    );
}
