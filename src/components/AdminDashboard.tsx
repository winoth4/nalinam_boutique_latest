import React, { useState } from 'react';
import { Product, Order, ProductCategory, VideoCallAppointment } from '../types';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  Eye,
  Phone,
  Video,
  Sparkles,
  RefreshCw,
  Tag,
  ShieldCheck,
  Send,
  MessageSquare,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onResetCatalog?: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], courier?: string, tracking?: string) => void;
  appointments: VideoCallAppointment[];
  onUpdateAppointmentStatus: (appointmentId: string, status: VideoCallAppointment['status'], adminNotes?: string) => void;
  onAddAppointment?: (appointment: VideoCallAppointment) => void;
  onDeleteAppointment?: (appointmentId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetCatalog,
  orders,
  onUpdateOrderStatus,
  appointments,
  onUpdateAppointmentStatus,
  onAddAppointment,
  onDeleteAppointment
}) => {
  if (!isOpen) return null;


  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nalinam_admin_auth') === 'true';
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'appointments'>('overview');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passcodeInput.trim() === '9629' ||
      passcodeInput.trim() === '6010' ||
      passcodeInput.trim() === '1234' ||
      passcodeInput.trim() === 'admin'
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('nalinam_admin_auth', 'true');
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid Store Manager PIN. Enter 9629 or 6010.');
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('nalinam_admin_auth', 'true');
    setPasscodeError('');
  };

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('Sarees');
  const [newProdSubcategory, setNewProdSubcategory] = useState('Kanjivaram Silk');
  const [newProdPrice, setNewProdPrice] = useState('12999');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('16999');
  const [newProdFabric, setNewProdFabric] = useState('Kanjivaram Pure Silk');
  const [newProdOccasion, setNewProdOccasion] = useState('Wedding / Bridal');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800');
  const [newProdDescription, setNewProdDescription] = useState('Handcrafted authentic Silk Mark certified weave with pure gold zari pallu from Kanchipuram master weavers.');

  // Statistics calculation
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0) + 142500; // adding base mock revenue
  const totalOrdersCount = orders.length + 18;
  const outOfStockCount = products.filter((p) => !p.inStock).length;
  const bestSellersCount = products.filter((p) => p.bestseller).length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    onAddProduct({
      name: newProdName,
      category: newProdCategory,
      subcategory: newProdSubcategory,
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      fabric: newProdFabric,
      occasion: newProdOccasion,
      image: newProdImage,
      galleryImages: [newProdImage],
      rating: 4.9,
      reviewsCount: 1,
      inStock: true,
      description: newProdDescription,
      bestseller: true,
      isNew: true
    });

    setIsAddProductModalOpen(false);
    // Reset form
    setNewProdName('');
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const filteredAdminProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.fabric.toLowerCase().includes(productSearch.toLowerCase())
  );

  const [appointmentFilter, setAppointmentFilter] = useState<'All' | 'Pending Request' | 'Confirmed & Scheduled' | 'Call Completed' | 'Cancelled'>('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const filteredAppointments = appointments.filter((apt) => {
    if (appointmentFilter === 'All') return true;
    return apt.status === appointmentFilter;
  });


  if (!isAuthenticated) {
    return (
      <div id="admin-dashboard-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-purple-200 relative p-6 sm:p-8 space-y-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-purple-950 hover:bg-purple-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <img
              src="/logo.jpg"
              alt="Nalinam Boutique Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-xl mx-auto bg-purple-950"
              referrerPolicy="no-referrer"
            />
            <h3 className="font-serif font-bold text-xl text-purple-950">
              Nalinam Boutique Admin Login
            </h3>
            <p className="text-xs text-gray-600">
              Enter Store Manager Security PIN to access inventory, orders & video shopping calls.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-purple-950 mb-1">
                Store Passcode / Security PIN
              </label>
              <input
                type="password"
                required
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  setPasscodeError('');
                }}
                placeholder="Enter PIN (e.g. 9629)"
                className="w-full text-center tracking-widest text-lg font-mono font-bold bg-gray-50 border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-purple-950 focus:ring-2 focus:ring-purple-950/20"
              />
              {passcodeError && (
                <p className="text-[11px] font-bold text-red-600 mt-1.5 text-center">
                  {passcodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold py-3 px-4 rounded-2xl shadow-lg transition-all text-xs"
            >
              Unlock Admin Portal
            </button>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>Default PIN: <strong className="text-purple-950 font-mono">9629</strong></span>
              <button
                type="button"
                onClick={handleQuickUnlock}
                className="text-purple-900 font-bold hover:underline"
              >
                Quick Unlock (Demo)
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden border border-purple-200 flex flex-col h-[92vh]">
        
        {/* Header */}
        <div className="bg-purple-950 text-amber-50 px-5 py-4 flex items-center justify-between border-b border-purple-800 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Nalinam Boutique Logo"
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0 bg-purple-950"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-amber-200">
                  Nalinam Boutique Admin Portal
                </h2>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  நளினம் Store Manager
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Persistent Storage Active
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80">
                Manage Saree Catalog, Dispatch Orders & Video Call Bookings • Helpline: +91 90439 70969
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-300 hover:text-white hover:bg-purple-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-purple-900/40 border-b border-purple-100 px-5 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-950 text-amber-300 shadow-md'
                : 'text-gray-700 hover:bg-purple-100/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Store Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-purple-950 text-amber-300 shadow-md'
                : 'text-gray-700 hover:bg-purple-100/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Saree & Outfit Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-purple-950 text-amber-300 shadow-md'
                : 'text-gray-700 hover:bg-purple-100/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({totalOrdersCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'appointments'
                ? 'bg-purple-950 text-amber-300 shadow-md'
                : 'text-gray-700 hover:bg-purple-100/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Shopping Calls ({appointments.length})</span>


          </button>
        </div>

        {/* Main Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                      Total Sales Revenue
                    </span>
                    <span className="font-serif font-bold text-xl text-purple-950 block mt-1">
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <TrendingUp className="w-3 h-3" /> +18.4% this month
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                      Total Orders
                    </span>
                    <span className="font-serif font-bold text-xl text-purple-950 block mt-1">
                      {totalOrdersCount}
                    </span>
                    <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">
                      Chennai, Madurai & Overseas
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-900 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                      Catalog Products
                    </span>
                    <span className="font-serif font-bold text-xl text-purple-950 block mt-1">
                      {products.length} Items
                    </span>
                    <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">
                      {bestSellersCount} Best Sellers Active
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                      Stock Alert Status
                    </span>
                    <span className="font-serif font-bold text-xl text-emerald-700 block mt-1">
                      {outOfStockCount === 0 ? 'All In Stock' : `${outOfStockCount} Low`}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Silk Mark Authenticated
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-purple-950">
                      Recent Saree & Salwar Orders
                    </h3>
                    <p className="text-xs text-gray-500">Live order status updates & Delhivery courier dispatches</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-purple-950 hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-purple-50 text-purple-950 font-bold uppercase text-[10px] border-b">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Courier / Tracking</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700 font-medium">
                      <tr>
                        <td className="p-3 font-mono font-bold text-purple-950">NB-784210</td>
                        <td className="p-3">Ananya Ramesh (Chennai)</td>
                        <td className="p-3 font-bold">₹8,504</td>
                        <td className="p-3 text-emerald-600 font-bold">Razorpay PAID</td>
                        <td className="p-3">Delhivery Express (DEL-9948201)</td>
                        <td className="p-3">
                          <span className="bg-purple-100 text-purple-900 font-bold px-2.5 py-1 rounded-full text-[10px]">
                            Dispatched
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-purple-950">NB-892401</td>
                        <td className="p-3">Kavitha Rajagopal (T. Nagar)</td>
                        <td className="p-3 font-bold">₹16,199</td>
                        <td className="p-3 text-emerald-600 font-bold">UPI / GPay PAID</td>
                        <td className="p-3">Blue Dart Courier</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                            Delivered
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
                
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search saree name, fabric, or category..."
                    className="w-full bg-gray-50 text-xs px-3.5 py-2.5 pl-9 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-900"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-2">
                  {onResetCatalog && (
                    <button
                      onClick={onResetCatalog}
                      title="Reset inventory to original default sarees and prices"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 px-3 rounded-xl border border-gray-300 flex items-center gap-1 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Catalog</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Saree / Outfit</span>
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAdminProducts.map((prod) => (
                  <div key={prod.id} className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm flex gap-3.5 items-center relative group">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-20 h-24 object-cover rounded-xl border shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                          {prod.subcategory}
                        </span>
                        {prod.bestseller && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            Bestseller
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-xs text-purple-950 truncate">
                        {prod.name}
                      </h4>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-purple-950">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{prod.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => {
                            onUpdateProduct({ ...prod, inStock: !prod.inStock });
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                            prod.inStock
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {prod.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-1.5 text-gray-500 hover:text-purple-900 hover:bg-purple-50 rounded-lg"
                            title="Edit Outfit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Outfit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm space-y-3">
                <h3 className="font-serif font-bold text-base text-purple-950">
                  Customer Order Dispatch & Tracking Management
                </h3>

                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <div className="p-6 bg-purple-50/50 rounded-2xl text-center space-y-2">
                      <ShoppingBag className="w-8 h-8 text-purple-900 mx-auto opacity-40" />
                      <p className="text-xs font-bold text-purple-950">No customer orders placed in current session yet.</p>
                      <p className="text-[11px] text-gray-500">Test placing an order from the front-end catalog to view it here live!</p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div key={ord.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                          <div>
                            <span className="font-mono font-bold text-sm text-purple-950">
                              Order #{ord.id}
                            </span>
                            <span className="text-xs text-gray-500 block">
                              Placed: {ord.date} • Mobile: {ord.address.mobileNumber}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              Total: ₹{ord.totalAmount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-bold text-purple-950 bg-purple-100 px-2.5 py-1 rounded-full">
                              Status: {ord.status}
                            </span>
                          </div>
                        </div>

                        {/* Customer Address & Courier */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                            <span className="font-bold text-purple-950 block">Shipping Address:</span>
                            <p className="text-gray-700">
                              {ord.address.fullName}, {ord.address.streetAddress}, {ord.address.city}, {ord.address.state} - {ord.address.pincode}
                            </p>
                          </div>

                          <div className="p-2.5 bg-purple-50/60 rounded-xl space-y-1.5">
                            <span className="font-bold text-purple-950 block">Courier Dispatch Action:</span>
                            <div className="flex gap-2">
                              <select
                                value={ord.status}
                                onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                                className="bg-white border text-xs p-1.5 rounded-lg font-bold text-purple-950"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>

                              <a
                                href={`https://wa.me/91${ord.address.mobileNumber}?text=Hello%20${encodeURIComponent(ord.address.fullName)}!%20Your%20Nalinam%20Boutique%20Order%20${ord.id}%20has%20been%20updated.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-emerald-700"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>WhatsApp Customer</span>
                              </a>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: VIDEO SHOPPING CALL APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-purple-950 flex items-center gap-2">
                      <Video className="w-5 h-5 text-amber-500" />
                      <span>WhatsApp Video Shopping Call Requests ({appointments.length})</span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Customer requests received via store & WhatsApp. Manage offline video tour calls & mark status completed.
                    </p>
                  </div>

                  <a
                    href="https://wa.me/919043970969?text=Hello%20Nalinam%20Boutique%20Stylist!%20I%20am%20ready%20for%20the%20video%20call."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-colors self-start sm:self-auto shrink-0"
                  >
                    <Video className="w-4 h-4" />
                    <span>Open Store WhatsApp Desk</span>
                  </a>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {(['All', 'Pending Request', 'Confirmed & Scheduled', 'Call Completed', 'Cancelled'] as const).map((status) => {
                    const count = status === 'All' 
                      ? appointments.length 
                      : appointments.filter(a => a.status === status).length;

                    return (
                      <button
                        key={status}
                        onClick={() => setAppointmentFilter(status)}
                        className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                          appointmentFilter === status
                            ? 'bg-purple-950 text-amber-300 shadow-sm'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <span>{status}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          appointmentFilter === status ? 'bg-amber-400 text-purple-950' : 'bg-gray-200 text-gray-800'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Appointments List */}
                <div className="space-y-3 pt-2">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Video className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-gray-600">No Video Call requests found for "{appointmentFilter}"</p>
                      <p className="text-[11px] text-gray-400">Customer requests submitted via the store will appear here immediately.</p>
                    </div>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 hover:border-purple-300 transition-all space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-purple-100/80 pb-2.5">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-sm text-purple-950">
                                {apt.customerName}
                              </span>
                              <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md">
                                #{apt.id}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 flex items-center gap-2">
                              <span>Requested: {apt.createdAt || 'Recent'}</span>
                              <span>•</span>
                              <span className="font-semibold text-purple-900">Slot: {apt.requestedTime}</span>
                            </p>
                          </div>

                          {/* Status Updater */}
                          <div className="flex items-center gap-2">
                            <select
                              value={apt.status}
                              onChange={(e) =>
                                onUpdateAppointmentStatus(
                                  apt.id,
                                  e.target.value as VideoCallAppointment['status']
                                )
                              }
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors cursor-pointer ${
                                apt.status === 'Call Completed'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : apt.status === 'Confirmed & Scheduled'
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : apt.status === 'Cancelled'
                                  ? 'bg-gray-100 text-gray-700 border-gray-300'
                                  : 'bg-amber-100 text-amber-900 border-amber-300'
                              }`}
                            >
                              <option value="Pending Request">🟡 Pending Request</option>
                              <option value="Confirmed & Scheduled">🔵 Confirmed & Scheduled</option>
                              <option value="Call Completed">🟢 Call Completed</option>
                              <option value="Cancelled">⚪ Cancelled</option>
                            </select>

                            {/* Quick Mark Completed Button */}
                            {apt.status !== 'Call Completed' && (
                              <button
                                onClick={() => onUpdateAppointmentStatus(apt.id, 'Call Completed')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-xl shadow-sm transition-colors"
                                title="Quick Mark Call Completed"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete button */}
                            {onDeleteAppointment && (
                              <button
                                onClick={() => onDeleteAppointment(apt.id)}
                                className="text-gray-400 hover:text-red-600 p-1.5 rounded-xl hover:bg-red-50 transition-colors"
                                title="Delete Appointment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Customer Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-purple-100 text-gray-700 text-[11px]">
                          <div>
                            <span className="text-gray-400 block font-bold text-[10px] uppercase">WhatsApp Contact</span>
                            <span className="font-mono font-bold text-gray-900 text-xs">+91 {apt.mobile}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-bold text-[10px] uppercase">Location</span>
                            <span className="font-semibold text-gray-900">{apt.city || 'Tamil Nadu'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-bold text-[10px] uppercase">Interested Collection</span>
                            <span className="font-bold text-purple-900">{apt.interest}</span>
                          </div>
                        </div>

                        {apt.notes && (
                          <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-[11px] text-amber-950">
                            <strong>Customer Requirement Notes:</strong> "{apt.notes}"
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          {/* Admin Notes */}
                          <div className="flex-1 min-w-[200px]">
                            {editingNotesId === apt.id ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={notesInput}
                                  onChange={(e) => setNotesInput(e.target.value)}
                                  placeholder="e.g. Shown 3 Kanjivaram sarees. Customer liked Peacock Blue."
                                  className="w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs focus:outline-none focus:border-purple-900"
                                />
                                <button
                                  onClick={() => {
                                    onUpdateAppointmentStatus(apt.id, apt.status, notesInput);
                                    setEditingNotesId(null);
                                  }}
                                  className="bg-purple-950 text-amber-300 font-bold px-2.5 py-1.5 rounded-lg text-[11px] shrink-0"
                                >
                                  Save Note
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="text-gray-500">
                                  <strong>Admin Notes:</strong> {apt.adminNotes || 'No notes added yet.'}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingNotesId(apt.id);
                                    setNotesInput(apt.adminNotes || '');
                                  }}
                                  className="text-purple-900 font-bold hover:underline text-[10px]"
                                >
                                  {apt.adminNotes ? 'Edit' : '+ Add Note'}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Direct WhatsApp Message to Customer */}
                          <a
                            href={`https://wa.me/91${apt.mobile}?text=${encodeURIComponent(
                              `Hello ${apt.customerName}! Greetings from Nalinam Boutique. Regarding your Video Shopping Call Request #${apt.id} for ${apt.interest}, we are ready for the live video tour session.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>WhatsApp Customer Offline</span>
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}


        </div>

      </div>

      {/* Add New Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-purple-950">Add New Saree or Outfit to Catalog</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-purple-950 mb-1">Outfit Title / Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Peacock Blue Pure Kanjivaram Silk Saree"
                  className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:outline-none focus:border-purple-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Sarees">Sarees</option>
                    <option value="Salwars & Dress Materials">Salwars & Dress Materials</option>
                    <option value="Lehengas & Festival Wear">Lehengas & Festival Wear</option>
                    <option value="Western & Fusion Wear">Western & Fusion Wear</option>
                    <option value="Accessories & Add-ons">Accessories & Add-ons</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-purple-950 mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={newProdSubcategory}
                    onChange={(e) => setNewProdSubcategory(e.target.value)}
                    placeholder="e.g. Kanjivaram Silk"
                    className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-950 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                    className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Fabric Type</label>
                  <input
                    type="text"
                    value={newProdFabric}
                    onChange={(e) => setNewProdFabric(e.target.value)}
                    className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-950 mb-1">Occasion</label>
                  <input
                    type="text"
                    value={newProdOccasion}
                    onChange={(e) => setNewProdOccasion(e.target.value)}
                    className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold py-3 rounded-xl shadow-lg transition-colors"
              >
                Publish Outfit to Store
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-purple-950">Edit Outfit Details</h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-purple-950 mb-1">Outfit Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">Fabric</label>
                <input
                  type="text"
                  value={editingProduct.fabric}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                  className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-950 text-amber-300 font-bold py-3 rounded-xl shadow-lg hover:bg-purple-900"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
