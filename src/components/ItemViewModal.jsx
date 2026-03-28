import React from 'react';

function ItemViewModal({ isOpen, item, isLoadingHistory, historyError, auditHistory, onClose }) {
    if (!isOpen || !item) return null;

    const DetailRow = ({ label, value }) => (
        <div className="flex flex-col mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-gray-900/80 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 transition-colors">
            
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden transition-colors border dark:border-gray-700">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 p-5 bg-gray-50/50 dark:bg-gray-800/50 transition-colors">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Item Details</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Viewing information and history for {item.sku}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full p-2 shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Two-Column Layout Body */}
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    
                    {/* LEFT COLUMN: Item Details */}
                    <div className="w-full md:w-1/2 p-6 border-r border-gray-100 dark:border-gray-700 overflow-y-auto transition-colors">
                        
                        {/* Image Header */}
                        <div className="flex items-start gap-5 mb-6">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm" />
                            ) : (
                                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm transition-colors">
                                    <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">No Image</span>
                                </div>
                            )}
                            <div className="pt-2">
                                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{item.name}</h4>
                                <span className="inline-block mt-2 px-2.5 py-1 bg-[#8884d8]/10 text-[#8884d8] dark:text-[#9b97e5] text-xs font-semibold rounded-md border border-[#8884d8]/20">
                                    {item.category_name || 'Uncategorized'}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 transition-colors">
                            <DetailRow label="SKU" value={item.sku} />
                            <DetailRow label="Price" value={`£${Number(item.price).toFixed(2)}`} />
                            
                            {/* Highlighting Quantity if it's low */}
                            <div className="flex flex-col mb-3">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Quantity</span>
                                <span className={`text-sm font-bold ${item.quantity <= item.low_stock_threshold ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                    {item.quantity} {item.quantity <= item.low_stock_threshold && '(Low Stock)'}
                                </span>
                            </div>
                            
                            <DetailRow label="Alert Threshold" value={item.low_stock_threshold} />
                            <DetailRow label="Added By" value={item.owner_email || '—'} />
                        </div>

                        <div className="mt-5">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">Description</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 leading-relaxed transition-colors">
                                {item.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Audit History */}
                    <div className="w-full md:w-1/2 flex flex-col bg-gray-50/30 dark:bg-gray-900/30 overflow-hidden transition-colors">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#8884d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Audit History
                            </h4>
                        </div>
                        
                        {/* Scrollable History List */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {isLoadingHistory ? (
                                <div className="flex justify-center items-center h-full text-gray-400 dark:text-gray-500 text-sm">Loading history...</div>
                            ) : historyError ? (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm border border-red-100 dark:border-red-800/50">{historyError}</div>
                            ) : auditHistory.length === 0 ? (
                                <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center transition-colors">
                                    No audit history found for this item yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {auditHistory.map((entry, idx) => (
                                        <div key={entry.id || idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm relative pl-4 border-l-4 border-l-[#8884d8] transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{entry.action || 'System Change'}</p>
                                                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full transition-colors">
                                                    {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{entry.description || 'No details provided.'}</p>
                                            
                                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 dark:border-gray-700 transition-colors">
                                                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">By: <span className="text-gray-800 dark:text-gray-200">{entry.username || 'System'}</span></p>
                                                {entry.fields_changed_count > 0 && (
                                                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-semibold transition-colors">
                                                        {entry.fields_changed_count} field(s) edited
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end transition-colors">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm">
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemViewModal;