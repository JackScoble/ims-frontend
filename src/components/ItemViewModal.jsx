import React from 'react';

const cancelBtnStyle = { padding: '10px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' };

function ItemViewModal({ isOpen, item, isLoadingHistory, historyError, auditHistory, onClose }) {
    if (!isOpen || !item) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h3>View Item</h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {item.image && (
                            <img src={item.image} alt={item.name} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                        )}
                        <div style={{ flex: 1, minWidth: '220px' }}>
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>SKU:</strong> {item.sku}</p>
                            <p><strong>Category:</strong> {item.category_name || 'None'}</p>
                            <p><strong>Price:</strong> £{item.price}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Alert Threshold:</strong> {item.low_stock_threshold}</p>
                            <p><strong>Description:</strong> {item.description || '—'}</p>
                            <p><strong>Added By:</strong> {item.owner_email || '—'}</p>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Audit History</h4>
                        {isLoadingHistory ? (
                            <p>Loading audit history…</p>
                        ) : historyError ? (
                            <p style={{ color: 'red' }}>{historyError}</p>
                        ) : auditHistory.length === 0 ? (
                            <p>No audit history found for this item.</p>
                        ) : (
                            <div style={{ maxHeight: '260px', overflowY: 'auto', paddingRight: '10px' }}>
                                {auditHistory.map((entry, idx) => (
                                    <div key={entry.id || idx} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        <p style={{ margin: '0 0 5px 0' }}>
                                            <strong>{entry.action || 'Change'}</strong> by {entry.username || 'Unknown'} 
                                            <span style={{ fontSize: '12px', color: '#666' }}> ({new Date(entry.timestamp).toLocaleString()})</span>
                                        </p>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{entry.description || 'No description'}</p>
                                        {entry.fields_changed_count > 0 && (
                                            <p style={{ margin: '0', fontSize: '12px', color: '#888' }}>
                                                Fields changed: {entry.fields_changed_count}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button onClick={onClose} style={cancelBtnStyle}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemViewModal;