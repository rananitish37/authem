import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  Tag,
  ArrowLeft,
  CheckCircle2,
  Info,
  X,
  ChevronDown
} from 'lucide-react';

// Sample Product Data
const PRODUCT_DATA = {
  id: 'aj1-chicago-lost-found',
  name: 'Air Jordan 1 Retro High OG',
  colorway: 'Chicago Lost & Found',
  sku: 'DZ5485-612',
  retailPrice: 180,
  releaseDate: '11/19/2022',
  description: 'The Air Jordan 1 Retro High OG Chicago Lost & Found brings back the iconic 1985 colorway with pre-aged, vintage aesthetic detailing. Features cracked leather collars, aged white leather quarters, and a distressed retro shoe box inspired by original mom-and-pop sneaker shop discoveries.',
  imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  lastSale: 390,
  changePrice: 15,
  changePercent: '+4.0%',
  totalSales: 14200,
};

// Available US Sizes with custom ask/bid pairs
const SIZE_OPTIONS = [
  { size: 'US 7', lowestAsk: 410, highestBid: 380 },
  { size: 'US 7.5', lowestAsk: 395, highestBid: 375 },
  { size: 'US 8', lowestAsk: 385, highestBid: 370 },
  { size: 'US 8.5', lowestAsk: 380, highestBid: 365 },
  { size: 'US 9', lowestAsk: 385, highestBid: 370 },
  { size: 'US 9.5', lowestAsk: 390, highestBid: 375 },
  { size: 'US 10', lowestAsk: 400, highestBid: 385 },
  { size: 'US 10.5', lowestAsk: 405, highestBid: 390 },
  { size: 'US 11', lowestAsk: 420, highestBid: 400 },
  { size: 'US 11.5', lowestAsk: 435, highestBid: 410 },
  { size: 'US 12', lowestAsk: 450, highestBid: 425 },
  { size: 'US 13', lowestAsk: 480, highestBid: 450 },
];

export const ProductDetail = () => {
  const { id } = useParams();

  // Selected state
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[2]); // Default US 8
  const [timeframe, setTimeframe] = useState('3M');
  const [activeModal, setActiveModal] = useState(null); // 'buy' | 'sell' | null
  const [tradeType, setTradeType] = useState('instant'); // 'instant' | 'custom'
  const [customPrice, setCustomPrice] = useState('');

  const currentAsk = selectedSize.lowestAsk;
  const currentBid = selectedSize.highestBid;

  return (
    <div className="bg-white min-h-screen pb-20">

      {/* Top Breadcrumb Header */}
      <div className="border-b border-authem-border bg-authem-grayBg/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-authem-dark flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <Link to="/browse?category=sneakers" className="hover:text-authem-dark">Sneakers</Link>
          <span>/</span>
          <span className="text-authem-dark truncate">{PRODUCT_DATA.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT COLUMN: Main Image & Description */}
          <div className="lg:col-span-7 space-y-8">

            {/* Main Product Title */}
            <div>
              <span className="text-xs font-black uppercase text-authem-green tracking-wider">
                100% Verified Authentic
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-authem-dark tracking-tight mt-1">
                {PRODUCT_DATA.name}
              </h1>
              <p className="text-slate-500 font-bold text-base mt-1">
                {PRODUCT_DATA.colorway}
              </p>
            </div>

            {/* Sneaker Image Stage */}
            <div className="relative bg-authem-grayBg/60 border border-authem-border rounded-2xl p-8 flex items-center justify-center">
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white border border-authem-border px-3 py-1 rounded-full text-xs font-extrabold text-authem-dark shadow-sm">
                <ShieldCheck className="w-4 h-4 text-authem-green" /> Condition: New
              </div>

              <img
                src={PRODUCT_DATA.imageUrl}
                alt={PRODUCT_DATA.name}
                className="w-full max-h-[380px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-authem-grayBg/40 border border-authem-border rounded-xl text-xs">
              <div>
                <p className="text-slate-400 font-bold uppercase">SKU</p>
                <p className="font-extrabold text-authem-dark">{PRODUCT_DATA.sku}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase">Retail Price</p>
                <p className="font-extrabold text-authem-dark">${PRODUCT_DATA.retailPrice}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase">Release Date</p>
                <p className="font-extrabold text-authem-dark">{PRODUCT_DATA.releaseDate}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase">Total Sales</p>
                <p className="font-extrabold text-authem-dark">{PRODUCT_DATA.totalSales.toLocaleString()}</p>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-lg text-authem-dark uppercase tracking-wide">Product Details</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                {PRODUCT_DATA.description}
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Live Market Orderbook & Actions */}
          <div className="lg:col-span-5 space-y-6">

            {/* Last Sale & Ticker Box */}
            <div className="p-4 bg-authem-grayBg/50 border border-authem-border rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Last Sale</p>
                <p className="text-2xl font-black text-authem-dark">${PRODUCT_DATA.lastSale}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-authem-green bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                  <TrendingUp className="w-3.5 h-3.5" /> +${PRODUCT_DATA.changePrice} ({PRODUCT_DATA.changePercent})
                </span>
              </div>
            </div>

            {/* Size Selector Box */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Select Size (US Men)
                </label>
                <span className="text-xs font-bold text-authem-green cursor-pointer hover:underline">
                  Size Guide
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {SIZE_OPTIONS.map((item) => {
                  const isSelected = selectedSize.size === item.size;
                  return (
                    <button
                      key={item.size}
                      onClick={() => setSelectedSize(item)}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-authem-dark bg-authem-dark text-white shadow-md'
                          : 'border-authem-border bg-white text-authem-dark hover:border-slate-400'
                      }`}
                    >
                      <p className="text-xs font-black">{item.size}</p>
                      <p className={`text-[10px] font-bold mt-0.5 ${isSelected ? 'text-authem-green' : 'text-slate-500'}`}>
                        ${item.lowestAsk}
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
                onClick={() => {
                  setActiveModal('buy');
                  setTradeType('instant');
                }}
                className="bg-authem-green hover:bg-authem-greenHover text-white p-4 rounded-xl font-extrabold text-center transition-all shadow-md group"
              >
                <p className="text-xs uppercase tracking-wider text-green-100 font-bold">Buy Now For</p>
                <p className="text-2xl font-black">${currentAsk}</p>
                <p className="text-[10px] text-green-100 mt-1 uppercase group-hover:underline">Or Place Bid</p>
              </button>

              {/* SELL / ASK Button */}
              <button
                onClick={() => {
                  setActiveModal('sell');
                  setTradeType('instant');
                }}
                className="bg-authem-dark hover:bg-slate-800 text-white p-4 rounded-xl font-extrabold text-center transition-all shadow-md group"
              >
                <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">Sell Now For</p>
                <p className="text-2xl font-black">${currentBid}</p>
                <p className="text-[10px] text-slate-300 mt-1 uppercase group-hover:underline">Or Place Ask</p>
              </button>

            </div>

            {/* Interactive Price History Chart Wrapper */}
            <div className="border border-authem-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm uppercase text-authem-dark flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-authem-green" /> Price History
                </h4>

                {/* Timeframe Toggles */}
                <div className="flex items-center gap-1 bg-authem-grayBg p-1 rounded-lg text-xs font-bold">
                  {['1M', '3M', '6M', '1Y', 'ALL'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        timeframe === tf
                          ? 'bg-white text-authem-dark shadow-sm'
                          : 'text-slate-500 hover:text-authem-dark'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated SVG Graph */}
              <div className="h-40 w-full pt-4 flex items-end">
                <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                  <path
                    d="M 0 90 Q 60 70, 120 80 T 240 40 T 360 20 L 400 35"
                    fill="none"
                    stroke="#00805D"
                    strokeWidth="3"
                  />
                  <path
                    d="M 0 90 Q 60 70, 120 80 T 240 40 T 360 20 L 400 35 L 400 120 L 0 120 Z"
                    fill="url(#greenGradient)"
                    opacity="0.15"
                  />
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00805D" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Authenticity Guarantee Card */}
            <div className="border border-slate-200 bg-emerald-50/50 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-authem-green flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-extrabold text-sm text-authem-dark">Authem Guarantee</h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Every product is physically inspected and authenticated by our specialists before being delivered.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* BUY / PLACE BID MODAL */}
      {/* ========================================== */}
      {activeModal === 'buy' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 relative shadow-2xl">

            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-authem-dark"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-extrabold text-authem-green uppercase">Size {selectedSize.size}</span>
              <h3 className="text-xl font-black text-authem-dark">{PRODUCT_DATA.name}</h3>
            </div>

            {/* Toggle Buy Now vs Place Bid */}
            <div className="grid grid-cols-2 gap-2 bg-authem-grayBg p-1 rounded-xl font-extrabold text-xs">
              <button
                onClick={() => setTradeType('instant')}
                className={`py-2 rounded-lg transition-all ${
                  tradeType === 'instant' ? 'bg-authem-green text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Buy Now (${currentAsk})
              </button>
              <button
                onClick={() => setTradeType('custom')}
                className={`py-2 rounded-lg transition-all ${
                  tradeType === 'custom' ? 'bg-authem-dark text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Place Bid
              </button>
            </div>

            {/* Price Inputs */}
            {tradeType === 'custom' ? (
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase">Your Custom Bid ($)</label>
                <input
                  type="number"
                  placeholder={`Higher than $${currentBid}`}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full bg-authem-grayBg text-authem-dark font-extrabold text-lg px-4 py-3 rounded-xl border border-authem-border focus:border-authem-green focus:outline-none"
                />
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <p className="text-xs font-bold text-emerald-800 uppercase">Immediate Purchase Price</p>
                <p className="text-3xl font-black text-authem-green mt-1">${currentAsk}</p>
              </div>
            )}

            {/* Fee Breakdown */}
            <div className="space-y-2 border-t border-authem-border pt-4 text-xs">
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Item Price</span>
                <span>${tradeType === 'instant' ? currentAsk : Number(customPrice) || 0}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Processing Fee (3%)</span>
                <span>${Math.round((tradeType === 'instant' ? currentAsk : Number(customPrice) || 0) * 0.03)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Verification Shipping</span>
                <span>$14.50</span>
              </div>
              <div className="flex justify-between text-authem-dark font-black text-sm pt-2 border-t border-authem-border">
                <span>Total Payment</span>
                <span className="text-authem-green">
                  ${(tradeType === 'instant' ? currentAsk : Number(customPrice) || 0) + Math.round((tradeType === 'instant' ? currentAsk : Number(customPrice) || 0) * 0.03) + 14.50}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={() => {
                alert('Order placed successfully! Connecting with Spring Boot Backend.');
                setActiveModal(null);
              }}
              className="w-full bg-authem-green hover:bg-authem-greenHover text-white py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-md"
            >
              {tradeType === 'instant' ? 'Confirm Purchase' : 'Submit Bid'}
            </button>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SELL / PLACE ASK MODAL */}
      {/* ========================================== */}
      {activeModal === 'sell' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 relative shadow-2xl">

            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-authem-dark"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-extrabold text-authem-dark uppercase">Size {selectedSize.size}</span>
              <h3 className="text-xl font-black text-authem-dark">{PRODUCT_DATA.name}</h3>
            </div>

            {/* Toggle Sell Now vs Place Ask */}
            <div className="grid grid-cols-2 gap-2 bg-authem-grayBg p-1 rounded-xl font-extrabold text-xs">
              <button
                onClick={() => setTradeType('instant')}
                className={`py-2 rounded-lg transition-all ${
                  tradeType === 'instant' ? 'bg-authem-dark text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Sell Now (${currentBid})
              </button>
              <button
                onClick={() => setTradeType('custom')}
                className={`py-2 rounded-lg transition-all ${
                  tradeType === 'custom' ? 'bg-authem-green text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Place Ask
              </button>
            </div>

            {/* Price Inputs */}
            {tradeType === 'custom' ? (
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase">Your Asking Price ($)</label>
                <input
                  type="number"
                  placeholder={`Lower than $${currentAsk}`}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full bg-authem-grayBg text-authem-dark font-extrabold text-lg px-4 py-3 rounded-xl border border-authem-border focus:border-authem-green focus:outline-none"
                />
              </div>
            ) : (
              <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-center">
                <p className="text-xs font-bold text-slate-700 uppercase">Immediate Payout Price</p>
                <p className="text-3xl font-black text-authem-dark mt-1">${currentBid}</p>
              </div>
            )}

            {/* Seller Fee Breakdown */}
            <div className="space-y-2 border-t border-authem-border pt-4 text-xs">
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Sale Price</span>
                <span>${tradeType === 'instant' ? currentBid : Number(customPrice) || 0}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Seller Fee (9.5%)</span>
                <span>-${Math.round((tradeType === 'instant' ? currentBid : Number(customPrice) || 0) * 0.095)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Payment Processing (3%)</span>
                <span>-${Math.round((tradeType === 'instant' ? currentBid : Number(customPrice) || 0) * 0.03)}</span>
              </div>
              <div className="flex justify-between text-authem-dark font-black text-sm pt-2 border-t border-authem-border">
                <span>Net Estimated Payout</span>
                <span className="text-authem-green">
                  ${Math.max(0, (tradeType === 'instant' ? currentBid : Number(customPrice) || 0) - Math.round((tradeType === 'instant' ? currentBid : Number(customPrice) || 0) * 0.125))}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={() => {
                alert('Ask placed successfully! Connecting with Spring Boot Backend.');
                setActiveModal(null);
              }}
              className="w-full bg-authem-dark hover:bg-slate-800 text-white py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-md"
            >
              {tradeType === 'instant' ? 'Confirm Instant Sale' : 'Submit Ask'}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};