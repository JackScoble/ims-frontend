import React from 'react';

function KpiCard({ title, value, color }) {
    return (
        <div style={{
            flex: '1 1 200px', 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
            textAlign: 'center', 
            minWidth: 0
        }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>{title}</h4>
            <h1 style={{ margin: 0, color: color, fontSize: '2.5rem' }}>{value}</h1>
        </div>
    );
}

export default KpiCard;