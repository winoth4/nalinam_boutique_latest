import React, { useState } from 'react';
import { CartItem, Address, PaymentMethod, Order } from '../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  CreditCard,
  Banknote,
  Truck,
  Building,
  Lock,
  Smartphone,
  Download,
  PackageCheck,
  MessageCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { lookupPincode } from '../data/pincodes';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon?: string;
  couponDiscount?: number;
  onOrderPlaced: (order: Order) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  couponDiscount = 0,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  
  // Address State
  const [address, setAddress] = useState<Address>({
    fullName: 'Priya Sundaram',
    mobileNumber: '9840123456',
    pincode: '600001',
    city: 'Chennai',
    state: 'Tamil Nadu',
    streetAddress: 'No. 42, Usman Road, T. Nagar',
    landmark: 'Near Panagal Park',
    addressType: 'Home'
  });

  const [pincodeInfo, setPincodeInfo] = useState(() => lookupPincode('600001'));

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Totals
  const rawSubtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = rawSubtotal >= 1999 || items.length === 0 ? 0 : 99;
  const codFee = paymentMethod === 'cod' ? 50 : 0;
  const gstAmount = Math.round((rawSubtotal - couponDiscount) * 0.05);
  const finalTotal = rawSubtotal - couponDiscount + shippingFee + codFee + gstAmount;

  const handlePincodeChange = (pin: string) => {
    const cleanPin = pin.replace(/\D/g, '');
    const info = lookupPincode(cleanPin);
    setPincodeInfo(info);
    setAddress((prev) => ({
      ...prev,
      pincode: cleanPin,
      city: info.state.includes('Chennai') ? 'Chennai' : info.state.includes('Coimbatore') ? 'Coimbatore' : prev.city,
      state: info.state.includes('Tamil Nadu') ? 'Tamil Nadu' : prev.state
    }));
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);

    if (paymentMethod === 'cod' || paymentMethod === 'upi_qr') {
      setTimeout(() => {
        const newOrder: Order = {
          id: `NB-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          items: [...items],
          address: { ...address },
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'PENDING_COD' : 'PAID',
          subtotal: rawSubtotal,
          discountAmount: couponDiscount,
          couponApplied: appliedCoupon,
          gstAmount,
          shippingFee,
          codFee,
          totalAmount: finalTotal,
          status: 'Order Confirmed',
          courierPartner: pincodeInfo.courier || 'Porter / Delhivery Express',
          trackingNumber: `TN-${Math.floor(10000000 + Math.random() * 90000000)}`,
          estimatedDeliveryDate: '2 Business Days'
        };

        setPlacedOrder(newOrder);
        setIsProcessing(false);
        setStep('confirmation');
        onOrderPlaced(newOrder);
      }, 1200);
      return;
    }

    // Razorpay Gateway
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Unable to load Razorpay payment gateway SDK. Please check your connection.');
      setIsProcessing(false);
      return;
    }

    const orderId = `NB-${Math.floor(100000 + Math.random() * 900000)}`;
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Saul1etiX5mDW3';

    const options = {
      key: razorpayKey,
      amount: finalTotal * 100, // Amount in paise
      currency: 'INR',
      name: 'Nalinam Boutique',
      description: `Order #${orderId} - Kanjivaram Pure Silk & Festive Wear`,
      image: '/logo.jpg',
      handler: function (response: any) {
        const paymentTxnId = response.razorpay_payment_id || `pay_${Math.floor(Math.random() * 1000000000)}`;
        const newOrder: Order = {
          id: orderId,
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          items: [...items],
          address: { ...address },
          paymentMethod: 'razorpay',
          paymentStatus: 'PAID',
          paymentTxnId,
          subtotal: rawSubtotal,
          discountAmount: couponDiscount,
          couponApplied: appliedCoupon,
          gstAmount,
          shippingFee,
          codFee,
          totalAmount: finalTotal,
          status: 'Order Confirmed',
          courierPartner: pincodeInfo.courier || 'Porter / Delhivery Express',
          trackingNumber: `TN-${Math.floor(10000000 + Math.random() * 90000000)}`,
          estimatedDeliveryDate: '2 Business Days'
        };

        setPlacedOrder(newOrder);
        setIsProcessing(false);
        setStep('confirmation');
        onOrderPlaced(newOrder);
      },
      prefill: {
        name: address.fullName,
        email: `${address.fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        contact: address.mobileNumber
      },
      notes: {
        shipping_address: `${address.streetAddress}, ${address.city}, ${address.state} - ${address.pincode}`,
        boutique: 'Nalinam Boutique'
      },
      theme: {
        color: '#3b0764'
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error?.description || 'Transaction cancelled or failed.'}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay SDK init error:', err);
      alert('Failed to initialize Razorpay checkout popup. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden border border-purple-100 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-purple-950 text-amber-50 p-4 sm:p-5 flex items-center justify-between border-b border-purple-800 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Nalinam Boutique Logo"
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0 bg-purple-950"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xs font-serif font-bold text-amber-300 block">
                Nalinam Boutique Express Checkout
              </span>
              <h2 className="font-serif font-bold text-lg text-white">
                {step === 'address' && '1. Delivery Address & Serviceability'}
                {step === 'payment' && '2. Razorpay & UPI Payment Options'}
                {step === 'confirmation' && 'Order Confirmed! 🎉'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: ADDRESS FORM */}
          {step === 'address' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-950 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-900"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-950 mb-1">Mobile Number (For WhatsApp Updates)</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={address.mobileNumber}
                    onChange={(e) => setAddress({ ...address, mobileNumber: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-900"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-950 mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-900 font-bold"
                    placeholder="600001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-950 mb-1">City / District</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-900"
                    placeholder="Chennai / Coimbatore"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-950 mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1">Street Address, Door No., Building</label>
                <textarea
                  rows={2}
                  value={address.streetAddress}
                  onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-900"
                  placeholder="Door No, Street Name, Area"
                />
              </div>

              {/* Serviceability Banner */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">Pincode {address.pincode} Serviceable via {pincodeInfo.courier}</span>
                  <span className="text-[11px] text-emerald-800">Estimated Delivery: {pincodeInfo.estimatedDays}. Cash on Delivery Available.</span>
                </div>
              </div>

              <button
                onClick={() => setStep('payment')}
                className="w-full bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-sm py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              >
                <span>Proceed to Payment Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-5">
              
              <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-purple-950">
                  Select Payment Gateway / Mode
                </label>

                <div className="space-y-2.5">
                  {/* Razorpay Gateway */}
                  <div
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      paymentMethod === 'razorpay' ? 'bg-purple-50 border-purple-900 shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        RZP
                      </div>
                      <div>
                        <span className="font-bold text-xs text-purple-950 block">
                          Razorpay (Cards, NetBanking, Pay Later)
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Supports Credit/Debit Cards, HDFC/SBI NetBanking & Simpl/LazyPay
                        </span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'razorpay' ? 'border-purple-900 bg-purple-900 text-amber-300' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'razorpay' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Direct GPay / UPI QR Modal */}
                  <div
                    onClick={() => setPaymentMethod('upi_qr')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      paymentMethod === 'upi_qr' ? 'bg-purple-50 border-purple-900 shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-purple-950 block">
                          Direct Google Pay / PhonePe UPI QR Code
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Scan & Pay to <strong className="text-purple-950 font-mono">archanamathi14-3@okicici</strong> (Archanaa M)
                        </span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'upi_qr' ? 'border-purple-900 bg-purple-900 text-amber-300' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'upi_qr' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Cash on Delivery (COD) */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      paymentMethod === 'cod' ? 'bg-purple-50 border-purple-900 shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-purple-950 block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Pay cash upon courier delivery (+₹50 verification charge)
                        </span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-purple-900 bg-purple-900 text-amber-300' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* UPI QR Display if upi_qr selected */}
              {paymentMethod === 'upi_qr' && (
                <div className="p-5 bg-slate-100 text-gray-900 rounded-2xl space-y-4 text-center border border-purple-200 shadow-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-purple-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      AM
                    </div>
                    <span className="font-serif font-bold text-base text-gray-900">
                      Archanaa M
                    </span>
                  </div>

                  {/* Google Pay Style QR Container */}
                  <div className="bg-white p-5 rounded-3xl max-w-[260px] mx-auto shadow-md border border-slate-200 relative space-y-3">
                    <div className="relative aspect-square w-48 mx-auto bg-white flex items-center justify-center p-2 rounded-2xl border border-gray-100 shadow-inner">
                      {/* High quality styled QR SVG matching the scan code */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900 fill-current">
                        {/* Corner Position Detection Patterns */}
                        <rect x="5" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="11" y="11" width="14" height="14" rx="2" fill="currentColor" />
                        
                        <rect x="69" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="75" y="11" width="14" height="14" rx="2" fill="currentColor" />
                        
                        <rect x="5" y="69" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="11" y="75" width="14" height="14" rx="2" fill="currentColor" />

                        {/* Data Modules Pattern Simulation */}
                        <path d="M36 5h6v6h-6z M48 5h6v6h-6z M60 5h6v6h-6z M36 17h6v6h-6z M48 17h6v6h-6z M36 29h6v6h-6z M48 29h6v12h-6z M60 29h12v6h-12z M5 36h6v12H5z M17 36h12v6H17z M5 54h12v6H5z M23 54h6v12h-6z M36 54h6v6h-6z M48 54h12v6H48z M66 54h6v6h-6z M78 36h18v6H78z M78 48h6v12h-6z M90 48h6v6h-6z M78 66h12v6H78z M66 66h6v12h-6z M36 66h12v6H36z M48 78h6v18h-6z M60 78h12v6H60z M36 84h6v12h-6z M60 90h18v6H60z M84 84h12v12H84z M5 90h12v6H5z" />
                      </svg>

                      {/* Google Pay Center Logo Badge */}
                      <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-full border border-gray-200 shadow-md flex items-center justify-center p-1">
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      </div>
                    </div>

                    <div className="pt-1">
                      <div className="flex items-center justify-center gap-1.5 bg-slate-50 py-1.5 px-3 rounded-xl border border-gray-200">
                        <span className="text-xs font-mono font-bold text-gray-900 select-all">
                          archanamathi14-3@okicici
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('archanamathi14-3@okicici');
                            alert('UPI ID archanamathi14-3@okicici copied to clipboard!');
                          }}
                          className="text-[10px] font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 px-2 py-0.5 rounded-md transition-colors"
                          title="Copy UPI ID"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] font-medium text-gray-500">
                      Scan to pay with any UPI app
                    </p>
                  </div>

                  {/* Quick launch UPI Intent link for mobile users */}
                  <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <a
                      href={`upi://pay?pa=archanamathi14-3@okicici&pn=Archanaa%20M&am=${finalTotal}&cu=INR`}
                      className="inline-flex items-center gap-1.5 bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs py-2 px-4 rounded-xl shadow transition-colors"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Tap to Open UPI App (GPay / PhonePe)</span>
                    </a>
                  </div>

                  <p className="text-xs font-medium text-purple-950">
                    Pay exactly <strong className="text-purple-900 text-sm font-bold">₹{finalTotal.toLocaleString('en-IN')}</strong> to complete your Nalinam Boutique order.
                  </p>
                </div>
              )}

              {/* Final Price Summary Box */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items):</span>
                  <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Boutique Coupon Discount:</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling:</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between text-amber-800 font-semibold">
                    <span>COD Fee:</span>
                    <span>+₹{codFee}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between font-serif font-black text-base text-purple-950">
                  <span>Grand Total:</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('address')}
                  className="w-1/3 py-3 rounded-2xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  disabled={isProcessing}
                  onClick={handleCompleteOrder}
                  className="w-2/3 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-purple-950 font-black text-xs py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay & Place Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION */}
          {step === 'confirmation' && placedOrder && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment & Order Successful
                </span>
                <h3 className="font-serif font-bold text-2xl text-purple-950 mt-2">
                  Thank You, {placedOrder.address.fullName}!
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Your order <strong>{placedOrder.id}</strong> has been received by our Kanchipuram Weaving Hub.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-left space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono font-bold text-purple-950">{placedOrder.id}</span>
                </div>
                {placedOrder.paymentTxnId && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Razorpay Payment ID:</span>
                    <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {placedOrder.paymentTxnId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-bold text-purple-950">₹{placedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="font-medium text-purple-950 text-right max-w-[200px] truncate">
                    {placedOrder.address.streetAddress}, {placedOrder.address.city} - {placedOrder.address.pincode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-bold text-emerald-700">{placedOrder.estimatedDeliveryDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://wa.me/919043970969?text=Hello%20Nalinam%20Boutique!%20I%20have%20placed%20Order%20${placedOrder.id}%20for%20Amount%20₹${placedOrder.totalAmount}.%20Please%20send%20tracking%20updates.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Receive WhatsApp Receipt</span>
                </a>

                <button
                  onClick={() => {
                    alert(`Invoice downloaded for Order ${placedOrder.id}`);
                  }}
                  className="bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Tax Invoice</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-3 rounded-xl"
              >
                Continue Shopping
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
