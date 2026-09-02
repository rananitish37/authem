import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  Check,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import API from '../services/api';

const BRANDS = ['Nike', 'Jordan', 'adidas', 'New Balance', 'ASICS'];
const CATEGORIES = ['Men', 'Women', 'Unisex', 'Kids'];
const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Lowest Ask: Low to High', value: 'price_asc' },
  { label: 'Lowest Ask: High to Low', value: 'price_desc' },
  { label: 'Newest Arrivals', value: 'newest' }
];

export const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // API Data State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.get('brand') ? [searchParams.get('brand')] : []
  );
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch API Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await API.get('/v1/products/browse');
        const data = response.data;
        const rawItems = Array.isArray(data) ? data : (data.content || []);

        const mappedProducts = rawItems.map((item) => {
          const askPrice = item.lowestAskPrice ?? item.lowestAsk ?? item.retailPrice;
          return {
            id: item.id,
            name: item.name,
            colorway: item.colorway || item.description || '',
            brand: item.brand,
            category: item.category || 'Unisex',
            sku: item.sku,
            lowestAskPrice: askPrice ? Number(askPrice) : null,
            highestBidPrice: item.highestBidPrice ? Number(item.highestBidPrice) : null,
            retailPrice: item.retailPrice ? Number(item.retailPrice) : null,
            imageUrl: item.imageUrl || item.primaryImageUrl || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
            createdAt: item.createdAt
          };
        });

        setProducts(mappedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMaxPrice(1000);
    setSearchQuery('');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const queryMatch =
          searchQuery === '' ||
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.colorway?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchQuery.toLowerCase());

        const brandMatch =
          selectedBrands.length === 0 || selectedBrands.includes(product.brand);

        const categoryMatch =
          selectedCategories.length === 0 || selectedCategories.includes(product.category);

        const priceMatch = (product.lowestAskPrice || 0) <= maxPrice;

        return queryMatch && brandMatch && categoryMatch && priceMatch;
      })
      .sort((a, b) => {
        const priceA = a.lowestAskPrice || 0;
        const priceB = b.lowestAskPrice || 0;

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        return b.id - a.id;
      });
  }, [products, searchQuery, selectedBrands, selectedCategories, maxPrice, sortBy]);

  const activeFilterCount =
    selectedBrands.length + selectedCategories.length + (maxPrice < 1000 ? 1 : 0);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 antialiased pb-16">

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-8 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                Live Marketplace
              </span>
              <h1 className="text-3xl font-black tracking-tight text-white mt-1">Browse Authentic Sneakers</h1>
              <p className="text-slate-300 text-sm mt-1">
                Buy and sell verified authentic footwear at real-time market prices.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search models, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 text-white placeholder-slate-400 border border-slate-700 rounded-lg pl-10 pr-8 py-2 w-full text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-900 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filters
              {activeFilterCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <p className="text-xs font-extrabold text-slate-600">
              Showing <span className="text-slate-900 font-black">{filteredProducts.length}</span> Results
            </p>
          </div>

          {/* Active Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedBrands.map((brand) => (
              <span
                key={brand}
                onClick={() => handleBrandToggle(brand)}
                className="inline-flex items-center gap-1.5 bg-slate-200 border border-slate-300 text-slate-800 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer hover:bg-slate-300"
              >
                {brand} <X className="w-3 h-3 text-slate-600" />
              </span>
            ))}

            {selectedCategories.map((cat) => (
              <span
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className="inline-flex items-center gap-1.5 bg-slate-200 border border-slate-300 text-slate-800 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer hover:bg-slate-300"
              >
                {cat} <X className="w-3 h-3 text-slate-600" />
              </span>
            ))}

            {maxPrice < 1000 && (
              <span
                onClick={() => setMaxPrice(1000)}
                className="inline-flex items-center gap-1.5 bg-slate-200 border border-slate-300 text-slate-800 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer hover:bg-slate-300"
              >
                Under ${maxPrice} <X className="w-3 h-3 text-slate-600" />
              </span>
            )}

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-extrabold text-emerald-600 hover:underline ml-1"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label className="text-xs font-black uppercase text-slate-500">Sort By:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-300 text-slate-900 font-extrabold text-xs pl-3 pr-8 py-2.5 rounded-xl cursor-pointer focus:outline-none focus:border-slate-900 shadow-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">

          {/* SIDEBAR FILTERS */}
          <div className="hidden lg:block lg:col-span-3 space-y-8 pr-4">

            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filter Products
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Brand Checkboxes */}
            <div className="space-y-3 border-t border-slate-200 pt-5">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Brand</h4>
              <div className="space-y-2">
                {BRANDS.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      onClick={() => handleBrandToggle(brand)}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <span className="text-xs font-extrabold text-slate-700 group-hover:text-slate-900">
                        {brand}
                      </span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 group-hover:border-slate-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3 border-t border-slate-200 pt-5">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Max Price</h4>
                <span className="text-xs font-black text-emerald-600">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>$50</span>
                <span>$1000+</span>
              </div>
            </div>

            {/* Authenticity Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <p className="font-extrabold text-xs text-slate-900">Verified Authentic</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Every sneaker sold is inspected by expert authenticators before shipment.
              </p>
            </div>

          </div>

          {/* PRODUCT CARDS */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <p className="text-xs font-bold uppercase tracking-wider">Fetching live catalog...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 border border-red-200 bg-red-50 rounded-2xl p-8 space-y-3">
                <p className="text-sm font-bold text-red-700">Failed to load marketplace items</p>
                <p className="text-xs text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl"
                >
                  Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-300 bg-white rounded-2xl p-8 space-y-4">
                <Search className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-black text-slate-900">No Sneakers Found</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  We couldn't find any products matching your current search and filter criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/productdetails/${product.id}`}
                    className="group border border-slate-200 rounded-2xl p-4 bg-white hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Brand & Badge */}
                      <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500 mb-2">
                        <span>{product.brand}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                          Verified
                        </span>
                      </div>

                      {/* Image Box */}
                      <div className="bg-slate-100 border border-slate-200/80 rounded-xl p-4 flex items-center justify-center mb-4 group-hover:bg-slate-200/60 transition-colors h-44">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-36 w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>

                      {/* Title & Subtitle */}
                      <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold line-clamp-1 mt-0.5">
                        {product.colorway || product.sku}
                      </p>
                    </div>

                    {/* Price Breakdown */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">Lowest Ask</p>
                        <p className="text-lg font-black text-slate-900">
                          {product.lowestAskPrice ? `$${product.lowestAskPrice}` : 'None'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Highest Bid</span>
                        <span className="text-xs font-bold text-slate-700">
                          {product.highestBidPrice ? `$${product.highestBidPrice}` : 'None'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};