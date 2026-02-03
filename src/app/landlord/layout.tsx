"use client";

import Sidebar from "@/components/landlord/Sidebar";
import { Search, Bell, MessageSquare, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import styles from "./layout.module.css";

export default function LandlordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                setUser({
                    email: authUser.email,
                    name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User'
                });
            }
        };
        fetchUser();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainArea}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.greeting}>
                        <h1>{getGreeting()}, {user?.name} 👋</h1>
                    </div>

                    <div className={styles.headerActions}>
                        {/* Search Bar */}
                        <div className={styles.searchBar}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search Anything..."
                                className={styles.searchInput}
                            />
                        </div>

                        {/* Notifications */}
                        <button className={styles.iconBtn}>
                            <MessageSquare size={20} />
                        </button>
                        <button className={styles.iconBtn}>
                            <Bell size={20} />
                            <span className={styles.notifDot}></span>
                        </button>

                        {/* User Profile */}
                        <div className={styles.userProfile}>
                            <div className={styles.avatar}>
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className={styles.userName}>{user?.name}</span>
                            <ChevronDown size={16} className={styles.chevron} />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}
