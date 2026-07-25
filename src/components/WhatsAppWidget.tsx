import React, { useState } from 'react';
import { MessageCircle, X, Video, Scissors, PackageCheck, Send, MapPin } from 'lucide-react';

interface WhatsAppWidgetProps {
  onOpenVideoCall?: (interest?: string) => void;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ onOpenVideoCall }) => {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = '919043970969';

  const quickLinks = [
    {
      label: 'Book WhatsApp Video Shopping Call',
      icon: Video,
      isVideoCall: true,
      msg: 'Hello Nalinam Boutique! I would like to schedule a live video shopping call to inspect Kanjivaram silk sarees.'
    },
    {
      label: 'Custom Stitching & Size Help',
      icon: Scissors,
      msg: 'Hello Nalinam Boutique! I need guidance regarding custom blouse stitching and size measurements.'
    },
    {
      label: 'Order Delivery Inquiry',
      icon: PackageCheck,
      msg: 'Hello Nalinam Boutique! I would like to check the dispatch status of my order.'
    }
  ];

  return (
    <div id="whatsapp-widget-container" className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Expanded Popup Card */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-purple-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
          
          <div className="bg-emerald-800 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.jpg"
                alt="Nalinam WhatsApp Desk"
                className="w-9 h-9 rounded-full object-cover border border-emerald-300 shadow-sm shrink-0 bg-purple-950"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-bold text-xs block text-amber-200">Nalinam WhatsApp Desk</span>
                <span className="text-[10px] text-emerald-100">Live Support • Boutique Styling Desk</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3.5 bg-emerald-50/50 space-y-2 text-xs">
            <p className="text-gray-700 font-medium">
              Vanakkam! How can our boutique stylists assist you today?
            </p>

            <div className="space-y-1.5 pt-1">
              {quickLinks.map((item, idx) => {
                const Icon = item.icon;
                const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(item.msg)}`;

                if (item.isVideoCall && onOpenVideoCall) {
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsOpen(false);
                        onOpenVideoCall('Kanjivaram Silk Sarees');
                      }}
                      className="w-full text-left flex items-center gap-2 p-2.5 bg-gradient-to-r from-purple-950 to-pink-950 text-amber-300 rounded-xl border border-amber-400/40 hover:brightness-110 font-bold transition-all group shadow-sm"
                    >
                      <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="flex-1 text-[11px] text-amber-200">{item.label}</span>
                      <Send className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  );
                }

                return (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 text-gray-800 font-semibold transition-all group"
                  >
                    <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="flex-1 text-[11px] group-hover:text-emerald-950">{item.label}</span>
                    <Send className="w-3 h-3 text-emerald-600 opacity-60 group-hover:opacity-100" />
                  </a>
                );
              })}

              <a
                href="https://share.google/M7JYL4AP8CYQNsj1w"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 bg-purple-950 text-amber-300 rounded-xl border border-amber-400/30 hover:bg-purple-900 font-semibold transition-all group mt-2"
              >
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="flex-1 text-[11px]">View Store Location on Google Maps</span>
                <Send className="w-3 h-3 text-amber-300" />
              </a>
            </div>
          </div>

        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        id="whatsapp-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 sm:w-14 sm:h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 relative border-2 border-white"
        aria-label="WhatsApp Support"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full animate-ping" />
      </button>

    </div>
  );
};

