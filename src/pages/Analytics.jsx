import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Analytics = () => {
  const [items, setItems] = useState([]);
  const [auditCount, setAuditCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Items
      const itemsRes = await api.get('items/');
      setItems(itemsRes.data);

      // 2. Fetch Audit Logs (just to get the total count)
      const auditRes = await api.get('audit/');
      setAuditCount(auditRes.data.length);

      // 3. Fetch Users safely (in case your endpoint is named differently)
      try {
        const usersRes = await api.get('users/'); 
        setUsersCount(usersRes.data.length);
      } catch (userErr) {
        console.warn("Could not fetch users list. Endpoint might be protected or named differently.");
        setUsersCount("N/A"); // Fallback if the user endpoint isn't accessible
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
      setError("Failed to load analytics data.");
      setLoading(false);
    }
  };

  // --- DATA PROCESSING FOR CHARTS & KPIS ---

  // KPI Calculations
  const totalUniqueItems = items.length;
  // This adds up the 'quantity' of every single item in the array
  const totalStockQuantity = items.reduce((sum, item) => sum + item.quantity, 0); 

  // Format data for the Bar Chart
  const stockData = items.map(item => ({
    name: item.name,
    quantity: item.quantity
  }));

  // Format data for the Pie Chart
  const categoryCount = items.reduce((acc, item) => {
    const catName = item.category_name || `Category ${item.category}`; 
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // --- STYLING HELPERS ---
  const cardStyle = {
    flex: '1 1 200px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    minWidth: 0
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading analytics...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventory Analytics</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Real-time data visualization and system metrics.</p>

      {/* --- NEW: KPI SUMMARY CARDS --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Total Users</h4>
          <h1 style={{ margin: 0, color: '#0088FE', fontSize: '2.5rem' }}>{usersCount}</h1>
        </div>
        
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Unique Items</h4>
          <h1 style={{ margin: 0, color: '#00C49F', fontSize: '2.5rem' }}>{totalUniqueItems}</h1>
        </div>
        
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Total Stock Quantity</h4>
          <h1 style={{ margin: 0, color: '#FFBB28', fontSize: '2.5rem' }}>{totalStockQuantity}</h1>
        </div>
        
        <div style={cardStyle}>
          <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Total Actions Logged</h4>
          <h1 style={{ margin: 0, color: '#FF8042', fontSize: '2.5rem' }}>{auditCount}</h1>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        
        {/* BAR CHART: Stock Levels */}
        <div style={{ flex: '1 1 400px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', minWidth: 0 }}>
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
        <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', minWidth: 0 }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Items by Category</h3>
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