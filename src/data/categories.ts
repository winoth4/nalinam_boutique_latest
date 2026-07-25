import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'sarees',
    name: 'Sarees',
    slug: 'sarees',
    description: 'Timeless Kanjivaram, Soft Silks, Handloom Cottons & Designer Organzas.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    subcategories: ['Kanjivaram', 'Soft Silk', 'Cotton', 'Organza', 'Georgette', 'Designer', 'Chanderi'],
    featuredCount: 42
  },
  {
    id: 'salwars',
    name: 'Salwars & Dress Materials',
    slug: 'salwars',
    description: 'Unstitched sets, Readymade Anarkalis, Kurti sets & Palazzo combinations.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    subcategories: ['Unstitched sets', 'Readymade suits', 'Anarkalis', 'Kurti sets', 'Palazzo sets'],
    featuredCount: 28
  },
  {
    id: 'lehengas',
    name: 'Lehengas & Festival Wear',
    slug: 'lehengas',
    description: 'Bridal Kanjivaram Lehengas, Festive Silk sets & Light Partywear.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    subcategories: ['Bridal', 'Festive', 'Light partywear'],
    featuredCount: 19
  },
  {
    id: 'fusion',
    name: 'Western & Fusion Wear',
    slug: 'fusion',
    description: 'Contemporary Indo-Western tunics, Peplum tops & Ethnic Maxi dresses.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    subcategories: ['Tops', 'Indo-Western tunics', 'Maxi dresses'],
    featuredCount: 15
  },
  {
    id: 'accessories',
    name: 'Accessories & Add-ons',
    slug: 'accessories',
    description: 'Pure Silk Dupattas, Blouse fabrics, Cotton In-Skirts & Temple Jewelry.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    subcategories: ['Dupattas', 'Blouse materials', 'In skirts', 'Matching accessories'],
    featuredCount: 34
  }
];
