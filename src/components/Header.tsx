import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Sparkles,
  PackageCheck,
  MessageCircle,
  SlidersHorizontal,
  ChevronDown,
  LayoutDashboard,
  Video
} from 'lucide-react';
import { ProductCategory } from '../types';
import { CATEGORIES } from '../data/categories';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  activeCategory: ProductCategory | 'All';
  onSelectCategory: (category: ProductCategory | 'All') => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAIStylist: () => void;
  onOpenOrderTracking: () => void;
  onOpenAdmin: () => void;
  onOpenFilter: () => void;
  onOpenVideoCall?: (interest?: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}


export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  activeCategory,
  onSelectCategory,
  onOpenCart,
  onOpenWishlist,
  onOpenAIStylist,
  onOpenOrderTracking,
  onOpenAdmin,
  onOpenFilter,
  onOpenVideoCall,
  searchQuery,
  onSearchChange,
}) => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-30 bg-purple-950/95 backdrop-blur-md text-amber-50 border-b border-purple-800/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Left: Mobile Menu Trigger + Logo */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-amber-200 hover:text-white hover:bg-purple-900/60 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              id="brand-logo-btn"
              onClick={() => {
                onSelectCategory('All');
                onSearchChange('');
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-amber-300 p-0.5 shadow-lg group-hover:scale-105 transition-all shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Nalinam Boutique Logo"
                  className="w-full h-full rounded-full object-cover bg-purple-950 border border-amber-300/60"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <span className="block font-serif font-bold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-300 to-amber-100 tracking-wide">
                  NALINAM
                </span>
                <span className="block text-[10px] sm:text-xs text-amber-300/90 tracking-[0.25em] uppercase font-sans font-medium">
                  Boutique • நளினம்
                </span>
              </div>
            </button>
          </div>

          {/* Middle: Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search Kanjivaram silk, Anarkali, Lehengas..."
                className="w-full bg-purple-900/40 text-amber-100 placeholder-purple-300/60 text-sm rounded-full pl-10 pr-10 py-2.5 border border-purple-700/60 focus:border-amber-400 focus:bg-purple-900/80 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-amber-300/80 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white text-xs bg-purple-800 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Request Video Call Button */}
            {onOpenVideoCall && (
              <button
                id="video-call-nav-btn"
                onClick={() => onOpenVideoCall()}
                className="hidden md:flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-purple-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-md transition-all hover:scale-105"
                title="Request WhatsApp Video Shopping Call"
              >
                <Video className="w-3.5 h-3.5 text-purple-950" />
                <span>Video Shopping</span>
              </button>
            )}

            {/* AI Stylist Button */}
            <button
              id="ai-stylist-nav-btn"
              onClick={onOpenAIStylist}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-pink-400/40 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>AI Style Assistant</span>
            </button>


            {/* Order Tracking */}
            <button
              id="order-tracking-nav-btn"
              onClick={onOpenOrderTracking}
              className="p-2 text-amber-200/90 hover:text-white hover:bg-purple-900/60 rounded-full transition-colors relative"
              title="Track Order"
            >
              <PackageCheck className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              id="wishlist-nav-btn"
              onClick={onOpenWishlist}
              className="p-2 text-amber-200/90 hover:text-pink-400 hover:bg-purple-900/60 rounded-full transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-pink-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="cart-nav-btn"
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-purple-950 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-full shadow-lg transition-all hover:scale-105"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-4 sm:h-4 text-purple-950" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-950 text-amber-300 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-amber-400">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Bag ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Sarees, Salwars, Lehengas..."
              className="w-full bg-purple-900/50 text-amber-100 placeholder-purple-300/60 text-xs rounded-full pl-9 pr-9 py-2 border border-purple-700/60 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-amber-300/80 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              onClick={onOpenFilter}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-300 hover:text-white p-1"
              title="Filter"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Desktop Category Navigation Menu */}
        <nav className="hidden lg:flex items-center justify-between border-t border-purple-900/80 py-2.5 text-xs font-medium tracking-wider uppercase">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onSelectCategory('All')}
              className={`transition-colors pb-1 border-b-2 font-semibold ${
                activeCategory === 'All'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-purple-200 hover:text-amber-200'
              }`}
            >
              All Collections
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`transition-colors pb-1 border-b-2 font-semibold ${
                  activeCategory === cat.name
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-purple-200 hover:text-amber-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenFilter}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-100 bg-purple-900/40 px-3 py-1 rounded-full border border-purple-700/50 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters & Sort</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-purple-950 border-t border-purple-800 p-4 space-y-3 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-purple-800/60">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-300">
              Shop Categories
            </span>
            <button
              onClick={onOpenAIStylist}
              className="flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-pink-600 to-purple-700 text-white px-2.5 py-1 rounded-full"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>AI Stylist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1 pt-1">
            <button
              onClick={() => {
                onSelectCategory('All');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === 'All'
                  ? 'bg-amber-400 text-purple-950 font-bold'
                  : 'text-amber-100 hover:bg-purple-900'
              }`}
            >
              All Collections
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.name);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  activeCategory === cat.name
                    ? 'bg-amber-400 text-purple-950 font-bold'
                    : 'text-amber-100 hover:bg-purple-900'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs opacity-75">({cat.featuredCount})</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-purple-800/60 flex items-center justify-between gap-2 text-xs text-amber-200">
            <button
              onClick={() => {
                onOpenOrderTracking();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 hover:text-white"
            >
              <PackageCheck className="w-4 h-4 text-amber-400" />
              <span>Track Order Status</span>
            </button>

            <a
              href="https://wa.me/919043970969?text=Hello%20Nalinam%20Boutique!%20I%20would%20like%20to%20inquire%20about%20your%20saree%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
