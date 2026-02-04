"use client";

import Sidebar from "@/components/landlord/Sidebar";
import { Search, Bell, MessageSquare, ChevronDown, ShieldAlert, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./layout.module.css";

type UserRole = "tenant" | "landlord" | "admin";

export default function LandlordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newInquiriesCount, setNewInquiriesCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                // Not logged in, redirect to login
                router.push("/login");
                return;
            }

            // Get user's role from profiles table
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", authUser.id)
                .single();

            const userRole = profile?.role || "tenant";
            setRole(userRole as UserRole);

            setUser({
                email: authUser.email,
                name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User'
            });

            setIsLoading(false);

            // Fetch notifications if user is landlord
            if (userRole === "landlord" || userRole === "admin") {
                fetchNotifications();
            }
        };
        fetchUser();

        // Refresh notifications every 30 seconds
        const interval = setInterval(() => {
            if (role === "landlord" || role === "admin") {
                fetchNotifications();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [router, role]);

    const fetchNotifications = async () => {
        try {
            const supabase = createClient();

            // Get new inquiries count
            const { count, error: countError } = await supabase
                .from('listing_inquiries')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'new');

            if (countError) {
                console.error('Error fetching inquiry count:');
                console.error('Message:', countError.message);
                console.error('Code:', countError.code);
                console.error('Details:', countError.details);
            } else {
                console.log('📬 New inquiries count:', count);
                setNewInquiriesCount(count || 0);
            }

            // Get recent inquiries (all statuses except archived for historical view)
            const { data: inquiries, error: inquiriesError } = await supabase
                .from('listing_inquiries')
                .select(`
                    *,
                    listing:property_listings (
                        title,
                        display_address
                    )
                `)
                .neq('status', 'archived')
                .order('created_at', { ascending: false })
                .limit(5);

            if (inquiriesError) {
                console.error('Error fetching recent inquiries:');
                console.error('Message:', inquiriesError.message);
                console.error('Code:', inquiriesError.code);
                console.error('Details:', inquiriesError.details);
            } else {
                console.log('📬 Recent inquiries data:', inquiries);
                setRecentInquiries(inquiries || []);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (showNotifications && !target.closest(`.${styles.notificationWrapper}`)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);


    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 size={32} className={styles.spinner} />
                <p>Loading...</p>
            </div>
        );
    }

    // If user is not a landlord, show access denied
    if (role !== "landlord" && role !== "admin") {
        return (
            <div className={styles.accessDenied}>
                <div className={styles.accessCard}>
                    <ShieldAlert size={48} className={styles.accessIcon} />
                    <h1>Landlord Access Required</h1>
                    <p>
                        You need to be a verified landlord to access this dashboard.
                        Apply to become a landlord from your account page.
                    </p>
                    <div className={styles.accessActions}>
                        <Link href="/account" className={styles.primaryBtn}>
                            Apply to Become a Landlord
                        </Link>
                        <Link href="/" className={styles.secondaryBtn}>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                        <div className={styles.notificationWrapper}>
                            <button
                                className={styles.iconBtn}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell size={20} />
                                {newInquiriesCount > 0 && (
                                    <span className={styles.notifBadge}>{newInquiriesCount}</span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className={styles.notificationDropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <h3>Notifications</h3>
                                        <span className={styles.notifCount}>{newInquiriesCount} new</span>
                                    </div>

                                    <div className={styles.notificationList}>
                                        {recentInquiries.length === 0 ? (
                                            <div className={styles.emptyNotif}>
                                                <Bell size={32} />
                                                <p>No new notifications</p>
                                            </div>
                                        ) : (
                                            recentInquiries.map((inquiry: any) => (
                                                <Link
                                                    key={inquiry.id}
                                                    href="/landlord/inquiries"
                                                    className={`${styles.notifItem} ${inquiry.status === 'new' ? styles.unread : ''}`}
                                                    onClick={() => setShowNotifications(false)}
                                                >
                                                    <div className={styles.notifIcon}>
                                                        <MessageSquare size={16} />
                                                    </div>
                                                    <div className={styles.notifContent}>
                                                        <p className={styles.notifTitle}>
                                                            {inquiry.status === 'new' ? 'New inquiry' : 'Inquiry'} from {inquiry.name}
                                                        </p>
                                                        <p className={styles.notifText}>
                                                            {inquiry.listing?.title || 'Property'}
                                                        </p>
                                                        <p className={styles.notifTime}>
                                                            {new Date(inquiry.created_at).toLocaleString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: '2-digit'
                                                            })}
                                                            {inquiry.status !== 'new' && <span className={styles.statusLabel}> · {inquiry.status}</span>}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>

                                    {recentInquiries.length > 0 && (
                                        <Link
                                            href="/landlord/inquiries"
                                            className={styles.viewAllBtn}
                                            onClick={() => setShowNotifications(false)}
                                        >
                                            View All Inquiries
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        <Link href="/account" className={styles.userProfile}>
                            <div className={styles.avatar}>
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className={styles.userName}>{user?.name}</span>
                            <ChevronDown size={16} className={styles.chevron} />
                        </Link>
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
