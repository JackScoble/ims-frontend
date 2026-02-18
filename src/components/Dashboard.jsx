import { useState, useEffect } from 'react';
import api from '../api/axios';

function Dashboard() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            // Because of our interceptor, this request automatically has the token!
            const response = await api.get('items/');
            setItems(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch items. Are you logged in?');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Inventory Dashboard</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div style={{ display: 'grid', gap: '15px' }}>
                {items.length === 0 ? <p>No items found.</p> : null}
                
                {items.map(item => (
                    <div key={item.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                        <h3>{item.name} (SKU: {item.sku})</h3>
                        <p><strong>Category:</strong> {item.category_name || 'None'}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Description:</strong> {item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;