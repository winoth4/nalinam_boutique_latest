import React, { useState, useMemo, useEffect } from 'react';
import { Product, ProductCategory, FilterState, CartItem, Order, StitchingOption, GarmentSize, VideoCallAppointment } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { BannerCarousel } from './components/BannerCarousel';
import { ShopByCategory } from './components/ShopByCategory';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CategoryFilterDrawer } from './components/CategoryFilterDrawer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AIStyleAdvisor } from './components/AIStyleAdvisor';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { CustomerReviews } from './components/CustomerReviews';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { VideoCallRequestModal } from './components/VideoCallRequestModal';

import {
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  X,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { lookupPincode } from './data/pincodes';

export default function App() {
  // 1. Products state with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nalinam_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to load products from localStorage:', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    subcategories: [],
    fabrics: [],
    colors: [],
    priceRange: [1000, 35000],
    occasions: [],
    inStockOnly: false,
    minRating: 0,
    searchQuery: '',
    sortBy: 'popularity'
  });

  // Shopping Bag & Wishlist with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nalinam_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      {
        product: INITIAL_PRODUCTS[0],
        selectedStitching: 'Unstitched',
        quantity: 1
      }
    ];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nalinam_wishlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [INITIAL_PRODUCTS[1]];
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nalinam_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Video Call Appointments State with persistence
  const [videoCallAppointments, setVideoCallAppointments] = useState<VideoCallAppointment[]>(() => {
    const saved = localStorage.getItem('nalinam_video_call_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved video call appointments', e);
      }
    }
    return [
      {
        id: 'VCA-101',
        customerName: 'Priya Sundaram',
        mobile: '9840123456',
        city: 'Chennai',
        requestedTime: 'Today (4:00 PM - 7:00 PM)',
        interest: 'Kanjivaram Pure Silk Sarees',
        notes: 'Looking for Peacock Blue bridal saree under ₹25,000.',
        status: 'Confirmed & Scheduled',
        createdAt: '25 Jul, 10:30 AM',
        adminNotes: 'Scheduled with Stylist Archanaa.'
      },
      {
        id: 'VCA-102',
        customerName: 'Sangeetha Rao',
        mobile: '9629046010',
        city: 'Coimbatore',
        requestedTime: 'Tomorrow Morning (10:30 AM)',
        interest: 'Soft Silk & Light Silks',
        notes: 'Sarees for farewell party.',
        status: 'Pending Request',
        createdAt: '25 Jul, 11:15 AM'
      }
    ];
  });

  // Sync Products to localStorage and API
  useEffect(() => {
    localStorage.setItem('nalinam_products', JSON.stringify(products));
    fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products)
    }).catch(() => {});
  }, [products]);

  // Sync Cart to localStorage
  useEffect(() => {
    localStorage.setItem('nalinam_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync Wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('nalinam_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync Orders to localStorage and API
  useEffect(() => {
    localStorage.setItem('nalinam_orders', JSON.stringify(recentOrders));
    if (recentOrders.length > 0) {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recentOrders)
      }).catch(() => {});
    }
  }, [recentOrders]);

  // Sync Appointments to localStorage and API
  useEffect(() => {
    localStorage.setItem('nalinam_video_call_appointments', JSON.stringify(videoCallAppointments));
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoCallAppointments)
    }).catch(() => {});
  }, [videoCallAppointments]);

  // Initial Fetch from server API on mount if server has updated records
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          localStorage.setItem('nalinam_products', JSON.stringify(data));
        }
      })
      .catch(() => {});

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRecentOrders(data);
          localStorage.setItem('nalinam_orders', JSON.stringify(data));
        }
      })
      .catch(() => {});

    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVideoCallAppointments(data);
          localStorage.setItem('nalinam_video_call_appointments', JSON.stringify(data));
        }
      })
      .catch(() => {});
  }, []);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nalinam_products' && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === 'nalinam_orders' && e.newValue) {
        try {
          setRecentOrders(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === 'nalinam_video_call_appointments' && e.newValue) {
        try {
          setVideoCallAppointments(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNewVideoCallRequest = (apt: VideoCallAppointment) => {
    setVideoCallAppointments((prev) => [apt, ...prev]);
  };

  const handleUpdateAppointmentStatus = (
    id: string,
    status: VideoCallAppointment['status'],
    adminNotes?: string
  ) => {
    setVideoCallAppointments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status,
            adminNotes: adminNotes !== undefined ? adminNotes : item.adminNotes
          };
        }
        return item;
      })
    );
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Video Call request?')) {
      setVideoCallAppointments((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAIStylistOpen, setIsAIStylistOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const [videoCallPrefillInterest, setVideoCallPrefillInterest] = useState('');

  const openVideoCallModal = (interest: string = '') => {
    setVideoCallPrefillInterest(interest);
    setIsVideoCallModalOpen(true);
  };


  // Check URL hash or parameter for direct route access (e.g. ?admin=nalinamadmin)
  useEffect(() => {
    const checkHashAndQuery = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        search.includes('admin=nalinamadmin') ||
        search.includes('admin=true') ||
        hash.includes('admin=nalinamadmin') ||
        hash === '#admin'
      ) {
        setIsAdminOpen(true);
      }
    };

    checkHashAndQuery();
    window.addEventListener('hashchange', checkHashAndQuery);
    window.addEventListener('popstate', checkHashAndQuery);
    return () => {
      window.removeEventListener('hashchange', checkHashAndQuery);
      window.removeEventListener('popstate', checkHashAndQuery);
    };
  }, []);

  // User pincode state
  const [userPincode, setUserPincode] = useState('600001');
  const [tempPincodeInput, setTempPincodeInput] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState('');

  // Checkout coupon calculations
  const [checkoutCoupon, setCheckoutCoupon] = useState<string | undefined>('NALINAM10');
  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(1849);

  // Sync activeCategory with filters
  const handleSelectCategory = (cat: ProductCategory | 'All') => {
    setActiveCategory(cat);
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      subcategories: [],
      fabrics: [],
      colors: [],
      priceRange: [1000, 35000],
      occasions: [],
      inStockOnly: false,
      minRating: 0,
      searchQuery: '',
      sortBy: 'popularity'
    });
    setActiveCategory('All');
    setSearchQuery('');
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category
      if (filters.category !== 'All' && prod.category !== filters.category) {
        return false;
      }
      // Subcategories
      if (
        filters.subcategories.length > 0 &&
        !filters.subcategories.includes(prod.subcategory)
      ) {
        return false;
      }
      // Fabrics
      if (
        filters.fabrics.length > 0 &&
        !filters.fabrics.includes(prod.fabric)
      ) {
        return false;
      }
      // Occasions
      if (
        filters.occasions.length > 0 &&
        !filters.occasions.includes(prod.occasion)
      ) {
        return false;
      }
      // Price
      if (prod.price > filters.priceRange[1]) {
        return false;
      }
      // In-stock
      if (filters.inStockOnly && !prod.inStock) {
        return false;
      }
      // Search
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesFabric = prod.fabric.toLowerCase().includes(query);
        const matchesCat = prod.category.toLowerCase().includes(query);
        const matchesSub = prod.subcategory.toLowerCase().includes(query);
        if (!matchesName && !matchesFabric && !matchesCat && !matchesSub) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    });
  }, [products, filters, searchQuery]);

  // Wishlist handler
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    selectedStitching: StitchingOption = 'Unstitched',
    selectedSize?: GarmentSize
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedStitching === selectedStitching &&
          i.selectedSize === selectedSize
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          selectedStitching,
          selectedSize,
          quantity: 1
        }
      ];
    });

    setIsCartOpen(true);
  };

  const handleBuyNow = (
    product: Product,
    selectedStitching: StitchingOption = 'Unstitched',
    selectedSize?: GarmentSize
  ) => {
    handleAddToCart(product, selectedStitching, selectedSize);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const copy = [...prev];
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Pincode Modal Save
  const handleSavePincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPincodeInput) return;
    const info = lookupPincode(tempPincodeInput);
    if (info.serviceable) {
      setUserPincode(info.pincode);
      setPincodeMessage(`Pincode ${info.pincode} (${info.state}) is serviceable via ${info.courier}!`);
      setTimeout(() => {
        setIsPincodeModalOpen(false);
        setPincodeMessage('');
      }, 1200);
    } else {
      setPincodeMessage('Pincode is currently not serviceable.');
    }
  };

  // Admin product handlers
  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts((prev) => [
      {
        ...newProduct,
        id: Date.now()
      },
      ...prev
    ]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleResetCatalog = () => {
    if (window.confirm('Are you sure you want to reset all products & prices back to default catalog?')) {
      localStorage.removeItem('nalinam_products');
      setProducts(INITIAL_PRODUCTS);
      fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(INITIAL_PRODUCTS)
      }).catch(() => {});
    }
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: Order['status'],
    courier?: string,
    tracking?: string
  ) => {
    setRecentOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(courier ? { courierPartner: courier } : {}),
              ...(tracking ? { trackingNumber: tracking } : {})
            }
          : o
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col justify-between selection:bg-pink-600 selection:text-white">
      
      {/* Top Announcement Ticker Bar */}
      <AnnouncementBar
        onOpenPincodeModal={() => setIsPincodeModalOpen(true)}
        userPincode={userPincode}
        onOpenVideoCall={() => openVideoCallModal()}
      />

      {/* Main Header */}
      <Header
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onOpenVideoCall={openVideoCallModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Page Layout */}
      <main className="flex-1">
        
        {/* Show Banner Carousel & Shop By Category if no search & "All" active */}
        {activeCategory === 'All' && !searchQuery && (
          <>
            <BannerCarousel
              onSelectCategory={handleSelectCategory}
              onOpenAIStylist={() => setIsAIStylistOpen(true)}
              onOpenVideoCall={() => openVideoCallModal()}
            />
            <ShopByCategory
              onSelectCategory={handleSelectCategory}
              onSelectSubcategory={(sub) => {
                setFilters((prev) => ({ ...prev, subcategories: [sub] }));
              }}
            />
          </>
        )}


        {/* Product Catalog Grid Section */}
        <section id="product-catalog-section" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-widest block mb-1">
                Handcrafted Collections
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-purple-950">
                {activeCategory === 'All'
                  ? searchQuery ? `Search Results for "${searchQuery}"` : 'Best Sellers & Trending Now'
                  : `${activeCategory} Collection`}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Showing {filteredProducts.length} authentic pieces available for immediate dispatch.
              </p>
            </div>

            {/* Quick Filter & Sort Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-full shadow-md transition-colors self-start sm:self-auto"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filter & Sort ({filteredProducts.length})</span>
            </button>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-purple-50 text-purple-900 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-purple-800" />
              </div>
              <h3 className="font-serif font-bold text-xl text-purple-950">
                No Outfits Matched Your Filter Criteria
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your price range or clearing fabric filters to view more items.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-purple-950 text-amber-300 font-bold text-xs py-2.5 px-6 rounded-xl shadow-md hover:bg-purple-900 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={wishlist.some((w) => w.id === prod.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={(p) => handleAddToCart(p, 'Unstitched')}
                  onQuickView={(p) => {
                    setSelectedProduct(p);
                    setIsDetailModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}

        </section>

        {/* Customer Reviews & Instagram Feed */}
        <CustomerReviews />

      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onOpenVideoCall={() => openVideoCallModal()}
      />

      {/* MODALS & DRAWERS */}

      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isWishlisted={selectedProduct ? wishlist.some((w) => w.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onOpenVideoCall={openVideoCallModal}
      />


      {/* 2. Category Filter Drawer */}
      <CategoryFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(coupon, discount) => {
          setCheckoutCoupon(coupon);
          setCheckoutDiscount(discount || 0);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 4. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedCoupon={checkoutCoupon}
        couponDiscount={checkoutDiscount}
        onOrderPlaced={(newOrder) => {
          setRecentOrders((prev) => [newOrder, ...prev]);
          setCartItems([]);
        }}
      />

      {/* 5. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
        recentOrders={recentOrders}
      />

      {/* 6. AI Style Advisor */}
      <AIStyleAdvisor
        isOpen={isAIStylistOpen}
        onClose={() => setIsAIStylistOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setIsDetailModalOpen(true);
        }}
      />

      {/* 7. Wishlist Drawer */}
      {isWishlistDrawerOpen && (
        <div id="wishlist-drawer-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="bg-purple-950 text-amber-50 p-4 sm:p-5 flex items-center justify-between border-b border-purple-800">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400 fill-current" />
                <h2 className="font-serif font-bold text-lg text-amber-200">
                  Your Wishlist ({wishlist.length})
                </h2>
              </div>
              <button onClick={() => setIsWishlistDrawerOpen(false)} className="p-1 rounded-full text-purple-300 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
              {wishlist.length === 0 ? (
                <p className="text-center text-xs text-gray-500 py-12">
                  Your wishlist is empty. Click the heart icon on any product to save it for later!
                </p>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded-xl border" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-xs text-gray-900 truncate">{item.name}</h4>
                      <span className="font-bold text-xs text-purple-950">₹{item.price.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => {
                          handleAddToCart(item);
                          setIsWishlistDrawerOpen(false);
                        }}
                        className="mt-1 block text-[11px] font-bold text-pink-600 hover:underline"
                      >
                        Move to Bag &rarr;
                      </button>
                    </div>
                    <button onClick={() => handleToggleWishlist(item)} className="text-gray-400 hover:text-red-600 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. Pincode Checker Modal */}
      {isPincodeModalOpen && (
        <div id="pincode-modal-backdrop" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-1.5 text-purple-950 font-serif font-bold text-base">
                <MapPin className="w-4 h-4 text-pink-600" />
                <span>Check Delivery Serviceability</span>
              </div>
              <button onClick={() => setIsPincodeModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePincode} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Enter Your 6-Digit Indian Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={tempPincodeInput}
                  onChange={(e) => setTempPincodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 600001 or 641001"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-purple-900"
                />
              </div>

              {pincodeMessage && (
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  {pincodeMessage}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs py-3 rounded-xl shadow-md transition-colors"
              >
                Save Pincode
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 9. Store Admin Dashboard Portal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetCatalog={handleResetCatalog}
        orders={recentOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        appointments={videoCallAppointments}
        onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
        onAddAppointment={handleNewVideoCallRequest}
        onDeleteAppointment={handleDeleteAppointment}
      />

      {/* 10. Customer Video Call Request Modal */}
      <VideoCallRequestModal
        isOpen={isVideoCallModalOpen}
        onClose={() => setIsVideoCallModalOpen(false)}
        onRequestSubmitted={handleNewVideoCallRequest}
        prefillInterest={videoCallPrefillInterest}
      />

      {/* Floating WhatsApp Action Widget */}
      <WhatsAppWidget onOpenVideoCall={openVideoCallModal} />

    </div>
  );
}

