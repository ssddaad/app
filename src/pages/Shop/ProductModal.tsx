import React, { useState } from 'react';
import type { Product } from './types';
import { X, Heart, ShoppingCart, Star, Minus, Plus } from 'lucide-react';
import './shop.css';

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductModal: React.FC<Props> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !product) return null;

  const images = product.images || [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-content">
          {/* 左侧图片 */}
          <div className="modal-images">
            <div className="main-image">
              <img src={images[selectedImage]} alt={product.name} />
              {discount > 0 && <div className="discount-badge">-{discount}%</div>}
            </div>
            <div className="thumbnail-images">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name}-${i}`}
                  className={`thumbnail ${i === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                />
              ))}
            </div>
          </div>

          {/* 右侧信息 */}
          <div className="modal-info">
            <h2 className="modal-title">{product.name}</h2>

            {/* 评分 */}
            <div className="modal-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'filled' : ''}
                  />
                ))}
              </div>
              <span>{product.rating}</span>
              <span className="review-count">({product.reviewCount} 条评价)</span>
            </div>

            {/* 价格 */}
            <div className="modal-price">
              <span className="current-price">¥{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original-price">¥{product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {/* 描述 */}
            <p className="modal-description">{product.description}</p>

            {/* 产品特性 */}
            <div className="product-features">
              <div className="feature">
                <span className="label">库存</span>
                <span className="value">
                  {product.stock > 0 ? `${product.stock} 件` : '已售罄'}
                </span>
              </div>
              <div className="feature">
                <span className="label">分类</span>
                <span className="value">{product.category}</span>
              </div>
            </div>

            {/* 数量选择 */}
            <div className="quantity-selector">
              <span className="label">数量</span>
              <div className="quantity-control">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="modal-actions">
              <button
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? '已收藏' : '收藏'}
              </button>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart size={20} />
                {product.stock > 0 ? '加入购物车' : '已售罄'}
              </button>
            </div>

            {/* 配送信息 */}
            <div className="shipping-info">
              <div className="info-item">
                <span className="icon">🚚</span>
                <span>免运费 全国包邮</span>
              </div>
              <div className="info-item">
                <span className="icon">✓</span>
                <span>正品保证 假一赔十</span>
              </div>
              <div className="info-item">
                <span className="icon">↩</span>
                <span>7天无理由退货</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
