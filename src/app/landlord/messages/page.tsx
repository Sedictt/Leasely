"use client";

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{
                width: '64px',
                height: '64px',
                background: '#e0e7ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5',
                marginBottom: '1.5rem'
            }}>
                <MessageSquare size={32} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Messages</h1>
            <p style={{ color: '#64748b', fontSize: '1rem', textAlign: 'center', maxWidth: '400px' }}>
                Select a conversation to start chatting with your tenants.
            </p>
        </div>
    );
}
