import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Lock, Globe } from 'lucide-react';
import { AuthemLogo } from '../common/AuthemLogo';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800 transition-colors">
      {/* Verification & Trust Guarantee Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base tracking-wide uppercase text-white">100% Verified Authentic</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every item sold on Authem is physically inspected by our expert authentication team before shipment.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base tracking-wide uppercase text-white">Live Market Pricing</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Buy and sell at true market value driven by real-time bid and ask data from global buyers and sellers.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base tracking-wide uppercase text-white">Secure Transactions</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Payment is secured until your item passes our multi-point authentication check and ships to you.
            </p>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Column 1: Brand Info */}
          <div className="col-span-2 space-y-4">
            <AuthemLogo className="h-8" showText={true} />
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Authem is the world’s premier live-market platform for authentic sneakers, streetwear, electronics, and luxury goods.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold pt-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Global Marketplace | English (US) | USD ($)</span>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h5 className="font-extrabold text-sm uppercase tracking-wider text-white mb-4">Categories</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/browse?category=sneakers" className="hover:text-emerald-400 transition-colors">Sneakers</Link></li>
              <li><Link to="/browse?category=apparel" className="hover:text-emerald-400 transition-colors">Apparel</Link></li>
              <li><Link to="/browse?category=electronics" className="hover:text-emerald-400 transition-colors">Electronics</Link></li>
              <li><Link to="/browse?category=collectibles" className="hover:text-emerald-400 transition-colors">Collectibles</Link></li>
              <li><Link to="/browse?category=accessories" className="hover:text-emerald-400 transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Column 3: Popular Brands */}
          <div>
            <h5 className="font-extrabold text-sm uppercase tracking-wider text-white mb-4">Popular Brands</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/browse?brand=nike" className="hover:text-emerald-400 transition-colors">Nike</Link></li>
              <li><Link to="/browse?brand=jordan" className="hover:text-emerald-400 transition-colors">Air Jordan</Link></li>
              <li><Link to="/browse?brand=adidas" className="hover:text-emerald-400 transition-colors">Adidas / Yeezy</Link></li>
              <li><Link to="/browse?brand=supreme" className="hover:text-emerald-400 transition-colors">Supreme</Link></li>
              <li><Link to="/browse?brand=fear-of-god" className="hover:text-emerald-400 transition-colors">Fear of God</Link></li>
            </ul>
          </div>

          {/* Column 4: Support & Company */}
          <div>
            <h5 className="font-extrabold text-sm uppercase tracking-wider text-white mb-4">Support</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/help" className="hover:text-emerald-400 transition-colors">Help Center</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              <li><Link to="/verification" className="hover:text-emerald-400 transition-colors">Verification Process</Link></li>
              <li><Link to="/sell" className="hover:text-emerald-400 transition-colors">Sell on Authem</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© {new Date().getFullYear()} Authem, Inc. All Rights Reserved.</p>
        <div className="flex gap-6">
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/security" className="hover:text-white transition-colors">Security</Link>
          <Link to="/cookies" className="hover:text-white transition-colors">Cookie Preferences</Link>
        </div>
      </div>
    </footer>
  );
};