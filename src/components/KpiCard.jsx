/**
 * @file kpicard.jsx
 * @description A reusable card component used to display a single Key Performance Indicator (KPI).
 */

import React from 'react';

/**
 * KpiCard Component
 * Renders a styled metric card with a title, numerical value, and thematic color accent.
 * * @param {Object} props - The component props.
 * @param {string} props.title - The label/title for the KPI.
 * @param {number|string} props.value - The numerical value or string to display.
 * @param {string} props.color - The CSS color code used for styling accents.
 * @returns {JSX.Element} The rendered KPI card.
 */
function KpiCard({ title, value, color }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 group">
            
            {/* Title: Small, uppercase, and slightly muted */}
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-3 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors text-center">
                {title}
            </h4>
            
            {/* Value: Bold, high-contrast, and dynamic color */}
            <div 
                className="text-3xl font-extrabold tracking-tight sm:text-4xl transition-colors"
                style={{ color: color }}
            >
                {value}
            </div>

            {/* Subtle bottom accent bar that matches the KPI color */}
            <div 
                className="w-8 h-1 rounded-full mt-4 opacity-40 group-hover:w-12 transition-all"
                style={{ backgroundColor: color }}
            />
        </div>
    );
}

export default KpiCard;