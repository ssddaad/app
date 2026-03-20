import React from 'react';
import type { CartItem } from './types';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import './shop.css';

interface Props {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<Props> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* 背景遮罩 */}
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

      {/* 购物车侧边栏 */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={24} />
            <h2>购物车</h2>
            {itemCount > 0 && <span className="item-count">{itemCount}</span>}
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} />
              <p>购物车为空</p>
              <button onClick={onClose} className="continue-shopping">
                继续购物
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {items.map(item => (
                <div key={item.productId} className="cart-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="item-details">
                    <h4>{item.product.name}</h4>
                    <p className="item-price">¥{item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))
                      }
                      className="qty-btn"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      className="qty-btn"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="remove-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>小计</span>
                <span>¥{total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>运费</span>
                <span className="free">免费</span>
              </div>
              <div className="summary-row total">
                <span>合计</span>
                <span>¥{total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={onCheckout} className="checkout-btn">
              去结算
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
