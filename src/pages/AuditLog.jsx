import { useState, useEffect } from 'react';
import api from '../api/axios';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('audit/');
      setLogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError("Failed to load system logs. Please try again.");
      setLoading(false);
    }
  };

  const processedLogs = logs.filter(log => {
    // 1. Search Logic (checks user, item name, and description)
    const matchesSearch = (
      log.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.object_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // 2. Filter Logic (checks action type)
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    
    return matchesSearch && matchesAction;
  }).sort((a, b) => {
    // 3. Sort Logic (compares timestamps)
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  if (loading) return <div style={{ padding: '20px' }}>Loading system logs...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>System Audit Logs</h2>
      <p>Tracking all inventory and user modifications.</p>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search logs..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <select 
          value={filterAction} 
          onChange={(e) => setFilterAction(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="ALL">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
        </select>

        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Table Section */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px' }}>Date & Time</th>
            <th style={{ padding: '10px' }}>User</th>
            <th style={{ padding: '10px' }}>Action</th>
            <th style={{ padding: '10px' }}>Item/Category</th>
            <th style={{ padding: '10px' }}>Changes (Old → New)</th>
          </tr>
        </thead>
        <tbody>
          {processedLogs.length > 0 ? (
            processedLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={{ padding: '10px' }}>{log.username}</td>
                <td style={{ padding: '10px' }}><strong>{log.action}</strong></td>
                <td style={{ padding: '10px' }}>{log.object_type}: {log.object_name}</td>
                <td style={{ padding: '10px', color: '#555' }}>{log.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                No logs match your current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLog;