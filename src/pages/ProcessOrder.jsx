import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ProcessOrder = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ item: '', quantity_ordered: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('items/');
      setItems(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch items. Are you logged in?');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('orders/', {
        item: formData.item,
        quantity_ordered: parseInt(formData.quantity_ordered)
      });

      toast.success('Order processed successfully! Stock has been deducted.');
      setFormData({ item: '', quantity_ordered: 1 });
      
      fetchInventory(); 
      
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        const errorMsg = data.quantity_ordered ? data.quantity_ordered[0] : 'Failed to process order.';
        toast.error(errorMsg);
      } else {
        toast.error('Network error. Could not connect to the server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Process New Order</h2>
      <p style={{ color: '#555' }}>Simulate a purchase to deduct stock and update audit logs.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Item Selection */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Item:</label>
          <select 
            name="item" 
            value={formData.item} 
            onChange={handleChange} 
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="" disabled>-- Choose an item --</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} (In Stock: {item.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quantity Ordered:</label>
          <input 
            type="number" 
            name="quantity_ordered" 
            value={formData.quantity_ordered} 
            onChange={handleChange} 
            min="1"
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting || !formData.item}
          style={{ 
            padding: '10px', 
            backgroundColor: isSubmitting ? '#ccc' : '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Processing...' : 'Process Order'}
        </button>

      </form>
    </div>
  );
};

export default ProcessOrder;