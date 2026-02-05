import React from 'react';
import styles from './RequestDecisionModal.module.css';
import { Check, User, Calendar, Phone, Mail, Clock, X } from 'lucide-react';

interface RequestDecisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    tenantName: string;
    tenantData?: {
        email: string;
        phone: string | null;
        moveInDate: string | null;
        message: string;
    };
    propertyDetails?: {
        title: string;
        address: string;
        city: string;
        price?: string | null;
    };
    tenantStats?: {
        verified: boolean;
    };
}

export default function RequestDecisionModal({
    isOpen,
    onClose,
    onApprove,
    onReject,
    tenantName,
    tenantData,
    propertyDetails,
    tenantStats = { verified: true }
}: RequestDecisionModalProps) {
    if (!isOpen) return null;

    const moveInDate = tenantData?.moveInDate ? new Date(tenantData.moveInDate) : null;
    const dateDay = moveInDate ? moveInDate.getDate() : '--';
    const dateMonth = moveInDate ? moveInDate.toLocaleString('default', { month: 'short' }).toUpperCase() : 'ANY';

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.avatarContainer}>
                        <div className={styles.avatar}>
                            {tenantName.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className={styles.headerInfo}>
                        <div className={styles.tenantName}>{tenantName}</div>
                        <div style={{ position: 'relative' }}>
                            <div className={styles.realInfo}>
                                Request for {propertyDetails?.title || 'Listing'}
                            </div>
                            <div className={styles.realInfo}>
                                {propertyDetails?.city}
                            </div>

                            <div className={styles.statusTag}></div>
                        </div>
                    </div>
                </div>

                {/* Tenant Message */}
                <div className={styles.messageSection}>
                    <p>"{tenantData?.message || "I'm interested in this property."}"</p>
                </div>

                {/* Main Stats: Move-in & Verification */}
                <div className={styles.statsSection}>
                    {/* Left: Move-In Date Widget */}
                    <div className={styles.calendarGroup}>
                        <div className={styles.calendarWidget}>
                            <div className={styles.calendarHeader}>{dateMonth}</div>
                            <div className={styles.calendarBody}>{dateDay}</div>
                        </div>
                        <div>
                            <span className={styles.statLabel}>Move-In</span>
                            <span className={styles.subLabel}>Target Date</span>
                        </div>
                    </div>

                    {/* Right: Verified Badge */}
                    <div className={styles.verifiedBadge}>
                        <div className={styles.checkCircle}>
                            <Check strokeWidth={4} size={20} />
                        </div>
                        <span className={styles.verifiedLabel}>Verified</span>
                    </div>
                </div>

                {/* Contact Details */}
                <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                        <div className={styles.detailTitle}>Email</div>
                        <div className={styles.detailText}>{tenantData?.email}</div>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailTitle}>Phone</div>
                        <div className={styles.detailText}>{tenantData?.phone || 'N/A'}</div>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailTitle}>Requested Unit</div>
                        <div className={styles.detailText}>
                            {/* Placeholder for now if we don't have unit info passed yet */}
                            General / Any
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailTitle}>Rent Offer</div>
                        <div className={styles.detailText}>
                            {propertyDetails?.price || 'Standard'}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className={styles.folderActions}>
                    <button className={styles.btnApprove} onClick={onApprove}>
                        Approve
                    </button>
                    <button className={styles.btnReject} onClick={onReject}>
                        Reject
                    </button>
                </div>

            </div>
        </div>
    );
}
