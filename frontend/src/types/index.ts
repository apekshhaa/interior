export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'texture' | 'paint' | 'package' | 'consultation';
  image: string;
  description: string;
  fullDescription: string;
  isSale?: boolean;
  featured?: boolean;
  tallAspect?: boolean;
  coverage?: string;
  finishType?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BookingDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  propertyAddress: string;
  propertyType: 'Residential' | 'Commercial';
  approxArea: string;
  selectedServices: string[];
  preferredTextures: string[];
  selectedColours?: string[];
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  role?: 'customer' | 'admin';
}

export type PageType = 'home' | 'services' | 'gallery' | 'shop' | 'product-detail' | 'about' | 'contact' | 'cart' | 'checkout' | 'confirmation' | 'auth';
