import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import api from '../api/axios';

// --- Mocks ---
/** Mock API client for fetching inventory data and submitting changes */
vi.mock('../api/axios');

/** Mock toast notifications to prevent rendering issues and verify success/error states */
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// --- Mock Data ---
/** @type {Array<Object>} Mocked category reference data */
const mockCategories = [
  { id: 1, name: 'Power Tools' },
  { id: 2, name: 'Hand Tools' }
];

/** @type {Array<Object>} Mocked inventory items for populating the dashboard */
const mockItems = [
  {
    id: 101,
    name: 'Impact Driver',
    sku: 'PWR-001',
    quantity: 3,
    low_stock_threshold: 5, // Low Stock!
    price: '120.00',
    owner_email: 'owner@test.com',
    category_name: 'Power Tools',
    category: 1,
    image: null,
  },
  {
    id: 102,
    name: 'Tape Measure',
    sku: 'HND-020',
    quantity: 50,
    low_stock_threshold: 10,
    price: '12.50',
    owner_email: 'other@test.com',
    category_name: 'Hand Tools',
    category: 2,
    image: 'https://example.com/tape.jpg',
  }
];

/** @type {Array<Object>} Mocked audit logs for a specific item */
const mockAuditLogs = [
  { id: 1, action: 'Created', timestamp: '2023-10-01T12:00:00Z', username: 'owner@test.com', description: 'Initial stock added' }
];

/**
 * Test suite for the main Inventory Dashboard integration.
 * Verifies that the dashboard correctly fetches data, applies client-side 
 * filtering, handles ownership permissions, and manages CRUD modal interactions.
 */
describe('Inventory System Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulate being logged in as the owner of the Impact Driver
    localStorage.setItem('user_email', 'owner@test.com');

    // Default API Success Responses
    api.get.mockImplementation((url) => {
      if (url === 'items/') return Promise.resolve({ data: mockItems });
      if (url === 'categories/') return Promise.resolve({ data: mockCategories });
      if (url === 'items/101/') return Promise.resolve({ data: { ...mockItems[0], audit_logs: mockAuditLogs } });
      return Promise.reject(new Error('API Error'));
    });
  });

  /** Utility function to render the dashboard wrapped in necessary providers */
  const renderDashboard = () => render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

  // --- 1. Initial Render & Data Fetching ---
  it('loads and displays inventory items and categories', async () => {
    renderDashboard();
    expect(await screen.findByText('Impact Driver')).toBeInTheDocument();
    expect(screen.getByText(/PWR-001/i)).toBeInTheDocument();
    expect(screen.getByText(/Tape Measure/i)).toBeInTheDocument();
  });

  // --- 2. Filtering Logic ---
  /**
   * Sub-suite testing the search bar and drop-down filtering logic
   * applied to the currently displayed inventory items.
   */
  describe('Filtering and Searching', () => {
    it('filters the list based on search term (Name or SKU)', async () => {
      renderDashboard();
      const searchInput = await screen.findByPlaceholderText(/Search by Name or SKU/i);
      
      fireEvent.change(searchInput, { target: { value: 'HND-020' } });
      
      expect(screen.getByText('Tape Measure')).toBeInTheDocument();
      expect(screen.queryByText('Impact Driver')).not.toBeInTheDocument();
    });

    it('filters for "Low Stock Only"', async () => {
      renderDashboard();
      const lowStockFilter = await screen.findByDisplayValue('Low Stock: All');
      
      fireEvent.change(lowStockFilter, { target: { value: 'yes' } });
      
      // Only Impact Driver has qty (3) < threshold (5)
      expect(screen.getByText('Impact Driver')).toBeInTheDocument();
      expect(screen.queryByText('Tape Measure')).not.toBeInTheDocument();
    });
  });

  // --- 3. Modal Interactions (Create/View/Delete) ---
  /**
   * Sub-suite testing user interactions that trigger modals, including
   * adding new items, viewing item history, and deleting items.
   */
  describe('Inventory Actions', () => {
    
    it('opens the Add Modal and handles item creation', async () => {
      api.post.mockResolvedValue({ data: { ...mockItems[0], id: 103, name: 'New Drill' } });
      renderDashboard();

      // 1. Open the modal
      fireEvent.click(screen.getByText(/Add New Item/i));
      
      // 2. Wait for modal to appear
      await screen.findByText(/Add New Inventory/i);

      // 3. Fill out the form using Labels (The most robust way to test!)
      // This looks for a label "Name" and finds the input linked to it
      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Drill' } });
      fireEvent.change(screen.getByLabelText(/SKU/i), { target: { value: 'DRL-123' } });
      fireEvent.change(screen.getByLabelText(/Current Quantity/i), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText(/Alert Threshold/i), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '45.00' } });

      // 4. Select category
      // Using 'combobox' because it's a <select> element
      const categorySelect = screen.getByLabelText(/Category/i);
      fireEvent.change(categorySelect, { target: { value: '1' } });

      // 5. Submit
      fireEvent.click(screen.getByText('Add Item'));

      await waitFor(() => {
          expect(api.post).toHaveBeenCalled();
      });
    });

    it('opens View Modal and displays Audit History', async () => {
      renderDashboard();
      
      // Find the "View" button specifically for the Impact Driver card
      const impactCard = (await screen.findByText('Impact Driver')).closest('.bg-white');
      fireEvent.click(within(impactCard).getByText('View'));

      // Check for Modal Content
      expect(await screen.findByText('Item Details')).toBeInTheDocument();
      expect(screen.getByText('Audit History')).toBeInTheDocument();
      expect(await screen.findByText('Initial stock added')).toBeInTheDocument();
    });

    it('shows the Delete button only for the item owner', async () => {
      renderDashboard();
      
      // User is owner@test.com
      const ownedCard = (await screen.findByText('Impact Driver')).closest('.bg-white');
      const otherCard = (await screen.findByText('Tape Measure')).closest('.bg-white');

      expect(within(ownedCard).getByText('Delete')).toBeInTheDocument();
      expect(within(otherCard).queryByText('Delete')).not.toBeInTheDocument();
    });

    it('handles item deletion through the confirmation modal', async () => {
      api.delete.mockResolvedValue({});
      renderDashboard();

      const deleteBtn = (await screen.findAllByText('Delete'))[0];
      fireEvent.click(deleteBtn);

      // Confirm in Modal
      const confirmBtn = screen.getByText('Yes, Delete');
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(api.delete).toHaveBeenCalled();
      });
    });
  });
});