import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Dashboard() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [newItem, setNewItem] = useState({
        name: '',
        sku: '',
        category: '',
        quantity: 0,
        description: '',
        image: null
    });

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    useEffect(() => {
        fetchInventory();
        fetchCategories();
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

    const fetchCategories = async () => {
        try {
            const response = await api.get('categories/');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault(); 
        try {
            const formData = new FormData();
            
            formData.append('name', newItem.name);
            formData.append('sku', newItem.sku);
            formData.append('quantity', newItem.quantity);
            formData.append('description', newItem.description);
            
            if (newItem.category) {
                formData.append('category', newItem.category);
            }

            if (newItem.image) {
                formData.append('image', newItem.image);
            }

            const response = await api.post('items/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            setItems([...items, response.data]);
            setNewItem({ name: '', sku: '', quantity: 0, description: '', category: null, image: null });
            
            document.getElementById('image-upload').value = ''; 

        } catch (err) {
            console.error("Backend Error Data:", err.response?.data); 
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
                    <select 
                        value={newItem.category} 
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
                    >
                        <option value="">Select a Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <input 
                        id="image-upload"
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setNewItem({...newItem, image: e.target.files[0]})} 
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
                        
                        {/* Display the image if it exists! */}
                        {item.image && (
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }} 
                            />
                        )}
                        
                        <h3 style={{ marginTop: 0 }}>{item.name} (SKU: {item.sku})</h3>
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