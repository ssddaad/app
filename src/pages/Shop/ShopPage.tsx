import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, CartItem, FilterOptions } from './types';
import ProductCard from './ProductCard';
import CartSidebar from './CartSidebar';
import ProductModal from './ProductModal';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import './shop.css';
import Header from '@/components/header';
import p1 from '@/components/bcj.png';
import p2 from '@/components/jhy.jpg';
import p3 from '@/components/amy.jpg';
import p4 from '@/components/jksc.jpg';
import p5 from '@/components/xz.jpg';
import p6 from '@/components/watch.jpg';
import p7 from '@/components/tj.jpg';
import p8 from '@/components/sjh.jpg';
import AIAssistant from '@/components/AIAssistant/AIAssistant';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '乳腺健康检测试剂盒',
    description: '专业级家用乳腺健康检测工具，准确率高达95%',
    category: '检测工具',
    price: 299,
    originalPrice: 399,
    image: p8,
    rating: 4.8,
    reviewCount: 328,
    stock: 50,
    badge: '热卖',
    tags: ['专业', '准确', '家用'],
  },
  {
    id: 'p2',
    name: '乳腺健康营养补充剂',
    description: '含有天然植物提取物，帮助维护乳腺健康',
    category: '保健品',
    price: 168,
    originalPrice: 228,
    image: p1,
    rating: 4.6,
    reviewCount: 215,
    stock: 120,
    badge: '新品',
    tags: ['天然', '安全', '有效'],
  },
  {
    id: 'p3',
    name: '乳腺护理精油套装',
    description: '精选天然精油，温和护理，舒缓不适',
    category: '护理产品',
    price: 258,
    originalPrice: 358,
    image: p2,
    rating: 4.7,
    reviewCount: 189,
    stock: 80,
    tags: ['天然', '温和', '护理'],
  },
  {
    id: 'p4',
    name: '智能乳腺按摩仪',
    description: '智能温热按摩，缓解乳腺不适，促进血液循环',
    category: '医疗器械',
    price: 599,
    originalPrice: 799,
    image: p3,
    rating: 4.9,
    reviewCount: 412,
    stock: 35,
    badge: '热卖',
    tags: ['智能', '高效', '安全'],
  },
  {
    id: 'p5',
    name: '乳腺健康知识手册',
    description: '由医学专家编写，全面介绍乳腺健康知识',
    category: '书籍',
    price: 58,
    image: p4,
    rating: 4.5,
    reviewCount: 156,
    stock: 200,
    tags: ['专业', '详细', '实用'],
  },
  {
    id: 'p6',
    name: '防护内衣套装',
    description: '专业设计的防护内衣，舒适透气，健康护理',
    category: '服装',
    price: 198,
    originalPrice: 298,
    image: p5,
    rating: 4.6,
    reviewCount: 267,
    stock: 150,
    tags: ['舒适', '透气', '健康'],
  },
  {
    id: 'p7',
    name: '乳腺健康体检套餐',
    description: '专业医疗机构提供的乳腺健康检查服务',
    category: '服务',
    price: 499,
    image: p7,
    rating: 4.8,
    reviewCount: 324,
    stock: 100,
    badge: '推荐',
    tags: ['专业', '全面', '放心'],
  },
  {
    id: 'p8',
    name: '乳腺健康监测手环',
    description: '实时监测乳腺健康指标，数据同步手机',
    category: '医疗器械',
    price: 799,
    originalPrice: 999,
    image: p6,
    rating: 4.7,
    reviewCount: 189,
    stock: 45,
    badge: '新品',
    tags: ['智能', '便携', '准确'],
  },
];

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    priceRange: [0, 1000],
    rating: 0,
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', '检测工具', '保健品', '护理产品', '医疗器械', '书籍', '服装', '服务'];

  // 筛选和排序产品
  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filters.category === 'all' || p.category === filters.category;

      const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];

      const matchesRating = p.rating >= filters.rating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    // 排序
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'sales':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, filters]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          product,
          quantity,
          addedAt: Date.now(),
        },
      ];
    });
    setIsModalOpen(false);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  // 计算购物车总价
  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  // 处理结算 - 跳转到支付页面
  // 处理结算 - 跳转到支付页面
const handleCheckout = () => {
  navigate('/payment', {
    state: {
      cartItems: cartItems,  
      totalPrice: totalPrice,
    },
  });
  setIsCartOpen(false);
};

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Header onSearch={() => {}} />
      <AIAssistant />
      <div className="w-full p-4 md:p-6 flex-1">
        <div className="shop-page">
          {/* 直接显示工具栏（已移除 .shop-header 区块） */}
          <div className="shop-toolbar">
            <div className="search-container">
              <Search size={20} />
              <input
                type="text"
                placeholder="搜索产品..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
  
            <div className="toolbar-actions">
              <button
                className="filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                筛选
              </button>
              <button
                className="cart-btn"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </div>
          </div>
  
          <div className="shop-container">
            {/* 左侧筛选栏 */}
            <aside className={`shop-sidebar ${showFilters ? 'open' : ''}`}>
              <div className="filter-section">
                <h3>分类</h3>
                <div className="filter-options">
                  {categories.map(cat => (
                    <label key={cat} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={filters.category === cat}
                        onChange={() => setFilters({ ...filters, category: cat })}
                      />
                      <span>{cat === 'all' ? '全部分类' : cat}</span>
                    </label>
                  ))}
                </div>
              </div>
  
              <div className="filter-section">
                <h3>价格范围</h3>
                <div className="price-range">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={filters.priceRange[0]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        priceRange: [Number(e.target.value), filters.priceRange[1]],
                      })
                    }
                    placeholder="最低价"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        priceRange: [filters.priceRange[0], Number(e.target.value)],
                      })
                    }
                    placeholder="最高价"
                  />
                </div>
              </div>
  
              <div className="filter-section">
                <h3>评分</h3>
                <div className="rating-filter">
                  {[0, 4, 4.5].map(rating => (
                    <label key={rating} className="rating-option">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={() => setFilters({ ...filters, rating })}
                      />
                      <span>{rating === 0 ? '全部' : `${rating}分及以上`}</span>
                    </label>
                  ))}
                </div>
              </div>
  
              <div className="filter-section">
                <h3>排序</h3>
                <select
                  value={filters.sortBy}
                  onChange={e =>
                    setFilters({
                      ...filters,
                      sortBy: e.target.value as FilterOptions['sortBy'],
                    })
                  }
                  className="sort-select"
                >
                  <option value="newest">最新上架</option>
                  <option value="price-low">价格低到高</option>
                  <option value="price-high">价格高到低</option>
                  <option value="rating">评分最高</option>
                  <option value="sales">销量最高</option>
                </select>
              </div>
            </aside>
  
            {/* 产品网格 */}
            <main className="shop-main">
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>未找到匹配的产品</p>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
  
          {/* 购物车侧边栏 */}
          <CartSidebar
            isOpen={isCartOpen}
            items={cartItems}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
  
          {/* 产品详情模态框 */}
          <ProductModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
