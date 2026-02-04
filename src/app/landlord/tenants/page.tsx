
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import styles from "./tenants.module.css";

type TenantProfile = {
    id: string;
    full_name: string | null;
    email: string | null;
};

type Lease = {
    id: string;
    unit_id: string;
    start_date: string;
    end_date: string;
    status: string;
    rent_amount: number;
    profiles: TenantProfile | null;
    units: {
        unit_number: string;
        properties: {
            name: string;
        } | null;
    } | null;
};

export default function TenantsPage() {
    const [leases, setLeases] = useState<Lease[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = useMemo(() => createClient(), []);

    const fetchTenants = useCallback(async () => {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsLoading(false);
            return;
        }

        // Fetch active leases with related data
        // Note: In a real app, you'd filter by landlord properties. 
        // For this demo, we assume the user has access to these leases.
        const { data } = await supabase
            .from('leases')
            .select(`
                *,
                profiles:tenant_id (*),
                units (
                    unit_number,
                    properties (name)
                )
            `)
            .eq('status', 'active');

        if (data) {
            setLeases(data as any);
        }
        setIsLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchTenants();
    }, [fetchTenants]);

    if (isLoading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 className={styles.spinner} size={32} />
                <p>Loading tenant directory...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        <Users size={32} />
                        Tenant Directory
                    </h1>
                    <p className={styles.subtitle}>View and manage your active lease agreements.</p>
                </div>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tenant Name</th>
                            <th>Contact</th>
                            <th>Property / Unit</th>
                            <th>Lease Period</th>
                            <th>Monthly Rent</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leases.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                                    <Users size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                    <p>No active tenants found.</p>
                                </td>
                            </tr>
                        ) : (
                            leases.map(lease => (
                                <tr key={lease.id}>
                                    <td>
                                        <div className={styles.tenantName}>
                                            {lease.profiles?.full_name || 'Unknown Tenant'}
                                        </div>
                                    </td>
                                    <td className={styles.tenantEmail}>
                                        {lease.profiles?.email || '-'}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>
                                            {lease.units?.properties?.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                            Unit {lease.units?.unit_number}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem' }}>
                                            {new Date(lease.start_date).toLocaleDateString()} - <br />
                                            {new Date(lease.end_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        ₱{lease.rent_amount.toLocaleString()}
                                    </td>
                                    <td>
                                        <span className={styles.statusBadge} style={{ background: '#dcfce7', color: '#166534' }}>
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
