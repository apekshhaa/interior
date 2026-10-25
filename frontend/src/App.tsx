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
import { FEATURED_HOME_SERVICES, SHOP_PRODUCTS } from './data/catalogue';
import { Check, X } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(SHOP_PRODUCTS[4]); // Commercial Scale Model default
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string>('');

  // Prepopulate initial cart similar to reference recording for seamless testing
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: FEATURED_HOME_SERVICES[0], // Artisan Texture Consultation
      quantity: 1,
    },
  ]);

  // Current User (supports authentication flow)
  const [currentUser, setCurrentUser] = useState<User | null>({
    name: 'Adish Devadiga',
    email: 'abhikshardevadiga@gmail.com',
    phone: '+91 9972727446',
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleBookService = (serviceName: string) => {
    setSelectedServiceForBooking(serviceName);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = () => {
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingConfirmed = (details: BookingDetails, refId: string) => {
    // Empty the cart on successful completion
    setCartItems([]);
    showToast(`Quotation request ${refId} submitted!`);
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
            onBookNow={handleOpenBooking}
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
            items={cartItems}
            currentUser={currentUser}
            onRemoveItem={handleRemoveItem}
            onBookingConfirmed={handleBookingConfirmed}
            onBackToCart={() => handleNavigate('cart')}
            defaultServiceName={selectedServiceForBooking}
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
              setCurrentUser(null);
              showToast('You have been signed out.');
            }}
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
        onLogout={() => setCurrentUser(null)}
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
