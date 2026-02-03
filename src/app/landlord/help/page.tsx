"use client";

import {
    HelpCircle,
    Book,
    MessageCircle,
    Mail,
    ExternalLink,
    ChevronRight,
    Search,
    FileText,
    Video,
    Users
} from "lucide-react";
import styles from "./help.module.css";

const FAQs = [
    {
        question: "How do I add a new property?",
        answer: "Go to the Properties page and click the 'Add Property' button. Fill in the property details and save."
    },
    {
        question: "How do I create an invoice for a tenant?",
        answer: "Navigate to the Invoices page, click 'Create Invoice', fill in the tenant details and amount, then save."
    },
    {
        question: "How do I track maintenance requests?",
        answer: "Maintenance requests appear in your Dashboard under 'Alerts & Maintenance'. You can also create tasks in your To-Do List."
    },
    {
        question: "How do I mark a unit as occupied?",
        answer: "Go to Properties, select the property, and click on the unit. Change the status from 'Available' to 'Occupied'."
    },
    {
        question: "How do I export my financial data?",
        answer: "Visit the Finances page and use the export feature to download your transactions as a CSV file."
    }
];

const resources = [
    {
        icon: <Book size={24} />,
        title: "Documentation",
        description: "Complete guide to using the platform",
        link: "#"
    },
    {
        icon: <Video size={24} />,
        title: "Video Tutorials",
        description: "Step-by-step video guides",
        link: "#"
    },
    {
        icon: <FileText size={24} />,
        title: "Best Practices",
        description: "Tips for property management",
        link: "#"
    },
    {
        icon: <Users size={24} />,
        title: "Community Forum",
        description: "Connect with other landlords",
        link: "#"
    }
];

export default function HelpPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Help & Support</h1>
                <p className={styles.subtitle}>Find answers and get help with your account</p>
            </div>

            {/* Search */}
            <div className={styles.searchSection}>
                <div className={styles.searchBox}>
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search for help articles..."
                    />
                </div>
            </div>

            {/* Quick Links */}
            <div className={styles.resourcesGrid}>
                {resources.map((resource, index) => (
                    <a key={index} href={resource.link} className={styles.resourceCard}>
                        <div className={styles.resourceIcon}>
                            {resource.icon}
                        </div>
                        <div className={styles.resourceContent}>
                            <h3>{resource.title}</h3>
                            <p>{resource.description}</p>
                        </div>
                        <ExternalLink size={16} className={styles.externalIcon} />
                    </a>
                ))}
            </div>

            {/* FAQ Section */}
            <div className={styles.faqSection}>
                <h2 className={styles.sectionTitle}>
                    <HelpCircle size={20} />
                    Frequently Asked Questions
                </h2>
                <div className={styles.faqList}>
                    {FAQs.map((faq, index) => (
                        <details key={index} className={styles.faqItem}>
                            <summary className={styles.faqQuestion}>
                                {faq.question}
                                <ChevronRight size={18} className={styles.chevron} />
                            </summary>
                            <p className={styles.faqAnswer}>{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </div>

            {/* Contact Section */}
            <div className={styles.contactSection}>
                <h2 className={styles.sectionTitle}>
                    <MessageCircle size={20} />
                    Still need help?
                </h2>
                <div className={styles.contactGrid}>
                    <div className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <Mail size={24} />
                        </div>
                        <h3>Email Support</h3>
                        <p>Get help via email within 24 hours</p>
                        <a href="mailto:support@landlordpro.com" className={styles.contactBtn}>
                            Send Email
                        </a>
                    </div>
                    <div className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <MessageCircle size={24} />
                        </div>
                        <h3>Live Chat</h3>
                        <p>Chat with our support team</p>
                        <button className={styles.contactBtn}>
                            Start Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
