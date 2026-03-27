import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const chartContainerStyle = { 
    backgroundColor: '#fff', 
    padding: '20px', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
    minWidth: 0 
};

function AnalyticsCharts({ dynamicChartData, stockData, pieData }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
            
            {/* LINE CHART : Daily Stock Snapshot */}
            <div style={{ ...chartContainerStyle, flex: '1 1 100%' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Total Stock Value Over Time</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={dynamicChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `£${value}`} width={80} />
                        <Tooltip formatter={(value) => [`£${value.toFixed(2)}`, 'Total Value']} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} name="Stock Value (£)" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            {/* BAR CHART: Stock Levels */}
            <div style={{ ...chartContainerStyle, flex: '1 1 400px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Stock Levels by Item</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="quantity" fill="#8884d8" name="Quantity in Stock" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* PIE CHART: Category Distribution */}
            <div style={{ ...chartContainerStyle, flex: '1 1 300px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Items by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData} cx="50%" cy="50%" labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100} fill="#8884d8" dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}

export default AnalyticsCharts;