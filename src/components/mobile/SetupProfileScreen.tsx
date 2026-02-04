"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Camera, ArrowRight } from "lucide-react";
import styles from "./SetupProfileScreen.module.css";

interface SetupProfileScreenProps {
    onContinue: (username: string, avatarUrl: string | null) => void;
}

export function SetupProfileScreen({ onContinue }: SetupProfileScreenProps) {
    const [username, setUsername] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onContinue(username, avatarUrl);
        }
    };

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className={styles.title}>All set!</h1>
                <p className={styles.subtitle}>Let's set up your profile.</p>
            </motion.div>

            <motion.form
                className={styles.form}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onSubmit={handleSubmit}
            >
                {/* Avatar Upload */}
                <div className={styles.avatarSection}>
                    <div
                        className={styles.avatarWrapper}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Profile" className={styles.avatarImage} />
                        ) : (
                            <User size={48} className={styles.placeholderIcon} strokeWidth={1.5} />
                        )}

                        <div className={styles.cameraIconBadge}>
                            <Camera size={18} />
                        </div>
                    </div>
                    <span className={styles.uploadLabel}>
                        {avatarUrl ? "Change Photo" : "Add Profile Photo (Optional)"}
                    </span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className={styles.hiddenInput}
                    />
                </div>

                {/* Username Input */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Username *</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="@username"
                        className={styles.input}
                        required
                    />
                    {/* Helper text could go here */}
                </div>

                <div style={{ flex: 1 }} />

                <motion.button
                    type="submit"
                    className={styles.submitButton}
                    whileTap={{ scale: 0.98 }}
                    disabled={!username.trim()}
                >
                    <span>Continue</span>
                    <ArrowRight size={20} strokeWidth={2.5} />
                </motion.button>
            </motion.form>
        </div>
    );
}
