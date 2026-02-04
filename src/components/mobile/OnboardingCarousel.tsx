"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, MessageSquare, FileCheck, Building2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import styles from "./OnboardingCarousel.module.css";

interface Slide {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const slides: Slide[] = [
    {
        title: "Your Building is the Server",
        description: "Join your residential community's exclusive digital space. One building, one secure server for everyone.",
        icon: <Building2 size={80} strokeWidth={1.5} />
    },
    {
        title: "Your Unit is the Channel",
        description: "Access your private unit channel for maintenance and lease management. Connect with neighbors in public channels.",
        icon: <MessageSquare size={80} strokeWidth={1.5} />
    },
    {
        title: "Secure Community",
        description: "Verified tenants only. Report issues, get updates, and chat securely with your landlord and community.",
        icon: <ShieldCheck size={80} strokeWidth={1.5} />
    }
];

export function OnboardingCarousel({ onComplete }: { onComplete?: () => void }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setDirection(1);
            setCurrentSlide(currentSlide + 1);
        } else {
            onComplete?.();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide(currentSlide - 1);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100, // Reduced distance for modern feel
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <div className={styles.container}>
            {/* Back button - Top Left Absolute */}
            {currentSlide > 0 && (
                <motion.button
                    className={styles.backButton}
                    onClick={prevSlide}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                >
                    <ChevronLeft size={24} />
                </motion.button>
            )}

            <div className={styles.slideContainer}>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.2 }
                        }}
                        className={styles.slide}
                    >
                        <div className={styles.card}>
                            {/* Icon */}
                            <div className={styles.iconWrapper}>
                                {slides[currentSlide].icon}
                            </div>

                            {/* Title */}
                            <h1 className={styles.title}>
                                {slides[currentSlide].title}
                            </h1>

                            {/* Description */}
                            <p className={styles.description}>
                                {slides[currentSlide].description}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Controls - Fixed */}
            <div className={styles.bottomControls}>
                <button
                    className={styles.continueButton}
                    onClick={nextSlide}
                >
                    Continue
                </button>

                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
