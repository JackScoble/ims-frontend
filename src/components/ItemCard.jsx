import React from 'react';

function ItemCard({ item, currentUserEmail, onView, onEdit, onDelete }) {
    const threshold = item.low_stock_threshold || 0;
    const isLowStock = item.quantity <= threshold;
    const isOwner = item.owner_email === currentUserEmail;

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all hover:shadow-md ${isLowStock ? 'border-red-400 shadow-red-100 dark:border-red-500/50 dark:shadow-none' : 'border-gray-200 dark:border-gray-700'}`}>
            
            {/* Image Section */}
            <div className="h-48 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden transition-colors">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 dark:text-gray-500 font-medium">No Image</span>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-2" title={item.name}>
                        {item.name} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(SKU: {item.sku})</span>
                    </h3>
                </div>
                
                <div className="inline-block mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full transition-colors">
                        {item.category_name || 'None'}
                    </span>
                </div>

                <div className="space-y-1.5 mb-4 flex-grow text-sm dark:text-gray-300">
                    <p><span className="font-semibold text-gray-700 dark:text-gray-200">Price:</span> £{item.price}</p>
                    
                    {/* Quantity & Low Stock Warning */}
                    <div className="flex flex-col gap-1 items-start">
                        <p>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Quantity:</span>{' '}
                            <span className={isLowStock ? 'text-red-600 dark:text-red-400 font-bold text-base' : 'text-gray-900 dark:text-gray-100'}>
                                {item.quantity}
                            </span>
                        </p>
                        {isLowStock && (
                            <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-100 dark:border-red-800/50 flex items-center gap-1 transition-colors">
                                ⚠️ Low Stock! (Threshold: {threshold})
                            </span>
                        )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 pt-2 text-xs" title={item.description}>
                        <span className="font-semibold text-gray-700 dark:text-gray-200">Desc:</span> {item.description}
                    </p>
                </div>
                
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-auto mb-4 truncate" title={item.owner_email}>
                    Added by: {item.owner_email || 'No email provided'}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors">
                    <button 
                        onClick={() => onView(item)} 
                        className="flex-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-md text-sm font-semibold transition-colors border border-gray-200 dark:border-gray-600"
                    >
                        View
                    </button>
                    <button 
                        onClick={() => onEdit(item)} 
                        className="flex-1 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white text-blue-600 dark:text-blue-400 py-2 rounded-md text-sm font-semibold transition-colors border border-blue-100 dark:border-blue-500/20"
                    >
                        Edit
                    </button>
                    {isOwner && (
                        <button 
                            onClick={() => onDelete(item)} 
                            className="flex-1 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white dark:hover:text-white text-red-600 dark:text-red-400 py-2 rounded-md text-sm font-semibold transition-colors border border-red-100 dark:border-red-500/20"
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