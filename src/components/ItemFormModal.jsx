import React from 'react';

const modalInputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' };
const successBtnStyle = { padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const cancelBtnStyle = { padding: '10px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' };

function ItemFormModal({ isOpen, isEditing, newItem, setNewItem, categories, onSubmit, onClose }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3>{isEditing ? 'Edit Item' : 'Add New Inventory'}</h3>
                <form onSubmit={(e) => { onSubmit(e); onClose(); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required style={modalInputStyle} />
                    <input type="text" placeholder="SKU" value={newItem.sku} onChange={(e) => setNewItem({...newItem, sku: e.target.value})} required style={modalInputStyle} />
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Current Qty</label>
                            <input type="number" placeholder="Quantity" value={newItem.quantity} onKeyDown={(e) => ["e", "E", ".", ","].includes(e.key) && e.preventDefault()} onChange={(e) => setNewItem({...newItem, quantity: e.target.value.replace(/\D/g, '')})} required style={{...modalInputStyle, width: '100%', boxSizing: 'border-box'}} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Alert Threshold</label>
                            <input type="number" placeholder="Alert Threshold" value={newItem.low_stock_threshold} onKeyDown={(e) => ["e", "E", ".", ","].includes(e.key) && e.preventDefault()} onChange={(e) => setNewItem({...newItem, low_stock_threshold: e.target.value.replace(/\D/g, '')})} required style={{...modalInputStyle, width: '100%', boxSizing: 'border-box'}} />
                        </div>
                    </div>

                    <input 
                        type="number" step="0.01" placeholder="Price (£)" value={newItem.price} min="0.01" required 
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) setNewItem({...newItem, price: val});
                        }}
                        style={modalInputStyle} 
                    />

                    <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} style={modalInputStyle} />
                    <select value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} style={modalInputStyle}>
                        <option value="">Select a Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <input id="image-upload" type="file" accept="image/*" onChange={(e) => setNewItem({...newItem, image: e.target.files[0]})} />
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
                        <button type="submit" style={successBtnStyle}>{isEditing ? 'Save Changes' : 'Add Item'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ItemFormModal;