import React, { useState } from 'react';
import { Product, PageType } from '../types';
import { Check, ArrowLeft, Shield, Sparkles } from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: PageType) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBookNow: (productName: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onAddToCart,
  onBookNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] py-8 sm:py-12 px-6 sm:px-10 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb matching Video Frame 35 ("Shop › [Title]") */}
        <div className="mb-10 text-xs sm:text-sm text-[#1e1e1e]/60 font-light flex items-center gap-2">
          <button
            onClick={() => onNavigate('shop')}
            className="hover:text-[#321B35] underline underline-offset-2 transition-colors cursor-pointer"
          >
            Shop
          </button>
          <span>›</span>
          <span className="text-[#1e1e1e] font-normal">{product.name}</span>
        </div>

        {/* 2-Column Product Detail Layout matching Video Frame 35 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Product Image */}
          <div className="lg:col-span-7 aspect-[4/3] bg-black/5 overflow-hidden shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Right Column: Information, Price, Quantity & Add To Cart */}
          <div className="lg:col-span-5 space-y-6 lg:pt-4">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#1e1e1e] font-normal tracking-tight leading-[1.12]">
                {product.name}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-2xl font-light text-[#1e1e1e]">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#1e1e1e]/40 line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.isSale && (
                  <span className="text-xs bg-[#F2B632]/20 text-[#321B35] px-2 py-0.5 rounded-full font-medium">
                    Special Offer
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#1e1e1e]/80 leading-relaxed font-light">
              {product.fullDescription || product.description}
            </p>

            {/* Finish Specifications */}
            <div className="p-4 bg-white/60 rounded-2xl border border-[#321B35]/10 space-y-2 text-xs text-[#1e1e1e]/80">
              {product.finishType && (
                <div className="flex justify-between">
                  <span className="text-[#1e1e1e]/60">Finish Type:</span>
                  <span className="font-medium text-[#321B35]">{product.finishType}</span>
                </div>
              )}
              {product.coverage && (
                <div className="flex justify-between">
                  <span className="text-[#1e1e1e]/60">Coverage / Unit:</span>
                  <span className="font-medium text-[#321B35]">{product.coverage}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#1e1e1e]/60">Artisan Service:</span>
                <span className="font-medium text-[#321B35]">Mangalore & Coastal Karnataka</span>
              </div>
            </div>

            {/* Quantity Pill + Add To Cart Button matching Video Frame 35 */}
            <div className="flex items-center gap-4 pt-4">
              {/* Quantity Pill */}
              <div className="flex items-center justify-between border border-[#1e1e1e]/30 rounded-full px-4 py-2.5 w-32 bg-white/50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-base font-light hover:text-[#321B35] cursor-pointer px-1"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-base font-light hover:text-[#321B35] cursor-pointer px-1"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add To Cart Pill Button */}
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3 px-8 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-[#F2B632]" />
                    <span>Added To Cart!</span>
                  </>
                ) : (
                  <span>Add To Cart</span>
                )}
              </button>
            </div>

            {/* Direct Booking CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onBookNow(product.name)}
                className="w-full py-2.5 rounded-full border border-[#321B35] text-[#321B35] text-xs font-medium hover:bg-[#321B35]/5 transition-colors cursor-pointer"
              >
                Book Site Consultation for this Finish →
              </button>
            </div>

            {/* Quality Note */}
            <div className="pt-4 border-t border-[#321B35]/10 flex items-center gap-3 text-xs text-[#1e1e1e]/70">
              <Shield className="w-4 h-4 text-[#F2B632]" />
              <span>Backed by 20 years of craftsmanship in Mangalore</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
