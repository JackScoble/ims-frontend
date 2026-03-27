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
    // Shared class for all inputs and selects to keep them uniform
    const inputStyle = "bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-[#8884d8] focus:border-[#8884d8] block p-2.5 transition-colors shadow-sm";

    return (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
            
            {/* Top Row: Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder="Search by Name or SKU..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className={`${inputStyle} w-full pl-4`}
                    />
                </div>
                
                <select 
                    value={sortConfig} 
                    onChange={(e) => setSortConfig(e.target.value)}
                    className={`${inputStyle} md:w-64`}
                >
                    <option value="-created_at">Newest First</option>
                    <option value="created_at">Oldest First</option>
                    <option value="-updated_at">Recently Updated</option>
                    <option value="-quantity">Quantity: High to Low</option>
                    <option value="quantity">Quantity: Low to High</option>
                </select>
            </div>

            {/* Bottom Row: Detailed Filters */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                
                {/* Quantity Range */}
                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-md border border-gray-200 shadow-sm">
                    <span className="text-sm text-gray-600 font-medium px-2">Qty:</span>
                    <input 
                        type="number" 
                        placeholder="Min" 
                        value={filterQty.min} 
                        onKeyDown={(e) => ["e", "E", ".", ","].includes(e.key) && e.preventDefault()} 
                        onChange={(e) => setFilterQty({...filterQty, min: e.target.value.replace(/\D/g, '')})} 
                        className="w-16 p-1 text-sm border-gray-300 rounded focus:ring-[#8884d8] focus:border-[#8884d8] text-center" 
                        min="0"
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                        type="number" 
                        placeholder="Max" 
                        value={filterQty.max} 
                        onKeyDown={(e) => ["e", "E", ".", ","].includes(e.key) && e.preventDefault()} 
                        onChange={(e) => setFilterQty({...filterQty, max: e.target.value.replace(/\D/g, '')})} 
                        className="w-16 p-1 text-sm border-gray-300 rounded focus:ring-[#8884d8] focus:border-[#8884d8] text-center" 
                        min={filterQty.min || 0}
                    />
                </div>

                <select value={filterImage} onChange={(e) => setFilterImage(e.target.value)} className={inputStyle}>
                    <option value="">Images: All</option>
                    <option value="yes">Has Image</option>
                    <option value="no">No Image</option>
                </select>

                <select value={filterLowStock} onChange={(e) => setFilterLowStock(e.target.value)} className={inputStyle}>
                    <option value="">Low Stock: All</option>
                    <option value="yes">Low Stock Only</option>
                    <option value="no">Healthy Stock</option>
                </select>

                <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className={`${inputStyle} max-w-[200px] truncate`}>
                    <option value="">All Owners</option>
                    {uniqueOwners.map(email => <option key={email} value={email}>{email}</option>)}
                </select>
                
                {/* Clear Filters Button */}
                <button 
                    onClick={onClearFilters}
                    className="ml-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-md transition-colors border border-gray-300 whitespace-nowrap"
                >
                    Clear Filters
                </button>
            </div>
            
        </div>
    );
}

export default DashboardFilterBar;