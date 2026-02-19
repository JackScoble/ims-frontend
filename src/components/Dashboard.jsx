import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const modalInputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' };
const successBtnStyle = { padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const cancelBtnStyle = { padding: '10px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const deleteBtnStyle = { padding: '10px 20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

function Dashboard() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalType, setModalType] = useState(null); // 'form' or 'delete'
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingId, setEditingId] = useState(null);
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

    // Open Modal for Adding
    const openAddModal = () => {
        setEditingId(null);
        setNewItem({ name: '', sku: '', category: '', quantity: 0, description: '', image: null });
        setModalType('form');
    };

    // Open Modal for Editing
    const openEditModal = (item) => {
        setEditingId(item.id);
        setNewItem({
            name: item.name,
            sku: item.sku,
            category: item.category || '',
            quantity: item.quantity,
            description: item.description,
            image: null 
        });
        setModalType('form');
    };

    // Open Modal for Delete Confirmation
    const openDeleteModal = (item) => {
        setItemToDelete(item);
        setModalType('delete');
    };

    // Close any modal
    const closeModal = () => {
        setModalType(null);
        setEditingId(null);
        setItemToDelete(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newItem.name);
            formData.append('sku', newItem.sku);
            formData.append('quantity', newItem.quantity);
            formData.append('description', newItem.description);
            if (newItem.category) formData.append('category', newItem.category);
            if (newItem.image) formData.append('image', newItem.image);

            if (editingId) {
                // PATCH updates only the fields we send
                const response = await api.patch(`items/${editingId}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setItems(items.map(item => item.id === editingId ? response.data : item));
                setEditingId(null);
            } else {
                const response = await api.post('items/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setItems([...items, response.data]);
            }

            setNewItem({ name: '', sku: '', category: '', quantity: 0, description: '', image: null });
            document.getElementById('image-upload').value = ''; 

        } catch (err) {
            console.error("Submit failed:", err.response?.data);
            setError("Failed to save item.");
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
                <button onClick={openAddModal} style={{ ...successBtnStyle, marginBottom: '20px' }}>+ Add New Item</button>
            </div>
            
            <div style={{ display: 'grid', gap: '15px' }}>
                {items.length === 0 ? <p>No items found.</p> : null}
                
                {items.map(item => (
                    <div key={item.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                        
                        <button onClick={() => openEditModal(item)} style={{ marginRight: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => openDeleteModal(item)} style={deleteBtnStyle}>Delete</button>

                        {/* Display the image if it exists */}
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

            {/* MODAL OVERLAY */}
            {modalType && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                        
                        {/* CONTEXT 1: ADD / EDIT FORM */}
                        {modalType === 'form' && (
                            <>
                                <h3>{editingId ? 'Edit Item' : 'Add New Inventory'}</h3>
                                <form onSubmit={(e) => { handleSubmit(e); closeModal(); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <input type="text" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required style={modalInputStyle} />
                                    <input type="text" placeholder="SKU" value={newItem.sku} onChange={(e) => setNewItem({...newItem, sku: e.target.value})} required style={modalInputStyle} />
                                    <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={(e) => setNewItem({...newItem, quantity: e.target.value})} required style={modalInputStyle} />
                                    <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} style={modalInputStyle} />
                                    <select value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} style={modalInputStyle}>
                                        <option value="">Select a Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    <input id="image-upload" type="file" accept="image/*" onChange={(e) => setNewItem({...newItem, image: e.target.files[0]})} />
                                    
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                        <button type="button" onClick={closeModal} style={cancelBtnStyle}>Cancel</button>
                                        <button type="submit" style={successBtnStyle}>{editingId ? 'Save Changes' : 'Add Item'}</button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* CONTEXT 2: DELETE CONFIRMATION */}
                        {modalType === 'delete' && (
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{ color: '#ff4d4d' }}>Delete Item?</h2>
                                <p>Are you sure you want to delete <strong>{itemToDelete?.name}</strong>? This action cannot be undone.</p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                                    <button onClick={closeModal} style={cancelBtnStyle}>No, Keep it</button>
                                    <button onClick={() => { handleDelete(itemToDelete.id); closeModal(); }} style={deleteBtnStyle}>Yes, Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;