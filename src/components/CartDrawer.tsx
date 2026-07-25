import React, { useState } from 'react';
import { CartItem } from '../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ArrowRight,
  ShieldCheck,
  Check,
  Truck
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (appliedCoupon?: string, couponDiscount?: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('NALINAM10');
  const [couponError, setCouponError] = useState('');

  // Calculations
  const rawSubtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  let couponDiscount = 0;
  if (appliedCoupon === 'NALINAM10') {
    couponDiscount = Math.round(rawSubtotal * 0.1);
  } else if (appliedCoupon === 'WELCOME200') {
    couponDiscount = Math.min(200, rawSubtotal);
  }

  const shippingFee = rawSubtotal >= 1999 || items.length === 0 ? 0 : 99;
  const gstAmount = Math.round((rawSubtotal - couponDiscount) * 0.05);
  const finalTotal = Math.max(0, rawSubtotal - couponDiscount + shippingFee + gstAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (code === 'NALINAM10' || code === 'WELCOME200' || code === 'FESTIVE500') {
      setAppliedCoupon(code);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try NALINAM10 or WELCOME200');
    }
  };

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="bg-purple-950 text-amber-50 p-4 sm:p-5 flex items-center justify-between border-b border-purple-800 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="font-serif font-bold text-lg text-amber-200">
              Your Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Body - Items List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-purple-50 text-purple-900 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-purple-800" />
              </div>
              <h3 className="font-serif font-bold text-lg text-purple-950">
                Your Shopping Bag is Empty
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our Royal Kanjivaram Sarees, Anarkalis & Festive Lehengas to add your favorite pieces!
              </p>
              <button
                onClick={onClose}
                className="bg-purple-950 text-amber-300 font-bold text-xs py-2.5 px-6 rounded-xl shadow-md hover:bg-purple-900 transition-colors"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            <div className="space-y-3 divide-y divide-gray-100">
              {items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex gap-3 items-center">
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 object-cover object-center rounded-xl border border-purple-100 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-xs text-gray-900 truncate">
                      {item.product.name}
                    </h4>

                    <div className="text-[11px] text-gray-500 space-y-0.5 mt-0.5">
                      <p>Stitching: <span className="font-semibold text-purple-900">{item.selectedStitching}</span></p>
                      {item.selectedSize && <p>Size: <span className="font-semibold text-purple-900">{item.selectedSize}</span></p>}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-sm text-purple-950">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 text-gray-600 rounded-l-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 text-gray-600 rounded-r-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Coupon Code Section */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <label className="block text-xs uppercase font-extrabold text-purple-950 tracking-wider">
                Promo Code / Coupon
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon}</strong> applied!</span>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-red-600 hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter NALINAM10 or WELCOME200"
                    className="flex-1 bg-gray-50 text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-900 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
            </div>
          )}

        </div>

        {/* Drawer Footer Price Breakup */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-200 bg-purple-50/50 space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal MRP:</span>
                <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon}):</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST (5% Apparel/Fabric):</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee (Tamil Nadu & India):</span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  <span>₹{shippingFee}</span>
                )}
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between font-serif font-extrabold text-base text-purple-950">
                <span>Total Amount:</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onProceedToCheckout(appliedCoupon || undefined, couponDiscount);
              }}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-purple-950 font-black text-sm py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
            >
              <span>Proceed to Express Checkout</span>
              <ArrowRight className="w-5 h-5 text-purple-950" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
