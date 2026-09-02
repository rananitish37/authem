import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit3, AlertCircle, Loader2 } from 'lucide-react';
import API from '../../services/api';

const INITIAL_FORM = {
  sku: '',
  name: '',
  brand: 'Jordan',
  colorway: '',
  retailPrice: '',
  imageUrl: ''
};

export default function AdminCatalogManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState('');

  // Fetch Master Catalog with Search & Filter
  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await API.get('/v1/admin/catalog', {
        params: {
          search: search.trim(),
          brand: brandFilter,
          page: 0,
          size: 20,
          sort: 'id,desc'
        }
      });

      const data = res.data;
      setProducts(Array.isArray(data) ? data : (data.content || []));
    } catch (err) {
      console.error('Network error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatalog();
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [search, brandFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      ...formData,
      retailPrice: parseFloat(formData.retailPrice)
    };

    try {
      if (editingId) {
        await API.put(`/v1/admin/catalog/${editingId}`, payload);
      } else {
        await API.post('/v1/admin/catalog', payload);
      }

      setIsModalOpen(false);
      setFormData(INITIAL_FORM);
      setEditingId(null);
      fetchCatalog();
    } catch (err) {
      const message = err.response?.data?.message || (err.response?.data?.errors ? Object.values(err.response.data.errors).join(', ') : 'Operation failed');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      sku: product.sku,
      name: product.name,
      brand: product.brand,
      colorway: product.colorway || '',
      retailPrice: product.retailPrice,
      imageUrl: product.imageUrl
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return;
    try {
      await API.delete(`/v1/admin/catalog/${id}`);
      fetchCatalog();
    } catch (err) {
      console.error('Failed to delete product', err);
      alert(err.response?.data?.message || 'Failed to deactivate product.');
    }
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Master Catalog Management</h1>
          <p className="text-slate-400 text-sm mt-1">Upload and manage official sneaker inventory data for seller listings.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData(INITIAL_FORM);
            setError('');
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition"
        >
          <Plus className="w-5 h-5" /> Add Master Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU or Model Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Brands</option>
          <option value="Jordan">Jordan</option>
          <option value="Nike">Nike</option>
          <option value="adidas">adidas</option>
          <option value="New Balance">New Balance</option>
          <option value="Asics">Asics</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-4 px-6">Sneaker</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Brand</th>
                <th className="py-4 px-6">Retail Price</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No master products found. Click "Add Master Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition">
                    <td className="py-3 px-6 flex items-center gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md bg-slate-900 border border-slate-700"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.colorway || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="py-3 px-6 font-mono text-xs text-indigo-400">{item.sku}</td>
                    <td className="py-3 px-6">{item.brand}</td>
                    <td className="py-3 px-6 font-medium text-emerald-400">
                      ${item.retailPrice ? item.retailPrice.toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-400 hover:text-indigo-400 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Edit Master Product' : 'Add New Master Product'}
            </h2>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingId}
                    placeholder="e.g. DZ5485-052"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Brand</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Jordan">Jordan</option>
                    <option value="Nike">Nike</option>
                    <option value="adidas">adidas</option>
                    <option value="New Balance">New Balance</option>
                    <option value="Asics">Asics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Official Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Air Jordan 1 High OG Lost & Found"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Colorway</label>
                  <input
                    type="text"
                    placeholder="e.g. Red/Black/Sail"
                    value={formData.colorway}
                    onChange={(e) => setFormData({ ...formData, colorway: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="180.00"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Image Live Preview */}
              {formData.imageUrl && (
                <div className="mt-2 p-2 bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-3">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded bg-black"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <span className="text-xs text-slate-400">Live Image Preview</span>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}