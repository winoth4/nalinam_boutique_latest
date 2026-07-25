import React, { useState } from 'react';
import { X, Video, Send, CheckCircle2, Calendar, Phone, MapPin, Sparkles, Clock } from 'lucide-react';
import { VideoCallAppointment } from '../types';

interface VideoCallRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: (appointment: VideoCallAppointment) => void;
  prefillInterest?: string;
}

export const VideoCallRequestModal: React.FC<VideoCallRequestModalProps> = ({
  isOpen,
  onClose,
  onRequestSubmitted,
  prefillInterest = ''
}) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [city, setCity] = useState('');
  const [interest, setInterest] = useState(prefillInterest || 'Kanjivaram Bridal Sarees');
  const [timeSlot, setTimeSlot] = useState('Today (4:00 PM - 7:00 PM)');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdAptId, setCreatedAptId] = useState('');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !mobileNumber.trim()) {
      alert('Please enter your Name and Mobile Number.');
      return;
    }

    const aptId = `VCA-${Math.floor(100 + Math.random() * 900)}`;
    const newAppointment: VideoCallAppointment = {
      id: aptId,
      customerName: fullName.trim(),
      mobile: mobileNumber.trim(),
      city: city.trim() || 'Tamil Nadu',
      requestedTime: timeSlot,
      interest: interest,
      notes: notes.trim(),
      status: 'Pending Request',
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Save to App State / Admin
    onRequestSubmitted(newAppointment);
    setCreatedAptId(aptId);
    setIsSuccess(true);

    // Format WhatsApp Message to Primary Number +91 90439 70969
    const waText = `Hello Nalinam Boutique! I would like to request a WhatsApp Video Shopping Call.

📋 *Request Ref:* ${aptId}
👤 *Name:* ${fullName.trim()}
📞 *Mobile:* ${mobileNumber.trim()}
📍 *City/Pincode:* ${city.trim() || 'Not specified'}
⏰ *Preferred Slot:* ${timeSlot}
🥻 *Interested In:* ${interest}
${notes.trim() ? `💬 *Notes:* ${notes.trim()}` : ''}

Please confirm my video call slot. Thank you!`;

    const waUrl = `https://wa.me/919043970969?text=${encodeURIComponent(waText)}`;
    
    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFullName('');
    setMobileNumber('');
    setCity('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-purple-200 relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-pink-950 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-amber-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Nalinam Boutique Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-lg shrink-0 bg-purple-950"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Boutique Experience</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                Request WhatsApp Video Shopping Call
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center space-y-4 py-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif font-bold text-xl text-purple-950">
                  Video Call Request Sent!
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Your video call booking <strong className="text-purple-900 font-mono">#{createdAptId}</strong> has been logged into our boutique system & sent via WhatsApp message.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-left text-xs space-y-2">
                <p className="text-gray-700"><strong>Primary Helpline:</strong> <span className="font-mono text-purple-950 font-bold">+91 90439 70969</span></p>
                <p className="text-gray-700"><strong>Scheduled Time:</strong> {timeSlot}</p>
                <p className="text-gray-700"><strong>Selection:</strong> {interest}</p>
                <p className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 p-2 rounded-xl border border-emerald-200/60 mt-1">
                  ✓ Reflects in Store Manager Admin portal. Our stylist will connect offline via WhatsApp video call.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={`https://wa.me/919043970969?text=Hello%20Nalinam%20Boutique!%20Inquiring%20about%20Video%20Call%20Request%20${createdAptId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Open WhatsApp Direct Chat</span>
                </a>
                <button
                  onClick={handleReset}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-3 px-5 rounded-2xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <p className="text-gray-600 text-[11px]">
                Fill out the quick form below. The request will be sent to our WhatsApp desk (<strong className="text-purple-950">+91 90439 70969</strong>) and automatically updated in our Admin system for offline video tour confirmation.
              </p>

              <div>
                <label className="block font-bold text-purple-950 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sangeetha Sundaram"
                  className="w-full bg-gray-50 border border-gray-300 p-3 rounded-2xl text-xs focus:outline-none focus:border-purple-950 focus:ring-1 focus:ring-purple-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">
                    WhatsApp Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="e.g. 9043970969"
                      className="w-full bg-gray-50 border border-gray-300 pl-9 pr-3 py-3 rounded-2xl text-xs focus:outline-none focus:border-purple-950 focus:ring-1 focus:ring-purple-950 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-purple-950 mb-1">
                    City / Pincode
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Chennai 600001 / USA"
                      className="w-full bg-gray-50 border border-gray-300 pl-9 pr-3 py-3 rounded-2xl text-xs focus:outline-none focus:border-purple-950 focus:ring-1 focus:ring-purple-950"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">
                    Interested Saree / Outfit Collection
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 p-3 rounded-2xl text-xs focus:outline-none focus:border-purple-950"
                  >
                    <option value="Kanjivaram Pure Silk Sarees">Kanjivaram Pure Silk Sarees</option>
                    <option value="Soft Silk & Light Silks">Soft Silk & Light Silks</option>
                    <option value="Bridal Collection & Trousseau">Bridal Collection & Trousseau</option>
                    <option value="Festival Lehengas & Salwars">Festival Lehengas & Salwars</option>
                    <option value="Custom Blouse Stitching Consultation">Custom Blouse Stitching Consultation</option>
                    <option value="General Boutique Tour">General Boutique Tour</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-purple-950 mb-1">
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 pl-9 pr-3 py-3 rounded-2xl text-xs focus:outline-none focus:border-purple-950"
                    >
                      <option value="Today (11:00 AM - 1:00 PM)">Today Morning (11 AM - 1 PM)</option>
                      <option value="Today (4:00 PM - 7:00 PM)">Today Evening (4 PM - 7 PM)</option>
                      <option value="Tomorrow Morning (10:30 AM)">Tomorrow Morning (10:30 AM)</option>
                      <option value="Tomorrow Evening (5:00 PM)">Tomorrow Evening (5:00 PM)</option>
                      <option value="Weekend Special Slot">Weekend Special Slot</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">
                  Specific Requirements or Budget Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Looking for Pink Kanjivaram saree with gold zari border under ₹20,000"
                  className="w-full bg-gray-50 border border-gray-300 p-3 rounded-2xl text-xs focus:outline-none focus:border-purple-950"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all text-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Request to WhatsApp (+91 90439 70969) & Admin</span>
                </button>
              </div>

              <p className="text-[10px] text-gray-500 text-center">
                🔒 Your details are private. Calls are conducted 1-on-1 via WhatsApp video with our expert drape stylists.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
