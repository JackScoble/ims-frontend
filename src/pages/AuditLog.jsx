import { useState, useEffect } from 'react';
import api from '../api/axios';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState('-timestamp');
    const [filterAction, setFilterAction] = useState('ALL');
    const [filterUser, setFilterUser] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await api.get('audit/');
            setLogs(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load system logs.");
            setLoading(false);
        }
    };

    const onClearFilters = () => {
        setSearchTerm('');
        setSortConfig('-timestamp');
        setFilterAction('ALL');
        setFilterUser('');
        setDateRange({ start: '', end: '' });
    };

    const uniqueUsers = Array.from(new Set(logs.map(log => log.username))).filter(Boolean);

    const inputStyle = "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-md focus:ring-[#8884d8] focus:border-[#8884d8] dark:focus:border-[#9b97e5] block p-2.5 transition-colors shadow-sm";

    const getActionStyle = (action) => {
        switch (action) {
            case 'CREATE': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
            case 'UPDATE': return 'bg-[#8884d8]/10 text-[#8884d8] dark:text-[#9b97e5] border-[#8884d8]/20 dark:border-[#8884d8]/30';
            case 'DELETE': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    const processedLogs = logs.filter(log => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch = log.object_name?.toLowerCase().includes(lowerSearch) || 
                              log.description?.toLowerCase().includes(lowerSearch);
        const matchesAction = filterAction === 'ALL' || log.action === filterAction;
        const matchesUser = filterUser === '' || log.username === filterUser;
        
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        const matchesStart = !dateRange.start || logDate >= dateRange.start;
        const matchesEnd = !dateRange.end || logDate <= dateRange.end;

        return matchesSearch && matchesAction && matchesUser && matchesStart && matchesEnd;
    }).sort((a, b) => {
        const timeA = new Date(a.timestamp);
        const timeB = new Date(b.timestamp);
        return sortConfig === '-timestamp' ? timeB - timeA : timeA - timeB;
    });

    if (loading) return (
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto mt-2 transition-colors">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">System Audit Log</h2>
          <div className="p-10 text-center text-gray-500 dark:text-gray-400 font-medium bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
              Loading system logs...
          </div>
      </div>
  );

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto transition-colors">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight transition-colors">System Audit Log</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Traceability for all inventory and user modifications.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-4 transition-colors">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder="Search by Item Name or Description..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className={`${inputStyle} w-full pl-4`}
                        />
                    </div>
                    
                    <select 
                        value={sortConfig} 
                        onChange={(e) => setSortConfig(e.target.value)}
                        className={`${inputStyle} md:w-64`}
                    >
                        <option value="-timestamp">Newest First</option>
                        <option value="timestamp">Oldest First</option>
                    </select>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-md border border-gray-200 dark:border-gray-600 shadow-sm transition-colors">
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium px-2">Date:</span>
                        <input 
                            type="date" 
                            value={dateRange.start} 
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})} 
                            className="p-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 rounded focus:ring-[#8884d8] focus:border-[#8884d8] dark:focus:border-[#9b97e5] transition-colors" 
                        />
                        <span className="text-gray-400 dark:text-gray-500">-</span>
                        <input 
                            type="date" 
                            value={dateRange.end} 
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})} 
                            className="p-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 rounded focus:ring-[#8884d8] focus:border-[#8884d8] dark:focus:border-[#9b97e5] transition-colors" 
                        />
                    </div>

                    <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className={inputStyle}>
                        <option value="ALL">All Actions</option>
                        <option value="CREATE">Create</option>
                        <option value="UPDATE">Update</option>
                        <option value="DELETE">Delete</option>
                    </select>

                    <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)} className={`${inputStyle} max-w-[200px] truncate`}>
                        <option value="">All Users</option>
                        {uniqueUsers.map(user => <option key={user} value={user}>{user}</option>)}
                    </select>
                    
                    <button 
                        onClick={onClearFilters}
                        className="ml-auto px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-md transition-colors border border-gray-300 dark:border-gray-600 whitespace-nowrap"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-10 transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Entity</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Action</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {processedLogs.length > 0 ? (
                                processedLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                                        {/* Entity Column */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">{log.object_type}</span>
                                                <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{log.object_name}</span>
                                            </div>
                                        </td>
                                        {/* Action Column */}
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getActionStyle(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        {/* Details Column */}
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 italic line-clamp-2 hover:line-clamp-none transition-all">
                                            {log.description}
                                        </td>
                                        {/* User Column */}
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {log.username}
                                        </td>
                                        {/* Time Column */}
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400 dark:text-gray-500 italic">No logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLog;