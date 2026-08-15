import React, { useState, useEffect } from 'react';
import { Search, Tag, CheckCircle2, ArrowLeft, DollarSign, Layers } from 'lucide-react';

const US_SIZES = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];

export default function SellerCreateAsk() {
  const [step, setStep] = useState(1); // Step 1: Search & Select, Step 2: Choose Size & Price
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Ask Form State
  const [selectedSize, setSelectedSize] = useState('');
  const [askPrice, setAskPrice] = useState('');
  const [condition, setCondition] = useState('NEW_BOX');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAsk, setSuccessAsk] = useState(null);

  // Search Master Catalog API
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/seller/catalog/search?query=${searchQuery}&size=8`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.content || []);
        }
      } catch (err) {
        console.error('Failed to query master catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCatalog, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setStep(2);
  };

  const handleSubmitAsk = async (e) => {
    e.preventDefault();
    if (!selectedSize || !askPrice) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/seller/asks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterProductId: selectedProduct.id,
          size: selectedSize,
          askPrice: parseFloat(askPrice),
          condition: condition
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessAsk(data);
        setStep(3); // Success step
      }
    } catch (err) {
      console.error('Error submitting ask:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sell a Sneaker</h1>
            <p className="text-sm text-slate-400">List an Ask in the Authem master catalog</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1. Select Product</span>
            <span className="text-slate-600">→</span>
            <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2. Set Price</span>
          </div>
        </div>

        {/* STEP 1: CATALOG SEARCH */}
        {step === 1 && (
          <div>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search master catalog by name (e.g. 'Lost & Found') or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-base"
              />
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500">Searching master catalog...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectProduct(item)}
                    className="bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl p-4 cursor-pointer transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-40 bg-slate-950 rounded-lg flex items-center justify-center p-2 mb-3 overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="max-h-full object-contain group-hover:scale-105 transition duration-300" />
                      </div>
                      <span className="text-xs font-mono text-indigo-400">{item.sku}</span>
                      <h3 className="font-semibold text-white text-sm line-clamp-1 mt-0.5">{item.name}</h3>
                      <p className="text-xs text-slate-400">{item.brand} • {item.colorway}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Retail: ${item.retailPrice}</span>
                      <span className="text-emerald-400 font-medium">
                        {item.lowestAskPrice ? `Lowest Ask: $${item.lowestAskPrice}` : 'No Asks Yet'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SIZE & PRICE FORM */}
        {step === 2 && selectedProduct && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" /> Change Selected Sneaker
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center mb-8 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-24 h-24 object-contain" />
              <div>
                <span className="text-xs font-mono text-indigo-400">{selectedProduct.sku}</span>
                <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>
                <p className="text-xs text-slate-400">{selectedProduct.colorway}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitAsk} className="space-y-6">
              {/* Select Size */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select US Mens Size</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {US_SIZES.map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 rounded-lg text-sm font-semibold border transition ${
                        selectedSize === sz
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Set Ask Price */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Asking Price ($USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Enter amount..."
                    value={askPrice}
                    onChange={(e) => setAskPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold text-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Select Condition */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Item Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="NEW_BOX">Brand New (Original Box)</option>
                  <option value="GOOD_BOX">Brand New (Damaged Box)</option>
                  <option value="NO_BOX">Brand New (No Box)</option>
                  <option value="USED">Pre-Owned / Used</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!selectedSize || !askPrice || isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition"
              >
                {isSubmitting ? 'Posting Ask...' : `List Ask for $${askPrice || '0'}`}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && successAsk && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-lg mx-auto">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Ask Listed Successfully!</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your Ask for Size US {successAsk.size} at ${successAsk.askPrice} is now live. When a buyer's bid matches your price, the order will execute automatically.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setSelectedProduct(null);
                setSelectedSize('');
                setAskPrice('');
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-500 transition"
            >
              List Another Sneaker
            </button>
          </div>
        )}

      </div>
    </div>
  );
}