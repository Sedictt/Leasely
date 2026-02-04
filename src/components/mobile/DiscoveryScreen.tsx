"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import styles from "./DiscoveryScreen.module.css";
import { PropertyCard, Property } from "./PropertyCard";

// Mock Data matches the vision "Smart Property Search"
const MOCK_PROPERTIES: Property[] = [
    {
        id: "1",
        title: "Modern Loft in Downtown",
        price: 2450,
        rating: 4.8,
        address: "123 Innovation Dr, Tech City",
        beds: 2,
        baths: 2,
        sqft: 1100,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
        isSuperhost: true
    },
    {
        id: "2",
        title: "Cozy Studio near Park",
        price: 1800,
        rating: 4.5,
        address: "45 Green Way, Nature Valley",
        beds: 1,
        baths: 1,
        sqft: 650,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "3",
        title: "Luxury Penthouse Suite",
        price: 5200,
        rating: 4.9,
        address: "1 Skyline Blvd, Metropolis",
        beds: 3,
        baths: 3,
        sqft: 2200,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        isSuperhost: true
    },
    {
        id: "4",
        title: "Riverview Apartment",
        price: 2100,
        rating: 4.7,
        address: "88 River Rd, Waterfront",
        beds: 2,
        baths: 1,
        sqft: 950,
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
    }
];

const FILTERS = ["All", "Apartments", "Houses", "Studios", "Lofts"];

export function DiscoveryScreen() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.welcomeText}>Welcome back, Alex</div>
                <h1 className={styles.title}>Find your perfect<br />place to live</h1>
            </header>

            {/* Search Bar */}
            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search by location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className={styles.filterButton}>
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            {/* Filter Chips */}
            <div className={styles.filtersRow}>
                {FILTERS.map((filter) => (
                    <button
                        key={filter}
                        className={`${styles.filterChip} ${activeFilter === filter ? styles.active : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Property Grid */}
            <div className={styles.grid}>
                {MOCK_PROPERTIES.map((property, index) => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        onClick={() => console.log("Clicked property", property.id)}
                    />
                ))}
            </div>
        </div>
    );
}
