import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  ArrowLeft,
  X,
  Loader2
} from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();

  // Dynamic state
  const [product, setProduct] = useState(null);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI Interactive state
  const [timeframe, setTimeframe] = useState('3M');
  const [activeModal, setActiveModal] = useState(null); // 'buy' | 'sell' | null
  const [tradeType, setTradeType] = useState('instant'); // 'instant' | 'custom'
  const [customPrice, setCustomPrice] = useState('');

  // Fetch product data on mount/route change
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/v1/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details.');
        }
        const data = await response.json();

        setProduct(data);

        // Map sizes array from response OR generate fallback size options
        let sizes = data.sizes || [];
        if (sizes.length === 0) {
          const defaultSizes = ['8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];
          sizes = defaultSizes.map((sz) => ({
            size: sz,
            lowestAskPrice: data.lowestAskPrice ?? 0,
            highestBidPrice: data.highestBidPrice ?? 0
          }));
        }

        setSizeOptions(sizes);

        // Default to first available size
        if (sizes.length > 0) {
          setSelectedSize(sizes[0]);
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Derived current pricing based on selected size or top-level product stats
  const currentAsk = selectedSize?.lowestAskPrice ?? product?.lowestAskPrice ?? 0;
  const currentBid = selectedSize?.highestBidPrice ?? product?.highestBidPrice ?? 0;

  // Handle Loading & Error States
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Product Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{error || "The requested item couldn't be loaded."}</p>
          <Link
            to="/browse"
            className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen pb-20 transition-colors">

      {/* Top Breadcrumb Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <Link to="/browse" className="hover:text-slate-900 dark:hover:text-white">Sneakers</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT COLUMN: Main Image & Description */}
          <div className="lg:col-span-7 space-y-8">

            {/* Main Product Title */}
            <div>
              <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                100% Verified Authentic
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {product.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-base mt-1">
                {product.colorway}
              </p>
            </div>

            {/* Sneaker Image Stage */}
            <div className="relative bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-8 flex items-center justify-center">
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-extrabold text-slate-900 dark:text-white shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Condition: New
              </div>

              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full max-h-[380px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs">
              <div>
                <p className="text-slate-400 dark:text-slate-400 font-bold uppercase">SKU</p>
                <p className="font-extrabold text-slate-900 dark:text-white">{product.sku || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-400 font-bold uppercase">Retail Price</p>
                <p className="font-extrabold text-slate-900 dark:text-white">${product.retailPrice || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-400 font-bold uppercase">Brand</p>
                <p className="font-extrabold text-slate-900 dark:text-white">{product.brand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-400 font-bold uppercase">Total Sales</p>
                <p className="font-extrabold text-slate-900 dark:text-white">
                  {product.totalSales ? product.totalSales.toLocaleString() : 0}
                </p>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white uppercase tracking-wide">Product Details</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
                {product.description || 'No description available for this item.'}
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Live Market Orderbook & Actions */}
          <div className="lg:col-span-5 space-y-6">

            {/* Last Sale & Ticker Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Last Sale</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {product.lastSalePrice ? `$${product.lastSalePrice}` : '--'}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5" /> +${product.changePrice || 0} ({product.changePercent || '0%'})
                </span>
              </div>
            </div>

            {/* Size Selector Box */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Select Size (US Men)
                </label>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline">
                  Size Guide
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map((item) => {
                  const isSelected = selectedSize?.size === item.size;
                  const itemAsk = item.lowestAskPrice ?? item.lowestAsk ?? product.lowestAskPrice ?? 0;
                  return (
                    <button
                      key={item.size}
                      onClick={() => setSelectedSize(item)}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-slate-500'
                      }`}
                    >
                      <p className="text-xs font-black">{item.size}</p>
                      <p className={`text-[10px] font-bold mt-0.5 ${isSelected ? 'text-emerald-400 dark:text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>
                        {itemAsk ? `$${itemAsk}` : '--'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Buttons (Buy vs Sell) */}
            <div className="grid grid-cols-2 gap-4 pt-2">

              {/* BUY / BID Button */}
              <button
                disabled={!selectedSize}
                onClick={() => {
                  setActiveModal('buy');
                  setTradeType('instant');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-4 rounded-xl font-extrabold text-center transition-all shadow-md group"
              >
                <p className="text-xs uppercase tracking-wider text-emerald-100 font-bold">Buy Now For</p>
                <p className="text-2xl font-black">{currentAsk ? `$${currentAsk}` : '--'}</p>
                <p className="text-[10px] text-emerald-100 mt-1 uppercase group-hover:underline">Or Place Bid</p>
              </button>

              {/* SELL / ASK Button */}
              <button
                disabled={!selectedSize}
                onClick={() => {
                  setActiveModal('sell');
                  setTradeType('instant');
                }}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-white p-4 rounded-xl font-extrabold text-center transition-all shadow-md group border border-transparent dark:border-slate-700"
              >
                <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">Sell Now For</p>
                <p className="text-2xl font-black">{currentBid ? `$${currentBid}` : '--'}</p>
                <p className="text-[10px] text-slate-300 mt-1 uppercase group-hover:underline">Or Place Ask</p>
              </button>

            </div>

            {/* Price History Chart */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4 bg-white dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Price History
                </h4>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-bold">
                  {['1M', '3M', '6M', '1Y', 'ALL'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        timeframe === tf
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-40 w-full pt-4 flex items-end">
                <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                  <path
                    d="M 0 90 Q 60 70, 120 80 T 240 40 T 360 20 L 400 35"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                  />
                  <path
                    d="M 0 90 Q 60 70, 120 80 T 240 40 T 360 20 L 400 35 L 400 120 L 0 120 Z"
                    fill="url(#greenGradient)"
                    opacity="0.15"
                  />
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Authenticity Guarantee Card */}
            <div className="border border-slate-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">Authem Guarantee</h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Every product is physically inspected and authenticated by our specialists before being delivered.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* BUY / PLACE BID MODAL */}
      {activeModal === 'buy' && selectedSize && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 relative shadow-2xl border border-slate-200 dark:border-slate-700">

            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">Size {selectedSize.size}</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{product.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl font-extrabold text-xs">
              <button
                onClick={() => setTradeType('instant')}
                className={`py-2 rounded-lg transition-all ${
                  tradeType === 'instant' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Buy Now (${currentAsk})
              </button>
              <button
                onClick={() => setTradeType('custom')}
                className={`py-2 rounded-lg transition-all ${
                  tradeType === 'custom' ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Place Bid
              </button>
            </div>

            {tradeType === 'custom' ? (
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">Your Custom Bid ($)</label>
                <input
                  type="number"
                  placeholder={`Higher than $${currentBid}`}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-lg px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase">Immediate Purchase Price</p>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${currentAsk}</p>
              </div>
            )}

            <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                <span>Item Price</span>
                <span>${tradeType === 'instant' ? currentAsk : Number(customPrice) || 0}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                <span>Processing Fee (3%)</span>
                <span>${Math.round((tradeType === 'instant' ? currentAsk : Number(customPrice) || 0) * 0.03)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                <span>Verification Shipping</span>
                <span>$14.50</span>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Payment</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  ${(tradeType === 'instant' ? currentAsk : Number(customPrice) || 0) + Math.round((tradeType === 'instant' ? currentAsk : Number(customPrice) || 0) * 0.03) + 14.50}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-md"
            >
              {tradeType === 'instant' ? 'Confirm Purchase' : 'Submit Bid'}
            </button>

          </div>
        </div>
      )}

      {/* SELL / PLACE ASK MODAL */}
      {activeModal === 'sell' && selectedSize && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 relative shadow-2xl border border-slate-200 dark:border-slate-700">

            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase">Size {selectedSize.size}</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{product.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl font-extrabold text-xs">
              <button
                onClick={() => setTradeType('instant')}
                className={`py-2 rounded-lg transition-all ${
                  tradeType === 'instant' ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Sell Now (${currentBid})
              </button>
              <button
                onClick={() => setTradeType('custom')}
                className={`py-2 rounded-lg transition-all ${
                  tradeType === 'custom' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Place Ask
              </button>
            </div>

            {tradeType === 'custom' ? (
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">Your Asking Price ($)</label>
                <input
                  type="number"
                  placeholder={`Lower than $${currentAsk}`}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-lg px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            ) : (
              <div className="p-4 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-center">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Immediate Payout Price</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">${currentBid}</p>
              </div>
            )}

            <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                <span>Sale Price</span>
                <span>${tradeType === 'instant' ? currentBid : Number(customPrice) || 0}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                <span>Seller Fee (9.5%)</span>
                <span>-${Math.round((tradeType === 'instant' ? currentBid : Number(customPrice) || 0) * 0.095)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                <span>Payment Processing (3%)</span>
                <span>-${Math.round((tradeType === 'instant' ? currentBid : Number(customPrice) || 0) * 0.03)}</span>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Net Estimated Payout</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  ${Math.max(0, (tradeType === 'instant' ? currentBid : Number(customPrice) || 0) - Math.round((tradeType === 'instant' ? currentBid : Number(customPrice) || 0) * 0.125))}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-md"
            >
              {tradeType === 'instant' ? 'Confirm Instant Sale' : 'Submit Ask'}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};