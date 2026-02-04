"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/mobile/LoadingScreen";
import { WelcomeScreen } from "@/components/mobile/WelcomeScreen";
import { OnboardingCarousel } from "@/components/mobile/OnboardingCarousel";
import { SignUpScreen } from "@/components/mobile/SignUpScreen";
import { EmailVerificationScreen } from "@/components/mobile/EmailVerificationScreen";
import { VerificationSuccessScreen } from "@/components/mobile/VerificationSuccessScreen";
import { LoginScreen } from "@/components/mobile/LoginScreen";
import { SetupProfileScreen } from "@/components/mobile/SetupProfileScreen";

import { MobileAppShell } from "@/components/mobile/MobileAppShell";

type Screen = 'loading' | 'welcome' | 'onboarding' | 'signup' | 'verification' | 'success' | 'login' | 'setup-profile' | 'app';

export default function MobileAppDemo() {
    const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
    const [userEmail, setUserEmail] = useState<string>("");

    // Animation variants for screen transitions
    // Animation variants for modern sophisticated transitions (2025 style)
    const screenVariants = {
        initial: {
            opacity: 0,
            scale: 0.98,
            filter: "blur(10px)",
            y: 20
        },
        animate: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            y: 0,
            transition: {
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        },
        exit: {
            opacity: 0,
            scale: 1.02,
            filter: "blur(10px)",
            transition: {
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    } as const;

    return (
        <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
            <AnimatePresence mode="popLayout">
                {/* Loading Screen */}
                {currentScreen === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <LoadingScreen onLoadingComplete={() => setCurrentScreen('welcome')} />
                    </motion.div>
                )}

                {/* Welcome/Intro Screen */}
                {currentScreen === 'welcome' && (
                    <motion.div
                        key="welcome"
                        variants={screenVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <WelcomeScreen
                            onGetStarted={() => setCurrentScreen('onboarding')}
                        />
                    </motion.div>
                )}

                {/* Onboarding Carousel */}
                {currentScreen === 'onboarding' && (
                    <motion.div
                        key="onboarding"
                        variants={screenVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <OnboardingCarousel onComplete={() => setCurrentScreen('signup')} />
                    </motion.div>
                )}

                {/* Sign Up Screen */}
                {currentScreen === 'signup' && (
                    <motion.div
                        key="signup"
                        variants={screenVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <SignUpScreen
                            onSignUp={(email: string, password: string) => {
                                console.log('Sign up:', { email, password });
                                setUserEmail(email);
                                setCurrentScreen('verification');
                            }}
                            onLoginClick={() => {
                                setCurrentScreen('login');
                            }}
                        />
                    </motion.div>
                )}

                {/* Email Verification Screen */}
                {currentScreen === 'verification' && (
                    <motion.div
                        key="verification"
                        variants={screenVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <EmailVerificationScreen
                            email={userEmail}
                            onVerify={(code: string) => {
                                console.log('Verification code:', code);
                                setCurrentScreen('success');
                            }}
                            onResendCode={() => {
                                console.log('Resend verification code');
                            }}
                            onBack={() => {
                                setCurrentScreen('signup');
                            }}
                        />
                    </motion.div>
                )}

                {/* Verification Success Screen */}
                {currentScreen === 'success' && (
                    <motion.div
                        key="success"
                        variants={screenVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <VerificationSuccessScreen
                            onContinue={() => setCurrentScreen('login')}
                        />
                    </motion.div>
                )}

                {/* Login Screen */}
                {currentScreen === 'login' && (
                    <motion.div
                        key="login"
                        variants={screenVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <LoginScreen
                            onLogin={(email) => {
                                console.log("Logged in as", email);
                                setCurrentScreen('setup-profile');
                            }}
                            onSignUpClick={() => setCurrentScreen('signup')}
                        />
                    </motion.div>
                )}

                {/* Profile Setup Screen */}
                {currentScreen === 'setup-profile' && (
                    <motion.div
                        key="setup-profile"
                        variants={screenVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <SetupProfileScreen
                            onContinue={(username, avatar) => {
                                console.log("Profile setup:", { username, avatar });
                                setCurrentScreen('app');
                            }}
                        />
                    </motion.div>
                )}

                {/* Main App Shell (Dashboard) */}
                {currentScreen === 'app' && (
                    <motion.div
                        key="app"
                        variants={screenVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <MobileAppShell />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
