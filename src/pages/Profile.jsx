import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ChangePasswordForm from '../components/ChangePasswordForm';

const Profile = () => {
  const [formData, setFormData] = useState({
    email: '', first_name: '', last_name: '', department: '', job_title: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('profile/');
        const data = response.data;
        setFormData({
          email: data.email || '', first_name: data.first_name || '', last_name: data.last_name || '',
          department: data.profile?.department || '', job_title: data.profile?.job_title || '',
        });
        if (data.profile?.profile_image) setImagePreview(data.profile.profile_image);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Saving...');
    const submitData = new FormData();
    submitData.append('email', formData.email);
    submitData.append('first_name', formData.first_name);
    submitData.append('last_name', formData.last_name);
    submitData.append('profile.department', formData.department);
    submitData.append('profile.job_title', formData.job_title);
    if (imageFile) submitData.append('profile.profile_image', imageFile);

    try {
      await api.put('profile/', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Profile updated successfully! (Refresh to see sidebar update)');
    } catch (error) {
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}> 
      
      {/* --- STANDARD PROFILE SECTION --- */}
      <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Edit Profile</h2>
        {message && <p style={{ color: message.includes('success') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden' }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold' }}>Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold' }}>First Name:
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </label>
            <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold' }}>Last Name:
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold' }}>Job Title:
            <input type="text" name="job_title" value={formData.job_title} onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold' }}>Department:
            <input type="text" name="department" value={formData.department} onChange={handleChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#8884d8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            Save Profile
          </button>
        </form>
      </div>

      {/* --- DANGER ZONE SECTION --- */}
      <div style={{ 
          marginTop: '40px', 
          border: '1px solid #d73a49', 
          borderRadius: '6px', 
          overflow: 'hidden',
          backgroundColor: '#fff'
      }}>
        <div style={{ 
            backgroundColor: '#ffeef0', 
            padding: '15px 20px', 
            borderBottom: '1px solid #d73a49' 
        }}>
          <h3 style={{ margin: 0, color: '#d73a49', fontSize: '18px' }}>Danger Zone</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ChangePasswordForm /> 
        </div>
      </div>
      
    </div>
  );
};

export default Profile;