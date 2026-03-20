import { useLocation, useNavigate } from 'react-router-dom';
import { PaymentPage } from './PaymentPage';
import type { CartItem } from './types';

interface LocationState {
  cartItems: CartItem[];
  totalPrice: number;
}

export function PaymentPageWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  // 如果没有数据（直接访问 /payment），返回商城或显示空状态
  if (!state || !state.cartItems || state.cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">购物车是空的</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500"
          >
            去购物
          </button>
        </div>
      </div>
    );
  }

  return (
    <PaymentPage
      cartItems={state.cartItems}
      totalPrice={state.totalPrice}
      onBack={() => navigate('/shop')}
    />
  );
}
