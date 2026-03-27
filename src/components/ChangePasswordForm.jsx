import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ChangePasswordForm = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputStyle = "bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-rose-500 focus:border-rose-500 block p-2.5 transition-colors shadow-sm";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match!');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.put('password_change/', {
                old_password: oldPassword,
                new_password: newPassword
            });
            toast.success(response.data.message || 'Password updated successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to change password.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8">
            <div className="mb-6">
                <h4 className="text-gray-800 font-bold mb-1">Change Login Password</h4>
                <p className="text-sm text-gray-500 italic">
                    You will be required to log in again with your new credentials after updating.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Current Password</label>
                    <input 
                        type="password" 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                        required 
                        className={inputStyle} 
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">New Password</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        className={inputStyle} 
                    />
                </div>

                <div className="flex flex-col gap-2 text-rose-600">
                    <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        className={inputStyle} 
                    />
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-bold transition-all shadow-md active:scale-95 disabled:bg-gray-300"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;