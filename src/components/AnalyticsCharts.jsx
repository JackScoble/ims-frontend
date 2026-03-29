/**
 * @file analyticscharts.jsx
 * @description A data visualization component that uses Recharts to render
 * Line, Bar, and Pie charts representing inventory metrics.
 */

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const chartCardClass = "bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-0 transition-colors";
const titleClass = "text-lg font-bold text-gray-800 dark:text-white mb-6 text-center tracking-tight transition-colors";

/**
 * AnalyticsCharts Component
 * Takes processed data arrays and maps them to interactive Recharts graphics.
 * Includes a mounting check to prevent hydration mismatch errors.
 * * @param {Object} props - The component props.
 * @param {Array<Object>} props.dynamicChartData - Time-series data for the stock value Line chart.
 * @param {Array<Object>} props.categoryStockData - Aggregated quantity data for the category Bar chart.
 * @param {Array<Object>} props.pieData - Aggregated count data for the category Pie chart.
 * @returns {JSX.Element} The rendered charts grid.
 */
function AnalyticsCharts({ dynamicChartData, categoryStockData, pieData }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If no data or not mounted, don't render the charts.
    if (!isMounted || !dynamicChartData?.length || !categoryStockData?.length) {
        return (
            <div className="flex items-center justify-center h-64 w-full text-gray-400 dark:text-gray-500 font-medium transition-colors">
                Gathering analytics data...
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. LINE CHART */}
            <div className={`${chartCardClass} lg:col-span-2`}>
                <h3 className={titleClass}>Total Stock Value Over Time</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dynamicChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis tickFormatter={(value) => `£${value}`} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} width={80} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                                labelStyle={{ color: '#374151', fontWeight: '600' }} 
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={4} dot={{ r: 4 }} name="Stock Value (£)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* 2. BAR CHART */}
            <div className={chartCardClass}>
                <h3 className={titleClass}>Stock Quantity by Category</h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryStockData}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} dy={10} />
                             <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                             <Tooltip 
                                cursor={{fill: 'rgba(156, 163, 175, 0.1)'}} 
                                contentStyle={{ borderRadius: '12px', border: 'none' }} 
                                labelStyle={{ color: '#374151', fontWeight: '600' }} 
                             />
                             <Bar dataKey="quantity" radius={[6, 6, 0, 0]} barSize={50}>
                                {categoryStockData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                             </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. PIE CHART */}
            <div className={chartCardClass}>
                <h3 className={titleClass}>Item Variety by Category</h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                             <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                             >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                             </Pie>
                             <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none' }} 
                                itemStyle={{ color: '#374151' }} 
                             />
                             <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsCharts;