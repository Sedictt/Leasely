"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Plus,
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    X,
    Calendar,
    DollarSign,
    Filter
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./finances.module.css";

type Transaction = {
    id: string;
    type: 'income' | 'expense';
    category: string;
    description: string | null;
    amount: number;
    date: string;
    property_id: string | null;
    created_at: string;
};

type Property = {
    id: string;
    name: string;
};

const CATEGORIES = {
    income: ['Rent', 'Deposit', 'Late Fee', 'Other Income'],
    expense: ['Maintenance', 'Utilities', 'Insurance', 'Taxes', 'Management Fee', 'Other Expense']
};

export default function FinancesPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    const [newTransaction, setNewTransaction] = useState({
        type: 'income' as 'income' | 'expense',
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        property_id: ''
    });

    const supabase = useMemo(() => createClient(), []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsLoading(false);
            return;
        }

        // Fetch transactions
        const { data: transactionsData } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        // Fetch properties
        const { data: propertiesData } = await supabase
            .from('properties')
            .select('id, name');

        if (transactionsData) {
            setTransactions(transactionsData as Transaction[]);
        }

        if (propertiesData) {
            setProperties(propertiesData as Property[]);
        }

        setIsLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateTransaction = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('transactions').insert({
            landlord_id: user.id,
            type: newTransaction.type,
            category: newTransaction.category,
            description: newTransaction.description || null,
            amount: parseFloat(newTransaction.amount),
            date: newTransaction.date,
            property_id: newTransaction.property_id || null
        });

        if (!error) {
            setShowModal(false);
            setNewTransaction({
                type: 'income',
                category: '',
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                property_id: ''
            });
            fetchData();
        }
    };

    const filteredTransactions = transactions.filter(t => {
        return filter === 'all' || t.type === filter;
    });

    const stats = useMemo(() => {
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        // This month
        const thisMonth = new Date().toISOString().slice(0, 7);
        const monthlyIncome = transactions
            .filter(t => t.type === 'income' && t.date.startsWith(thisMonth))
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const monthlyExpense = transactions
            .filter(t => t.type === 'expense' && t.date.startsWith(thisMonth))
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return {
            totalIncome,
            totalExpense,
            netIncome: totalIncome - totalExpense,
            monthlyIncome,
            monthlyExpense,
            monthlyNet: monthlyIncome - monthlyExpense
        };
    }, [transactions]);

    if (isLoading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 size={32} className={styles.spinner} />
                <p>Loading finances...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Finances</h1>
                    <p className={styles.subtitle}>Track your income and expenses</p>
                </div>
                <button className={styles.addBtn} onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    Add Transaction
                </button>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${styles.summaryCard} ${styles.income}`}
                >
                    <div className={styles.summaryIcon}>
                        <ArrowUpRight size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryLabel}>Total Income</span>
                        <span className={styles.summaryValue}>₱{stats.totalIncome.toLocaleString()}</span>
                        <span className={styles.summaryMeta}>
                            <TrendingUp size={14} />
                            ₱{stats.monthlyIncome.toLocaleString()} this month
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${styles.summaryCard} ${styles.expense}`}
                >
                    <div className={styles.summaryIcon}>
                        <ArrowDownRight size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryLabel}>Total Expenses</span>
                        <span className={styles.summaryValue}>₱{stats.totalExpense.toLocaleString()}</span>
                        <span className={styles.summaryMeta}>
                            <TrendingDown size={14} />
                            ₱{stats.monthlyExpense.toLocaleString()} this month
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`${styles.summaryCard} ${styles.net}`}
                >
                    <div className={styles.summaryIcon}>
                        <Wallet size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryLabel}>Net Income</span>
                        <span className={`${styles.summaryValue} ${stats.netIncome >= 0 ? styles.positive : styles.negative}`}>
                            ₱{stats.netIncome.toLocaleString()}
                        </span>
                        <span className={styles.summaryMeta}>
                            {stats.monthlyNet >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            ₱{stats.monthlyNet.toLocaleString()} this month
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Filters */}
            <div className={styles.toolbar}>
                <div className={styles.filters}>
                    {(['all', 'income', 'expense'] as const).map(f => (
                        <button
                            key={f}
                            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions List */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Recent Transactions</h2>
                </div>
                <div className={styles.transactionsList}>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction, index) => (
                            <motion.div
                                key={transaction.id}
                                className={styles.transactionItem}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <div className={`${styles.transactionIcon} ${styles[transaction.type]}`}>
                                    {transaction.type === 'income' ? (
                                        <ArrowUpRight size={18} />
                                    ) : (
                                        <ArrowDownRight size={18} />
                                    )}
                                </div>
                                <div className={styles.transactionInfo}>
                                    <span className={styles.transactionCategory}>{transaction.category}</span>
                                    <span className={styles.transactionDesc}>
                                        {transaction.description || transaction.category}
                                    </span>
                                </div>
                                <div className={styles.transactionDate}>
                                    {new Date(transaction.date).toLocaleDateString()}
                                </div>
                                <div className={`${styles.transactionAmount} ${styles[transaction.type]}`}>
                                    {transaction.type === 'income' ? '+' : '-'}₱{Number(transaction.amount).toLocaleString()}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <Wallet size={48} />
                            <h3>No transactions found</h3>
                            <p>Add your first transaction to start tracking finances</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Transaction Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h2>Add Transaction</h2>
                                <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                {/* Type Toggle */}
                                <div className={styles.typeToggle}>
                                    <button
                                        className={`${styles.typeBtn} ${newTransaction.type === 'income' ? styles.active : ''}`}
                                        onClick={() => setNewTransaction({ ...newTransaction, type: 'income', category: '' })}
                                    >
                                        <ArrowUpRight size={18} />
                                        Income
                                    </button>
                                    <button
                                        className={`${styles.typeBtn} ${newTransaction.type === 'expense' ? styles.active : ''}`}
                                        onClick={() => setNewTransaction({ ...newTransaction, type: 'expense', category: '' })}
                                    >
                                        <ArrowDownRight size={18} />
                                        Expense
                                    </button>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label><DollarSign size={16} /> Amount *</label>
                                        <input
                                            type="number"
                                            value={newTransaction.amount}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label><Calendar size={16} /> Date *</label>
                                        <input
                                            type="date"
                                            value={newTransaction.date}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Category *</label>
                                    <select
                                        value={newTransaction.category}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                    >
                                        <option value="">Select category</option>
                                        {CATEGORIES[newTransaction.type].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        value={newTransaction.description}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                        placeholder="Add a note..."
                                    />
                                </div>

                                {properties.length > 0 && (
                                    <div className={styles.formGroup}>
                                        <label>Property (Optional)</label>
                                        <select
                                            value={newTransaction.property_id}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, property_id: e.target.value })}
                                        >
                                            <option value="">No property</option>
                                            {properties.map(prop => (
                                                <option key={prop.id} value={prop.id}>
                                                    {prop.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className={styles.modalFooter}>
                                <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    className={styles.submitBtn}
                                    onClick={handleCreateTransaction}
                                    disabled={!newTransaction.amount || !newTransaction.category || !newTransaction.date}
                                >
                                    Add Transaction
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
