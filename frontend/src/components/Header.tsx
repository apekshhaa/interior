import React, { useState } from 'react';
import { PageType, User } from '../types';
import { ShoppingBag, User as UserIcon, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  cartCount: number;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenBooking: () => void;
  isHeroOverlay?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  currentUser,
  onOpenAuth,
  onOpenBooking,
  isHeroOverlay = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // When on home page with hero overlay, text can be white/light over dark hero image
  const isDarkHero = isHeroOverlay && currentPage === 'home';

  const navClass = (page: PageType) => {
    const isActive = currentPage === page;
    if (isDarkHero) {
      return `transition-colors duration-200 text-sm tracking-wide ${
        isActive
          ? 'text-white border-b border-white pb-0.5 font-medium'
          : 'text-white/80 hover:text-white'
      }`;
    }
    return `transition-colors duration-200 text-sm tracking-wide ${
      isActive
        ? 'text-[#321B35] border-b border-[#321B35] pb-0.5 font-medium'
        : 'text-[#1e1e1e]/80 hover:text-[#321B35]'
    }`;
  };

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${
        isDarkHero
          ? 'absolute top-0 left-0 bg-transparent'
          : 'bg-[#E9EDF0] border-b border-[#321B35]/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6 flex items-center justify-between">
        {/* Brand Logo - High-end Serif matching video */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span
            className={`font-serif text-2xl sm:text-3xl tracking-tight transition-colors ${
              isDarkHero ? 'text-white' : 'text-[#321B35]'
            }`}
          >
            Colour Tone
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => onNavigate('services')}
            className={navClass('services')}
          >
            Services
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className={navClass('shop')}
          >
            Textures & Colours
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={navClass('about')}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={navClass('contact')}
          >
            Contact
          </button>
          <button
            onClick={() => onNavigate('cart')}
            className={`${navClass('cart')} flex items-center gap-1.5`}
          >
            <span>My Selection</span>
          </button>

          {/* User Sign In / Profile status */}
          <button
            onClick={() => onNavigate('auth')}
            className={`flex items-center gap-1.5 text-xs tracking-wider px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              currentPage === 'auth'
                ? 'bg-[#321B35] text-white font-medium'
                : currentUser
                ? isDarkHero
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-[#321B35]/10 text-[#321B35] hover:bg-[#321B35]/20'
                : isDarkHero
                ? 'text-white/90 hover:text-white border border-white/40 hover:border-white'
                : 'text-[#321B35] hover:text-[#321B35] border border-[#321B35]/30 hover:border-[#321B35]'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
          </button>

          {/* Book now Pill Button matching Video */}
          <button
            onClick={onOpenBooking}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer ${
              isDarkHero
                ? 'bg-[#E9EDF0] text-[#321B35] hover:bg-white hover:shadow-md'
                : 'bg-[#321B35] text-white hover:bg-[#432347] hover:shadow-md'
            }`}
          >
            Book now
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => onNavigate('cart')}
            className={`relative p-1.5 ${isDarkHero ? 'text-white' : 'text-[#321B35]'}`}
            aria-label="View My Selection"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F2B632] text-[#321B35] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 focus:outline-none ${isDarkHero ? 'text-white' : 'text-[#321B35]'}`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#E9EDF0] border-b border-[#321B35]/15 px-6 py-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-[#321B35] font-serif text-lg border-b border-[#321B35]/10"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('services');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-[#321B35] font-serif text-lg border-b border-[#321B35]/10"
            >
              Services
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-[#321B35] font-serif text-lg border-b border-[#321B35]/10"
            >
              Textures & Colours
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-[#321B35] font-serif text-lg border-b border-[#321B35]/10"
            >
              About (20 Yrs Experience)
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-[#321B35] font-serif text-lg border-b border-[#321B35]/10"
            >
              Contact
            </button>
            <button
              onClick={() => {
                onNavigate('cart');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-[#321B35] font-serif text-lg flex items-center justify-between border-b border-[#321B35]/10"
            >
              <span>My Selection</span>
              <span className="bg-[#321B35] text-white text-xs px-2.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  onNavigate('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-full border border-[#321B35] text-[#321B35] text-sm font-medium"
              >
                {currentUser ? `Account: ${currentUser.name}` : 'Login / Sign Up'}
              </button>
              <button
                onClick={() => {
                  onOpenBooking();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-full bg-[#321B35] text-white text-sm font-medium shadow-md"
              >
                Book Now (Site Visit)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
