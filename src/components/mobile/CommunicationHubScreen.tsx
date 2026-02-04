"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, Bell, Info, AlertCircle, Wrench } from "lucide-react";
import styles from "./CommunicationHubScreen.module.css";

// Mock Data
const MESSAGES = [
    {
        id: 1,
        name: "Landlord (Sarah)",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        lastMessage: "Hi Alex, just checking if the plumbing issue is resolved?",
        time: "10:30 AM",
        unread: 1,
        online: true
    },
    {
        id: 2,
        name: "Building Manager",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        lastMessage: "Package received at the front desk for you.",
        time: "Yesterday",
        unread: 0,
        online: false
    },
    {
        id: 3,
        name: "Maintenance Team",
        avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=150",
        lastMessage: "Your request #402 has been scheduled for Tuesday.",
        time: "Mon",
        unread: 0,
        online: false
    }
];

const ANNOUNCEMENTS = [
    {
        id: 1,
        title: "Water Shutoff Notice",
        date: "Dec 05, 2026",
        body: "Water will be temporarily shut off for maintenance on Floor 4-6 this Friday from 2 PM to 4 PM.",
        type: "high", // high priority
        icon: AlertCircle
    },
    {
        id: 2,
        title: "Gym Maintenance",
        date: "Dec 03, 2026",
        body: "The treadmill usage will be limited due to servicing on Wednesday morning.",
        type: "normal",
        icon: Wrench
    },
    {
        id: 3,
        title: "Holiday Party!",
        date: "Nov 28, 2026",
        body: "Join us in the lobby for the annual holiday mixer! Snacks and drinks provided.",
        type: "normal",
        icon: Info
    }
];

export function CommunicationHubScreen() {
    const [activeTab, setActiveTab] = useState<'messages' | 'announcements'>('messages');

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Communication Hub</h1>
                <p className={styles.subtitle}>Stay connected with your property.</p>
            </header>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'messages' ? styles.active : ''}`}
                    onClick={() => setActiveTab('messages')}
                >
                    Messages
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'announcements' ? styles.active : ''}`}
                    onClick={() => setActiveTab('announcements')}
                >
                    Announcements
                </button>
            </div>

            <div className={styles.list}>
                <AnimatePresence mode="wait">
                    {activeTab === 'messages' ? (
                        <motion.div
                            key="messages"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        >
                            {MESSAGES.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    className={styles.messageItem}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className={styles.avatarContainer}>
                                        <img src={msg.avatar} alt={msg.name} className={styles.avatar} />
                                        {msg.online && <div className={styles.onlineBadge} />}
                                    </div>
                                    <div className={styles.messageContent}>
                                        <div className={styles.nameRow}>
                                            <span className={styles.name}>{msg.name}</span>
                                            <span className={styles.time}>{msg.time}</span>
                                        </div>
                                        <div className={styles.previewRow}>
                                            <span className={styles.preview}>{msg.lastMessage}</span>
                                            {msg.unread > 0 && (
                                                <div className={styles.unreadBadge}>{msg.unread}</div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="announcements"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        >
                            {ANNOUNCEMENTS.map(item => (
                                <motion.div
                                    key={item.id}
                                    className={styles.announcementCard}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className={styles.announcementHeader}>
                                        <div className={styles.announcementIcon}>
                                            <item.icon size={20} />
                                        </div>
                                        <span className={styles.announcementTitle}>{item.title}</span>
                                        {item.type === 'high' ? (
                                            <span className={`${styles.priorityBadge} ${styles.priorityHigh}`}>Urgent</span>
                                        ) : (
                                            <span className={`${styles.priorityBadge} ${styles.priorityNormal}`}>Info</span>
                                        )}
                                    </div>
                                    <p className={styles.announcementBody}>{item.body}</p>
                                    <div className={styles.announcementDate}>{item.date}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.button
                className={styles.fab}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                <MessageSquarePlus size={24} />
            </motion.button>
        </div>
    );
}
