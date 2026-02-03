"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Plus,
    CheckCircle2,
    Circle,
    Clock,
    AlertTriangle,
    Loader2,
    X,
    Calendar,
    Flag,
    Trash2,
    MoreHorizontal
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./tasks.module.css";

type Task = {
    id: string;
    title: string;
    description: string | null;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed';
    due_date: string | null;
    property_id: string | null;
    created_at: string;
};

type Property = {
    id: string;
    name: string;
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'high' | 'medium' | 'low',
        due_date: '',
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

        // Fetch tasks
        const { data: tasksData } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        // Fetch properties for dropdown
        const { data: propertiesData } = await supabase
            .from('properties')
            .select('id, name');

        if (tasksData) {
            setTasks(tasksData as Task[]);
        }

        if (propertiesData) {
            setProperties(propertiesData as Property[]);
        }

        setIsLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateTask = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('tasks').insert({
            landlord_id: user.id,
            title: newTask.title,
            description: newTask.description || null,
            priority: newTask.priority,
            due_date: newTask.due_date || null,
            property_id: newTask.property_id || null,
            status: 'pending'
        });

        if (!error) {
            setShowModal(false);
            setNewTask({
                title: '',
                description: '',
                priority: 'medium',
                due_date: '',
                property_id: ''
            });
            fetchData();
        }
    };

    const handleToggleStatus = async (task: Task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const updates: { status: string; completed_at?: string | null } = { status: newStatus };

        if (newStatus === 'completed') {
            updates.completed_at = new Date().toISOString();
        } else {
            updates.completed_at = null;
        }

        await supabase.from('tasks').update(updates).eq('id', task.id);
        fetchData();
    };

    const handleDeleteTask = async (id: string) => {
        await supabase.from('tasks').delete().eq('id', id);
        fetchData();
    };

    const filteredTasks = tasks.filter(task => {
        return filter === 'all' || task.status === filter;
    });

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#94a3b8';
        }
    };

    const isOverdue = (dueDate: string | null) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
    };

    if (isLoading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 size={32} className={styles.spinner} />
                <p>Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>To Do List</h1>
                    <p className={styles.subtitle}>Manage your tasks and priorities</p>
                </div>
                <button className={styles.addBtn} onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    Add Task
                </button>
            </div>

            {/* Progress Overview */}
            <div className={styles.progressCard}>
                <div className={styles.progressInfo}>
                    <h3>Today&apos;s Progress</h3>
                    <p>{stats.completed} of {stats.total} tasks completed</p>
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                {(['all', 'pending', 'in_progress', 'completed'] as const).map(f => (
                    <button
                        key={f}
                        className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                        <span className={styles.filterCount}>
                            {f === 'all' ? stats.total :
                                f === 'pending' ? stats.pending :
                                    f === 'in_progress' ? stats.inProgress :
                                        stats.completed}
                        </span>
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div className={styles.tasksList}>
                <AnimatePresence>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                className={`${styles.taskCard} ${task.status === 'completed' ? styles.completed : ''}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                layout
                            >
                                <button
                                    className={styles.checkBtn}
                                    onClick={() => handleToggleStatus(task)}
                                >
                                    {task.status === 'completed' ? (
                                        <CheckCircle2 size={24} className={styles.checked} />
                                    ) : (
                                        <Circle size={24} />
                                    )}
                                </button>

                                <div className={styles.taskContent}>
                                    <div className={styles.taskHeader}>
                                        <h4 className={styles.taskTitle}>{task.title}</h4>
                                        <div className={styles.taskMeta}>
                                            <span
                                                className={styles.priorityBadge}
                                                style={{
                                                    background: `${getPriorityColor(task.priority)}15`,
                                                    color: getPriorityColor(task.priority)
                                                }}
                                            >
                                                <Flag size={12} />
                                                {task.priority}
                                            </span>
                                            {task.due_date && (
                                                <span className={`${styles.dueBadge} ${isOverdue(task.due_date) ? styles.overdue : ''}`}>
                                                    {isOverdue(task.due_date) ? <AlertTriangle size={12} /> : <Clock size={12} />}
                                                    {new Date(task.due_date).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {task.description && (
                                        <p className={styles.taskDescription}>{task.description}</p>
                                    )}
                                </div>

                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <CheckCircle2 size={48} />
                            <h3>No tasks found</h3>
                            <p>Create a new task to get started</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Create Task Modal */}
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
                                <h2>Add New Task</h2>
                                <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label>Task Title *</label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        placeholder="What needs to be done?"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        placeholder="Add more details..."
                                        rows={3}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label><Flag size={16} /> Priority</label>
                                        <select
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label><Calendar size={16} /> Due Date</label>
                                        <input
                                            type="date"
                                            value={newTask.due_date}
                                            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {properties.length > 0 && (
                                    <div className={styles.formGroup}>
                                        <label>Related Property (Optional)</label>
                                        <select
                                            value={newTask.property_id}
                                            onChange={(e) => setNewTask({ ...newTask, property_id: e.target.value })}
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
                                    onClick={handleCreateTask}
                                    disabled={!newTask.title}
                                >
                                    Add Task
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
