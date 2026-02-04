"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, Building2, Home } from "lucide-react";
import styles from "./PropertyPickerScreen.module.css";

const PROPERTIES = [
    {
        id: 1,
        name: "The Lofts",
        role: "Tenant",
        address: "123 Innovation Dr",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=200",
        unread: 3
    },
    {
        id: 2,
        name: "Skyline Apartments",
        role: "Landlord",
        address: "456 Metro Ave",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200",
        unread: 0
    },
    {
        id: 3,
        name: "Sunset Villas",
        role: "Maintenance",
        address: "789 Coastal Hwy",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=200",
        unread: 1
    }
];

interface PropertyPickerScreenProps {
    onSelect: (propertyId: number) => void;
    onClose: () => void;
}

export function PropertyPickerScreen({ onSelect, onClose }: PropertyPickerScreenProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProperties = PROPERTIES.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Communication</h1>
                <p className={styles.subtitle}>Select a property to view channels.</p>
            </header>

            <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} size={20} />
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className={styles.list}>
                {filteredProperties.map((property, index) => (
                    <motion.div
                        key={property.id}
                        className={styles.propertyCard}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(property.id)}
                    >
                        <div
                            className={styles.propertyImage}
                            style={{ backgroundImage: `url(${property.image})` }}
                        />
                        <div className={styles.propertyInfo}>
                            <div className={styles.propertyName}>{property.name}</div>
                            <div className={styles.propertyRole}>
                                <Home size={12} />
                                {property.role} • {property.address}
                            </div>
                        </div>
                        {property.unread > 0 && (
                            <div className={styles.unreadBadge}>{property.unread}</div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
