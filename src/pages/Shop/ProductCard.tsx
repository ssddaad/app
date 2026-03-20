import React, { useState } from 'react';
import type { Product } from './types';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import './shop.css';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onAddToCart, onViewDetails }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 产品图片 */}
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />

        {/* 徽章 */}
        {product.badge && <div className="product-badge">{product.badge}</div>}
        {discount > 0 && <div className="discount-badge">-{discount}%</div>}

        {/* 悬停覆盖层 */}
        {isHovered && (
          <div className="product-overlay">
            <button
              className="overlay-btn quick-view"
              onClick={() => onViewDetails(product)}
            >
              快速查看
            </button>
            <button
              className="overlay-btn add-to-cart"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart size={16} />
              加入购物车
            </button>
          </div>
        )}

        {/* 收藏按钮 */}
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label="收藏"
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* 产品信息 */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        {/* 评分 */}
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating) ? 'filled' : ''}
              />
            ))}
          </div>
          <span className="rating-value">{product.rating}</span>
          <span className="review-count">({product.reviewCount})</span>
        </div>

        {/* 价格 */}
        <div className="product-price">
          <span className="current-price">¥{product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">¥{product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* 标签 */}
        {product.tags && product.tags.length > 0 && (
          <div className="product-tags">
            {product.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 库存状态 */}
        <div className="stock-status">
          {product.stock > 10 ? (
            <span className="in-stock">库存充足</span>
          ) : product.stock > 0 ? (
            <span className="low-stock">仅剩 {product.stock} 件</span>
          ) : (
            <span className="out-of-stock">已售罄</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
