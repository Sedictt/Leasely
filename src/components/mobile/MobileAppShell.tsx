"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Heart, MessageSquare, User, Bell, X } from "lucide-react";
import styles from "./MobileAppShell.module.css";
import { DashboardScreen } from "./DashboardScreen";
import { DiscoveryScreen } from "./DiscoveryScreen";
import { InboxScreen } from "./InboxScreen";
import { PropertyHubScreen } from "./PropertyHubScreen";
import { PropertyPickerScreen } from "./PropertyPickerScreen";

type Tab = 'home' | 'search' | 'favorites' | 'messages' | 'profile';
type View = 'main' | 'picker' | 'property-hub';

export function MobileAppShell() {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [view, setView] = useState<View>('main');

    return (
        <div className={styles.shell}>
            {/* Main Content Area */}
            {/* Main Content Area */}
            <main className={styles.mainContent}>
                {/* Base Layer: Tab Content (Dashboard, Search, etc.) - Always visible (or behind modal) */}
                <div style={{ height: '100%', position: 'relative', zIndex: 1 }}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'home' && (
                            <motion.div
                                key="home"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                style={{ height: '100%' }}
                            >
                                <DashboardScreen />
                            </motion.div>
                        )}

                        {activeTab === 'search' && (
                            <motion.div
                                key="search"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                style={{ height: '100%' }}
                            >
                                <DiscoveryScreen />
                            </motion.div>
                        )}

                        {activeTab === 'messages' && (
                            <motion.div
                                key="messages"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                style={{ height: '100%' }}
                            >
                                <InboxScreen />
                            </motion.div>
                        )}

                        {activeTab !== 'home' && activeTab !== 'search' && activeTab !== 'messages' && (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--muted-foreground)',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}
                            >
                                {activeTab === 'favorites' && <Heart size={48} strokeWidth={1.5} />}
                                {activeTab === 'profile' && <User size={48} strokeWidth={1.5} />}
                                <p>Coming Soon</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Overlay Layer: Modals and Hubs */}
                <AnimatePresence>
                    {/* Backdrop for Picker - Dims the background */}
                    {view === 'picker' && (
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'black',
                                zIndex: 140
                            }}
                            onClick={() => setView('main')} // Click backdrop to close
                        />
                    )}

                    {/* Property Picker Modal - Slides up to 80% height */}
                    {view === 'picker' && (
                        <motion.div
                            key="picker"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            drag="y"
                            dragConstraints={{ top: 0 }}
                            dragElastic={{ top: 0, bottom: 0.5 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 100 || info.velocity.y > 500) {
                                    setView('main');
                                }
                            }}
                            style={{
                                position: 'absolute',
                                top: '20%', // Covers bottom 80%
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 150,
                                background: 'var(--background)',
                                borderTopLeftRadius: '24px',
                                borderTopRightRadius: '24px',
                                boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                                overflow: 'hidden',
                                paddingBottom: '100px' // Space for FAB
                            }}
                        >
                            {/* Drag Handle */}
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                padding: '1rem',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 10
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '4px',
                                    borderRadius: '2px',
                                    background: 'var(--muted-foreground)', // Use muted color 
                                    opacity: 0.3
                                }} />
                            </div>

                            <PropertyPickerScreen
                                onSelect={() => setView('property-hub')}
                                onClose={() => setView('main')}
                            />

                            {/* Integrated Close FAB - Moves with the modal */}
                            <motion.button
                                layoutId="fab"
                                className={styles.fab}
                                style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    zIndex: 200,
                                    backgroundColor: 'var(--surface-dark)',
                                    rotate: 90
                                }}
                                onClick={() => setView('main')}
                            >
                                <X size={24} color="var(--foreground)" />
                            </motion.button>
                        </motion.div>
                    )}

                    {view === 'property-hub' && (
                        <motion.div
                            key="property-hub"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{ position: 'absolute', inset: 0, zIndex: 200, background: 'var(--background)' }}
                        >
                            <PropertyHubScreen onBack={() => setView('picker')} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Main Open FAB - Morphs into the Close FAB */}
            <AnimatePresence>
                {view === 'main' && (
                    <motion.button
                        layoutId="fab"
                        className={styles.fab}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ position: 'fixed', bottom: 'calc(85px + 1.5rem)', right: '1.5rem' }}
                        onClick={() => setView('picker')}
                    >
                        <MessageSquare size={24} fill="currentColor" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Bottom Navigation (Hidden when in Hub/Picker view) */}
            <motion.nav
                className={styles.bottomNav}
                animate={{ y: view === 'main' ? 0 : 100 }}
                transition={{ duration: 0.3 }}
            >
                <NavButton
                    active={activeTab === 'home'}
                    onClick={() => setActiveTab('home')}
                    icon={<Home size={24} />}
                    label="Home"
                />
                <NavButton
                    active={activeTab === 'search'}
                    onClick={() => setActiveTab('search')}
                    icon={<Search size={24} />}
                    label="Search"
                />
                <NavButton
                    active={activeTab === 'favorites'}
                    onClick={() => setActiveTab('favorites')}
                    icon={<Heart size={24} />}
                    label="Saved"
                />
                <NavButton
                    active={activeTab === 'messages'}
                    onClick={() => setActiveTab('messages')}
                    icon={<Bell size={24} />}
                    label="Inbox"
                />
                <NavButton
                    active={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                    icon={<User size={24} />}
                    label="Profile"
                />
            </motion.nav>
        </div>
    );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            className={`${styles.navItem} ${active ? styles.active : ''}`}
            onClick={onClick}
        >
            {active && (
                <motion.div
                    layoutId="navIndicator"
                    className={styles.indicator}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
            {icon}
            <span className={styles.navLabel}>{label}</span>
        </button>
    );
}
