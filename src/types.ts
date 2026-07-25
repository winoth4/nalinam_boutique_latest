export type ProductCategory =
  | 'Sarees'
  | 'Salwars & Dress Materials'
  | 'Lehengas & Festival Wear'
  | 'Western & Fusion Wear'
  | 'Accessories & Add-ons';

export type FabricType =
  | 'Kanjivaram Pure Silk'
  | 'Soft Silk'
  | 'Handloom Cotton'
  | 'Organza'
  | 'Georgette'
  | 'Chanderi Silk'
  | 'Banarasi Silk'
  | 'Silk Cotton'
  | 'Velvet'
  | 'Chiffon';

export type StitchingOption = 'Unstitched' | 'Semi-stitched (+₹350)' | 'Ready-to-wear';

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | 'Free Size';

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  fabric: FabricType;
  color: string;
  colorHex: string;
  occasion: 'Bridal' | 'Festive' | 'Partywear' | 'Casual' | 'Office Wear' | 'Temple Visit';
  inStock: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  image: string;
  gallery: string[];
  description: string;
  careInstructions: string;
  stitchingOptions: StitchingOption[];
  sizesAvailable?: GarmentSize[];
  weaveCertificate?: string;
  blouseDetails?: string;
  pincodeDeliveryDays?: number;
}

export interface CategoryInfo {
  id: string;
  name: ProductCategory;
  slug: string;
  description: string;
  image: string;
  subcategories: string[];
  featuredCount: number;
}

export interface FilterState {
  category: ProductCategory | 'All';
  subcategories: string[];
  fabrics: FabricType[];
  colors: string[];
  priceRange: [number, number];
  occasions: string[];
  inStockOnly: boolean;
  minRating: number;
  searchQuery: string;
  sortBy: 'popularity' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
}

export interface CartItem {
  product: Product;
  selectedStitching: StitchingOption;
  selectedSize?: GarmentSize;
  quantity: number;
  customNotes?: string;
}

export interface Address {
  fullName: string;
  mobileNumber: string;
  pincode: string;
  city: string;
  state: string;
  streetAddress: string;
  landmark?: string;
  addressType: 'Home' | 'Work';
}

export type PaymentMethod = 'razorpay' | 'upi_qr' | 'cod';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PAID' | 'PENDING_COD' | 'FAILED';
  paymentTxnId?: string;
  subtotal: number;
  discountAmount: number;
  couponApplied?: string;
  gstAmount: number;
  shippingFee: number;
  codFee: number;
  totalAmount: number;
  status: 'Order Confirmed' | 'Weaving / Quality Check' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  courierPartner: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
}

export interface CustomerReview {
  id: number;
  userName: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  productName: string;
  avatar: string;
}

export interface PincodeInfo {
  pincode: string;
  serviceable: boolean;
  state: string;
  courier: string;
  estimatedDays: string;
  codAvailable: boolean;
  freeShippingEligible: boolean;
}

export interface VideoCallAppointment {
  id: string;
  customerName: string;
  mobile: string;
  city: string;
  requestedTime: string;
  interest: string;
  notes?: string;
  status: 'Pending Request' | 'Confirmed & Scheduled' | 'Call Completed' | 'Cancelled';
  createdAt: string;
  adminNotes?: string;
}

