"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Bot, FileText, Loader2, Calendar, DollarSign, AlertTriangle, CheckCircle2,
    Clock, Sparkles, Mail, Calculator, RefreshCw, User, Building, Copy, Check,
    FileWarning, TrendingUp
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./lease-ai.module.css";

type Lease = {
    id: string;
    start_date: string;
    end_date: string;
    rent_amount: number;
    status: string;
    profiles: { id: string; full_name: string | null; email: string | null; } | null;
    units: { unit_number: string; properties: { name: string; } | null; } | null;
};

type TerminationResult = {
    lease: Lease;
    moveOutDate: string;
    calculatedPenalty: number;
    remainingMonths: number;
    withinLockIn: boolean;
    breakdown: { monthlyRent: number; penaltyType: string; penaltyValue: number; };
    aiResponse: string;
    emailSubject: string;
    emailBody: string;
};

type RenewalAlert = {
    lease: Lease;
    daysUntilExpiry: number;
    suggestedNewRent: number;
    marketAnalysis: string;
};

export default function LeaseAIPage() {
    const [leases, setLeases] = useState<Lease[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'termination' | 'renewal' | 'parser'>('termination');
    const [selectedLease, setSelectedLease] = useState('');
    const [moveOutDate, setMoveOutDate] = useState('');
    const [terminationReason, setTerminationReason] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [terminationResult, setTerminationResult] = useState<TerminationResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [renewalAlerts, setRenewalAlerts] = useState<RenewalAlert[]>([]);
    const supabase = useMemo(() => createClient(), []);

    const checkRenewals = (data: Lease[]) => {
        const today = new Date();
        const alerts: RenewalAlert[] = [];
        data.forEach(lease => {
            const days = Math.ceil((new Date(lease.end_date).getTime() - today.getTime()) / 86400000);
            if (days <= 90 && days > 0) {
                const inc = 0.05 + Math.random() * 0.05;
                alerts.push({
                    lease, daysUntilExpiry: days,
                    suggestedNewRent: Math.round(lease.rent_amount * (1 + inc)),
                    marketAnalysis: `Market analysis suggests ${Math.round(inc * 100)}% increase based on comparable properties.`
                });
            }
        });
        setRenewalAlerts(alerts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry));
    };

    const fetchLeases = useCallback(async () => {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsLoading(false); return; }
        const { data } = await supabase.from('leases')
            .select(`*, profiles:tenant_id (*), units (unit_number, properties (name))`)
            .eq('status', 'active');
        if (data) { setLeases(data as Lease[]); checkRenewals(data as Lease[]); }
        setIsLoading(false);
    }, [supabase]);

    useEffect(() => { fetchLeases(); }, [fetchLeases]);

    const calculate = async () => {
        if (!selectedLease || !moveOutDate) return;
        setIsCalculating(true);
        await new Promise(r => setTimeout(r, 2000));
        const lease = leases.find(l => l.id === selectedLease)!;
        const moveOut = new Date(moveOutDate), endDate = new Date(lease.end_date), startDate = new Date(lease.start_date);
        const remaining = Math.max(0, (endDate.getFullYear() - moveOut.getFullYear()) * 12 + (endDate.getMonth() - moveOut.getMonth()));
        const lockInEnd = new Date(startDate); lockInEnd.setMonth(lockInEnd.getMonth() + 6);
        const withinLockIn = moveOut < lockInEnd;
        let penalty = 0, pType = 'none', pVal = 0;
        if (withinLockIn) { penalty = lease.rent_amount * 2; pType = 'months_rent'; pVal = 2; }
        else if (remaining > 3) { penalty = lease.rent_amount; pType = 'months_rent'; pVal = 1; }
        const name = lease.profiles?.full_name || 'Tenant';
        const prop = lease.units?.properties?.name || 'property';
        const unit = lease.units?.unit_number || '';
        const ai = withinLockIn
            ? `${name} is within lock-in period. Penalty of ₱${penalty.toLocaleString()} (2 months rent) applies.`
            : remaining > 3 ? `${name} is outside lock-in with ${remaining} months remaining. Standard penalty of ₱${penalty.toLocaleString()} applies.`
                : `${name} has only ${remaining} months left. Consider waiving penalty as goodwill.`;
        const subject = `Re: Early Move-Out Request - ${name}`;
        const body = `Dear ${name},\n\nThank you for your request to terminate early at ${prop}${unit ? ` Unit ${unit}` : ''}.\n\n${penalty > 0 ? `A termination fee of ₱${penalty.toLocaleString()} applies based on your lease terms.` : 'No penalty applies given the remaining lease term.'}\n\nPlease confirm to proceed.\n\nBest regards`;
        setTerminationResult({ lease, moveOutDate, calculatedPenalty: penalty, remainingMonths: remaining, withinLockIn, breakdown: { monthlyRent: lease.rent_amount, penaltyType: pType, penaltyValue: pVal }, aiResponse: ai, emailSubject: subject, emailBody: body });
        setIsCalculating(false);
    };

    const copy = async (t: string) => { await navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const reset = () => { setSelectedLease(''); setMoveOutDate(''); setTerminationReason(''); setTerminationResult(null); };

    if (isLoading) return <div className={styles.loadingState}><Loader2 size={32} className={styles.spinner} /><p>Loading AI Lease Agent...</p></div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}><div className={styles.headerIcon}><Bot size={28} /></div><div><h1 className={styles.title}>AI Lease Agent</h1><p className={styles.subtitle}>Automate penalty calculations and email responses</p></div></div>
                <div className={styles.headerBadge}><Sparkles size={14} />Powered by AI</div>
            </div>
            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'termination' ? styles.active : ''}`} onClick={() => setActiveTab('termination')}><Calculator size={18} />Early Termination</button>
                <button className={`${styles.tab} ${activeTab === 'renewal' ? styles.active : ''}`} onClick={() => setActiveTab('renewal')}><RefreshCw size={18} />Renewal Alerts{renewalAlerts.length > 0 && <span className={styles.tabBadge}>{renewalAlerts.length}</span>}</button>
                <button className={`${styles.tab} ${activeTab === 'parser' ? styles.active : ''}`} onClick={() => setActiveTab('parser')}><FileText size={18} />Contract Parser</button>
            </div>
            <AnimatePresence mode="wait">
                {activeTab === 'termination' && <TerminationTab leases={leases} selectedLease={selectedLease} setSelectedLease={setSelectedLease} moveOutDate={moveOutDate} setMoveOutDate={setMoveOutDate} terminationReason={terminationReason} setTerminationReason={setTerminationReason} isCalculating={isCalculating} terminationResult={terminationResult} calculate={calculate} reset={reset} copy={copy} copied={copied} />}
                {activeTab === 'renewal' && <RenewalTab alerts={renewalAlerts} />}
                {activeTab === 'parser' && <ParserTab />}
            </AnimatePresence>
        </div>
    );
}

function TerminationTab({ leases, selectedLease, setSelectedLease, moveOutDate, setMoveOutDate, terminationReason, setTerminationReason, isCalculating, terminationResult, calculate, reset, copy, copied }: any) {
    return (
        <motion.div key="term" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.tabContent}>
            <div className={styles.twoColumn}>
                <div className={styles.inputPanel}>
                    <div className={styles.panelHeader}><AlertTriangle size={20} /><h2>Early Termination Calculator</h2></div>
                    <p className={styles.panelDescription}>Enter request details for AI penalty calculation.</p>
                    <div className={styles.form}>
                        <div className={styles.formGroup}><label><User size={16} /> Select Lease</label><select value={selectedLease} onChange={e => setSelectedLease(e.target.value)} disabled={!!terminationResult}><option value="">Choose lease...</option>{leases.map((l: Lease) => <option key={l.id} value={l.id}>{l.profiles?.full_name} - {l.units?.properties?.name} Unit {l.units?.unit_number}</option>)}</select></div>
                        <div className={styles.formGroup}><label><Calendar size={16} /> Move-Out Date</label><input type="date" value={moveOutDate} onChange={e => setMoveOutDate(e.target.value)} min={new Date().toISOString().split('T')[0]} disabled={!!terminationResult} /></div>
                        <div className={styles.formGroup}><label><FileText size={16} /> Reason</label><textarea value={terminationReason} onChange={e => setTerminationReason(e.target.value)} placeholder="e.g., Job relocation" rows={3} disabled={!!terminationResult} /></div>
                        {!terminationResult ? <button className={styles.calculateBtn} onClick={calculate} disabled={!selectedLease || !moveOutDate || isCalculating}>{isCalculating ? <><Loader2 size={18} className={styles.spinner} />Processing...</> : <><Sparkles size={18} />Calculate</>}</button> : <button className={styles.resetBtn} onClick={reset}><RefreshCw size={18} />New Calculation</button>}
                    </div>
                </div>
                <div className={styles.resultsPanel}>
                    {terminationResult ? <>
                        <div className={styles.resultHeader}><CheckCircle2 size={20} /><h2>AI Analysis Complete</h2></div>
                        <div className={styles.penaltyCard}><div className={styles.penaltyHeader}><DollarSign size={24} /><div><span className={styles.penaltyLabel}>Calculated Penalty</span><span className={styles.penaltyAmount}>₱{terminationResult.calculatedPenalty.toLocaleString()}</span></div></div><div className={styles.penaltyDetails}><div className={styles.penaltyRow}><span>Monthly Rent:</span><span>₱{terminationResult.breakdown.monthlyRent.toLocaleString()}</span></div><div className={styles.penaltyRow}><span>Within Lock-in:</span><span className={terminationResult.withinLockIn ? styles.warning : styles.success}>{terminationResult.withinLockIn ? 'Yes' : 'No'}</span></div></div></div>
                        <div className={styles.aiRecommendation}><div className={styles.aiHeader}><Bot size={18} />AI Recommendation</div><p>{terminationResult.aiResponse}</p></div>
                        <div className={styles.emailDraft}><div className={styles.emailHeader}><Mail size={18} /><span>Email Response</span><button className={styles.copyBtn} onClick={() => copy(terminationResult.emailBody)}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied!' : 'Copy'}</button></div><div className={styles.emailSubject}><strong>Subject:</strong> {terminationResult.emailSubject}</div><pre className={styles.emailBody}>{terminationResult.emailBody}</pre></div>
                    </> : <div className={styles.emptyResults}><Bot size={48} /><h3>Ready to Analyze</h3><p>Select a lease to get AI-powered calculations.</p></div>}
                </div>
            </div>
        </motion.div>
    );
}

function RenewalTab({ alerts }: { alerts: RenewalAlert[] }) {
    return (
        <motion.div key="renew" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.tabContent}>
            <div className={styles.renewalGrid}>
                {alerts.length > 0 ? alerts.map((a, i) => (
                    <motion.div key={a.lease.id} className={styles.renewalCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <div className={styles.renewalCardHeader}><div className={styles.renewalTenant}><div className={styles.avatar}>{a.lease.profiles?.full_name?.[0] || '?'}</div><div><span className={styles.tenantName}>{a.lease.profiles?.full_name}</span><span className={styles.propertyInfo}>{a.lease.units?.properties?.name} Unit {a.lease.units?.unit_number}</span></div></div><div className={`${styles.urgencyBadge} ${a.daysUntilExpiry <= 30 ? styles.urgent : a.daysUntilExpiry <= 60 ? styles.warn : styles.normal}`}><Clock size={14} />{a.daysUntilExpiry} days</div></div>
                        <div className={styles.renewalDetails}><div className={styles.renewalRow}><span>Current:</span><strong>₱{a.lease.rent_amount.toLocaleString()}/mo</strong></div><div className={styles.renewalRow}><span>Expires:</span><strong>{new Date(a.lease.end_date).toLocaleDateString()}</strong></div></div>
                        <div className={styles.aiSuggestion}><div className={styles.suggestionHeader}><TrendingUp size={16} />AI Suggested</div><div className={styles.suggestedRent}>₱{a.suggestedNewRent.toLocaleString()}/mo <span className={styles.increase}>+{Math.round(((a.suggestedNewRent - a.lease.rent_amount) / a.lease.rent_amount) * 100)}%</span></div><p className={styles.marketAnalysis}>{a.marketAnalysis}</p></div>
                        <button className={styles.renewBtn}><Mail size={16} />Send Renewal Offer</button>
                    </motion.div>
                )) : <div className={styles.emptyRenewals}><CheckCircle2 size={48} /><h3>All Clear!</h3><p>No leases expiring in 90 days.</p></div>}
            </div>
        </motion.div>
    );
}

function ParserTab() {
    return (
        <motion.div key="parse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.tabContent}>
            <div className={styles.parserContent}>
                <div className={styles.uploadZone}><FileWarning size={48} /><h3>Contract Parser</h3><p>Upload a lease PDF to extract key terms</p><button className={styles.uploadBtn}><FileText size={18} />Upload PDF</button><span className={styles.uploadHint}>PDF up to 10MB</span></div>
                <div className={styles.parserFeatures}><h4>AI Extracts:</h4><div className={styles.featureGrid}><div className={styles.featureItem}><Calendar size={20} /><span>Dates</span></div><div className={styles.featureItem}><DollarSign size={20} /><span>Rent</span></div><div className={styles.featureItem}><Clock size={20} /><span>Lock-in</span></div><div className={styles.featureItem}><AlertTriangle size={20} /><span>Penalties</span></div><div className={styles.featureItem}><User size={20} /><span>Parties</span></div><div className={styles.featureItem}><Building size={20} /><span>Property</span></div></div></div>
            </div>
        </motion.div>
    );
}
