import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, ArrowRight, Flame, Sparkles, Loader2 } from 'lucide-react';
import API from '../services/api';

const BRANDS = [
  { name: 'Jordan', logo: '🏀', bg: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50' },
  { name: 'Nike', logo: '✔️', bg: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50' },
  { name: 'Adidas', logo: '👟', bg: 'bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-slate-800 dark:text-zinc-200 dark:border-slate-700' },
  { name: 'Yeezy', logo: '🔥', bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50' },
  { name: 'Supreme', logo: '🔴', bg: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50' },
  { name: 'Fear of God', logo: '⚡', bg: 'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700' },
];

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [heroProduct, setHeroProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trending/featured products on mount from master catalog
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await API.get('/v1/products/browse', {
          params: { page: 0, size: 8, sort: 'id,desc' }
        });

        const rawList = Array.isArray(response.data) ? response.data : (response.data?.content || []);

        const mapped = rawList.map((item) => ({
          id: item.id,
          name: item.name,
          colorway: item.colorway || item.brand || '',
          brand: item.brand,
          sku: item.sku,
          lowestAsk: item.lowestAskPrice ?? item.lowestAsk ?? item.retailPrice ?? 0,
          highestBid: item.highestBidPrice ?? item.highestBid ?? 0,
          retailPrice: item.retailPrice ?? 0,
          imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
          totalSales: 124
        }));

        setFeaturedProducts(mapped);
        if (mapped.length > 0) {
          setHeroProduct(mapped[0]);
        }
      } catch (err) {
        console.error('Home data fetch error:', err);
        setError('Error loading homepage products.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-12 pb-16 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">

      {/* 1. Hero Banner */}
      <section className="relative bg-slate-900 dark:bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Live Market Data & Verified Authenticity</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
              Buy & Sell <br />
              <span className="text-emerald-400">Authentic</span> Heat
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-lg font-normal leading-relaxed">
              Authem is the live marketplace for sneakers, streetwear, and collectibles. Every item is verified by hand before it reaches your door.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/browse"
                className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                Browse Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/seller/create-ask"
                className="px-6 py-3.5 rounded-full border border-slate-600 hover:border-white text-white font-extrabold text-sm uppercase tracking-wider transition-all"
              >
                Sell an Item
              </Link>
            </div>
          </div>

          {/* Dynamic Hero Product Showcase */}
          <div className="relative flex justify-center">
            {heroProduct ? (
              <Link
                to={`/productdetails/${heroProduct.id}`}
                className="relative w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm shadow-2xl block hover:border-emerald-500/50 transition-colors"
              >
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </div>

                <img
                  src={heroProduct.imageUrl}
                  alt={heroProduct.name}
                  className="w-full h-64 object-contain rounded-lg drop-shadow-2xl my-4 hover:scale-105 transition-transform duration-300"
                />

                <div className="border-t border-slate-700/80 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Featured Drop</p>
                    <h3 className="font-black text-lg text-white truncate max-w-[200px]">{heroProduct.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase">Lowest Ask</p>
                    <p className="text-xl font-extrabold text-emerald-400">${heroProduct.lowestAsk || heroProduct.retailPrice}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="w-full max-w-md h-80 bg-slate-800/30 border border-slate-800 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-slate-600 animate-spin" />
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 2. Top Brands Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" /> Popular Brands
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {BRANDS.map((brand) => (
            <Link
              key={brand.name}
              to={`/browse?brand=${brand.name.toLowerCase()}`}
              className={`p-4 rounded-xl border flex items-center gap-3 font-bold text-sm hover:shadow-md transition-all ${brand.bg}`}
            >
              <span className="text-xl">{brand.logo}</span>
              <span>{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Trending Sneakers Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" /> Trending Drops
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Real-time lowest asks across top sizes</p>
          </div>
          <Link
            to="/browse"
            className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 uppercase"
          >
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Trending Items...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <p className="text-slate-500 dark:text-slate-400 text-sm">{error}</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/productdetails/${product.id}`}
                className="group bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Product Badge */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md">
                      Verified
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400">
                      {product.brand}
                    </span>
                  </div>

                  {/* Sneaker Image */}
                  <div className="h-44 flex items-center justify-center p-2 mb-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-colors">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-h-36 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Sneaker Info */}
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4 line-clamp-1">
                    {product.colorway}
                  </p>
                </div>

                {/* Pricing Section */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase">Lowest Ask</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">${product.lowestAsk || product.retailPrice || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase">Highest Bid</p>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">${product.highestBid ? `$${product.highestBid}` : '--'}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};