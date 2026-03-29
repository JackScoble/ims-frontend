/**
 * @file deleteconfirmmodal.jsx
 * @description A destructive-action confirmation modal to prevent accidental
 * deletions of inventory items.
 */

import React from 'react';

/**
 * DeleteConfirmModal Component
 * Prompts the user to confirm they want to permanently delete an item.
 * * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Determines if the modal is currently visible.
 * @param {Object} props.item - The data object representing the item slated for deletion.
 * @param {Function} props.onClose - Callback to close the modal without deleting.
 * @param {Function} props.onConfirm - Callback fired when deletion is confirmed. Passed the item's ID.
 * @returns {JSX.Element|null} The rendered confirmation modal, or null if closed.
 */
function DeleteConfirmModal({ isOpen, item, onClose, onConfirm }) {
    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-gray-900/80 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 transition-colors">
            
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl w-full max-w-sm shadow-2xl transform transition-all text-center border dark:border-gray-700">
                
                {/* Big Red Warning Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 dark:bg-red-500/10 mb-5 border-4 border-red-100 dark:border-red-500/20 transition-colors">
                    <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">
                    Delete Item?
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-8 leading-relaxed transition-colors">
                    Are you sure you want to delete <strong className="text-gray-800 dark:text-white font-semibold">{item.name}</strong>? All of its data will be permanently removed. This action cannot be undone.
                </p>

                {/* Buttons: Stacked on mobile, side-by-side on desktop */}
                <div className="flex flex-col-reverse sm:flex-row justify-center gap-3">
                    <button 
                        onClick={onClose} 
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 transition-colors"
                    >
                        No, Keep it
                    </button>
                    <button 
                        onClick={() => { onConfirm(item.id); onClose(); }} 
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg focus:ring-4 focus:outline-none focus:ring-red-300/50 shadow-sm transition-colors"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;