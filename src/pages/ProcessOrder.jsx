import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ProcessOrder = () => {
    const [items, setItems] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [formData, setFormData] = useState({ item: '', quantity_ordered: 1 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchInventory();
        fetchRecentOrders();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get('items/');
            setItems(response.data);
        } catch (err) {
            toast.error('Failed to fetch items.');
        }
    };

    const fetchRecentOrders = async () => {
        try {
            const response = await api.get('orders/');
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const filtered = response.data
                .filter(order => new Date(order.created_at) > sevenDaysAgo)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setRecentOrders(filtered);
        } catch (err) {
            console.error("Could not load recent orders");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'item') {
            setFormData({ item: value, quantity_ordered: 1 });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('orders/', {
                item: formData.item,
                quantity_ordered: parseInt(formData.quantity_ordered)
            });

            toast.success('Order processed successfully!');
            setFormData({ item: '', quantity_ordered: 1 });
            fetchInventory();
            fetchRecentOrders();
        } catch (error) {
            const errorMsg = error.response?.data?.quantity_ordered?.[0] || 'Failed to process order.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = "bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-[#8884d8] focus:border-[#8884d8] block p-2.5 transition-colors shadow-sm";

    const selectedItemData = items.find(i => i.id.toString() === formData.item.toString());
    const isOverStock = selectedItemData && formData.quantity_ordered > selectedItemData.quantity;

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Process New Order</h2>
                    <p className="text-gray-500 text-sm mt-1">Deduct stock and track recent transaction history.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Form (Span 1) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Select Item</label>
                                <select 
                                    name="item" 
                                    value={formData.item} 
                                    onChange={handleChange} 
                                    required
                                    className={`${inputStyle} w-full cursor-pointer`}
                                >
                                    <option value="" disabled>-- Choose an item --</option>
                                    {items.map(item => (
                                        <option key={item.id} value={item.id} disabled={item.quantity <= 0}>
                                            {item.name} ({item.quantity > 0 ? `${item.quantity} available` : 'Out of Stock'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Quantity Ordered
                                    {selectedItemData && (
                                        <span className="text-xs font-normal text-gray-500 ml-2">
                                            (Max: {selectedItemData.quantity})
                                        </span>
                                    )}
                                </label>
                                <input 
                                    type="number" 
                                    name="quantity_ordered" 
                                    value={formData.quantity_ordered} 
                                    onChange={handleChange} 
                                    min="1"
                                    max={selectedItemData ? selectedItemData.quantity : ""}
                                    disabled={!formData.item}
                                    required
                                    className={`${inputStyle} w-full ${isOverStock ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                                />
                                {isOverStock && (
                                    <span className="text-xs text-rose-500 font-medium">
                                        Cannot order more than available stock.
                                    </span>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting || !formData.item || isOverStock}
                                className={`w-full py-3 px-5 rounded-md font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2
                                    ${isSubmitting || !formData.item || isOverStock ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#8884d8] hover:bg-[#706ac9]'}`}
                            >
                                {isSubmitting ? 'Processing...' : 'Complete Transaction'}
                            </button>
                        </form>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                        <p className="text-xs text-blue-700 leading-relaxed">
                            Orders immediately decrease stock and are logged for audit.
                        </p>
                    </div>
                </div>

                {/* Right Column: Recent Orders (Span 2) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Orders (Last 7 Days)</h3>
                            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                {recentOrders.length} Transactions
                            </span>
                        </div>
                        
                        <div className="overflow-y-auto max-h-[500px]">
                            {recentOrders.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                            <th className="px-6 py-3">Item Name</th>
                                            <th className="px-6 py-3">Qty</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">User</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                    {order.item_name || `Item ID: ${order.item}`}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-[#8884d8]">{order.quantity_ordered}</span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                                    {new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                                                    {order.processed_by_username ? `${order.processed_by_username}` : 'System'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400 italic">
                                    <p>No orders processed in the last week.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProcessOrder;