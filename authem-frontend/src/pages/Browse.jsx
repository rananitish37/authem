import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  Check,
  ShieldCheck,
  ArrowUpDown,
  Grid,
  ListFilter
} from 'lucide-react';

// Sample Catalog Data
const CATALOG_PRODUCTS = [
  {
    id: 'aj1-chicago-lost-found',
    name: 'Air Jordan 1 Retro High OG',
    colorway: 'Chicago Lost & Found',
    brand: 'Jordan',
    category: 'Men',
    condition: 'New',
    lowestAsk: 380,
    lastSale: 390,
    totalSales: 14200,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2022
  },
  {
    id: 'yeezy-350-v2-zebra',
    name: 'adidas Yeezy Boost 350 V2',
    colorway: 'Zebra',
    brand: 'adidas',
    category: 'Men',
    condition: 'New',
    lowestAsk: 260,
    lastSale: 255,
    totalSales: 28900,
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2017
  },
  {
    id: 'nike-dunk-low-panda',
    name: 'Nike Dunk Low',
    colorway: 'White Black (Panda)',
    brand: 'Nike',
    category: 'Unisex',
    condition: 'New',
    lowestAsk: 115,
    lastSale: 120,
    totalSales: 54000,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2021
  },
  {
    id: 'travis-scott-jordan-1-low-olive',
    name: 'Air Jordan 1 Retro Low OG SP',
    colorway: 'Travis Scott Medium Olive',
    brand: 'Jordan',
    category: 'Women',
    condition: 'New',
    lowestAsk: 485,
    lastSale: 510,
    totalSales: 8900,
    imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2023
  },
  {
    id: 'new-balance-9060-rain-cloud',
    name: 'New Balance 9060',
    colorway: 'Rain Cloud Grey',
    brand: 'New Balance',
    category: 'Unisex',
    condition: 'New',
    lowestAsk: 145,
    lastSale: 150,
    totalSales: 6300,
    imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2022
  },
  {
    id: 'asics-gel-kayano-14-silver',
    name: 'ASICS Gel-Kayano 14',
    colorway: 'Cream Black Metallic Plum',
    brand: 'ASICS',
    category: 'Men',
    condition: 'New',
    lowestAsk: 210,
    lastSale: 205,
    totalSales: 4100,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2023
  },
  {
    id: 'fear-of-god-athletics-los-angeles',
    name: 'Fear of God Athletics I Basketball',
    colorway: 'Carbon',
    brand: 'adidas',
    category: 'Men',
    condition: 'New',
    lowestAsk: 180,
    lastSale: 190,
    totalSales: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2023
  },
  {
    id: 'kobe-8-protro-venice-beach',
    name: 'Nike Kobe 8 Protro',
    colorway: 'Venice Beach (2024)',
    brand: 'Nike',
    category: 'Men',
    condition: 'New',
    lowestAsk: 290,
    lastSale: 305,
    totalSales: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80',
    releaseYear: 2024
  }
];

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

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.get('brand') ? [searchParams.get('brand')] : []
  );
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(600);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Toggle brand selection
  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Toggle category selection
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMaxPrice(600);
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      // Search query match
      const queryMatch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.colorway.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      // Brand match
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      // Category match
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      // Price match
      const priceMatch = product.lowestAsk <= maxPrice;

      return queryMatch && brandMatch && categoryMatch && priceMatch;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.lowestAsk - b.lowestAsk;
      if (sortBy === 'price_desc') return b.lowestAsk - a.lowestAsk;
      if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
      return b.totalSales - a.totalSales; // 'popular'
    });
  }, [searchQuery, selectedBrands, selectedCategories, maxPrice, sortBy]);

  const activeFilterCount =
    selectedBrands.length + selectedCategories.length + (maxPrice < 600 ? 1 : 0);

  return (
    <div className="bg-white dark:bg-authem-dark text-slate-900 dark:text-slate-100 transition-colors">

      {/* Header Banner */}
      <div className="bg-authem-dark text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-authem-green tracking-wider">
                Live Marketplace
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-1">Browse Authentic Sneakers</h1>
              <p className="text-slate-400 text-sm mt-1">
                Buy and sell verified authentic footwear at real-time market prices.
              </p>
            </div>

            {/* In-page Quick Search */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search models, colorways..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2"
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

        {/* Controls Toolbar (Filter Toggle, Active Tags, Sort Dropdown) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-authem-border">

          <div className="flex items-center gap-3">
            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-authem-grayBg border border-authem-border px-4 py-2.5 rounded-xl text-xs font-extrabold text-authem-dark"
            >
              <SlidersHorizontal className="w-4 h-4 text-authem-green" /> Filters
              {activeFilterCount > 0 && (
                <span className="bg-authem-green text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <p className="text-xs font-extrabold text-slate-500">
              Showing <span className="text-authem-dark font-black">{filteredProducts.length}</span> Results
            </p>
          </div>

          {/* Active Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedBrands.map((brand) => (
              <span
                key={brand}
                onClick={() => handleBrandToggle(brand)}
                className="inline-flex items-center gap-1.5 bg-authem-grayBg border border-slate-300 text-authem-dark px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer hover:bg-slate-200"
              >
                {brand} <X className="w-3 h-3 text-slate-500" />
              </span>
            ))}

            {selectedCategories.map((cat) => (
              <span
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className="inline-flex items-center gap-1.5 bg-authem-grayBg border border-slate-300 text-authem-dark px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer hover:bg-slate-200"
              >
                {cat} <X className="w-3 h-3 text-slate-500" />
              </span>
            ))}

            {maxPrice < 600 && (
              <span
                onClick={() => setMaxPrice(600)}
                className="inline-flex items-center gap-1.5 bg-authem-grayBg border border-slate-300 text-authem-dark px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer hover:bg-slate-200"
              >
                Under ${maxPrice} <X className="w-3 h-3 text-slate-500" />
              </span>
            )}

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-extrabold text-authem-green hover:underline ml-1"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label className="text-xs font-black uppercase text-slate-400">Sort By:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-authem-grayBg border border-authem-border text-authem-dark font-extrabold text-xs pl-3 pr-8 py-2.5 rounded-xl cursor-pointer focus:outline-none focus:border-authem-dark"
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

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">

          {/* DESKTOP SIDEBAR FILTERS */}
          <div className="hidden lg:block lg:col-span-3 space-y-8 pr-4">

            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm uppercase tracking-wider text-authem-dark flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-authem-green" /> Filter Products
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-slate-400 hover:text-authem-dark"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="space-y-3 border-t border-authem-border pt-5">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Brand</h4>
              <div className="space-y-2">
                {BRANDS.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      onClick={() => handleBrandToggle(brand)}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <span className="text-xs font-extrabold text-slate-600 group-hover:text-authem-dark">
                        {brand}
                      </span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-authem-green border-authem-green text-white'
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

            {/* Price Range Slider */}
            <div className="space-y-3 border-t border-authem-border pt-5">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Max Price</h4>
                <span className="text-xs font-black text-authem-green">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-authem-green cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>$100</span>
                <span>$600+</span>
              </div>
            </div>

            {/* Gender / Category Filter */}
            <div className="space-y-3 border-t border-authem-border pt-5">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Category</h4>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <span className="text-xs font-extrabold text-slate-600 group-hover:text-authem-dark">
                        {cat}
                      </span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-authem-green border-authem-green text-white'
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

            {/* Authenticity Banner */}
            <div className="p-4 bg-authem-grayBg border border-authem-border rounded-xl space-y-2">
              <ShieldCheck className="w-6 h-6 text-authem-green" />
              <p className="font-extrabold text-xs text-authem-dark">Verified Authentic Guarantee</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Every sneaker sold on Authem is rigorously inspected by expert authenticators before shipment.
              </p>
            </div>

          </div>

          {/* PRODUCT CARDS GRID */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-authem-border rounded-2xl p-8 space-y-4">
                <Search className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-black text-authem-dark">No Sneakers Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find any products matching your current search and filter criteria. Try broadening your selection.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-authem-dark hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group border border-authem-border rounded-2xl p-4 bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Badge Row */}
                      <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                        <span>{product.brand}</span>
                        <span className="text-authem-green bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          Verified
                        </span>
                      </div>

                      {/* Image Stage */}
                      <div className="bg-authem-grayBg/60 border border-authem-border/50 rounded-xl p-4 flex items-center justify-center mb-4 group-hover:bg-slate-100 transition-colors">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-36 w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                        />
                      </div>

                      {/* Product Names */}
                      <h4 className="font-extrabold text-sm text-authem-dark line-clamp-1 group-hover:text-authem-green transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-bold line-clamp-1 mt-0.5">
                        {product.colorway}
                      </p>
                    </div>

                    {/* Price / Ask Breakdown */}
                    <div className="mt-4 pt-3 border-t border-authem-border/60 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Lowest Ask</p>
                        <p className="text-lg font-black text-authem-dark">${product.lowestAsk}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Sale</span>
                        <span className="text-xs font-extrabold text-slate-600">${product.lastSale}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* MOBILE FILTERS DRAWER */}
      {/* ========================================== */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 flex flex-col justify-between overflow-y-auto space-y-6">

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-authem-border pb-4">
                <h3 className="font-black text-base uppercase text-authem-dark flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-authem-green" /> Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-slate-400 hover:text-authem-dark"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Brands */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Brand</h4>
                <div className="space-y-2">
                  {BRANDS.map((brand) => (
                    <label
                      key={brand}
                      onClick={() => handleBrandToggle(brand)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-xs font-extrabold text-slate-600">{brand}</span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedBrands.includes(brand)
                            ? 'bg-authem-green border-authem-green text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {selectedBrands.includes(brand) && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div className="space-y-3 border-t border-authem-border pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Max Price</h4>
                  <span className="text-xs font-black text-authem-green">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-authem-green"
                />
              </div>

              {/* Categories */}
              <div className="space-y-3 border-t border-authem-border pt-4">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Category</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-xs font-extrabold text-slate-600">{cat}</span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selectedCategories.includes(cat)
                            ? 'bg-authem-green border-authem-green text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {selectedCategories.includes(cat) && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="space-y-2 border-t border-authem-border pt-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-authem-green hover:bg-authem-greenHover text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full bg-authem-grayBg text-slate-600 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider"
              >
                Reset
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};