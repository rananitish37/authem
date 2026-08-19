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

  // Dynamic API state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'asks'

  // Fetch real user orders & asks from the backend API
  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Replace endpoint URL with your actual backend route if different
        const response = await fetch('/api/v1/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Sends Bearer token if present in your store
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user activity from backend.');
        }

        const data = await response.json();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || 'Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfileData();
    }
  }, [user, token]);

  // Derived statistics from real API data
  const totalPurchasedValue = orders
    .filter(o => o.type === 'BUY' || o.orderType === 'BUY')
    .reduce((sum, item) => sum + (item.price || item.totalPrice || 0), 0);

  const activeAsksCount = orders
    .filter(o => o.type === 'ASK' || o.type === 'SELL').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pb-16 transition-colors">

      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 text-white pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* User Avatar */}
            <div className="w-24 h-24 rounded-full bg-emerald-600 border-4 border-slate-800 flex items-center justify-center text-3xl font-black shadow-xl uppercase">
              {user?.firstName ? user.firstName[0] : 'U'}
            </div>

            {/* User Details */}
            <div className="text-center sm:text-left space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Authem Member'}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {user?.role === 'ROLE_ADMIN' ? 'Admin Account' : 'Verified Member'}
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

      {/* Main Portfolio Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">

        {/* Dynamic Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-400">Total Spent</span>
              <ShoppingBag className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              ${totalPurchasedValue.toLocaleString()}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">
              {orders.length} Total Activity Records
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-400">Active Listings</span>
              <Tag className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {activeAsksCount} {activeAsksCount === 1 ? 'Item' : 'Items'}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Listed on Marketplace</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-400">Authentication</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">Verified</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Account in Good Standing</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="border-b border-slate-200 dark:border-slate-800 mb-6 flex gap-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-extrabold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'orders'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Order History
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">

          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white">Recent Transactions</h3>
            <Link to="/browse" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              Browse Marketplace <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading API Data...</p>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-8 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">Could not load transactions</p>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
          )}

          {/* Empty API State */}
          {!loading && !error && orders.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-black text-slate-900 dark:text-white text-base">No Orders Found</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                You haven't placed any bids, asks, or orders yet. Browse the marketplace to place your first trade!
              </p>
              <Link
                to="/browse"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-sm mt-2"
              >
                Start Browsing
              </Link>
            </div>
          )}

          {/* Real API Data Render */}
          {!loading && !error && orders.length > 0 && (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {orders.map((item, idx) => (
                <div
                  key={item.id || item.orderId || idx}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl || item.product?.imageUrl || 'https://via.placeholder.com/150'}
                      alt={item.productName || item.product?.name || 'Product'}
                      className="w-16 h-16 object-contain p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                    />
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        {item.sku || item.product?.sku || 'N/A'} • Size: {item.size || 'N/A'}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.productName || item.product?.name || 'Marketplace Item'}
                      </h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        ID: #{item.id || item.orderId || idx + 1000} • {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                    <div className="text-left sm:text-right">
                      <p className="font-black text-slate-900 dark:text-white text-base">
                        ${item.price || item.totalPrice || 0}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {item.type || item.orderType || 'BUY'}
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {item.status || 'COMPLETED'}
                    </span>
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