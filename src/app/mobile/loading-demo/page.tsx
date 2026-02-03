"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/mobile/LoadingScreen";
import { WelcomeScreen } from "@/components/mobile/WelcomeScreen";
import { OnboardingCarousel } from "@/components/mobile/OnboardingCarousel";

type Screen = 'loading' | 'welcome' | 'onboarding' | 'authenticated';

export default function MobileAppDemo() {
    const [currentScreen, setCurrentScreen] = useState<Screen>('loading');

    return (
        <div style={{ minHeight: "100vh" }}>
            {/* Loading Screen */}
            {currentScreen === 'loading' && (
                <LoadingScreen onLoadingComplete={() => setCurrentScreen('welcome')} />
            )}

            {/* Welcome/Intro Screen */}
            {currentScreen === 'welcome' && (
                <WelcomeScreen onGetStarted={() => setCurrentScreen('onboarding')} />
            )}

            {/* Onboarding Carousel */}
            {currentScreen === 'onboarding' && (
                <OnboardingCarousel onComplete={() => setCurrentScreen('authenticated')} />
            )}

            {/* After Onboarding - Auth would go here */}
            {currentScreen === 'authenticated' && (
                <div style={{
                    padding: "2rem",
                    textAlign: "center",
                    fontFamily: "var(--font-sans)",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0f1a14"
                }}>
                    <h1 style={{ color: "#f5f7f6", marginBottom: "1rem", fontSize: "2rem" }}>
                        Ready to Get Started! 🎉
                    </h1>
                    <p style={{ color: "#c4d3cb", marginBottom: "2rem", maxWidth: "400px" }}>
                        Authentication/signup flow would start here. Users would create an account or sign in.
                    </p>
                    <button
                        onClick={() => setCurrentScreen('loading')}
                        style={{
                            padding: "0.75rem 2rem",
                            background: "linear-gradient(135deg, #5a7c6b 0%, #446b5c 100%)",
                            color: "#f5f7f6",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "1rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: "0 8px 24px rgba(90, 124, 107, 0.4)"
                        }}
                    >
                        Restart Flow
                    </button>
                </div>
            )}
        </div>
    );
}
