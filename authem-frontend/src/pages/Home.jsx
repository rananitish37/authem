import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, ArrowRight, Flame, Sparkles } from 'lucide-react';

// Sample market data for sneakers
const FEATURED_PRODUCTS = [
  {
    id: 'aj1-chicago-lost-found',
    name: 'Air Jordan 1 Retro High OG',
    colorway: 'Chicago Lost & Found',
    lowestAsk: 385,
    highestBid: 370,
    totalSales: 14200,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
    tag: 'Top Seller',
  },
  {
    id: 'nike-dunk-low-panda',
    name: 'Nike Dunk Low',
    colorway: 'White Black (Panda)',
    lowestAsk: 115,
    highestBid: 110,
    totalSales: 89400,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    tag: 'Trending',
  },
  {
    id: 'yeezy-350-v2-onyx',
    name: 'Adidas Yeezy Boost 350 V2',
    colorway: 'Onyx',
    lowestAsk: 230,
    highestBid: 215,
    totalSales: 22100,
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
    tag: 'Popular',
  },
  {
    id: 'travis-scott-jordan-1-low',
    name: 'Air Jordan 1 Low OG SP',
    colorway: 'Travis Scott Reverse Mocha',
    lowestAsk: 1120,
    highestBid: 1080,
    totalSales: 5400,
    imageUrl: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80',
    tag: 'Grail',
  },
];

const BRANDS = [
  { name: 'Jordan', logo: '🏀', bg: 'bg-red-50 text-red-600 border-red-200' },
  { name: 'Nike', logo: '✔️', bg: 'bg-blue-50 text-blue-600 border-blue-200' },
  { name: 'Adidas', logo: '👟', bg: 'bg-zinc-100 text-zinc-800 border-zinc-300' },
  { name: 'Yeezy', logo: '🔥', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Supreme', logo: '🔴', bg: 'bg-red-100 text-red-700 border-red-300' },
  { name: 'Fear of God', logo: '⚡', bg: 'bg-stone-100 text-stone-800 border-stone-300' },
];

export const Home = () => {
  return (
    <div className="space-y-12 pb-16">

      {/* 1. Hero Banner */}
      <section className="relative bg-authem-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold text-authem-green">
              <Sparkles className="w-4 h-4" />
              <span>Live Market Data & Verified Authenticity</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
              Buy & Sell <br />
              <span className="text-authem-green">Authentic</span> Heat
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-lg font-normal leading-relaxed">
              Authem is the live marketplace for sneakers, streetwear, and collectibles. Every item is verified by hand before it reaches your door.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/browse"
                className="px-6 py-3.5 rounded-full bg-authem-green hover:bg-authem-greenHover text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                Browse Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/sell"
                className="px-6 py-3.5 rounded-full border border-slate-600 hover:border-white text-white font-extrabold text-sm uppercase tracking-wider transition-all"
              >
                Sell an Item
              </Link>
            </div>
          </div>

          {/* Featured Hero Product Showcase */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
              <div className="absolute top-4 right-4 bg-authem-green text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </div>

              <img
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"
                alt="Air Jordan 1 Lost and Found"
                className="w-full h-64 object-contain rounded-lg drop-shadow-2xl my-4 hover:scale-105 transition-transform duration-300"
              />

              <div className="border-t border-slate-700/80 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Featured Drop</p>
                  <h3 className="font-black text-lg text-white">Air Jordan 1 Chicago</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase">Lowest Ask</p>
                  <p className="text-xl font-extrabold text-authem-green">$385</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Top Brands Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-authem-dark uppercase tracking-wide flex items-center gap-2">
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
            <h2 className="text-2xl font-black text-authem-dark uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-authem-green" /> Trending Drops
            </h2>
            <p className="text-slate-500 text-xs font-semibold">Real-time lowest asks across top sizes</p>
          </div>
          <Link
            to="/browse"
            className="text-sm font-extrabold text-authem-green hover:underline flex items-center gap-1 uppercase"
          >
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-white border border-authem-border rounded-xl p-4 hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Product Badge */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-authem-grayBg text-slate-700 rounded-md">
                    {product.tag}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {product.totalSales.toLocaleString()} Sold
                  </span>
                </div>

                {/* Sneaker Image */}
                <div className="h-44 flex items-center justify-center p-2 mb-3 bg-authem-grayBg/50 rounded-lg group-hover:bg-authem-grayBg transition-colors">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-36 object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Sneaker Info */}
                <h3 className="font-extrabold text-sm text-authem-dark group-hover:text-authem-green transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-1">
                  {product.colorway}
                </p>
              </div>

              {/* Pricing Section */}
              <div className="pt-3 border-t border-authem-border flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Lowest Ask</p>
                  <p className="text-lg font-black text-authem-dark">${product.lowestAsk}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Highest Bid</p>
                  <p className="text-xs font-bold text-slate-600">${product.highestBid}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};