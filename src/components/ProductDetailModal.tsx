import React, { useState } from 'react';
import { Product, StitchingOption, GarmentSize } from '../types';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  MapPin,
  MessageCircle,
  Sparkles,
  Heart,
  Check,
  Ruler,
  Info,
  Video
} from 'lucide-react';
import { lookupPincode } from '../data/pincodes';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (
    product: Product,
    selectedStitching: StitchingOption,
    selectedSize?: GarmentSize
  ) => void;
  onBuyNow: (
    product: Product,
    selectedStitching: StitchingOption,
    selectedSize?: GarmentSize
  ) => void;
  onOpenVideoCall?: (interest?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onOpenVideoCall,
}) => {

  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedStitching, setSelectedStitching] = useState<StitchingOption>(
    product.stitchingOptions[0] || 'Unstitched'
  );
  const [selectedSize, setSelectedSize] = useState<GarmentSize>(
    product.sizesAvailable ? product.sizesAvailable[0] : 'Free Size'
  );
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<any>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput) return;
    const info = lookupPincode(pincodeInput);
    setPincodeResult(info);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Nalinam Boutique! I am interested in purchasing:\n\n*${product.name}*\nPrice: ₹${product.price.toLocaleString('en-IN')}\nFabric: ${product.fabric}\nImage: ${product.image}\n\nPlease let me know availability and stitching options.`
  );

  return (
    <div id="product-modal-backdrop" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden border border-purple-100 relative animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Sticky Header */}
        <div className="bg-purple-950 text-amber-50 px-5 py-3 flex items-center justify-between border-b border-purple-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300">
              {product.category} • {product.subcategory}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-300 hover:text-white hover:bg-purple-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Left Column: Image Gallery & Zoom Preview */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-purple-50 rounded-2xl overflow-hidden border border-purple-100 shadow-md group">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              />

              {product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-pink-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                  {product.discountPercent}% OFF
                </span>
              )}

              <button
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isWishlisted ? 'bg-pink-600 text-white' : 'bg-white/90 text-gray-700 hover:text-pink-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === imgUrl ? 'border-amber-500 scale-105 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Weave Mark & Authenticity Banner */}
            {product.weaveCertificate && (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">100% Guaranteed Authenticity</span>
                  <span className="text-[11px] text-emerald-800">{product.weaveCertificate}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Buying Controls */}
          <div className="space-y-5 flex flex-col justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-purple-950 leading-snug">
                {product.name}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center bg-amber-50 text-amber-900 text-xs font-bold px-2 py-0.5 rounded border border-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 mr-1" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {product.reviewsCount} Customer Reviews
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                  {product.fabric}
                </span>
              </div>

              {/* Pricing Section */}
              <div className="mt-4 p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-purple-950">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discountPercent}%)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 mt-1">
                  Inclusive of all taxes. Free shipping across Tamil Nadu above ₹1,999.
                </p>
              </div>

              {/* Stitching Options */}
              <div className="mt-4 space-y-2">
                <label className="block text-xs uppercase font-extrabold text-purple-950 tracking-wider">
                  Select Stitching Choice
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {product.stitchingOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedStitching(opt)}
                      className={`text-xs p-2.5 rounded-xl border text-center font-bold transition-all ${
                        selectedStitching === opt
                          ? 'bg-purple-950 text-amber-300 border-purple-900 shadow-md'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garment Size (If applicable or ready-to-wear) */}
              {selectedStitching === 'Ready-to-wear' && product.sizesAvailable && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase font-extrabold text-purple-950 tracking-wider">
                      Select Size (Indian Fit)
                    </label>
                    <button
                      onClick={() => setShowSizeChart(true)}
                      className="text-xs text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 underline"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizesAvailable.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-10 h-10 rounded-xl border font-bold text-xs flex items-center justify-center transition-all ${
                          selectedSize === sz
                            ? 'bg-amber-400 text-purple-950 border-amber-500 shadow-md scale-105'
                            : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-amber-50'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Pincode Checker */}
              <div className="mt-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <label className="block text-xs font-extrabold text-purple-950 uppercase tracking-wider">
                  Check Delivery & Courier Serviceability
                </label>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode (e.g. 600001)"
                    className="flex-1 bg-white text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-900"
                  />
                  <button
                    type="submit"
                    className="bg-purple-900 hover:bg-purple-950 text-amber-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Check PIN
                  </button>
                </form>

                {pincodeResult && (
                  <div className={`mt-2 text-xs p-2.5 rounded-xl ${
                    pincodeResult.serviceable ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
                  }`}>
                    {pincodeResult.serviceable ? (
                      <div className="space-y-0.5">
                        <span className="font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Serviceable in {pincodeResult.state}!
                        </span>
                        <p className="text-[11px] text-emerald-800">
                          Estimated Delivery: <strong>{pincodeResult.estimatedDays}</strong> via {pincodeResult.courier}. Cash on Delivery (COD) available.
                        </p>
                      </div>
                    ) : (
                      <span>Pincode not currently serviceable. Please try another PIN code.</span>
                    )}
                  </div>
                )}
              </div>

              {/* Description & Blouse Details */}
              <div className="mt-4 space-y-2 text-xs text-gray-700 leading-relaxed">
                <p><strong>Description:</strong> {product.description}</p>
                {product.blouseDetails && <p><strong>Blouse / Bottom Details:</strong> {product.blouseDetails}</p>}
                <p><strong>Care Instructions:</strong> {product.careInstructions}</p>
              </div>
            </div>

            {/* Action Buttons Column */}
            <div className="pt-4 border-t border-gray-200 space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedStitching, selectedSize);
                    onClose();
                  }}
                  className="bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, selectedStitching, selectedSize);
                    onClose();
                  }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-purple-950 font-black text-xs py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now Express</span>
                </button>
              </div>

              {/* Direct WhatsApp Query & Video Shopping Call */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {onOpenVideoCall && (
                  <button
                    onClick={() => {
                      onOpenVideoCall(`${product.name} (₹${product.price})`);
                      onClose();
                    }}
                    className="w-full bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-4 h-4 text-amber-400" />
                    <span>Request Video Shopping Call</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/919043970969?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Inquire</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Size Chart Modal Sub-overlay */}
      {showSizeChart && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-purple-950">
                Indian Standard Garment Size Guide (Inches)
              </h3>
              <button onClick={() => setShowSizeChart(false)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-purple-950 text-amber-300">
                    <th className="p-2 border">Size</th>
                    <th className="p-2 border">Bust (Inches)</th>
                    <th className="p-2 border">Waist (Inches)</th>
                    <th className="p-2 border">Hip (Inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border font-bold">S (36)</td><td className="p-2 border">36"</td><td className="p-2 border">30"</td><td className="p-2 border">38"</td></tr>
                  <tr className="bg-gray-50"><td className="p-2 border font-bold">M (38)</td><td className="p-2 border">38"</td><td className="p-2 border">32"</td><td className="p-2 border">40"</td></tr>
                  <tr><td className="p-2 border font-bold">L (40)</td><td className="p-2 border">40"</td><td className="p-2 border">34"</td><td className="p-2 border">42"</td></tr>
                  <tr className="bg-gray-50"><td className="p-2 border font-bold">XL (42)</td><td className="p-2 border">42"</td><td className="p-2 border">36"</td><td className="p-2 border">44"</td></tr>
                  <tr><td className="p-2 border font-bold">2XL (44)</td><td className="p-2 border">44"</td><td className="p-2 border">38"</td><td className="p-2 border">46"</td></tr>
                  <tr className="bg-gray-50"><td className="p-2 border font-bold">3XL (46)</td><td className="p-2 border">46"</td><td className="p-2 border">40"</td><td className="p-2 border">48"</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-gray-500 italic">
              Note: All readymade boutique outfits include 2-inch inner margin margins for easy local alteration.
            </p>

            <button
              onClick={() => setShowSizeChart(false)}
              className="w-full bg-purple-950 text-white font-bold text-xs py-2.5 rounded-xl"
            >
              Close Size Chart
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
