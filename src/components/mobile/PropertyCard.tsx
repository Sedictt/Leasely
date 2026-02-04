"use client";

import { motion } from "framer-motion";
import { Heart, Star, Bed, Bath, Square } from "lucide-react";
import styles from "./PropertyCard.module.css";
import React from 'react';

export interface Property {
    id: string;
    title: string;
    price: number;
    rating: number;
    address: string;
    beds: number;
    baths: number;
    sqft: number;
    image: string;
    isSuperhost?: boolean;
}

interface PropertyCardProps {
    property: Property;
    onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
    return (
        <motion.div
            className={styles.card}
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Image Section */}
            <div className={styles.imageContainer}>
                {/* Fallback image if source fails or mock div */}
                <div
                    className={styles.image}
                    style={{
                        backgroundImage: `url(${property.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />

                {property.isSuperhost && (
                    <div className={styles.badge}>
                        Superhost
                    </div>
                )}

                <button className={styles.favoriteButton}>
                    <Heart size={18} />
                </button>
            </div>

            {/* Content Section */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.price}>
                        ${property.price.toLocaleString()}
                        <span className={styles.period}>/mo</span>
                    </div>
                    <div className={styles.rating}>
                        <Star size={14} className={styles.starIcon} />
                        <span>{property.rating}</span>
                    </div>
                </div>

                <div className={styles.address}>
                    {property.address}
                </div>

                <div className={styles.features}>
                    <div className={styles.feature}>
                        <Bed size={16} />
                        <span>{property.beds} Bed</span>
                    </div>
                    <div className={styles.feature}>
                        <Bath size={16} />
                        <span>{property.baths} Bath</span>
                    </div>
                    <div className={styles.feature}>
                        <Square size={16} />
                        <span>{property.sqft} sqft</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
