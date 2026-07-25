import React, { useState } from 'react';
import { Product } from '../types';
import { X, Sparkles, Send, ShoppingBag, Eye, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AIStyleAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const AIStyleAdvisor: React.FC<AIStyleAdvisorProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [occasion, setOccasion] = useState('South Indian Wedding / Bridal');
  const [colorPref, setColorPref] = useState('Royal Purple / Magenta');
  const [fabricPref, setFabricPref] = useState('Kanjivaram Silk');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const occasionsList = [
    'South Indian Wedding / Bridal',
    'Reception / Sangeet Night',
    'Diwali / Temple Festival',
    'College Farewell / Graduation',
    'Casual Office Ethnic'
  ];

  const colorsList = ['Royal Purple / Magenta', 'Sunset Orange / Gold', 'Peacock Blue / Green', 'Pastel Pink / Peach'];
  const fabricsList = ['Kanjivaram Pure Silk', 'Soft Silk', 'Handloom Cotton', 'Organza', 'Georgette'];

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setRecommendation(null);

    try {
      const response = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          colorPreference: colorPref,
          fabricPreference: fabricPref,
          promptText: customPrompt,
          catalog: products.map((p) => ({ id: p.id, name: p.name, fabric: p.fabric, category: p.category, price: p.price }))
        })
      });

      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      console.error('Failed to fetch AI style advice:', err);
      // Fallback response
      setRecommendation({
        recommendation: `For your ${occasion}, a handcrafted Kanjivaram or Soft Silk saree in ${colorPref} will offer an authentic and commanding Tamil Nadu boutique presence!`,
        suggestedProductIds: [1, 2, 6],
        stylingTips: [
          'Pair with an embroidered contrast zari blouse',
          'Wear antique gold temple jewelry choker set',
          'Finish with fresh Jasmine flowers (Gajra)'
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedProducts = recommendation?.suggestedProductIds
    ? products.filter((p) => recommendation.suggestedProductIds.includes(p.id))
    : products.slice(0, 3);

  return (
    <div id="ai-stylist-backdrop" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-purple-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-pink-950 text-amber-50 p-4 sm:p-5 flex items-center justify-between border-b border-purple-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Nalinam Boutique Logo"
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0 bg-purple-950"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="font-serif font-bold text-lg text-amber-200">
                Nalinam AI Style Assistant
              </h2>
              <span className="text-[10px] text-purple-200/80 tracking-wider uppercase font-sans">
                Personalized Ethnic Fashion & Saree Recommender
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-300 hover:text-white hover:bg-purple-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Controls Form */}
          <div className="space-y-4">
            
            {/* Occasion Selection */}
            <div>
              <label className="block text-xs uppercase font-extrabold tracking-wider text-purple-950 mb-1.5">
                1. What is the Event / Occasion?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {occasionsList.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setOccasion(occ)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                      occasion === occ
                        ? 'bg-purple-950 text-amber-300 font-bold border-purple-900 shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Color & Fabric */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-purple-950 mb-1.5">
                  2. Preferred Color Palette
                </label>
                <select
                  value={colorPref}
                  onChange={(e) => setColorPref(e.target.value)}
                  className="w-full bg-gray-50 text-xs p-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:border-purple-900 font-medium"
                >
                  {colorsList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-purple-950 mb-1.5">
                  3. Preferred Fabric
                </label>
                <select
                  value={fabricPref}
                  onChange={(e) => setFabricPref(e.target.value)}
                  className="w-full bg-gray-50 text-xs p-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:border-purple-900 font-medium"
                >
                  {fabricsList.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <label className="block text-xs uppercase font-extrabold tracking-wider text-purple-950 mb-1.5">
                Specific Outfit Wish or Question (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. 'Looking for a lightweight silk saree for my sister's morning reception in Madurai'"
                  className="w-full bg-gray-50 text-xs p-2.5 pr-10 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:border-purple-900"
                />
              </div>
            </div>

            <button
              onClick={handleGetAdvice}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-600 via-purple-900 to-purple-950 hover:from-pink-500 hover:to-purple-900 text-amber-200 font-bold text-xs py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Consulting Nalinam AI Fashion Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Personalized Outfit Recommendations</span>
                </>
              )}
            </button>
          </div>

          {/* Recommendation Output */}
          {recommendation && (
            <div className="p-4 sm:p-5 bg-purple-50 rounded-2xl border border-purple-200 space-y-4 animate-in fade-in duration-300">
              
              <div>
                <span className="text-xs font-bold text-pink-700 uppercase tracking-widest block mb-1">
                  Stylist Recommendation
                </span>
                <p className="text-xs text-purple-950 font-medium leading-relaxed">
                  {recommendation.recommendation}
                </p>
              </div>

              {/* Styling Tips */}
              {recommendation.stylingTips && recommendation.stylingTips.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-purple-200/80">
                  <span className="text-[11px] font-bold text-purple-950 uppercase tracking-wider block">
                    Boutique Styling Tips:
                  </span>
                  <ul className="space-y-1 text-xs text-purple-900">
                    {recommendation.stylingTips.map((tip: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Products Grid */}
              <div className="pt-2 border-t border-purple-200/80 space-y-2">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">
                  Recommended Catalog Pieces:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="bg-white p-2.5 rounded-xl border border-purple-200 hover:border-purple-900 shadow-sm flex items-center gap-3 cursor-pointer group transition-all"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-16 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs text-gray-900 truncate group-hover:text-purple-900">
                          {p.name}
                        </h4>
                        <span className="text-[11px] font-bold text-purple-950 block mt-0.5">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-pink-600 font-semibold flex items-center gap-0.5">
                          <Eye className="w-3 h-3" /> View Outfit
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
