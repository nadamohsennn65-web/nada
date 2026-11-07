export type Category = 'all' | 'winter-jackets' | 'lingerie' | 'women' | 'men';

export type Gender = 'women' | 'men' | 'unisex';

export interface ProductColor {
  nameAr: string;
  nameEn: string;
  hex: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  category: 'winter-jackets' | 'lingerie';
  gender: Gender;
  price: number;
  originalPrice?: number;
  descriptionAr: string;
  descriptionEn: string;
  materialAr: string;
  materialEn: string;
  image: string;
  secondaryImage?: string;
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[];
  colors: ProductColor[];
  inStock: boolean;
  featured?: boolean;
  sku: string;
  tagAr?: string;
  tagEn?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  nameAr: string;
  nameEn: string;
  size: string;
  colorNameAr: string;
  colorNameEn: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'card' | 'applepay';
  status: OrderStatus;
}
