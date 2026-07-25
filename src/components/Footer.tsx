import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Heart,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (category: ProductCategory | 'All') => void;
  onOpenOrderTracking: () => void;
  onOpenVideoCall?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenOrderTracking,
  onOpenVideoCall,
}) => {

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer id="main-footer" className="bg-purple-950 text-amber-100 border-t border-purple-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Newsletter & Offer Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-pink-900 to-purple-950 p-6 sm:p-8 rounded-3xl border border-amber-400/30 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-purple-950 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Exclusive Boutique Offer
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Get ₹200 OFF Your First Saree or Salwar Order
            </h3>
            <p className="text-xs text-amber-200/90 font-light">
              Subscribe to Nalinam Boutique updates for new Kanjivaram arrivals & festive discount codes.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="bg-purple-950/80 text-white placeholder-purple-300/60 text-xs px-4 py-3 rounded-xl border border-purple-700 focus:outline-none focus:border-amber-400 w-full sm:w-72"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs py-3 px-6 rounded-xl shadow-lg transition-colors shrink-0"
            >
              {subscribed ? 'Subscribed! 🎉' : 'Claim ₹200 OFF'}
            </button>
          </form>
        </div>

        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          {/* Col 1: Brand Info & Weaving Pledge */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.jpg"
                alt="Nalinam Boutique Logo"
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0 bg-purple-950"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif font-bold text-lg text-amber-200 tracking-wider">
                NALINAM BOUTIQUE
              </span>
            </div>

            <p className="text-purple-200/80 leading-relaxed font-light">
              Preserving Tamil Nadu's weaving legacy with handwoven Kanjivaram silks, soft silks, handloom Salem cottons & modern festive wear.
            </p>

            <div className="pt-2 flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Silk Mark Certified 100% Pure Silk</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-300 uppercase tracking-wider">
              Explore Categories
            </h4>
            <ul className="space-y-2 text-purple-200/90 font-medium">
              <li>
                <button onClick={() => onSelectCategory('Sarees')} className="hover:text-amber-300 transition-colors">
                  Royal Kanjivaram & Soft Silks
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Salwars & Dress Materials')} className="hover:text-amber-300 transition-colors">
                  Anarkalis & Salwar Suits
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Lehengas & Festival Wear')} className="hover:text-amber-300 transition-colors">
                  Bridal & Festival Lehengas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Western & Fusion Wear')} className="hover:text-amber-300 transition-colors">
                  Indo-Western Fusion Wear
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Accessories & Add-ons')} className="hover:text-amber-300 transition-colors">
                  Dupattas & Temple Jewelry
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service & Tracking */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-300 uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2 text-purple-200/90 font-medium">
              <li>
                <button onClick={onOpenOrderTracking} className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Track Order Status</span>
                </button>
              </li>
              <li>
                {onOpenVideoCall ? (
                  <button
                    onClick={onOpenVideoCall}
                    className="hover:text-amber-300 transition-colors text-left block"
                  >
                    <span className="font-bold text-amber-200">Request WhatsApp Video Shopping Call:</span> +91 90439 70969
                  </button>
                ) : (
                  <a href="tel:+919043970969" className="hover:text-amber-300 transition-colors block">
                    <span className="font-bold text-amber-200">Video Shopping & Primary Support:</span> +91 90439 70969
                  </a>
                )}
                <span className="text-[10px] text-purple-300/80 font-normal block pt-0.5">
                  Secondary Contact Phone: <a href="tel:+919629046010" className="hover:underline hover:text-amber-200 font-mono">+91 96290 46010</a>
                </span>
              </li>

              <li>
                <span className="block text-purple-300">Shipping Policy: Free TN Shipping &gt; ₹1,999</span>
              </li>
              <li>
                <span className="block text-purple-300">Easy 7-Day Boutique Return/Exchange Policy</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Location & Google Maps Pin */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-300 uppercase tracking-wider">
              Boutique Store Pin
            </h4>
            <p className="text-purple-200/80 text-[11px]">
              Visit our boutique in person or get directions directly on Google Maps:
            </p>
            
            <a
              href="https://share.google/M7JYL4AP8CYQNsj1w"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gradient-to-r from-purple-900 to-pink-950 hover:from-purple-800 hover:to-pink-900 rounded-2xl border border-amber-400/40 text-amber-100 shadow-md transition-all group"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center shrink-0 shadow">
                  <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-amber-300 block">
                    Nalinam Boutique Store Location
                  </span>
                  <span className="text-[11px] text-purple-200 block">
                    Open Google Maps Pin & Directions
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1 mt-1 underline">
                    <span>share.google/M7JYL4AP8CYQNsj1w</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="pt-8 border-t border-purple-900/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-purple-300/80">
          <p>© 2026 Nalinam Boutique. All rights reserved. Handwoven with pride in Tamil Nadu, India.</p>

          <div className="flex items-center gap-2 font-bold text-amber-200">
            <span>Payment Partners:</span>
            <span className="bg-purple-900 px-2 py-1 rounded text-[10px]">Razorpay</span>
            <span className="bg-purple-900 px-2 py-1 rounded text-[10px]">UPI / GPay</span>
            <span className="bg-purple-900 px-2 py-1 rounded text-[10px]">Visa / MC</span>
            <span className="bg-purple-900 px-2 py-1 rounded text-[10px]">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
