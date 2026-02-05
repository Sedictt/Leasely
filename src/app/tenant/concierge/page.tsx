"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Bot, Send, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type Message = {
    role: 'bot' | 'user';
    content: string;
};

type KnowledgeItem = {
    category: string;
    topic: string;
    content: string;
};

export default function ConciergePage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: "Hello! I'm your AI Property Concierge. Ask me anything about your home, rules, or amenities!" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([]);
    const [propertyInfo, setPropertyInfo] = useState<{ name: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const supabase = createClient();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPropertyAndKnowledge();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchPropertyAndKnowledge = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        // 1. Get user's active property
        const { data: lease } = await supabase
            .from('leases')
            .select('units(id, property_id, properties(name))')
            .eq('tenant_id', user.id)
            .eq('status', 'active')
            .single();

        const units = lease?.units as any;
        if (units?.properties) {
            setPropertyInfo({ name: units.properties.name });

            // 2. Fetch knowledge base for this property
            const { data: kb } = await supabase
                .from('property_knowledge_base')
                .select('category, topic, content')
                .eq('property_id', units.property_id);

            if (kb) setKnowledgeBase(kb);
        }

        setLoading(false);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        // Mimic AI processing delay
        setTimeout(() => {
            const botResponse = findBestResponse(userMsg);
            setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
            setIsTyping(false);
        }, 1000);
    };

    const findBestResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();

        // 1. Try to find exact topic/category matches
        let bestMatch: KnowledgeItem | null = null;
        let highestScore = 0;

        knowledgeBase.forEach(item => {
            let score = 0;
            const topic = item.topic.toLowerCase();
            const category = item.category.toLowerCase();
            const content = item.content.toLowerCase();

            // Simple scoring logic
            if (lowerQuery.includes(topic)) score += 50;
            if (lowerQuery.includes(category)) score += 20;

            // Keyword overlaps
            const words = lowerQuery.split(/\s+/);
            words.forEach(word => {
                if (word.length > 3) {
                    if (topic.includes(word)) score += 10;
                    if (content.includes(word)) score += 5;
                }
            });

            if (score > highestScore) {
                highestScore = score;
                bestMatch = item;
            }
        });

        if (bestMatch && highestScore > 10) {
            return (bestMatch as KnowledgeItem).content;
        }

        return "I'm sorry, I don't have information about that yet. You might want to contact your landlord directly or check the community forum.";
    };

    if (loading) {
        return (
            <div className={styles.emptyState}>
                <Loader2 className={styles.spin} size={32} />
                <p>Connecting to your property concierge...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => router.push('/tenant/dashboard')}>
                    <ArrowLeft size={20} />
                </button>
                <div className={styles.titleSection}>
                    <h1>AI Property Concierge</h1>
                    <p>Assistant for <strong>{propertyInfo?.name || 'Your Property'}</strong></p>
                </div>
            </header>

            <div className={styles.chatWindow}>
                <div className={styles.messages}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                            {msg.content}
                        </div>
                    ))}
                    {isTyping && (
                        <div className={styles.message + ' ' + styles.bot}>
                            <Loader2 className={styles.spin} size={16} />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className={styles.inputArea} onSubmit={handleSend}>
                    <input
                        className={styles.inputField}
                        placeholder="Ask a question (e.g., 'What's the wifi password?')"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button className={styles.sendBtn} disabled={!input.trim() || isTyping}>
                        <Send size={18} />
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
