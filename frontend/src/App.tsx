/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageType, Product, CartItem, User, BookingDetails } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { SHOP_PRODUCTS } from './data/catalogue';
import { Check, X } from 'lucide-react';
import { ApiError, authApi, bookingApi } from './lib/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(SHOP_PRODUCTS[4]); // Commercial Scale Model default
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string>('');
  const [bookingPrefill, setBookingPrefill] = useState<Partial<BookingDetails>>({});
  const [bookingSession, setBookingSession] = useState(0);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    authApi.me()
      .then(({ user }) => setCurrentUser(user))
      .catch((error) => {
        if (!(error instanceof ApiError) || error.status !== 401) {
          console.error('Unable to restore authentication session');
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  // Cart total count
  const cartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookService = (serviceName: string, prefill: Partial<BookingDetails> = {}) => {
    setBookingSession((value) => value + 1);
    setSelectedServiceForBooking(serviceName);
    setBookingPrefill(prefill);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (prefill: Partial<BookingDetails> = {}) => {
    setBookingSession((value) => value + 1);
    setBookingPrefill(prefill);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingConfirmed = (details: BookingDetails, refId: string) => {
    setCartItems([]);
    showToast(`Quotation request ${refId} submitted!`);
  };

  const handleAuthenticate = async (input: {
    mode: 'login' | 'signup';
    name?: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword?: string;
    rememberMe?: boolean;
  }) => {
    const result =
      input.mode === 'signup'
        ? await authApi.signup({
            name: input.name || '',
            email: input.email,
            phone: input.phone || '',
            password: input.password,
            confirmPassword: input.confirmPassword || '',
          })
        : await authApi.login({
            email: input.email,
            password: input.password,
            rememberMe: input.rememberMe || false,
          });
    setCurrentUser(result.user);
    return result.user;
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setCurrentUser(null);
      setAuthModalOpen(false);
      handleNavigate('home');
    } catch {
      showToast('Unable to sign out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E9EDF0] text-[#1e1e1e] font-sans selection:bg-[#321B35] selection:text-[#E9EDF0]">
      {/* Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenBooking={handleOpenBooking}
        isHeroOverlay={currentPage === 'home'}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onBookService={(serviceName, prefill) => handleBookService(serviceName, prefill)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onBookService={handleBookService}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onBookNow={(title) => handleBookService(title)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onBookNow={handleOpenBooking}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
            onBookNow={(prefill) => handleOpenBooking(prefill)}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigate={handleNavigate}
            onProceedToCheckout={() => handleNavigate('checkout')}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            key={bookingSession}
            items={cartItems}
            currentUser={currentUser}
            onRemoveItem={handleRemoveItem}
            onBookingConfirmed={handleBookingConfirmed}
            onBackToCart={() => handleNavigate('cart')}
            defaultServiceName={selectedServiceForBooking}
            initialDetails={bookingPrefill}
            onCreateBooking={(details) => bookingApi.create(details, cartItems)}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            currentUser={currentUser}
            onLogin={(u) => {
              setCurrentUser(u);
              showToast(`Welcome, ${u.name}!`);
            }}
            onLogout={() => {
              void handleLogout().then(() => showToast('You have been signed out.'));
            }}
            onAuthenticate={handleAuthenticate}
            onNavigate={handleNavigate}
            cartItems={cartItems}
            onUpdateUser={(u) => {
              setCurrentUser(u);
              showToast('Profile updated.');
            }}
          />
        )}
      </main>

      {/* Footer (matches reference) */}
      <Footer onNavigate={handleNavigate} />

      {/* Auth Modal for Login / Sign Up */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(u) => setCurrentUser(u)}
        onLogout={() => void handleLogout()}
        onAuthenticate={handleAuthenticate}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#321B35] text-[#E9EDF0] px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-[#F2B632]/40 text-xs sm:text-sm animate-bounce">
          <Check className="w-4 h-4 text-[#F2B632]" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-80"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
