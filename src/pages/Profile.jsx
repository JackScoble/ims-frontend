import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
    const [formData, setFormData] = useState({
        email: '', first_name: '', last_name: '', department: '', job_title: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    
    const [completionPercentage, setCompletionPercentage] = useState(0);
    
    const [userStats, setUserStats] = useState({
        role: '',
        dateJoined: null,
        lastLogin: null,
        itemsAdded: 0,
        editsToday: 0
    });
    
    const inputStyle = "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-md focus:ring-[#8884d8] focus:border-[#8884d8] block p-2.5 transition-colors shadow-sm";
    
    const RequiredAsterisk = () => <span className="text-red-500 dark:text-red-400 ml-1">*</span>;

    const { theme, setTheme } = useTheme();

    const handleThemeChange = async (e) => {
        const newTheme = e.target.value;
        
        setTheme(newTheme);
        
        const submitData = new FormData();
        submitData.append('profile.theme_preference', newTheme);
        
        try {
            const response = await api.patch('profile/', submitData);
            toast.success('Theme preference saved!');
        } catch (error) {
            toast.error('Failed to save to database. Check console.');
        }
    };

    const calculateCompletion = (email, firstName, lastName, department, jobTitle, image) => {
        const fields = [email, firstName, lastName, department, jobTitle, image];
        const filledFields = fields.filter(field => 
            field && (typeof field === 'string' ? field.trim() !== '' : true)
        );
        return Math.round((filledFields.length / fields.length) * 100);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('profile/');
                const data = response.data;
                
                setFormData({
                    email: data.email || '', 
                    first_name: data.first_name || '', 
                    last_name: data.last_name || '',
                    department: data.profile?.department || '', 
                    job_title: data.profile?.job_title || '',
                });
                
                if (data.profile?.profile_image) setImagePreview(data.profile.profile_image);

                const initialCompletion = calculateCompletion(
                    data.email, data.first_name, data.last_name, 
                    data.profile?.department, data.profile?.job_title, 
                    data.profile?.profile_image
                );
                setCompletionPercentage(initialCompletion);

                setUserStats({
                    role: data.role || '', 
                    dateJoined: data.date_joined,
                    lastLogin: data.last_login,
                    itemsAdded: data.items_added || 0,
                    editsToday: data.edits_today || 0,
                });

                if (data.profile?.theme_preference) {
                    setTheme(data.profile.theme_preference);
                }
                
                setHasChanges(false);

            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setHasChanges(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); 
            setHasChanges(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submitData = new FormData();
        submitData.append('email', formData.email);
        submitData.append('first_name', formData.first_name);
        submitData.append('last_name', formData.last_name);
        submitData.append('profile.department', formData.department);
        submitData.append('profile.job_title', formData.job_title);
        if (imageFile) submitData.append('profile.profile_image', imageFile);

        try {
            await api.put('profile/', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
            
            const newCompletion = calculateCompletion(
                formData.email, formData.first_name, formData.last_name, 
                formData.department, formData.job_title, 
                imagePreview
            );
            setCompletionPercentage(newCompletion);
            
            setHasChanges(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-GB', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-20">
            
            <div className="mt-2">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight transition-colors">Account Settings</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Manage your public profile and security credentials.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                
                <div className="lg:col-span-2 flex flex-col gap-8">
                    
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">Public Profile</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className="flex items-center gap-6 pb-6 border-b border-gray-50 dark:border-gray-700/50">
                                <div className="relative group w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-inner">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400 text-xs font-bold uppercase">No Pic</div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Picture</label>
                                    <input 
                                        type="file" 
                                        id="avatar-upload"
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        className="hidden"
                                    />
                                    <label 
                                        htmlFor="avatar-upload"
                                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors shadow-sm inline-block text-center"
                                    >
                                        Change Photo
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Email Address <RequiredAsterisk />
                                    </label>
                                    <input type="email" name="email" placeholder='john.doe@gmail.com' value={formData.email} onChange={handleChange} required className={inputStyle} />
                                </div>

                                <div className="hidden md:block"></div> 

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name</label>
                                    <input type="text" name="first_name" placeholder='John' value={formData.first_name} onChange={handleChange} className={inputStyle} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name</label>
                                    <input type="text" name="last_name" placeholder='Doe' value={formData.last_name} onChange={handleChange} className={inputStyle} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Title</label>
                                    <input type="text" name="job_title" placeholder='Software Engineer' value={formData.job_title} onChange={handleChange} className={inputStyle} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Department</label>
                                    <input type="text" name="department" placeholder='Engineering' value={formData.department} onChange={handleChange} className={inputStyle} />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || !hasChanges}
                                    className={`px-8 py-2.5 rounded-md font-bold transition-all shadow-md active:scale-95 text-white
                                        ${hasChanges 
                                            ? 'bg-[#8884d8] hover:bg-[#706ac9]' 
                                            : 'bg-gray-300 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'}`}
                                >
                                    {isSubmitting ? 'Saving...' : (hasChanges ? 'Save Changes' : 'Saved')}
                                </button>
                                
                                {hasChanges && (
                                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2 transition-opacity duration-300">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                        Unsaved changes
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="border border-rose-200 dark:border-rose-900/40 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-colors">
                        <div className="bg-rose-50 dark:bg-rose-950/20 px-6 py-4 border-b border-rose-200 dark:border-rose-900/40">
                            <h3 className="font-bold text-rose-700 dark:text-rose-400">Security & Danger Zone</h3>
                        </div>
                        <div className="p-0">
                            <ChangePasswordForm /> 
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">App Appearance</h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Theme Preference</label>
                            <select 
                                value={theme} 
                                onChange={(e) => {
                                    handleThemeChange(e);
                                }}
                                className={`${inputStyle} w-full cursor-pointer`}
                            >
                                <option value="light" className="dark:bg-gray-800">Light Mode</option>
                                <option value="dark" className="dark:bg-gray-800">Dark Mode</option>
                                <option value="system" className="dark:bg-gray-800">System Default</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Account Status</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">Active & Verified</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-2 transition-colors">
                            <div className="flex justify-between border-b border-gray-50 dark:border-gray-700 pb-2">
                                <span>Role</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                    {userStats.role ? userStats.role : <span className="text-gray-400 italic">Pending Assignment</span>}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 dark:border-gray-700 pb-2 pt-1">
                                <span>Joined</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">{formatDate(userStats.dateJoined)}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span>Last Login</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">{formatDateTime(userStats.lastLogin)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Your Activity</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md border border-gray-100 dark:border-gray-700 text-center transition-colors">
                                <span className="block text-3xl font-bold text-[#8884d8] dark:text-[#a5a1ff]">{userStats.itemsAdded}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 block">Items Added</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md border border-gray-100 dark:border-gray-700 text-center transition-colors">
                                <span className="block text-3xl font-bold text-[#8884d8] dark:text-[#a5a1ff]">{userStats.editsToday}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 block">Edits Today</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors">
                                    {completionPercentage === 100 ? 'Profile Complete! 🎉' : 'Profile Completion'}
                                </span>
                                <span className={`text-sm font-bold transition-colors ${completionPercentage === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-100'}`}>
                                    {completionPercentage}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-all">
                                <div 
                                    className={`${completionPercentage === 100 ? 'bg-emerald-500' : 'bg-[#8884d8]'} h-2 rounded-full transition-all duration-500`} 
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;