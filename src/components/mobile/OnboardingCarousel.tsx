"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageSquare, FileCheck, ChevronRight } from "lucide-react";
import { useState } from "react";
import styles from "./OnboardingCarousel.module.css";

interface Slide {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const slides: Slide[] = [
    {
        icon: <Search size={64} strokeWidth={1.5} />,
        title: "Discover Your Perfect Space",
        description: "Browse thousands of verified apartments, dorms, and housing options tailored to your needs and budget."
    },
    {
        icon: <MessageSquare size={64} strokeWidth={1.5} />,
        title: "Connect Instantly",
        description: "Chat directly with landlords and property managers. Schedule tours and get answers in real-time."
    },
    {
        icon: <FileCheck size={64} strokeWidth={1.5} />,
        title: "Manage Everything",
        description: "Sign leases, pay rent, submit maintenance requests, and track everything in one secure place."
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

    const goToSlide = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0
        })
    };

    return (
        <div className={styles.container}>
            {/* Skip button */}
            <button className={styles.skipButton} onClick={onComplete}>
                Skip
            </button>

            {/* Slide content */}
            <div className={styles.slideContainer}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={styles.slide}
                    >
                        {/* Icon */}
                        <motion.div
                            className={styles.iconWrapper}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            {slides[currentSlide].icon}
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            className={styles.title}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            {slides[currentSlide].title}
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            className={styles.description}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                        >
                            {slides[currentSlide].description}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom section */}
            <div className={styles.footer}>
                {/* Indicators */}
                <div className={styles.indicators}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.indicator} ${index === currentSlide ? styles.indicatorActive : ""
                                }`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Navigation buttons */}
                <div className={styles.navigation}>
                    {currentSlide > 0 && (
                        <button className={styles.backButton} onClick={prevSlide}>
                            Back
                        </button>
                    )}

                    <button className={styles.nextButton} onClick={nextSlide}>
                        {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
                        <ChevronRight size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}
