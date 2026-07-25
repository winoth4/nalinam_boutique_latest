import React from 'react';
import { FilterState, ProductCategory, FabricType } from '../types';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface CategoryFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
}

const FABRICS: FabricType[] = [
  'Kanjivaram Pure Silk',
  'Soft Silk',
  'Handloom Cotton',
  'Organza',
  'Georgette',
  'Chanderi Silk',
  'Banarasi Silk',
  'Silk Cotton'
];

const OCCASIONS = ['Bridal', 'Festive', 'Partywear', 'Casual', 'Office Wear', 'Temple Visit'];

export const CategoryFilterDrawer: React.FC<CategoryFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  const toggleFabric = (fabric: FabricType) => {
    const current = [...filters.fabrics];
    const index = current.indexOf(fabric);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(fabric);
    }
    onFilterChange({ ...filters, fabrics: current });
  };

  const toggleOccasion = (occ: string) => {
    const current = [...filters.occasions];
    const index = current.indexOf(occ);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(occ);
    }
    onFilterChange({ ...filters, occasions: current });
  };

  return (
    <div id="filter-drawer-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="bg-purple-950 text-amber-50 p-4 sm:p-5 flex items-center justify-between border-b border-purple-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-300" />
            <h2 className="font-serif font-bold text-lg text-amber-200">
              Filter & Sort Collections
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1 bg-purple-900 px-2.5 py-1 rounded-full border border-purple-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6 divide-y divide-gray-100">
          
          {/* Sorting */}
          <div className="space-y-3">
            <label className="block text-xs uppercase font-extrabold tracking-wider text-purple-950">
              Sort Products By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Most Popular', value: 'popularity' },
                { label: 'Price: Low to High', value: 'price-asc' },
                { label: 'Price: High to Low', value: 'price-desc' },
                { label: 'Newest First', value: 'newest' },
                { label: 'Highest Rated', value: 'rating' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange({ ...filters, sortBy: opt.value as any })}
                  className={`text-xs py-2 px-3 rounded-xl border text-left font-medium transition-all ${
                    filters.sortBy === opt.value
                      ? 'bg-purple-950 text-amber-300 border-purple-900 font-bold shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="pt-5 space-y-3">
            <label className="block text-xs uppercase font-extrabold tracking-wider text-purple-950">
              Primary Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange({ ...filters, category: 'All' })}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  filters.category === 'All'
                    ? 'bg-purple-950 text-amber-300 border-purple-900 font-bold'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onFilterChange({ ...filters, category: c.name })}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                    filters.category === c.name
                      ? 'bg-purple-950 text-amber-300 border-purple-900 font-bold'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-5 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-purple-950">
              <span className="uppercase tracking-wider">Max Price Range</span>
              <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Up to ₹{filters.priceRange[1].toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={35000}
              step={500}
              value={filters.priceRange[1]}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                })
              }
              className="w-full accent-purple-900 h-2 bg-gray-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>₹1,000</span>
              <span>₹18,000</span>
              <span>₹35,000+</span>
            </div>
          </div>

          {/* Fabric Types Filter */}
          <div className="pt-5 space-y-3">
            <label className="block text-xs uppercase font-extrabold tracking-wider text-purple-950">
              Fabric & Weave Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FABRICS.map((fab) => {
                const selected = filters.fabrics.includes(fab);
                return (
                  <button
                    key={fab}
                    onClick={() => toggleFabric(fab)}
                    className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                      selected
                        ? 'bg-pink-600 text-white border-pink-700 font-bold shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{fab}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasions */}
          <div className="pt-5 space-y-3">
            <label className="block text-xs uppercase font-extrabold tracking-wider text-purple-950">
              Occasion
            </label>
            <div className="flex flex-wrap gap-1.5">
              {OCCASIONS.map((occ) => {
                const selected = filters.occasions.includes(occ);
                return (
                  <button
                    key={occ}
                    onClick={() => toggleOccasion(occ)}
                    className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                      selected
                        ? 'bg-amber-500 text-purple-950 border-amber-600 font-bold shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{occ}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* In-Stock Only Toggle */}
          <div className="pt-5 flex items-center justify-between">
            <div>
              <span className="block text-xs uppercase font-extrabold tracking-wider text-purple-950">
                In-Stock Only
              </span>
              <span className="text-[11px] text-gray-500">
                Show items ready for immediate dispatch
              </span>
            </div>
            <button
              onClick={() => onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                filters.inStockOnly ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

        </div>

        {/* Drawer Footer CTA */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={onResetFilters}
            className="w-1/3 py-3 px-4 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={onClose}
            className="w-2/3 bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs py-3 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Apply Filter Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
};
