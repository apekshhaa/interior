import React from 'react';
import { CartItem, PageType } from '../types';
import { X, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onNavigate: (page: PageType) => void;
  onProceedToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  onProceedToCheckout,
}) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="w-full bg-[#E9EDF0] text-[#1e1e1e] py-12 px-6 sm:px-10 lg:px-16 min-h-[70vh]">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#321B35] font-normal mb-8 pb-4 border-b border-[#321B35]/15">
          Cart ({items.reduce((acc, it) => acc + it.quantity, 0)})
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4 bg-white/40 rounded-3xl p-8 border border-[#321B35]/10">
            <ShoppingBag className="w-12 h-12 text-[#321B35]/40 mx-auto" />
            <h2 className="font-serif text-2xl text-[#321B35]">Your cart is empty</h2>
            <p className="text-sm text-[#1e1e1e]/70 max-w-md mx-auto">
              Explore our handcrafted Italian stuccos, decorative wall textures, and consultation packages.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="px-8 py-3 rounded-full bg-[#321B35] text-white text-sm font-medium hover:bg-[#432347] transition-all cursor-pointer shadow-md"
              >
                Browse Textures & Services
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Items List matching Video Frame 47 */}
            <div className="divide-y divide-[#321B35]/15">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
                >
                  {/* Left: Thumbnail & Name */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black/5 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3
                        onClick={() => onNavigate('shop')}
                        className="font-sans text-base sm:text-lg font-normal text-[#1e1e1e] cursor-pointer hover:text-[#321B35] transition-colors"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#1e1e1e]/60 mt-0.5">
                        {product.price > 0 ? `₹${product.price.toFixed(2)} each` : 'Quotation on request'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quantity pill, Price, and Remove button (matching Frame 47) */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 ml-auto">
                    {/* Quantity Pill matching Video [- 2 +] */}
                    <div className="flex items-center justify-between border border-[#1e1e1e]/30 rounded-full px-3 py-1.5 w-24 bg-white/70">
                      <button
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="text-sm font-light hover:text-[#321B35] px-1 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-xs font-medium">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="text-sm font-light hover:text-[#321B35] px-1 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Total item price */}
                    <span className="font-sans text-sm sm:text-base font-light text-[#1e1e1e] min-w-[80px] text-right">
                      {product.price > 0 ? `₹${(product.price * quantity).toFixed(2)}` : 'Quotation on request'}
                    </span>

                    {/* Remove ✕ icon matching Video Frame 47 */}
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="p-1.5 text-[#1e1e1e]/50 hover:text-red-700 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Checkout Section matching Video Frame 47 */}
            <div className="pt-8 border-t border-[#321B35]/20 flex flex-col items-end space-y-4">
              <div className="flex items-center gap-12 text-lg">
                <span className="text-sm text-[#1e1e1e]/80">Estimated Cost</span>
                <span className="text-xl sm:text-2xl font-light text-[#321B35]">
                  {subtotal > 0 ? `₹${subtotal.toFixed(2)}` : 'Quotation on request'}
                </span>
              </div>

              {/* Checkout Pill Button matching Video Frame 47 */}
              <button
                onClick={onProceedToCheckout}
                className="w-full sm:w-80 py-3.5 px-8 rounded-full bg-[#1e1e1e] hover:bg-[#321B35] text-white text-sm font-medium transition-all shadow-md cursor-pointer text-center"
              >
                Checkout
              </button>

              <div className="flex items-center gap-1.5 text-xs text-[#1e1e1e]/60 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transparent quotation & on-site measurement guarantee</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
