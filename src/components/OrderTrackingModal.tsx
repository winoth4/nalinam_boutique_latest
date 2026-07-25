import React, { useState } from 'react';
import { Order } from '../types';
import { X, PackageCheck, Search, CheckCircle2, Clock, Truck, MapPin, MessageCircle } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Order[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
}) => {
  if (!isOpen) return null;

  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    recentOrders.length > 0 ? recentOrders[0] : null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = recentOrders.find(
      (o) => o.id.toLowerCase() === searchId.trim().toLowerCase() || o.address.mobileNumber === searchId.trim()
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      // Create mock trackable order if not found in local state
      setSearchedOrder({
        id: searchId.toUpperCase() || 'NB-784210',
        date: 'Today, 02:30 PM',
        items: [],
        address: {
          fullName: 'Ananya Ramesh',
          mobileNumber: '9629046010',
          pincode: '600001',
          city: 'Chennai',
          state: 'Tamil Nadu',
          streetAddress: 'Anna Salai',
          addressType: 'Home'
        },
        paymentMethod: 'razorpay',
        paymentStatus: 'PAID',
        subtotal: 8999,
        discountAmount: 900,
        gstAmount: 405,
        shippingFee: 0,
        codFee: 0,
        totalAmount: 8504,
        status: 'Dispatched',
        courierPartner: 'Delhivery Express',
        trackingNumber: 'DEL-9948201',
        estimatedDeliveryDate: 'Tomorrow by 6:00 PM'
      });
    }
  };

  const timelineSteps = [
    { title: 'Order Confirmed', time: '10:15 AM', done: true },
    { title: 'Kanchipuram Quality Check & Packing', time: '01:30 PM', done: true },
    { title: 'Handed to Delhivery Courier Hub', time: '04:00 PM', done: true },
    { title: 'Out for Delivery', time: 'Expected Tomorrow', done: false },
    { title: 'Delivered', time: 'Pending', done: false }
  ];

  return (
    <div id="order-tracking-backdrop" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-purple-100 relative">
        
        {/* Header */}
        <div className="bg-purple-950 text-amber-50 p-4 sm:p-5 flex items-center justify-between border-b border-purple-800">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Nalinam Boutique Logo"
              className="w-9 h-9 rounded-full object-cover border border-amber-400 shadow-sm shrink-0 bg-purple-950"
              referrerPolicy="no-referrer"
            />
            <h2 className="font-serif font-bold text-lg text-amber-200">
              Track Order Status
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. NB-89241) or Mobile"
              className="flex-1 bg-gray-50 text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-900"
            />
            <button
              type="submit"
              className="bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {searchedOrder && (
            <div className="space-y-4">
              {/* Order Info Badge */}
              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-purple-950 block text-sm">
                    {searchedOrder.id}
                  </span>
                  <span className="text-gray-500">
                    Courier: {searchedOrder.courierPartner} • {searchedOrder.trackingNumber}
                  </span>
                </div>
                <span className="bg-purple-950 text-amber-300 font-bold px-3 py-1 rounded-full">
                  {searchedOrder.status}
                </span>
              </div>

              {/* Timeline */}
              <div className="space-y-3 pl-2 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200">
                {timelineSteps.map((s, idx) => (
                  <div key={idx} className="relative pl-7 flex items-start justify-between text-xs">
                    <div className={`absolute left-2 top-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center -translate-x-1/2 ${
                      s.done ? 'bg-purple-900 border-purple-900 text-white' : 'bg-white border-gray-300'
                    }`}>
                      {s.done && <CheckCircle2 className="w-3 h-3 text-amber-300" />}
                    </div>

                    <div>
                      <span className={`font-bold block ${s.done ? 'text-purple-950' : 'text-gray-400'}`}>
                        {s.title}
                      </span>
                    </div>

                    <span className="text-[11px] text-gray-500">{s.time}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Address & ETA */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
                <span className="font-bold text-purple-950 block">Delivering To:</span>
                <p className="text-gray-700">
                  {searchedOrder.address.fullName}, {searchedOrder.address.streetAddress}, {searchedOrder.address.city} - {searchedOrder.address.pincode}
                </p>
                <p className="text-emerald-700 font-semibold pt-1">
                  Estimated Delivery: {searchedOrder.estimatedDeliveryDate}
                </p>
              </div>

              {/* Support */}
              <a
                href={`https://wa.me/919043970969?text=Hello%20Nalinam%20Boutique!%20Please%20help%20me%20with%20Order%20${searchedOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Need Support for Order {searchedOrder.id}?</span>
              </a>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
