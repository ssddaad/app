// 产品类型
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: string; // 新品、热卖、折扣等
  tags?: string[];
}

// 购物车项
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: number;
}

// 订单
export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: number;
  deliveryAddress?: string;
}

// 筛选选项
export interface FilterOptions {
  category: string;
  priceRange: [number, number];
  rating: number;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating' | 'sales';
}

// 产品评价
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: number;
  helpful: number;
}
