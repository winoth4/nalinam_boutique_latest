import React from 'react';
import { CATEGORIES } from '../data/categories';
import { ProductCategory } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ShopByCategoryProps {
  onSelectCategory: (category: ProductCategory) => void;
  onSelectSubcategory?: (subcategory: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  onSelectCategory,
  onSelectSubcategory,
}) => {
  return (
    <section id="shop-by-category-section" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-pink-600 font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Traditional & Modern Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-purple-950">
            Shop by Primary Category
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md">
          Explore handcrafted Kanjivaram silk sarees, festive Anarkalis, bridal lehengas, fusion tunics & traditional accessories.
        </p>
      </div>

      {/* Visual Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {CATEGORIES.map((cat, idx) => (
          <div
            key={cat.id}
            className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100 flex flex-col ${
              idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            {/* Card Image Background */}
            <div className="relative h-60 sm:h-64 overflow-hidden bg-purple-900">
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/95 via-purple-950/40 to-transparent" />

              {/* Top Item Count Badge */}
              <span className="absolute top-3 right-3 bg-purple-950/80 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/40 backdrop-blur-sm">
                {cat.featuredCount}+ Items
              </span>
            </div>

            {/* Content & Subcategory Pills */}
            <div className="bg-gradient-to-b from-purple-950 to-purple-900 text-white p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-amber-200 group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-purple-200/80 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              {/* Subcategories list pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cat.subcategories.slice(0, 5).map((sub) => (
                  <button
                    key={sub}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCategory(cat.name);
                      if (onSelectSubcategory) onSelectSubcategory(sub);
                    }}
                    className="text-[11px] bg-purple-800/60 hover:bg-amber-400 hover:text-purple-950 text-amber-100 font-medium px-2.5 py-0.5 rounded-full border border-purple-700/50 transition-colors"
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectCategory(cat.name)}
                className="w-full mt-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-purple-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform group-hover:translate-x-1"
              >
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
