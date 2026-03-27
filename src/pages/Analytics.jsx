import { useState, useEffect } from 'react';
import api from '../api/axios';

import KpiCard from '../components/KpiCard';
import AnalyticsCharts from '../components/AnalyticsCharts';

const Analytics = () => {
  const [items, setItems] = useState([]);
  const [auditCount, setAuditCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const itemsRes = await api.get('items/');
      setItems(itemsRes.data);

      const auditRes = await api.get('audit/');
      setAuditCount(auditRes.data.length);

      try {
        const usersRes = await api.get('users/'); 
        setUsersCount(usersRes.data.length);
      } catch (userErr) {
        console.warn("Could not fetch users list. Endpoint might be protected or named differently.");
        setUsersCount("N/A"); 
      }

      try {
        const historyRes = await api.get('snapshots/');
        setHistoryData(historyRes.data);
      } catch (historyErr) {
        console.error("Failed to fetch history data:", historyErr);
      }

      try {
        const ordersRes = await api.get('orders/');
        setOrdersData(ordersRes.data);
      } catch (ordersErr) {
        console.warn("Could not fetch orders. Endpoint might be protected or named differently.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
      setError("Failed to load analytics data.");
      setLoading(false);
    }
  };

  // --- DATA PROCESSING FOR CHARTS & KPIS ---
  const totalUniqueItems = items.length;
  const totalStockQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalOrders = ordersData.length;

  const totalStockValue = items.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    return sum + (item.quantity * itemPrice);
  }, 0);
  
  const formattedStockValue = `£${totalStockValue.toFixed(2)}`;

  const stockData = items.map(item => ({
    name: item.name,
    quantity: item.quantity
  }));

  const categoryCount = items.reduce((acc, item) => {
    const catName = item.category_name || `Category ${item.category}`; 
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  const dynamicChartData = historyData.map(snap => {
    const dateObj = new Date(snap.date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
    
    return {
      date: formattedDate,
      value: parseFloat(snap.total_value) || 0
    };
  });

  if (loading) return <div style={{ padding: '20px' }}>Loading analytics...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventory Analytics</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Real-time data visualization and system metrics.</p>

      {/* --- KPI SUMMARY CARDS --- */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <KpiCard title="Total Users" value={usersCount} color="#0088FE" />
        <KpiCard title="Unique Items" value={totalUniqueItems} color="#00C49F" />
        <KpiCard title="Total Stock Quantity" value={totalStockQuantity} color="#FFBB28" />
        <KpiCard title="Total Stock Value" value={formattedStockValue} color="#8884d8" />
        <KpiCard title="Total Orders" value={totalOrders} color="#82ca9d" />
        <KpiCard title="Total Actions Logged" value={auditCount} color="#FF8042" />
      </div>

      {/* --- CHARTS SECTION --- */}
      <AnalyticsCharts 
        dynamicChartData={dynamicChartData} 
        stockData={stockData} 
        pieData={pieData} 
      />

    </div>
  );
};

export default Analytics;