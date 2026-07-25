import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag, Award, ShieldCheck, Heart, Video } from 'lucide-react';
import { ProductCategory } from '../types';

interface BannerCarouselProps {
  onSelectCategory: (category: ProductCategory) => void;
  onOpenAIStylist: () => void;
  onOpenVideoCall?: () => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  onSelectCategory,
  onOpenAIStylist,
  onOpenVideoCall,
}) => {

  const slides = [
    {
      id: 1,
      title: 'Royal Kanjivaram Pure Silk Collection',
      subtitle: 'Kanchipuram Heritage Handwoven Sarees with 24K Gold Leaf Pure Zari Korvai',
      tag: 'Festive & Bridal Exclusive',
      image: '/src/assets/images/nalinam_hero_saree_1784944137845.jpg',
      category: 'Sarees' as ProductCategory,
      accentColor: 'from-purple-950/90 via-purple-900/60 to-transparent',
      ctaText: 'Explore Royal Sarees'
    },
    {
      id: 2,
      title: 'Grand Anarkali & Salwar Suits',
      subtitle: 'Vibrant Magenta Pink & Sunset Gold Threads with Organza Dupattas',
      tag: 'New Season Arrivals',
      image: '/src/assets/images/nalinam_hero_festive_1784944151903.jpg',
      category: 'Salwars & Dress Materials' as ProductCategory,
      accentColor: 'from-pink-950/90 via-purple-900/60 to-transparent',
      ctaText: 'Shop Festive Salwars'
    },
    {
      id: 3,
      title: 'Bridal Lehengas & Fusion Wear',
      subtitle: 'Contemporary South Indian Elegance for Weddings, Receptions & Sangeets',
      tag: 'Exclusive Designer Wear',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1600',
      category: 'Lehengas & Festival Wear' as ProductCategory,
      accentColor: 'from-amber-950/90 via-purple-900/60 to-transparent',
      ctaText: 'View Bridal Lehengas'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const setCurrentIndex = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const active = slides[currentSlide];

  return (
    <section id="banner-carousel" className="relative bg-purple-950 overflow-hidden">
      <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px]">
        
        {/* Background Image with Referrer Policy */}
        <img
          src={active.image}
          alt={active.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-700 filter brightness-95"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className={`absolute inset-0 bg-gradient-to-r ${active.accentColor} flex items-center`}>
          <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
            <div className="max-w-xl space-y-3 sm:space-y-4 text-amber-50 animate-in fade-in slide-in-from-left duration-500">
              
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-purple-950 font-extrabold text-[11px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{active.tag}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-md">
                {active.title}
              </h1>

              <p className="text-xs sm:text-base text-amber-100/90 font-light leading-relaxed max-w-lg">
                {active.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  id="carousel-shop-cta"
                  onClick={() => onSelectCategory(active.category)}
                  className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-purple-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{active.ctaText}</span>
                </button>

                <button
                  id="carousel-ai-stylist-cta"
                  onClick={onOpenAIStylist}
                  className="bg-purple-900/80 hover:bg-purple-800 text-amber-200 border border-amber-400/50 font-semibold text-xs sm:text-sm px-5 py-3 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5 hover:text-white transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Style Advice</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-purple-950/60 hover:bg-purple-900 text-amber-200 hover:text-white flex items-center justify-center backdrop-blur-sm border border-purple-700/50 transition-all shadow-md"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-purple-950/60 hover:bg-purple-900 text-amber-200 hover:text-white flex items-center justify-center backdrop-blur-sm border border-purple-700/50 transition-all shadow-md"
          aria-label="Next banner"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-purple-950/60 px-3 py-1.5 rounded-full border border-purple-800/60 backdrop-blur-sm">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-purple-400/50 hover:bg-purple-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Feature Badges Strip Below Banner */}
      <div className="bg-purple-900/90 border-t border-b border-purple-800/80 text-amber-100 py-3 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs font-medium">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Silk Mark Certified 100% Pure Silk</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0" />
            <span>Handwoven Kanchipuram Weaves</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Custom Stitching & Sizing</span>
          </div>
          {onOpenVideoCall ? (
            <button
              onClick={onOpenVideoCall}
              className="flex items-center justify-center gap-2 text-amber-200 hover:text-white font-bold transition-colors"
            >
              <Video className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Book Direct Video Call Shopping &rarr;</span>
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Video className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Direct Video Call Shopping</span>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
