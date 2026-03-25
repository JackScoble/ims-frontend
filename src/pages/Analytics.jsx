import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Analytics = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('items/');
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
      setError("Failed to load analytics data.");
      setLoading(false);
    }
  };

  // --- DATA PROCESSING FOR CHARTS ---

  // 1. Format data for the Bar Chart (Stock Levels)
  const stockData = items.map(item => ({
    name: item.name,
    quantity: item.quantity
  }));

  // 2. Format data for the Pie Chart (Items per Category)
  const categoryCount = items.reduce((acc, item) => {
    const catName = item.category_name || `Category ${item.category}`; 
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  // Colors for the Pie Chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) return <div style={{ padding: '20px' }}>Loading analytics...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventory Analytics</h2>
      <p>Real-time data visualization of your stock.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '30px' }}>
        
        {/* BAR CHART: Stock Levels */}
        <div style={{ flex: '1 1 400px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', minWidth: 0 }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Stock Levels by Item</h3>
          {/* We removed the extra div and moved height={300} directly here */}
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
        <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', minWidth: 0 }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Items by Category</h3>
          {/* We removed the extra div and moved height={300} directly here */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
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
    </div>
  );
};

export default Analytics;