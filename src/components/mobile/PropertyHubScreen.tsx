"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Hash, Volume2, Lock, ShieldCheck } from "lucide-react";
import styles from "./PropertyHubScreen.module.css";
import React from "react";

interface PropertyHubScreenProps {
    onBack: () => void;
}

export function PropertyHubScreen({ onBack }: PropertyHubScreenProps) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={onBack}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <div className={styles.headerTitle}>The Lofts</div>
                    <div className={styles.headerSubtitle}>12 Members • 4 Online</div>
                </div>
            </header>

            <div className={styles.content}>
                {/* Information Channels */}
                <div className={styles.sectionLabel}>Information</div>
                <ChannelItem icon={Volume2} name="announcements" />
                <ChannelItem icon={Hash} name="rules-and-info" />

                {/* Community Channels */}
                <div className={styles.sectionLabel}>Community</div>
                <ChannelItem icon={Hash} name="general" unread={3} active />
                <ChannelItem icon={Hash} name="events" />
                <ChannelItem icon={Hash} name="marketplace" />

                {/* Support Channels */}
                <div className={styles.sectionLabel}>Support</div>
                <ChannelItem icon={ShieldCheck} name="maintenance-tickets" />
                <ChannelItem icon={Lock} name="leasing-office" />
            </div>
        </div>
    );
}

function ChannelItem({ icon: Icon, name, unread, active }: { icon: any, name: string, unread?: number, active?: boolean }) {
    return (
        <div className={`${styles.channelItem} ${active ? styles.active : ''}`}>
            <Icon size={20} className={styles.channelIcon} />
            <span className={styles.channelName}>{name}</span>
            {unread && <div className={styles.unreadBadge}>{unread}</div>}
        </div>
    );
}
