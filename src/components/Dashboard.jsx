import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Dashboard() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 1. NEW: State to hold our form inputs
    const [newItem, setNewItem] = useState({
        name: '',
        sku: '',
        quantity: 0,
        description: ''
    });

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get('items/');
            setItems(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch items. Are you logged in?');
        }
    };

    // 2. NEW: The function that sends the new item to Django
    const handleAddItem = async (e) => {
        e.preventDefault(); // Stop the page from refreshing
        try {
            // Send the POST request (our interceptor attaches the token automatically!)
            const response = await api.post('items/', newItem);
            
            // Add the new item to our screen instantly without refreshing
            setItems([...items, response.data]);
            
            // Clear the form back to blank
            setNewItem({ name: '', sku: '', quantity: 0, description: '' });
        } catch (err) {
            console.error(err);
            setError('Failed to add item. Check your inputs.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Inventory Dashboard</h2>
                <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Log Out
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                <h3>Add New Item</h3>
                <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={newItem.name} 
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                        required 
                    />
                    <input 
                        type="text" 
                        placeholder="SKU" 
                        value={newItem.sku} 
                        onChange={(e) => setNewItem({...newItem, sku: e.target.value})} 
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="Quantity" 
                        value={newItem.quantity} 
                        onChange={(e) => setNewItem({...newItem, quantity: e.target.value})} 
                        required 
                        min="0"
                    />
                    <input 
                        type="text" 
                        placeholder="Description" 
                        value={newItem.description} 
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})} 
                    />
                    <button type="submit" style={{ padding: '5px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                        Add Item
                    </button>
                </form>
            </div>
            
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