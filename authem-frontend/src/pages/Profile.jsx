import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Tag,
  ShoppingBag,
  CheckCircle2,
  LogOut,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const Profile = () => {
  const { user, logout, token } = useAuthStore();

  // State management
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog');

  // Fetch catalog search data from backend (Spring Data Pageable API)
  useEffect(() => {
    const fetchCatalogData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/v1/seller/catalog/search', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch catalog items from the server.');
        }

        const data = await response.json();

        // Target the Spring Data pageable 'content' array
        setCatalogItems(data.content || []);
      } catch (err) {
        setError(err.message || 'Error loading profile activity.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogData();
  }, [token]);

  // Derived statistics from fetched content
  const totalMarketplaceValue = catalogItems.reduce(
    (sum, item) => sum + (item.lowestAskPrice || 0), 0
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pb-16 transition-colors">

      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 text-white pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* User Avatar */}
            <div className="w-24 h-24 rounded-full bg-emerald-600 border-4 border-slate-800 flex items-center justify-center text-3xl font-black shadow-xl uppercase">
              {user?.firstName ? user.firstName[0] : 'U'}
            </div>

            {/* User Meta */}
            <div className="text-center sm:text-left space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Authem Member'}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {user?.role === 'ROLE_ADMIN' ? 'Admin Account' : 'Verified Seller'}
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium">{user?.email || 'N/A'}</p>
            </div>

            {/* Logout Action */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase rounded-xl border border-slate-700 transition-colors text-slate-300"
            >
              <LogOut className="w-4 h-4 text-red-400" /> Log Out
            </button>

          </div>
        </div>
      </div>

      {/* Main Portfolio Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">

        {/* Quick Portfolio Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-400">Total Listed Items</span>
              <Package className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {catalogItems.length} {catalogItems.length === 1 ? 'Product' : 'Products'}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Active in Catalog</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-400">Lowest Ask Portfolio</span>
              <Tag className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              ${totalMarketplaceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Combined Lowest Ask Value</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-400">Account Status</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">Good Standing</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Verified Marketplace Member</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="border-b border-slate-200 dark:border-slate-800 mb-6 flex gap-6">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 text-sm font-extrabold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'catalog'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Catalog Portfolio
          </button>
        </div>

        {/* Catalog Table Container */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">

          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white">Active Products</h3>
            <Link to="/browse" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              Browse Marketplace <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fetching Catalog Data...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-8 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">Failed to load catalog items</p>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && catalogItems.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-black text-slate-900 dark:text-white text-base">No Products Found</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                There are no items currently available in this catalog search response.
              </p>
              <Link
                to="/browse"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-sm mt-2"
              >
                Explore Marketplace
              </Link>
            </div>
          )}

          {/* API Items Render */}
          {!loading && !error && catalogItems.length > 0 && (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {catalogItems.map((product) => (
                <div
                  key={product.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-contain p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                    />
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        {product.brand} • SKU: {product.sku}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{product.name}</h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        Colorway: {product.colorway}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Lowest Ask</span>
                      <p className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                        ${product.lowestAskPrice ? product.lowestAskPrice.toFixed(2) : 'N/A'}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Retail Price</span>
                      <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                        ${product.retailPrice ? product.retailPrice.toFixed(2) : 'N/A'}
                      </p>
                    </div>

                    <Link
                      to={`/productdetails/${product.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};