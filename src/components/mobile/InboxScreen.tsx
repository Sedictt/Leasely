"use client";

import { motion } from "framer-motion";
import { Bell, AlertCircle, Wrench, Info, Package, Calendar } from "lucide-react";
import styles from "./CommunicationHubScreen.module.css";

// Updates/Reminders Data
const UPDATES = [
    {
        id: 1,
        type: "reminder",
        title: "Rent Due Soon",
        body: "Your monthly rent of $2,450 is due in 3 days.",
        date: "Today, 9:00 AM",
        icon: Calendar,
        priority: "high"
    },
    {
        id: 2,
        type: "package",
        title: "Package Received",
        body: "A package from 'Amazon' is waiting for you at the front desk.",
        date: "Yesterday, 2:30 PM",
        icon: Package,
        priority: "normal"
    },
    {
        id: 3,
        type: "announcement",
        title: "Water Shutoff Notice",
        body: "Water will be temporarily shut off for maintenance on Floor 4-6 this Friday from 2 PM to 4 PM.",
        date: "Dec 05, 2026",
        icon: AlertCircle,
        priority: "urgent"
    }
];

export function InboxScreen() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Inbox</h1>
                <p className={styles.subtitle}>Updates, reminders, and notices.</p>
            </header>

            <div className={styles.list}>
                {UPDATES.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className={styles.announcementCard}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className={styles.announcementHeader}>
                            <div className={`${styles.announcementIcon} ${item.type === 'reminder' ? styles.iconReminder : ''}`}>
                                <item.icon size={20} />
                            </div>
                            <span className={styles.announcementTitle}>{item.title}</span>
                            {item.priority === 'urgent' && (
                                <span className={`${styles.priorityBadge} ${styles.priorityHigh}`}>Urgent</span>
                            )}
                            {item.priority === 'high' && (
                                <span className={`${styles.priorityBadge} ${styles.priorityHigh}`}>Important</span>
                            )}
                        </div>
                        <p className={styles.announcementBody}>{item.body}</p>
                        <div className={styles.announcementDate}>{item.date}</div>
                    </motion.div>
                ))}

                {UPDATES.length === 0 && (
                    <div className={styles.emptyState}>
                        <Bell size={48} />
                        <p>No new updates</p>
                    </div>
                )}
            </div>
        </div>
    );
}
