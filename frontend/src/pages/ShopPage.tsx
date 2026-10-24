import React from 'react';
import { Product } from '../types';
import { SHOP_PRODUCTS } from '../data/catalogue';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] py-12 px-6 sm:px-10 lg:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Subtle Category Title */}
        <div className="mb-10 pb-6 border-b border-[#321B35]/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#321B35] font-normal tracking-tight">
              Textures & Paint Catalogue
            </h1>
            <p className="text-sm text-[#1e1e1e]/70 mt-2 font-light">
              Explore authentic handcrafted textures, sample tiles, and colour consultation packages.
            </p>
          </div>
          <span className="text-xs uppercase tracking-widest text-[#321B35]/60">
            {SHOP_PRODUCTS.length} Finishes Available
          </span>
        </div>

        {/* 2-Column Product Grid matching Video Frame 30 & 31 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {SHOP_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image Container with high-end framing */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/5 mb-4 shadow-2xs">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                {/* Sale Badge matching Frame 31 */}
                {prod.isSale && (
                  <span className="absolute top-4 right-4 text-xs font-serif text-[#1e1e1e]/70 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-sm tracking-wide">
                    Sale
                  </span>
                )}
              </div>

              {/* Title & Price matching Frame 30 */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1e1e1e] font-normal group-hover:text-[#321B35] transition-colors">
                    {prod.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-[#1e1e1e]/90 font-light">
                    ₹{prod.price.toFixed(2)}
                  </span>
                  {prod.originalPrice && (
                    <span className="text-sm text-[#1e1e1e]/50 line-through font-light">
                      ₹{prod.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
