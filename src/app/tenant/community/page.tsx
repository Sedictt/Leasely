"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    MessageSquare,
    Plus,
    Send,
    AlertTriangle,
    CheckCircle,
    User,
    MoreVertical,
    Search,
    Users,
    ArrowLeft
} from "lucide-react";
import styles from "./community.module.css";
import { useRouter } from "next/navigation";

type Complaint = {
    id: string;
    category: string;
    description: string;
    priority: string;
    status: string;
    created_at: string;
    respondent_unit: {
        unit_number: string;
    };
    complainant_id: string;
};

type Message = {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
};

type Neighbor = {
    unit_number: string;
    tenant_name: string;
    tenant_id: string;
    tenant_avatar: string | null;
};

export default function CommunityPage() {
    const [view, setView] = useState<'complaints' | 'neighbors'>('complaints');
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [neighbors, setNeighbors] = useState<Neighbor[]>([]);

    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [units, setUnits] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        unit_id: "",
        category: "Noise",
        description: ""
    });

    const supabase = createClient();
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUserAndData();
    }, []);

    useEffect(() => {
        if (activeComplaint) {
            fetchMessages(activeComplaint.id);
            // Optional: Subscribe to realtime messages here
        }
    }, [activeComplaint]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchUserAndData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }
        setUser(user);

        // Fetch Complaints
        const { data: complaintsData, error } = await supabase
            .from('tenant_complaints')
            .select(`
                *,
                respondent_unit:units(unit_number)
            `)
            .order('updated_at', { ascending: false });

        if (complaintsData) setComplaints(complaintsData);

        // Fetch My Property Info to get Neighbors
        const { data: leaseData } = await supabase
            .from('leases')
            .select('unit_id, units(property_id)')
            .eq('tenant_id', user.id)
            .eq('status', 'active')
            .single();

        const unitsData = leaseData?.units as any;

        if (leaseData && unitsData?.property_id) {
            // 1. Fetch Units for dropdown (same property)
            const { data: propertyUnits } = await supabase
                .from('units')
                .select('id, unit_number')
                .eq('property_id', unitsData.property_id)
                .neq('id', leaseData.unit_id); // Exclude my own unit

            if (propertyUnits) setUnits(propertyUnits);

            // 2. Fetch Neighbors (Active leases in other units of same property)
            // We need to find leases where unit.property_id = my_property_id AND tenant != me
            const { data: neighborLeases } = await supabase
                .from('leases')
                .select(`
                    tenant_id,
                    units!inner (
                        unit_number,
                        property_id
                    ),
                    profiles:tenant_id (
                        full_name,
                        avatar_url,
                        id
                    )
                `)
                .eq('units.property_id', unitsData.property_id)
                .eq('status', 'active')
                .neq('tenant_id', user.id);

            if (neighborLeases) {
                const formattedNeighbors: Neighbor[] = neighborLeases.map((l: any) => ({
                    unit_number: l.units.unit_number,
                    tenant_name: l.profiles?.full_name || 'Unknown',
                    tenant_id: l.profiles?.id,
                    tenant_avatar: l.profiles?.avatar_url
                })).filter((n: Neighbor) => n.tenant_id); // Ensure we have a tenant ID
                setNeighbors(formattedNeighbors);
            }
        }

        setLoading(false);
    };

    const fetchMessages = async (complaintId: string) => {
        const { data } = await supabase
            .from('complaint_messages')
            .select('*')
            .eq('complaint_id', complaintId)
            .order('created_at', { ascending: true });

        if (data) setMessages(data);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeComplaint || !user) return;

        const { error } = await supabase
            .from('complaint_messages')
            .insert({
                complaint_id: activeComplaint.id,
                sender_id: user.id,
                content: newMessage
            });

        if (!error) {
            setNewMessage("");
            fetchMessages(activeComplaint.id); // Refresh messages
        }
    };

    const handleDirectMessage = async (neighborId: string) => {
        if (!user) return;

        // Check for existing conversation
        let { data: conversation } = await supabase
            .from('conversations')
            .select('id')
            .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
            .or(`participant1_id.eq.${neighborId},participant2_id.eq.${neighborId}`)
            .maybeSingle();

        if (!conversation) {
            // Create new
            const { data: newConv, error } = await supabase
                .from('conversations')
                .insert({
                    participant1_id: user.id,
                    participant2_id: neighborId,
                    listing_id: null
                })
                .select()
                .single();

            if (!error && newConv) conversation = newConv;
        }

        if (conversation) {
            router.push(`/tenant/messages?id=${conversation.id}`);
        }
    };

    const handleCreateComplaint = async () => {
        if (!user || !formData.unit_id || !formData.description) return;

        // Get property ID first (reuse logic or fetch again)
        const { data: unitData } = await supabase
            .from('units')
            .select('property_id')
            .eq('id', formData.unit_id)
            .single();

        if (!unitData) return;

        const { data, error } = await supabase
            .from('tenant_complaints')
            .insert({
                complainant_id: user.id,
                respondent_unit_id: formData.unit_id,
                property_id: unitData.property_id,
                category: formData.category,
                description: formData.description,
                status: 'open'
            })
            .select()
            .single();

        if (!error && data) {
            // Add initial message
            await supabase.from('complaint_messages').insert({
                complaint_id: data.id,
                sender_id: user.id,
                content: `Opened resolution regarding ${formData.category}: ${formData.description}`
            });

            setIsCreateOpen(false);
            setFormData({ unit_id: "", category: "Noise", description: "" });
            fetchUserAndData(); // Refresh list
        }
    };

    const handleEscalate = async () => {
        if (!activeComplaint) return;
        if (!confirm("Are you sure you want to escalate this to the landlord? Keep in mind you should try to resolve it with the neighbor first.")) return;

        const { error } = await supabase
            .from('tenant_complaints')
            .update({
                status: 'escalated',
                escalated_at: new Date().toISOString()
            })
            .eq('id', activeComplaint.id);

        if (!error) {
            setActiveComplaint({ ...activeComplaint, status: 'escalated' });
            await supabase.from('complaint_messages').insert({
                complaint_id: activeComplaint.id,
                sender_id: user.id,
                content: "⚠️ Issue escalated to Landlord."
            });
            fetchMessages(activeComplaint.id);
        }
    };

    const handleResolve = async () => {
        if (!activeComplaint) return;

        const { error } = await supabase
            .from('tenant_complaints')
            .update({ status: 'resolved' })
            .eq('id', activeComplaint.id);

        if (!error) {
            setActiveComplaint({ ...activeComplaint, status: 'resolved' });
            await supabase.from('complaint_messages').insert({
                complaint_id: activeComplaint.id,
                sender_id: user.id,
                content: "✅ Issue marked as resolved."
            });
            fetchMessages(activeComplaint.id);
        }
    };

    if (loading) return <div className={styles.emptyState}>Loading community...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className={styles.backBtn}
                        onClick={() => router.push('/tenant/dashboard')}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <ArrowLeft size={24} color="#64748b" />
                    </button>
                    <div>
                        <h1 className={styles.title}>Community & Resolution</h1>
                        <p className={styles.subtitle}>Connect with neighbors and resolve issues.</p>
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Sidebar / List */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <button
                                className={`${styles.tabBtn} ${view === 'complaints' ? styles.activeTab : ''}`}
                                onClick={() => setView('complaints')}
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    fontWeight: view === 'complaints' ? 700 : 400,
                                    color: view === 'complaints' ? '#0f172a' : '#64748b',
                                    paddingBottom: '0.25rem',
                                    borderBottom: view === 'complaints' ? '2px solid #0f172a' : 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Claims
                            </button>
                            <button
                                className={`${styles.tabBtn} ${view === 'neighbors' ? styles.activeTab : ''}`}
                                onClick={() => setView('neighbors')}
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    fontWeight: view === 'neighbors' ? 700 : 400,
                                    color: view === 'neighbors' ? '#0f172a' : '#64748b',
                                    paddingBottom: '0.25rem',
                                    borderBottom: view === 'neighbors' ? '2px solid #0f172a' : 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Neighbors
                            </button>
                        </div>

                        {view === 'complaints' && (
                            <button className={styles.newBtn} onClick={() => setIsCreateOpen(true)}>
                                <Plus size={16} /> Resolve New Issue
                            </button>
                        )}
                    </div>

                    <div className={styles.complaintList}>
                        {view === 'complaints' ? (
                            complaints.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    No active issues
                                </div>
                            ) : (
                                complaints.map(complaint => (
                                    <div
                                        key={complaint.id}
                                        className={`${styles.complaintItem} ${activeComplaint?.id === complaint.id ? styles.active : ''}`}
                                        onClick={() => setActiveComplaint(complaint)}
                                    >
                                        <div className={styles.itemHeader}>
                                            <span className={styles.categoryBadge}>{complaint.category}</span>
                                            <span className={styles.time}>
                                                {new Date(complaint.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className={styles.itemTitle}>
                                            Unit {complaint.respondent_unit?.unit_number}
                                        </span>
                                        <p className={styles.itemPreview}>{complaint.description}</p>
                                    </div>
                                ))
                            )
                        ) : (
                            // Neighbors List
                            neighbors.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    No neighbors found
                                </div>
                            ) : (
                                neighbors.map(neighbor => (
                                    <div
                                        key={neighbor.tenant_id}
                                        className={styles.complaintItem}
                                        style={{ cursor: 'default' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '40px', height: '40px', background: '#e0e7ff', color: '#4f46e5',
                                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                            }}>
                                                {neighbor.tenant_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{neighbor.tenant_name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Unit {neighbor.unit_number}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDirectMessage(neighbor.tenant_id);
                                            }}
                                            style={{
                                                marginTop: '0.75rem',
                                                width: '100%',
                                                padding: '0.5rem',
                                                background: 'white',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '0.375rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                fontWeight: 500,
                                                color: '#0f172a'
                                            }}
                                        >
                                            <MessageSquare size={16} /> Send Message
                                        </button>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                {view === 'complaints' ? (
                    <div className={styles.main}>
                        {!activeComplaint ? (
                            <div className={styles.emptyState}>
                                <MessageSquare size={48} className={styles.emptyIcon} />
                                <h3>Select an issue to view details</h3>
                            </div>
                        ) : (
                            <>
                                <div className={styles.chatHeader}>
                                    <div className={styles.chatInfo}>
                                        <h2>Unit {activeComplaint.respondent_unit?.unit_number} - {activeComplaint.category}</h2>
                                        <div className={styles.chatStatus}>
                                            Status:
                                            <span style={{
                                                fontWeight: 700,
                                                color: activeComplaint.status === 'escalated' ? '#ef4444' :
                                                    activeComplaint.status === 'resolved' ? '#16a34a' : '#3b82f6'
                                            }}>
                                                {activeComplaint.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.actions}>
                                        {activeComplaint.status !== 'resolved' && (
                                            <button className={`${styles.actionBtn} ${styles.resolveBtn}`} onClick={handleResolve}>
                                                <CheckCircle size={16} style={{ marginRight: 4 }} /> Mark Resolved
                                            </button>
                                        )}
                                        {activeComplaint.status === 'open' && (
                                            <button className={`${styles.actionBtn} ${styles.escalateBtn}`} onClick={handleEscalate}>
                                                <AlertTriangle size={16} style={{ marginRight: 4 }} /> Escalate to Landlord
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.messagesArea}>
                                    {messages.map(msg => (
                                        <div
                                            key={msg.id}
                                            className={`${styles.message} ${msg.sender_id === user?.id ? styles.ownMessage : styles.theirMessage}`}
                                        >
                                            {msg.content}
                                            <span className={styles.messageMeta}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className={styles.inputArea}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button className={styles.sendBtn} onClick={handleSendMessage}>
                                        <Send size={20} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    // Neighbors Placeholder View
                    <div className={styles.main}>
                        <div className={styles.emptyState}>
                            <Users size={48} className={styles.emptyIcon} style={{ background: '#ecfdf5', color: '#059669' }} />
                            <h3>Connect with Neighbours</h3>
                            <p style={{ maxWidth: '400px', margin: '0 auto', color: '#64748b' }}>
                                Find your neighbors in the sidebar to start a conversation.
                                Getting to know your community makes living here even better!
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Complaint Modal */}
            {isCreateOpen && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2 style={{ marginTop: 0 }}>Resolve an Issue</h2>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Which unit is involved?</label>
                            <select
                                className={styles.select}
                                value={formData.unit_id}
                                onChange={e => setFormData({ ...formData, unit_id: e.target.value })}
                            >
                                <option value="">Select a unit...</option>
                                {units.map(u => (
                                    <option key={u.id} value={u.id}>Unit {u.unit_number}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Category</label>
                            <select
                                className={styles.select}
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Noise</option>
                                <option>Cleanliness</option>
                                <option>Parking</option>
                                <option>Pet Issue</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                rows={4}
                                placeholder="Describe the matter kindly..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setIsCreateOpen(false)}>Cancel</button>
                            <button className={styles.submitBtn} onClick={handleCreateComplaint}>Start Resolution</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
