import { useState, useEffect } from 'react';
import api from '../api/axios';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // This hits the router.register(r'audit', StockAuditViewSet) from your urls.py
      const response = await api.get('audit/');
      setLogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError("Failed to load system logs. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading system logs...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>System Audit Logs</h2>
      <p>Tracking all inventory and user modifications.</p>

      {/* Basic table to display the data */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
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
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td style={{ padding: '10px' }}>{log.username}</td>
                <td style={{ padding: '10px' }}>
                  <strong>{log.action}</strong>
                </td>
                <td style={{ padding: '10px' }}>
                  {log.object_type}: {log.object_name}
                </td>
                <td style={{ padding: '10px', color: '#555' }}>
                  {log.description}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                No audit logs found. Try updating an item to generate a log!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLog;