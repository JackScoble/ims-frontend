import React from 'react';

function DeleteConfirmModal({ isOpen, item, onClose, onConfirm }) {
    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
            
            {/* Kept narrow (max-w-sm) so it feels like an alert dialog */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-sm shadow-2xl transform transition-all text-center">
                
                {/* Big Red Warning Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-5 border-4 border-red-100">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                    Delete Item?
                </h3>
                
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    Are you sure you want to delete <strong className="text-gray-800 font-semibold">{item.name}</strong>? All of its data will be permanently removed. This action cannot be undone.
                </p>

                {/* Buttons: Stacked on mobile, side-by-side on desktop */}
                <div className="flex flex-col-reverse sm:flex-row justify-center gap-3">
                    <button 
                        onClick={onClose} 
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 transition-colors"
                    >
                        No, Keep it
                    </button>
                    <button 
                        onClick={() => { onConfirm(item.id); onClose(); }} 
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg focus:ring-4 focus:outline-none focus:ring-red-300/50 shadow-sm transition-colors"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;