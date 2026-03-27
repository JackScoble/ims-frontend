import React from 'react';

function DashboardFilterBar({
    searchTerm, setSearchTerm,
    sortConfig, setSortConfig,
    filterQty, setFilterQty,
    filterImage, setFilterImage,
    filterLowStock, setFilterLowStock,
    filterOwner, setFilterOwner,
    uniqueOwners,
    onClearFilters
}) {
    return (
        <div style={{ backgroundColor: '#f4f4f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <input 
                    type="text" placeholder="Search by Name or SKU..." value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <select 
                    value={sortConfig} onChange={(e) => setSortConfig(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="-created_at">Newest First</option>
                    <option value="created_at">Oldest First</option>
                    <option value="-updated_at">Recently Updated</option>
                    <option value="-quantity">Quantity: High to Low</option>
                    <option value="quantity">Quantity: Low to High</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <label>Qty:</label>
                    <input type="number" placeholder="Min" value={filterQty.min} onKeyDown={(e) => ["e", "E", ".", ","].includes(e.key) && e.preventDefault()} onChange={(e) => setFilterQty({...filterQty, min: e.target.value.replace(/\D/g, '')})} style={{ width: '60px', padding: '8px' }} min="0"/>
                    <span>-</span>
                    <input type="number" placeholder="Max" value={filterQty.max} onKeyDown={(e) => ["e", "E", ".", ","].includes(e.key) && e.preventDefault()} onChange={(e) => setFilterQty({...filterQty, max: e.target.value.replace(/\D/g, '')})} style={{ width: '60px', padding: '8px' }} min={filterQty.min || 0}/>
                </div>

                <select value={filterImage} onChange={(e) => setFilterImage(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                    <option value="">Images: All</option>
                    <option value="yes">Has Image</option>
                    <option value="no">No Image</option>
                </select>

                <select value={filterLowStock} onChange={(e) => setFilterLowStock(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                    <option value="">Low Stock: All</option>
                    <option value="yes">Low Stock Only</option>
                    <option value="no">Healthy Stock</option>
                </select>

                <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '180px' }}>
                    <option value="">All Owners</option>
                    {uniqueOwners.map(email => <option key={email} value={email}>{email}</option>)}
                </select>
                
                <button 
                    onClick={onClearFilters}
                    style={{ padding: '8px 15px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
}

export default DashboardFilterBar;