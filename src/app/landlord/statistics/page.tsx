"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    Building2,
    Users,
    DollarSign,
    Loader2,
    Calendar
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import styles from "./statistics.module.css";

type PropertyStats = {
    name: string;
    totalUnits: number;
    occupiedUnits: number;
    revenue: number;
};

type MonthlyData = {
    month: string;
    income: number;
    expenses: number;
};

export default function StatisticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [propertyStats, setPropertyStats] = useState<PropertyStats[]>([]);
    const [totals, setTotals] = useState({
        totalRevenue: 0,
        totalProperties: 0,
        totalUnits: 0,
        occupancyRate: 0
    });
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

    const supabase = useMemo(() => createClient(), []);

    const fetchStatistics = useCallback(async () => {
        setIsLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsLoading(false);
            return;
        }

        // Fetch properties with units
        const { data: properties } = await supabase
            .from('properties')
            .select('*, units(*)');

        // Fetch transactions for monthly data
        const { data: transactions } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: true });

        if (properties) {
            let totalRevenue = 0;
            let totalUnits = 0;
            let occupiedUnits = 0;

            const stats: PropertyStats[] = properties.map((property: { name: string; units?: { status: string; rent_amount: number }[] }) => {
                const units = property.units || [];
                const occupied = units.filter((u: { status: string }) => u.status === 'occupied' || u.status === 'neardue').length;
                const revenue = units
                    .filter((u: { status: string }) => u.status === 'occupied' || u.status === 'neardue')
                    .reduce((sum: number, u: { rent_amount: number }) => sum + (Number(u.rent_amount) || 0), 0);

                totalUnits += units.length;
                occupiedUnits += occupied;
                totalRevenue += revenue;

                return {
                    name: property.name,
                    totalUnits: units.length,
                    occupiedUnits: occupied,
                    revenue
                };
            });

            setPropertyStats(stats);
            setTotals({
                totalRevenue,
                totalProperties: properties.length,
                totalUnits,
                occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0
            });
        }

        // Process monthly data
        if (transactions && transactions.length > 0) {
            const monthlyMap = new Map<string, { income: number; expenses: number }>();

            transactions.forEach((t: { date: string; type: string; amount: number }) => {
                const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                const existing = monthlyMap.get(month) || { income: 0, expenses: 0 };

                if (t.type === 'income') {
                    existing.income += Number(t.amount);
                } else {
                    existing.expenses += Number(t.amount);
                }

                monthlyMap.set(month, existing);
            });

            setMonthlyData(Array.from(monthlyMap.entries()).map(([month, data]) => ({
                month,
                ...data
            })));
        }

        setIsLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    if (isLoading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 size={32} className={styles.spinner} />
                <p>Loading statistics...</p>
            </div>
        );
    }

    const maxValue = Math.max(...monthlyData.map(d => Math.max(d.income, d.expenses)), 1);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Statistics</h1>
                    <p className={styles.subtitle}>Analytics and insights for your properties</p>
                </div>
                <div className={styles.periodSelector}>
                    <Calendar size={16} />
                    <span>Last 12 months</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.summaryCard}
                >
                    <div className={`${styles.summaryIcon} ${styles.blue}`}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryLabel}>Total Revenue</span>
                        <span className={styles.summaryValue}>₱{totals.totalRevenue.toLocaleString()}</span>
                        <span className={styles.summaryTrend}>
                            <TrendingUp size={14} /> +12.5% from last month
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={styles.summaryCard}
                >
                    <div className={`${styles.summaryIcon} ${styles.purple}`}>
                        <Building2 size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryLabel}>Properties</span>
                        <span className={styles.summaryValue}>{totals.totalProperties}</span>
                        <span className={styles.summaryTrend}>
                            {totals.totalUnits} total units
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={styles.summaryCard}
                >
                    <div className={`${styles.summaryIcon} ${styles.green}`}>
                        <Users size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryLabel}>Occupancy Rate</span>
                        <span className={styles.summaryValue}>{totals.occupancyRate}%</span>
                        <span className={styles.summaryTrend}>
                            <TrendingUp size={14} /> +2.3% from last month
                        </span>
                    </div>
                </motion.div>
            </div>

            <div className={styles.chartsGrid}>
                {/* Revenue Chart */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Revenue Overview</h2>
                    </div>
                    <div className={styles.chartContainer}>
                        {monthlyData.length > 0 ? (
                            <div className={styles.barChart}>
                                {monthlyData.slice(-6).map((data, index) => (
                                    <div key={index} className={styles.barGroup}>
                                        <div className={styles.bars}>
                                            <div
                                                className={`${styles.bar} ${styles.incomeBar}`}
                                                style={{ height: `${(data.income / maxValue) * 100}%` }}
                                                title={`Income: ₱${data.income.toLocaleString()}`}
                                            />
                                            <div
                                                className={`${styles.bar} ${styles.expenseBar}`}
                                                style={{ height: `${(data.expenses / maxValue) * 100}%` }}
                                                title={`Expenses: ₱${data.expenses.toLocaleString()}`}
                                            />
                                        </div>
                                        <span className={styles.barLabel}>{data.month}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyChart}>
                                <p>No transaction data yet</p>
                                <span>Add transactions to see revenue trends</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.chartLegend}>
                        <div className={styles.legendItem}>
                            <span className={`${styles.legendDot} ${styles.income}`}></span>
                            Income
                        </div>
                        <div className={styles.legendItem}>
                            <span className={`${styles.legendDot} ${styles.expense}`}></span>
                            Expenses
                        </div>
                    </div>
                </div>

                {/* Property Performance */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Property Performance</h2>
                    </div>
                    <div className={styles.propertyList}>
                        {propertyStats.length > 0 ? (
                            propertyStats.map((property, index) => (
                                <div key={index} className={styles.propertyItem}>
                                    <div className={styles.propertyInfo}>
                                        <span className={styles.propertyName}>{property.name}</span>
                                        <span className={styles.propertyUnits}>
                                            {property.occupiedUnits}/{property.totalUnits} units occupied
                                        </span>
                                    </div>
                                    <div className={styles.propertyStats}>
                                        <div className={styles.occupancyBar}>
                                            <div
                                                className={styles.occupancyFill}
                                                style={{
                                                    width: `${property.totalUnits > 0 ? (property.occupiedUnits / property.totalUnits) * 100 : 0}%`
                                                }}
                                            />
                                        </div>
                                        <span className={styles.propertyRevenue}>
                                            ₱{property.revenue.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <p>No properties found</p>
                                <span>Add properties to see performance metrics</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
