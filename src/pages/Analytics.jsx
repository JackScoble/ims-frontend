/**
 * @file analytics.jsx
 * @description The main analytics dashboard view. Fetches various system metrics
 * (items, users, audits, orders) and processes them into high-level KPIs and
 * chart-ready data structures for visualization.
 */

import { useState, useEffect } from 'react';
import api from '../api/axios';

import KpiCard from '../components/KpiCard';
import AnalyticsCharts from '../components/AnalyticsCharts';

/**
 * Analytics Component
 * Acts as the data container and layout engine for the analytics page.
 * @returns {JSX.Element} The rendered analytics dashboard view.
 */
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

  // Sum up quantities for each category
  const categoryStockMap = items.reduce((acc, item) => {
      const catName = item.category_name || `Category ${item.category}`;
      acc[catName] = (acc[catName] || 0) + item.quantity;
      return acc;
  }, {});

  const categoryStockData = Object.keys(categoryStockMap).map(key => ({
      name: key,
      quantity: categoryStockMap[key]
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

  // --- UI RENDERING ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] transition-colors">
        <svg className="animate-spin h-8 w-8 text-[#8884d8] dark:text-[#9b97e5] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse transition-colors">Gathering your analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto mt-2 transition-colors">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-medium rounded-lg border border-red-200 dark:border-red-800/50 flex items-center gap-3 max-w-2xl transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto transition-colors">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 transition-colors">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight transition-colors">Inventory Analytics</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Real-time data visualization and system metrics.</p>
        </div>
      </div>

      {/* KPI Grid - Responsive Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title="Total Users" value={usersCount} color="#0088FE" />
        <KpiCard title="Unique Items" value={totalUniqueItems} color="#00C49F" />
        <KpiCard title="Total Stock Qty" value={totalStockQuantity} color="#FFBB28" />
        <KpiCard title="Total Stock Value" value={formattedStockValue} color="#8884d8" />
        <KpiCard title="Total Orders" value={totalOrders} color="#82ca9d" />
        <KpiCard title="Actions Logged" value={auditCount} color="#FF8042" />
      </div>

      {/* Charts Section */}
      <div>
        <AnalyticsCharts 
          dynamicChartData={dynamicChartData} 
          categoryStockData={categoryStockData} 
          pieData={pieData} 
        />
      </div>

    </div>
  );
};

export default Analytics;