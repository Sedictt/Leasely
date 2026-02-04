"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Plus, CreditCard, Wrench, FileText, Bell } from "lucide-react";
import styles from "./DashboardScreen.module.css";

export function DashboardScreen() {
    // For demo purposes, we'll toggle roles to show both visions
    const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');

    return (
        <div className={styles.container}>
            {/* Header with Role Toggle */}
            <div className={styles.header}>
                <div>
                    <div className={styles.welcomeText}>Welcome back,</div>
                    <h1 className={styles.userName}>Alex Johnson</h1>
                </div>
                <div className={styles.roleToggle}>
                    <button
                        className={`${styles.roleButton} ${role === 'tenant' ? styles.active : ''}`}
                        onClick={() => setRole('tenant')}
                    >
                        Tenant
                    </button>
                    <button
                        className={`${styles.roleButton} ${role === 'landlord' ? styles.active : ''}`}
                        onClick={() => setRole('landlord')}
                    >
                        Landlord
                    </button>
                </div>
            </div>

            {role === 'tenant' ? (
                <>
                    {/* Tenant View: Current Unit */}
                    <div>
                        <div className={styles.sectionTitle}>My Home</div>
                        <motion.div
                            className={styles.unitCard}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div
                                className={styles.unitImage}
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800)' }}
                            >
                                <div className={styles.unitStatus}>Lease Active</div>
                            </div>
                            <div className={styles.unitDetails}>
                                <div className={styles.unitName}>The Lofts, Unit 4B</div>
                                <div className={styles.unitAddress}>123 Innovation Dr, Tech City</div>

                                <div className={styles.divider} />

                                <div className={styles.actionGrid}>
                                    <button className={styles.actionButton}>
                                        <Home size={20} />
                                        <span>Manage Home</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Notifications */}
                    <div>
                        <div className={styles.sectionTitle}>Updates</div>
                        <div style={{
                            background: 'var(--surface-light)',
                            padding: '1rem',
                            borderRadius: '16px',
                            border: '1px solid var(--surface-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(59, 130, 246, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)'
                            }}>
                                <Bell size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--foreground)' }}>Rent Due Soon</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>Dec 01, 2026</div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Landlord View: Properties */}
                    <div>
                        <div className={styles.sectionTitle}>My Properties</div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {/* Existing Property Mock */}
                            <motion.div
                                className={styles.unitCard}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ minHeight: 'auto' }}
                            >
                                <div style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '12px',
                                        backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }} />
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--foreground)' }}>Skyline Apartments</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--success)' }}>12/12 Units Occupied</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Add New Property */}
                            <motion.div
                                className={styles.addPropertyCard}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => console.log('Add Property')}
                            >
                                <div className={styles.addIconCircle}>
                                    <Plus size={32} />
                                </div>
                                <div className={styles.addText}>Add New Property</div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
