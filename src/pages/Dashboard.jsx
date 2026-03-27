import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

import ItemFormModal from '../components/ItemFormModal';
import ItemViewModal from '../components/ItemViewModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ItemCard from '../components/ItemCard';
import DashboardFilterBar from '../components/DashboardFilterBar';

function Dashboard() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalType, setModalType] = useState(null); 
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [auditHistory, setAuditHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState('-created_at'); 
    const [filterQty, setFilterQty] = useState({ min: '', max: '' });
    const [filterImage, setFilterImage] = useState(''); 
    const [filterOwner, setFilterOwner] = useState('');
    const [filterLowStock, setFilterLowStock] = useState('');

    const [newItem, setNewItem] = useState({
        name: '', sku: '', category: '', quantity: 0, low_stock_threshold: 0, price: '', description: '', image: null
    });

    useEffect(() => {
        fetchInventory();
        fetchCategories();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get('items/');
            setItems(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch items. Are you logged in?');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('categories/');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const currentUserEmail = localStorage.getItem('user_email');
    const uniqueOwners = Array.from(new Set(items.map(item => item.owner_email))).filter(Boolean);

    const openAddModal = () => {
        setEditingId(null);
        setNewItem({ name: '', sku: '', category: '', quantity: 0, low_stock_threshold: 0, price: '', description: '', image: null });
        setModalType('form');
    };

    const openEditModal = (item) => {
        setEditingId(item.id);
        setNewItem({
            name: item.name, sku: item.sku, category: item.category || '', quantity: item.quantity,
            low_stock_threshold: item.low_stock_threshold || 0, price: item.price || '', 
            description: item.description, image: item.image || null 
        });
        setModalType('form');
    };

    const openDeleteModal = (item) => {
        setItemToDelete(item);
        setModalType('delete');
    };

    const fetchItemDetails = async (itemId) => {
        setIsLoadingHistory(true);
        setHistoryError('');
        try {
            const response = await api.get(`items/${itemId}/`);
            setViewingItem(response.data);
            setAuditHistory(response.data.audit_logs || []);
        } catch (err) {
            console.error('Failed to fetch item details', err);
            setHistoryError('Unable to load item details and audit history.');
            setViewingItem(null);
            setAuditHistory([]);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const openViewModal = (item) => {
        setModalType('view');
        fetchItemDetails(item.id);
    };

    const closeModal = () => {
        setModalType(null);
        setEditingId(null);
        setItemToDelete(null);
        setViewingItem(null);
        setAuditHistory([]);
        setHistoryError('');
        setIsLoadingHistory(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newItem.name);
            formData.append('sku', newItem.sku);
            formData.append('quantity', newItem.quantity);
            formData.append('low_stock_threshold', newItem.low_stock_threshold);
            formData.append('price', newItem.price); 
            formData.append('description', newItem.description);
            if (newItem.category) formData.append('category', newItem.category);
            if (newItem.image) formData.append('image', newItem.image);

            if (editingId) {
                const response = await api.patch(`items/${editingId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                setItems(items.map(item => item.id === editingId ? response.data : item));
                setEditingId(null);
            } else {
                const response = await api.post('items/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                setItems([...items, response.data]);
            }

            setNewItem({ name: '', sku: '', category: '', quantity: 0, low_stock_threshold: 5, price: '', description: '', image: null });
            const fileInput = document.getElementById('image-upload');
            if (fileInput) fileInput.value = '';

        } catch (err) {
            console.error("Submit failed:", err.response?.data);
            setError("Failed to save item.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`items/${id}/`);
            setItems(items.filter(item => item.id !== id));
            toast.success('Item deleted successfully');
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to delete';
            toast.error(msg);
        }
    };

    const processedItems = items.filter(item => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch = item.name.toLowerCase().includes(lowerSearch) || item.sku.toLowerCase().includes(lowerSearch);
        const min = filterQty.min !== '' ? parseInt(filterQty.min) : 0;
        const max = filterQty.max !== '' ? parseInt(filterQty.max) : Infinity;
        const matchesQty = item.quantity >= min && item.quantity <= max;

        let matchesImage = true;
        if (filterImage === 'yes') matchesImage = !!item.image;
        if (filterImage === 'no') matchesImage = !item.image;

        const matchesOwner = filterOwner === '' || item.owner_email === filterOwner;

        let matchesLowStock = true;
        if (filterLowStock === 'yes') matchesLowStock = item.quantity <= (item.low_stock_threshold || 0);
        if (filterLowStock === 'no') matchesLowStock = item.quantity > (item.low_stock_threshold || 0);

        return matchesSearch && matchesQty && matchesImage && matchesOwner && matchesLowStock;
    }).sort((a, b) => {
        switch (sortConfig) {
            case 'quantity': return a.quantity - b.quantity; 
            case '-quantity': return b.quantity - a.quantity; 
            case 'created_at': return new Date(a.created_at) - new Date(b.created_at); 
            case '-created_at': return new Date(b.created_at) - new Date(a.created_at); 
            case 'updated_at': return new Date(a.updated_at) - new Date(b.updated_at);
            case '-updated_at': return new Date(b.updated_at) - new Date(a.updated_at);
            default: return 0;
        }
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setSortConfig('-created_at');
        setFilterQty({min:'', max:''});
        setFilterImage('');
        setFilterOwner('');
        setFilterLowStock('');
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Inventory Dashboard</h2>
                
                <button 
                    onClick={openAddModal} 
                    className="bg-[#8884d8] hover:bg-[#706ac9] text-white font-medium py-2 px-5 rounded-md transition-colors shadow-sm flex items-center gap-2"
                >
                    <span className="text-xl leading-none">+</span> Add New Item
                </button>
            </div>

            {/* Filters Component */}
            <DashboardFilterBar 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                sortConfig={sortConfig} setSortConfig={setSortConfig}
                filterQty={filterQty} setFilterQty={setFilterQty}
                filterImage={filterImage} setFilterImage={setFilterImage}
                filterLowStock={filterLowStock} setFilterLowStock={setFilterLowStock}
                filterOwner={filterOwner} setFilterOwner={setFilterOwner}
                uniqueOwners={uniqueOwners}
                onClearFilters={handleClearFilters}
            />
            
            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {processedItems.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <p className="text-lg">No items found matching your criteria.</p>
                    </div>
                ) : null}
                
                {processedItems.map(item => (
                    <ItemCard 
                        key={item.id} 
                        item={item} 
                        currentUserEmail={currentUserEmail} 
                        onView={openViewModal} 
                        onEdit={openEditModal} 
                        onDelete={openDeleteModal} 
                    />
                ))}
            </div>

            {/* Modals */}
            <ItemFormModal 
                isOpen={modalType === 'form'} isEditing={!!editingId}
                newItem={newItem} setNewItem={setNewItem}
                categories={categories} onSubmit={handleSubmit} onClose={closeModal}
            />

            <ItemViewModal 
                isOpen={modalType === 'view'} item={viewingItem}
                isLoadingHistory={isLoadingHistory} historyError={historyError}
                auditHistory={auditHistory} onClose={closeModal}
            />

            <DeleteConfirmModal 
                isOpen={modalType === 'delete'} item={itemToDelete}
                onConfirm={handleDelete} onClose={closeModal}
            />

        </div>
    );
}

export default Dashboard;