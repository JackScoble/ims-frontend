import React from 'react';

const cancelBtnStyle = { padding: '10px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const deleteBtnStyle = { padding: '10px 20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

function DeleteConfirmModal({ isOpen, item, onClose, onConfirm }) {
    if (!isOpen || !item) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#ff4d4d' }}>Delete Item?</h2>
                    <p>Are you sure you want to delete <strong>{item.name}</strong>? This action cannot be undone.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                        <button onClick={onClose} style={cancelBtnStyle}>No, Keep it</button>
                        <button onClick={() => { onConfirm(item.id); onClose(); }} style={deleteBtnStyle}>Yes, Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;