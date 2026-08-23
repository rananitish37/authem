import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Tag,
  ShoppingBag,
  CheckCircle2,
  LogOut,
  ExternalLink,
  Loader2,
  AlertCircle,
  Wallet as WalletIcon,
  PlusCircle,
  Trash2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  DollarSign,
  X
} from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const Profile = () => {
  const { user, logout, token } = useAuthStore();
  const navigate = useNavigate();

  // State
  const [wallet, setWallet] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'bids' | 'asks'

  // Top Up Modal State
  const [topUpModal, setTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('250');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Fetch all user specific data
  const loadUserData = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

      // Parallel fetch of user data
      const [walletRes, ordersRes, bidsRes, asksRes] = await Promise.allSettled([
        axios.get('/api/v1/wallet', authHeaders),
        axios.get('/api/v1/orders', authHeaders),
        axios.get('/api/v1/trading/bids/my', authHeaders),
        axios.get('/api/v1/trading/asks/my', authHeaders)
      ]);

      if (walletRes.status === 'fulfilled') setWallet(walletRes.value.data);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data);
      if (bidsRes.status === 'fulfilled') setBids(bidsRes.value.data);
      if (asksRes.status === 'fulfilled') setAsks(asksRes.value.data);

    } catch (err) {
      setError('Failed to load user profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [token]);

  // Handle Wallet Top-Up
  const handleTopUp = async (e) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (!amount || amount <= 0) return;

    setTopUpLoading(true);
    try {
      const res = await axios.post('/api/v1/wallet/top-up', { amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWallet(res.data);
      setTopUpModal(false);
      setActionMessage(`Successfully deposited $${amount.toFixed(2)} into your wallet!`);
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Top-up failed.');
    } finally {
      setTopUpLoading(false);
    }
  };

  // Handle Cancel Bid
  const handleCancelBid = async (bidId) => {
    if (!window.confirm('Cancel this bid and return held funds to your wallet?')) return;

    try {
      await axios.delete(`/api/v1/trading/bids/${bidId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActionMessage('Bid cancelled and funds returned to your available balance.');
      setTimeout(() => setActionMessage(''), 4000);
      loadUserData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel bid.');
    }
  };

  // Handle Cancel Ask
  const handleCancelAsk = async (askId) => {
    if (!window.confirm('Cancel this active asking listing?')) return;

    try {
      await axios.delete(`/api/v1/trading/asks/${askId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActionMessage('Ask listing cancelled successfully.');
      setTimeout(() => setActionMessage(''), 4000);
      loadUserData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel ask.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pb-16 transition-colors">

      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 text-white pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* User Avatar */}
            <div className="w-20 h-20 rounded-full bg-emerald-600 border-4 border-slate-800 flex items-center justify-center text-3xl font-black shadow-xl uppercase">
              {user?.firstName ? user.firstName[0] : 'U'}
            </div>

            {/* User Meta */}
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-6">

        {/* Global Action Message Banner */}
        {actionMessage && (
          <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center gap-3 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Financial & Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Wallet Available Balance Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-400">Available Balance</span>
                <WalletIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                ${wallet?.balance ? Number(wallet.balance).toFixed(2) : '0.00'}
              </p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">Ready for bidding & purchases</p>
            </div>

            <button
              onClick={() => setTopUpModal(true)}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Deposit Funds
            </button>
          </div>

          {/* Locked in Bids / Escrow Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-400">Held in Active Bids</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              ${wallet?.frozenBalance ? Number(wallet.frozenBalance).toFixed(2) : '0.00'}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Escrowed for active buy offers</p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs font-bold text-slate-500">
              <span>Active Bids:</span>
              <span className="text-slate-900 dark:text-white">{bids.filter(b => b.status === 'PENDING').length}</span>
            </div>
          </div>

          {/* Orders / Trading Summary Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-400">Total Completed Trades</span>
              <ShoppingBag className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {orders.length}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Purchases & seller payouts</p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs font-bold text-slate-500">
              <span>Active Listings:</span>
              <span className="text-slate-900 dark:text-white">{asks.filter(a => a.status === 'ACTIVE').length}</span>
            </div>
          </div>

        </div>

        {/* Tab Controls */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex gap-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-extrabold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'orders'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('bids')}
            className={`pb-3 text-sm font-extrabold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'bids'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Active Bids ({bids.length})
          </button>

          <button
            onClick={() => setActiveTab('asks')}
            className={`pb-3 text-sm font-extrabold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'asks'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Listings ({asks.length})
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading your portfolio...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">{error}</p>
          </div>
        )}

        {/* TAB 1: USER ORDERS */}
        {!loading && !error && activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
            {orders.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-black text-slate-900 dark:text-white text-base">No Orders Yet</h4>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  When you buy a sneaker or your ask is matched by a buyer, your orders will appear here with live tracking.
                </p>
                <Link
                  to="/browse"
                  className="inline-block bg-emerald-600 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-sm mt-2"
                >
                  Explore Marketplace
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {order.productImageUrl ? (
                        <img
                          src={order.productImageUrl}
                          alt={order.productName}
                          className="w-16 h-16 object-contain p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-slate-400">
                          👟
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Order #{order.orderId}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{order.productName}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          Size US {order.shoeSize} • Role: {order.buyerId === user?.id ? 'Buyer' : 'Seller'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Matched Price</span>
                        <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">
                          ${order.price ? Number(order.price).toFixed(2) : '0.00'}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Status</span>
                        <span className="inline-block mt-0.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {order.status || 'PROCESSING'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE BIDS */}
        {!loading && !error && activeTab === 'bids' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
            {bids.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Tag className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-black text-slate-900 dark:text-white text-base">No Active Bids</h4>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Place a custom bid on any sneaker in the marketplace. When a seller matches your price, the trade executes automatically.
                </p>
                <Link
                  to="/browse"
                  className="inline-block bg-emerald-600 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-sm mt-2"
                >
                  Browse Sneakers
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {bid.productImageUrl ? (
                        <img
                          src={bid.productImageUrl}
                          alt={bid.productName}
                          className="w-16 h-16 object-contain p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-slate-400">
                          👟
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          Bid #{bid.id} • {bid.createdAt ? new Date(bid.createdAt).toLocaleDateString() : ''}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">{bid.productName}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          Size US {bid.shoeSize}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Bid Offer</span>
                        <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">
                          ${bid.bidPrice ? Number(bid.bidPrice).toFixed(2) : '0.00'}
                        </p>
                      </div>

                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${
                          bid.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                          bid.status === 'MATCHED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {bid.status}
                        </span>
                      </div>

                      {bid.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelBid(bid.id)}
                          title="Cancel Bid & Refund Escrow"
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER ASKS / LISTINGS */}
        {!loading && !error && activeTab === 'asks' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
            {asks.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Package className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-black text-slate-900 dark:text-white text-base">No Active Listings</h4>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  List sneakers for sale. Set your asking price and earn payouts when matched.
                </p>
                <Link
                  to="/seller/create-ask"
                  className="inline-block bg-emerald-600 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-sm mt-2"
                >
                  Create New Ask
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {asks.map((ask) => (
                  <div
                    key={ask.askId}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {ask.productImageUrl ? (
                        <img
                          src={ask.productImageUrl}
                          alt={ask.productName}
                          className="w-16 h-16 object-contain p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-slate-400">
                          👟
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          Ask #{ask.askId} • Condition: {ask.condition || 'NEW_BOX'}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">{ask.productName}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          Size US {ask.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Asking Price</span>
                        <p className="font-black text-slate-900 dark:text-white text-lg">
                          ${ask.askPrice ? Number(ask.askPrice).toFixed(2) : '0.00'}
                        </p>
                      </div>

                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${
                          ask.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                          ask.status === 'MATCHED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {ask.status}
                        </span>
                      </div>

                      {ask.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleCancelAsk(ask.askId)}
                          title="Cancel Listing"
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* TOP-UP MODAL */}
      {topUpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 relative shadow-2xl border border-slate-200 dark:border-slate-700">

            <button
              onClick={() => setTopUpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">Instant Deposit</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Top Up Wallet</h3>
              <p className="text-xs text-slate-500 mt-1">Add funds to place bids and execute instant purchases.</p>
            </div>

            <form onSubmit={handleTopUp} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {['100', '250', '500', '1000'].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setTopUpAmount(preset)}
                    className={`py-2 text-xs font-black rounded-xl border transition-all ${
                      topUpAmount === preset
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    +${preset}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Custom Amount ($)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full mt-1 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-lg px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={topUpLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                {topUpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm ${parseFloat(topUpAmount || 0).toFixed(2)} Deposit
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};