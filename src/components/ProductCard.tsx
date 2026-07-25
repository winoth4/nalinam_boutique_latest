import React from 'react';
import { Product } from '../types';
import { Heart, Star, ShoppingBag, Eye, ShieldCheck, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
    >
      {/* Top Image & Badges Container */}
      <div className="relative aspect-[3/4] bg-purple-50 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay Darkening on Hover */}
        <div className="absolute inset-0 bg-purple-950/10 group-hover:bg-purple-950/20 transition-colors pointer-events-none" />

        {/* Badges Column Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercent > 0 && (
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-md">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.bestseller && (
            <span className="bg-amber-400 text-purple-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-purple-900 text-amber-200 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md">
              NEW ARRIVAL
            </span>
          )}
        </div>

        {/* Wishlist Button Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
            isWishlisted
              ? 'bg-pink-600 text-white scale-110'
              : 'bg-white/90 text-gray-600 hover:text-pink-600 hover:bg-white'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-purple-950/90 hover:bg-purple-950 text-amber-200 font-medium text-xs py-2 rounded-xl backdrop-blur-sm shadow-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-300" />
            <span>Quick View & Details</span>
          </button>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Fabric Tag */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-purple-900 mb-1">
            <span className="truncate bg-purple-50 text-purple-900 px-2 py-0.5 rounded-md">
              {product.subcategory || product.category}
            </span>
            <span className="text-gray-500 text-[10px] truncate max-w-[120px]" title={product.fabric}>
              {product.fabric}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif font-bold text-sm text-gray-900 line-clamp-2 hover:text-purple-900 transition-colors cursor-pointer leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center bg-amber-50 text-amber-800 text-[11px] font-bold px-1.5 py-0.5 rounded border border-amber-200">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[11px] text-gray-500">
              ({product.reviewsCount})
            </span>
            {product.weaveCertificate && (
              <span className="ml-auto text-[10px] text-emerald-700 font-medium flex items-center gap-0.5" title={product.weaveCertificate}>
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Silk Mark
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Bag */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base sm:text-lg text-purple-950">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block">
              Inclusive of all taxes
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-purple-950 hover:bg-purple-900 text-amber-300 hover:text-white p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
            title="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
