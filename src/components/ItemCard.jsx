import React from 'react';

function ItemCard({ item, currentUserEmail, onView, onEdit, onDelete }) {
    const threshold = item.low_stock_threshold || 0;
    const isLowStock = item.quantity <= threshold;
    const isOwner = item.owner_email === currentUserEmail;

    return (
        <div className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all hover:shadow-md ${isLowStock ? 'border-red-400 shadow-red-100' : 'border-gray-200'}`}>
            
            {/* Image Section */}
            <div className="h-48 bg-gray-50 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 font-medium">No Image</span>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2" title={item.name}>
                        {item.name} <span className="text-sm font-normal text-gray-500">(SKU: {item.sku})</span>
                    </h3>
                </div>
                
                <div className="inline-block mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {item.category_name || 'None'}
                    </span>
                </div>

                <div className="space-y-1.5 mb-4 flex-grow text-sm">
                    <p><span className="font-semibold text-gray-700">Price:</span> £{item.price}</p>
                    
                    {/* Quantity & Low Stock Warning */}
                    <div className="flex flex-col gap-1 items-start">
                        <p>
                            <span className="font-semibold text-gray-700">Quantity:</span>{' '}
                            <span className={isLowStock ? 'text-red-600 font-bold text-base' : 'text-gray-900'}>
                                {item.quantity}
                            </span>
                        </p>
                        {isLowStock && (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 flex items-center gap-1">
                                ⚠️ Low Stock! (Threshold: {threshold})
                            </span>
                        )}
                    </div>
                    
                    <p className="text-gray-600 line-clamp-2 pt-2 text-xs" title={item.description}>
                        <span className="font-semibold text-gray-700">Desc:</span> {item.description}
                    </p>
                </div>
                
                <p className="text-[10px] text-gray-400 mt-auto mb-4 truncate" title={item.owner_email}>
                    Added by: {item.owner_email || 'No email provided'}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                    <button 
                        onClick={() => onView(item)} 
                        className="flex-1 bg-gray-50 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-sm font-semibold transition-colors border border-gray-200"
                    >
                        View
                    </button>
                    <button 
                        onClick={() => onEdit(item)} 
                        className="flex-1 bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-600 py-2 rounded-md text-sm font-semibold transition-colors border border-blue-100"
                    >
                        Edit
                    </button>
                    {isOwner && (
                        <button 
                            onClick={() => onDelete(item)} 
                            className="flex-1 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 py-2 rounded-md text-sm font-semibold transition-colors border border-red-100"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ItemCard;