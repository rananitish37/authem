import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Menu, X, ShieldCheck, Settings } from 'lucide-react';
import { AuthemLogo } from '../common/AuthemLogo';
import { useAuthStore } from '../../store/useAuthStore';
import ThemeToggle from './ThemeToggle';

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-authem-border dark:border-slate-800 shadow-sm transition-colors">
      {/* Top Banner */}
     <div className="bg-slate-950 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2">
       <ShieldCheck className="w-4 h-4 text-authem-green" />
        <span>100% Verified Authentic Sneakers, Apparel & Collectibles</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <AuthemLogo className="h-8" />
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl relative hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for brand, colorway, or SKU (e.g., Air Jordan 1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-authem-grayBg dark:bg-slate-800 text-authem-dark dark:text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2 rounded-full border border-transparent focus:border-authem-green focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-sm font-medium"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </form>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/browse"
              className="text-sm font-bold text-slate-700 hover:text-authem-green dark:text-slate-200 dark:hover:text-authem-green transition-colors"
            >
              Browse
            </Link>

            {/* Main Seller Button */}
            <Link
              to="/seller/create-ask"
              className="px-4 py-1.5 text-xs font-bold rounded-full bg-authem-green hover:bg-authem-greenHover text-white transition-colors shadow-sm"
            >
              Sell
            </Link>

            {/* Dark / Light Theme Switcher */}
            <ThemeToggle />

            {/* Auth State Conditional Rendering */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-bold text-authem-dark dark:text-slate-100 hover:text-authem-green focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-authem-dark dark:bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                    {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                  </div>
                  <span>{user?.firstName || 'Account'}</span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 border border-authem-border dark:border-slate-700 z-50">
                    <div className="px-4 py-2 border-b border-authem-border dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-authem-dark dark:text-white truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-authem-grayBg dark:hover:bg-slate-700"
                    >
                      <User className="w-4 h-4" /> Portfolio & Orders
                    </Link>

                    {/* Admin Link inside dropdown */}
                    <Link
                      to="/admin/catalog"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-authem-grayBg dark:hover:bg-slate-700"
                    >
                      <Settings className="w-4 h-4" /> Admin Catalog
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-bold text-slate-700 hover:text-authem-green dark:text-slate-200 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-bold bg-authem-dark dark:bg-slate-800 text-white rounded-full hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-authem-dark dark:text-slate-200 p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search sneakers, apparel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-authem-grayBg dark:bg-slate-800 text-authem-dark dark:text-slate-100 pl-10 pr-4 py-2 rounded-full border border-transparent focus:border-authem-green focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm font-medium"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          </form>
        </div>
      </div>

      {/* Categories Sub-bar */}
      <div className="bg-authem-grayBg dark:bg-slate-950 border-t border-authem-border dark:border-slate-800 hidden md:block transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 py-2.5">
            <li className="hover:text-authem-green dark:hover:text-authem-green cursor-pointer"><Link to="/browse?category=sneakers">Sneakers</Link></li>
            <li className="hover:text-authem-green dark:hover:text-authem-green cursor-pointer"><Link to="/browse?category=shoes">Shoes</Link></li>
            <li className="hover:text-authem-green dark:hover:text-authem-green cursor-pointer"><Link to="/browse?category=apparel">Apparel</Link></li>
            <li className="hover:text-authem-green dark:hover:text-authem-green cursor-pointer"><Link to="/browse?category=electronics">Electronics</Link></li>
            <li className="hover:text-authem-green dark:hover:text-authem-green cursor-pointer"><Link to="/browse?category=trading-cards">Trading Cards</Link></li>
            <li className="hover:text-authem-green dark:hover:text-authem-green cursor-pointer"><Link to="/browse?category=accessories">Accessories</Link></li>
            <li className="text-authem-green hover:underline cursor-pointer"><Link to="/browse?sort=trending">Trending</Link></li>
          </ul>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-authem-border dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/browse"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-bold text-authem-dark dark:text-slate-100 py-2"
          >
            Browse All
          </Link>
          <Link
            to="/seller/create-ask"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-bold text-authem-green py-2"
          >
            Sell / Create Ask
          </Link>

          <div className="border-t border-authem-border dark:border-slate-800 pt-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-bold text-authem-dark dark:text-slate-100 py-2"
                >
                  My Portfolio ({user?.firstName})
                </Link>
                <Link
                  to="/admin/catalog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-bold text-slate-600 dark:text-slate-300 py-2"
                >
                  Admin Catalog
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left text-base font-bold text-red-600 dark:text-red-400 py-2"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 font-bold text-authem-dark dark:text-slate-100 border border-authem-dark dark:border-slate-700 rounded-full"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 font-bold bg-authem-dark dark:bg-slate-800 text-white rounded-full"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};