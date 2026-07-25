import React from 'react';
import { Star, CheckCircle2, Instagram, Heart, Quote } from 'lucide-react';
import { CustomerReview } from '../types';

export const REVIEWS: CustomerReview[] = [
  {
    id: 1,
    userName: 'Kavitha Rajagopal',
    location: 'T. Nagar, Chennai',
    rating: 5,
    date: '12 July 2026',
    comment: 'The Royal Purple Kanjivaram saree I ordered for my daughter’s muhurtham was absolute perfection! Pure silk shine, heavy gold zari pallu, and received in 24 hours in Chennai!',
    verifiedPurchase: true,
    productName: 'Kanjivaram Royal Purple Pure Silk Saree',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 2,
    userName: 'Meenakshi Sundaram',
    location: 'Town Hall, Madurai',
    rating: 5,
    date: '04 July 2026',
    comment: 'Soft silk material feels so featherlight and comfortable during long temple functions. Highly recommend Nalinam Boutique for authentic Tamil Nadu weaves!',
    verifiedPurchase: true,
    productName: 'Sunset Magenta Pink Soft Silk Saree',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 3,
    userName: 'Deepa Krishnan',
    location: 'RS Puram, Coimbatore',
    rating: 5,
    date: '28 June 2026',
    comment: 'Ordered an Anarkali suit set with custom stitching. Fits like a glove! Delivered right on time with neat packaging.',
    verifiedPurchase: true,
    productName: 'Festive Anarkali Suit in Magenta Pink',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  }
];

export const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
    handle: '@priya_chennai',
    likes: 1240,
    caption: 'Draped in pure Kanjivaram elegance from @NalinamBoutique for Diwali 🪔✨'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
    handle: '@divya_madurai',
    likes: 980,
    caption: 'Loved this bridal lehenga detail! Pure gold zari craft. #NalinamBoutique'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
    handle: '@sangeetha_coimbatore',
    likes: 1510,
    caption: 'Salem handloom cotton saree perfection for hot summer days! 🌺'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
    handle: '@anitha_salem',
    likes: 840,
    caption: 'Chanderi silk salwar set with organza dupatta! So comfortable!'
  }
];

export const CustomerReviews: React.FC = () => {
  return (
    <section id="reviews-and-instagram" className="py-12 bg-purple-950 text-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Reviews Section */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 bg-purple-900/80 px-3 py-1 rounded-full border border-purple-700">
              Customer Testimonials
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Loved by Women Across Tamil Nadu
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 font-light">
              Real reviews from buyers in Chennai, Coimbatore, Madurai, Salem & across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-purple-900/60 p-5 rounded-2xl border border-purple-800 shadow-lg flex flex-col justify-between relative"
              >
                <Quote className="w-8 h-8 text-amber-400/20 absolute top-4 right-4 pointer-events-none" />

                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-amber-100/90 leading-relaxed font-light italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-purple-800/80 flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.userName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-amber-200">
                      {rev.userName}
                    </h4>
                    <span className="text-[11px] text-purple-300 block">
                      {rev.location}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Verified Purchase ({rev.productName})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Lookbook Feed Section */}
        <div className="pt-8 border-t border-purple-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Instagram className="w-4 h-4" />
                <span>Instagram Lookbook</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-white mt-1">
                Tag @NalinamBoutique to Get Featured
              </h3>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-pink-600 to-purple-800 text-white font-bold text-xs px-4 py-2 rounded-full border border-pink-400/40 hover:scale-105 transition-transform self-start sm:self-auto"
            >
              Follow Us on Instagram
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INSTAGRAM_POSTS.map((post) => (
              <div
                key={post.id}
                className="group relative rounded-2xl overflow-hidden aspect-square border border-purple-800 shadow-md cursor-pointer"
              >
                <img
                  src={post.image}
                  alt={post.handle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-purple-950/80 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-amber-100">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{post.handle}</span>
                    <div className="flex items-center gap-1 text-pink-400">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>{post.likes}</span>
                    </div>
                  </div>

                  <p className="text-[11px] line-clamp-3 italic text-amber-200">
                    "{post.caption}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
