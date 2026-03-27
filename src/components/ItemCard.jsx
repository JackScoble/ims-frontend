import React from 'react';

const deleteBtnStyle = { padding: '10px 20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

function ItemCard({ item, currentUserEmail, onView, onEdit, onDelete }) {
    const threshold = item.low_stock_threshold || 0;
    const isLowStock = item.quantity <= threshold;

    return (
        <div style={{ 
            border: isLowStock ? '1px solid #d73a49' : '1px solid #ccc',
            backgroundColor: isLowStock ? '#ffeef0' : '#fff',
            padding: '15px', borderRadius: '5px' 
        }}>
            
            <button onClick={() => onView(item)} style={{ marginRight: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>View</button>
            <button onClick={() => onEdit(item)} style={{ marginRight: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
            {item.owner_email === currentUserEmail && (
                <button onClick={() => onDelete(item)} style={deleteBtnStyle}>Delete</button>
            )}

            {item.image && (
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px', marginTop: '10px' }} />
            )}
            
            <h3 style={{ marginTop: '10px' }}>{item.name} (SKU: {item.sku})</h3>
            <p><strong>Category:</strong> {item.category_name || 'None'}</p>
            <p><strong>Price:</strong> £{item.price}</p>

            <p style={{ color: isLowStock ? '#d73a49' : '#333', fontWeight: isLowStock ? 'bold' : 'normal', fontSize: isLowStock ? '16px' : '14px' }}>
                <strong>Quantity:</strong> {item.quantity} 
                {isLowStock && <span style={{ marginLeft: '10px' }}>⚠️ Low Stock Warning! (Threshold: {threshold})</span>}
            </p>
            
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Added By:</strong> {item.owner_email || 'No email provided'}</p>
        </div>
    );
}

export default ItemCard;