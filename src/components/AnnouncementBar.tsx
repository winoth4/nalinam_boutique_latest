import React, { useState, useEffect } from 'react';
import { Truck, Tag, MapPin, Phone, Sparkles, Video } from 'lucide-react';


interface AnnouncementBarProps {
  onOpenPincodeModal: () => void;
  userPincode?: string;
  onOpenVideoCall?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onOpenPincodeModal,
  userPincode,
  onOpenVideoCall
}) => {

  const announcements = [
    '✨ Free Express Shipping across Tamil Nadu on orders above ₹1,999!',
    '🎁 Use code NALINAM10 to get flat 10% OFF on your first purchase!',
    '🪔 Exclusive Festival Collection: New Kanjivaram & Soft Silks Live Now!',
    '📞 Need Custom Stitching or Video Shopping Call? Call +91 90439 70969'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div id="announcement-bar" className="bg-gradient-to-r from-purple-950 via-purple-900 to-pink-900 text-amber-100 text-xs py-2 px-3 sm:px-6 flex flex-wrap items-center justify-between border-b border-purple-800/50 shadow-sm relative z-40">
      <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-2xl">
        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider shrink-0 border border-amber-400/30">
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          Boutique Special
        </span>
        <p className="truncate font-medium transition-all duration-500 text-amber-50">
          {announcements[currentIndex]}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-4 text-xs font-medium shrink-0">
        <a
          href="https://share.google/M7JYL4AP8CYQNsj1w"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-purple-800/60 hover:bg-purple-700/80 px-2.5 py-1 rounded-full text-amber-200 hover:text-white border border-purple-600/40 transition-colors"
          title="Open Boutique location pin on Google Maps"
        >
          <MapPin className="w-3.5 h-3.5 text-pink-400" />
          <span>Boutique Store Pin</span>
        </a>

        <button
          id="pincode-trigger-btn"
          onClick={onOpenPincodeModal}
          className="flex items-center gap-1.5 bg-purple-800/60 hover:bg-purple-700/80 px-2.5 py-1 rounded-full text-amber-200 hover:text-white border border-purple-600/40 transition-colors"
          title="Check pincode delivery serviceability"
        >
          <MapPin className="w-3.5 h-3.5 text-pink-400" />
          <span>{userPincode ? `Deliver to: ${userPincode}` : 'Check Delivery Pincode'}</span>
        </button>

        {onOpenVideoCall && (
          <button
            onClick={onOpenVideoCall}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold px-2.5 py-0.5 rounded-full text-[11px] shadow-sm transition-colors"
          >
            <Video className="w-3 h-3 text-purple-950" />
            <span>Book Video Call</span>
          </button>
        )}

        <a
          href="tel:+919043970969"
          className="flex items-center gap-1 text-amber-200 hover:text-white transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>+91 90439 70969</span>
        </a>

      </div>
    </div>
  );
};
