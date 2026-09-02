import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Image, Tag, DollarSign, Calendar, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

const BRANDS = ['Nike', 'Jordan', 'adidas', 'New Balance', 'ASICS', 'Puma', 'Fear of God', 'Supreme'];
const CATEGORIES = ['Sneakers', 'Shoes', 'Apparel', 'Electronics', 'Collectibles', 'Accessories'];

export const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: 'Jordan',
    category: 'Sneakers',
    colorway: '',
    retailPrice: '',
    releaseDate: '',
    imageUrl: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await API.post('/v1/admin/catalog', {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        colorway: formData.colorway?.trim() || '',
        retailPrice: parseFloat(formData.retailPrice),
        imageUrl: formData.imageUrl.trim()
      });

      setSuccess(true);
      // Reset form after submission
      setFormData({
        name: '',
        sku: '',
        brand: 'Jordan',
        category: 'Sneakers',
        colorway: '',
        retailPrice: '',
        releaseDate: '',
        imageUrl: '',
        description: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-authem-grayBg/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white border border-authem-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-authem-dark text-[10px] font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-authem-green" />
              Admin Portal
            </div>
            <h1 className="text-2xl font-black text-authem-dark tracking-tight">Add Master Product</h1>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              Create official catalog entries so sellers can list their items.
            </p>
          </div>
          <button
            onClick={() => navigate('/browse')}
            className="text-xs font-bold text-slate-600 hover:text-authem-dark border border-authem-border px-4 py-2 rounded-xl transition-all self-start sm:self-auto"
          >
            View Catalog
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-authem-green text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Product added successfully to the catalog! Sellers can now post asks.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-authem-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-authem-border pb-2">
              1. General Details
            </h3>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                Product Title / Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Air Jordan 1 High OG 'Lost & Found'"
                className="w-full px-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Brand *
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-bold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all cursor-pointer"
                >
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-bold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Specifications */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-authem-border pb-2">
              2. Product Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Style Code / SKU *
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="e.g., DZ5485-052"
                    className="w-full pl-10 pr-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Official Colorway *
                </label>
                <input
                  type="text"
                  name="colorway"
                  required
                  value={formData.colorway}
                  onChange={handleChange}
                  placeholder="e.g., Varsity Red/Black-Sail-Muslin"
                  className="w-full px-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Retail Price ($ USD) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    name="retailPrice"
                    required
                    min="0"
                    step="1"
                    value={formData.retailPrice}
                    onChange={handleChange}
                    placeholder="180"
                    className="w-full pl-10 pr-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                  Release Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Media & Description */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-authem-border pb-2">
              3. Media & Overview
            </h3>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                Product Image URL *
              </label>
              <div className="relative">
                <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="imageUrl"
                  required
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.stockx.com/360/Air-Jordan-1-Retro-High-OG-Lost-and-Found..."
                  className="w-full pl-10 pr-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Live Image Preview */}
            {formData.imageUrl && (
              <div className="p-4 bg-authem-grayBg border border-authem-border rounded-xl flex items-center justify-center">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-32 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                Description / History
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief summary of the sneaker history, materials, and significance..."
                className="w-full px-4 py-2.5 bg-authem-grayBg border border-authem-border rounded-xl text-xs font-semibold text-authem-dark focus:outline-none focus:border-authem-green focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-authem-dark hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            {loading ? 'Adding Product...' : 'Add Master Product to Catalog'}
          </button>
        </form>

      </div>
    </div>
  );
};