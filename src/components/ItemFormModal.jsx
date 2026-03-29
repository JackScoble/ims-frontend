/**
 * @file itemformmodal.jsx
 * @description Modal component containing the form used for both creating 
 * and editing inventory items. Handles file uploads for images and category selection.
 */

import React from 'react';

/**
 * ItemFormModal Component
 * * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Determines if the modal is currently visible.
 * @param {boolean} props.isEditing - Flags whether the form is in 'Edit' mode vs 'Create' mode.
 * @param {Object} props.newItem - The state object holding the current form data.
 * @param {Function} props.setNewItem - State setter function to update form fields.
 * @param {Array<Object>} props.categories - Array of category objects for the dropdown select.
 * @param {Function} props.onSubmit - Callback fired when the form is submitted.
 * @param {Function} props.onClose - Callback to close the modal without saving.
 * @returns {JSX.Element|null} The rendered form modal, or null if not open.
 */
function ItemFormModal({ isOpen, isEditing, newItem, setNewItem, categories, onSubmit, onClose }) {
    if (!isOpen) return null;

    const inputClass = "w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:placeholder-gray-400 text-sm rounded-md focus:ring-[#8884d8] focus:border-[#8884d8] block p-2 transition-colors";
    const labelClass = "block mb-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide";
    
    const RequiredAsterisk = () => <span className="text-red-500 dark:text-red-400 ml-1">*</span>;

    return (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-gray-900/80 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 transition-colors">
            
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-4 transition-colors border dark:border-gray-700">
                
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 transition-colors">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {isEditing ? 'Edit Item' : 'Add New Inventory'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1.5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={(e) => { onSubmit(e); onClose(); }} className="flex flex-col gap-4">
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className={labelClass} htmlFor="item-name">Name <RequiredAsterisk /></label>
                            <input id="item-name" type="text" placeholder="Claw Hammer" value={newItem.name || ''} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required className={inputClass} />
                        </div>
                        <div className="w-full sm:w-1/3">
                            <label className={labelClass} htmlFor="item-sku">SKU <RequiredAsterisk /></label>
                            <input id="item-sku" type="text" placeholder="TOOL-001" value={newItem.sku || ''} onChange={(e) => setNewItem({...newItem, sku: e.target.value})} required className={inputClass} />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className={labelClass} htmlFor="item-quantity">Current Quantity <RequiredAsterisk /></label>
                            <input id="item-quantity" type="number" placeholder="0" value={newItem.quantity || ''} onKeyDown={(e) => ["e", "E", ".", ","].includes(e.key) && e.preventDefault()} onChange={(e) => setNewItem({...newItem, quantity: e.target.value.replace(/\D/g, '')})} max="99999" required className={inputClass} />
                        </div>
                        <div className="flex-1">
                            <label className={labelClass} htmlFor="threshold">Alert Threshold <RequiredAsterisk /></label>
                            <input id="threshold" type="number" placeholder="0" value={newItem.low_stock_threshold || ''} onKeyDown={(e) => ["e", "E", ".", ","].includes(e.key) && e.preventDefault()} onChange={(e) => setNewItem({...newItem, low_stock_threshold: e.target.value.replace(/\D/g, '')})} max="99999" required className={inputClass} />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className={labelClass} htmlFor="item-category">Category <RequiredAsterisk /></label>
                            <select id="item-category" value={newItem.category || ''} onChange={(e) => setNewItem({...newItem, category: e.target.value})} required className={`${inputClass} appearance-none`}>
                                <option value="">Select a Category</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div className="w-full sm:w-1/3">
                            <label className={labelClass} htmlFor="price">Price (£) <RequiredAsterisk /></label>
                            <input id="price" type="number" step="0.01" placeholder="0.00" value={newItem.price || ''} min="0.01" max="99999.99" required onChange={(e) => { const val = e.target.value; if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) setNewItem({...newItem, price: val}); }} className={inputClass} />
                        </div>
                    </div>

                    {/* Not required */}
                    <div>
                        <label className={labelClass} htmlFor="item-description">Description</label>
                        <textarea id="item-description" placeholder="Brief description of the item..." value={newItem.description || ''} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className={`${inputClass} min-h-[60px] resize-y`} />
                    </div>
                    
                    {/* Image Upload Area */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-3 transition-colors">
                        <label className={labelClass} htmlFor="item-image">Product Image</label>
                        
                        {/* Dynamic Preview */}
                        {newItem.image && (
                            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner transition-colors">
                                <img 
                                    src={typeof newItem.image === 'string' ? newItem.image : URL.createObjectURL(newItem.image)} 
                                    alt="Preview" 
                                    className="w-14 h-14 object-cover rounded-md border border-gray-200 dark:border-gray-700" 
                                />
                                <div className="text-sm space-y-0.5">
                                    <p className={`font-semibold text-xs ${typeof newItem.image === 'string' ? 'text-green-700 dark:text-green-400' : 'text-[#8884d8]'}`}>
                                        {typeof newItem.image === 'string' ? '✓ Current image active.' : '✓ New image selected.'}
                                    </p>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                        {typeof newItem.image === 'string' ? 'Uploading below replaces this.' : newItem.image.name}
                                    </p>
                                </div>
                            </div>
                        )}

                        <input id="image-upload" type="file" accept="image/*" onChange={(e) => setNewItem({...newItem, image: e.target.files[0]})} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#8884d8]/10 file:text-[#8884d8] hover:file:bg-[#8884d8]/20 cursor-pointer transition-colors" />
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-2 pt-3 border-t border-gray-100 dark:border-gray-700 transition-colors">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-[#8884d8] hover:bg-[#706ac9] rounded-lg transition-colors shadow-sm">
                            {isEditing ? 'Save Changes' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ItemFormModal;