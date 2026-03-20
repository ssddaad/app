import { CreditCard, Check, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem } from './types';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import p from '@/components/ewm.jpg';

interface PaymentPageProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

type PaymentMethod = 'wechat' | 'alipay' | 'card';

// 微信支付弹窗组件
interface WechatPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
}

function WechatPayModal({ isOpen, onClose, totalPrice }: WechatPayModalProps) {
  const orderNumber = '377875028390868085';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
              </svg>
            </div>
            <span className="text-2xl font-medium text-gray-800">微信支付</span>
          </div>
          <div className="text-sm text-gray-500">
            <span className="mr-2">中文</span>
            <span className="text-gray-300">|</span>
            <span className="ml-2 text-green-600">EN</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">金额</span>
              <span className="text-xl font-semibold text-gray-800">{totalPrice.toFixed(2)} CNY</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">订单</span>
              <span className="text-gray-800 font-mono">{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">描述</span>
              <span className="text-gray-800">乳此安心商城购买</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white border-2 border-gray-100 rounded-xl">
            <img src={p} alt="微信支付二维码" className="w-64 h-64 object-contain" />
          </div>
        </div>

        <div className="text-center">
          <button className="text-gray-500 hover:text-pink-500 text-sm transition-colors">
            如何付款？
          </button>
        </div>
      </div>
    </div>
  );
}

// 支付宝弹窗组件
interface AlipayModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
}

function AlipayModal({ isOpen, onClose, totalPrice }: AlipayModalProps) {
  const orderNumber = '377875028390868086';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <span className="text-2xl font-medium text-gray-800">支付宝</span>
          </div>
          <div className="text-sm text-gray-500">
            <span className="mr-2">中文</span>
            <span className="text-gray-300">|</span>
            <span className="ml-2 text-blue-600">EN</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">金额</span>
              <span className="text-xl font-semibold text-gray-800">{totalPrice.toFixed(2)} CNY</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">订单</span>
              <span className="text-gray-800 font-mono">{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">描述</span>
              <span className="text-gray-800">乳此安心商城购买</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white border-2 border-gray-100 rounded-xl">
            <img src={p} alt="支付宝二维码" className="w-64 h-64 object-contain" />
          </div>
        </div>

        <div className="text-center">
          <button className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
            如何付款？
          </button>
        </div>
      </div>
    </div>
  );
}

// 银行卡支付弹窗组件
interface CardPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
}

function CardPayModal({ isOpen, onClose, totalPrice }: CardPayModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    // 模拟支付请求（实际项目中接入银行支付网关）
    await new Promise((r) => setTimeout(r, 1500));
    setPaying(false);
    setPaid(true);
    setTimeout(() => {
      onClose();
      setPaid(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-medium text-gray-800">银行卡支付</span>
          </div>
          <p className="text-gray-500">安全快捷的银行卡支付</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">支付金额</span>
            <span className="text-xl font-semibold text-gray-800">¥{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">持卡人姓名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入持卡人姓名"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">银行卡号</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="请输入银行卡号"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">有效期</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={paying || paid}
            className="w-full bg-pink-400 hover:bg-pink-500 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {paid ? (
              <><Check className="w-5 h-5" /> 支付成功</>
            ) : paying ? (
              '处理中...'
            ) : (
              `确认支付 ¥${totalPrice.toFixed(2)}`
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            您的支付信息将通过加密通道传输，保障资金安全
          </p>
        </div>
      </div>
    </div>
  );
}

export function PaymentPage({ cartItems, totalPrice, onBack }: PaymentPageProps) {
  const [agreed, setAgreed] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('wechat');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 处理支付按钮点击
  const handlePay = () => {
    if (agreed) {
      setIsModalOpen(true);
    }
  };

  // 获取按钮文字
  const getButtonText = () => {
    switch (selectedPayment) {
      case 'wechat':
        return '跳转至微信支付';
      case 'alipay':
        return '跳转至支付宝';
      case 'card':
        return '银行卡支付';
      default:
        return '确认支付';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="bg-gradient-to-r from-pink-400 to-pink-500 h-2" />
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">支付信息</h1>
          </div>
        </div>
      </div>

      {/* Payment Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">订单商品</h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-6 py-4 border-b border-gray-100 last:border-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-lg">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mt-2">数量: {item.quantity}</p>
                      <div className="flex gap-2 mt-2">
                        {item.product.tags?.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-pink-50 text-pink-400 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-pink-400 text-lg">
                        ¥{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        ¥{item.product.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>商品小计</span>
                  <span>¥{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>运费</span>
                  <span className="text-green-500">免运费</span>
                </div>
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>优惠</span>
                  <span className="text-gray-400">- ¥0.00</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-4 border-t border-gray-100">
                  <span>应付总额</span>
                  <span className="text-pink-400">¥{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method - 可选择的支付方式 */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">支付方式</h2>
              <div className="space-y-4">
                {/* 微信支付 */}
                <label
                  className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedPayment === 'wechat'
                      ? 'border-pink-400 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                  onClick={() => setSelectedPayment('wechat')}
                >
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-lg">微信支付</p>
                    <p className="text-sm text-gray-500">使用微信扫码支付，安全便捷</p>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      selectedPayment === 'wechat' ? 'bg-pink-400' : 'border-2 border-gray-300'
                    }`}
                  >
                    {selectedPayment === 'wechat' && <Check className="w-4 h-4 text-white" />}
                  </div>
                </label>

                {/* 支付宝 */}
                <label
                  className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedPayment === 'alipay'
                      ? 'border-pink-400 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                  onClick={() => setSelectedPayment('alipay')}
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-lg">支付宝</p>
                    <p className="text-sm text-gray-500">支付宝快捷支付</p>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      selectedPayment === 'alipay' ? 'bg-pink-400' : 'border-2 border-gray-300'
                    }`}
                  >
                    {selectedPayment === 'alipay' && <Check className="w-4 h-4 text-white" />}
                  </div>
                </label>

                {/* 银行卡支付 */}
                <label
                  className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedPayment === 'card'
                      ? 'border-pink-400 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                  onClick={() => setSelectedPayment('card')}
                >
                  <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-lg">银行卡支付</p>
                    <p className="text-sm text-gray-500">支持各大银行借记卡、信用卡</p>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      selectedPayment === 'card' ? 'bg-pink-400' : 'border-2 border-gray-300'
                    }`}
                  >
                    {selectedPayment === 'card' && <Check className="w-4 h-4 text-white" />}
                  </div>
                </label>
              </div>
            </div>

            {/* Agreement */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-pink-400"
                />
                <span className="text-gray-600">
                  我同意《乳此安心用户协议》中的条款，并确认以上订单信息无误。
                </span>
              </label>
            </div>

            {/* Checkout Button */}
            <div className="flex justify-center pb-8">
              <Button
                onClick={handlePay}
                disabled={!agreed}
                className="bg-pink-400 hover:bg-pink-500 disabled:bg-gray-300 text-white px-16 py-6 text-xl rounded-xl"
              >
                <CreditCard className="w-6 h-6 mr-3" />
                {getButtonText()}
              </Button>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="w-80 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">在乳此安心上购物</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                当您完成此笔交易后，款项会自动从您的支付方式中扣除，且您将收到一封电子邮件确认您的购买。
              </p>
              <h4 className="font-medium text-gray-800 mb-2">支付提示</h4>
              <p className="text-gray-600 leading-relaxed">
                请确保您的支付账户已绑定有效的银行卡，并保证账户余额充足。
              </p>
            </div>

            <div className="bg-pink-50 rounded-xl p-6">
              <h3 className="font-semibold text-pink-600 mb-3">安全提示</h3>
              <p className="text-sm text-pink-500 leading-relaxed">
                您的支付信息将通过加密通道传输，我们承诺保护您的隐私安全。如有任何问题，请联系客服。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 支付弹窗 */}
      <WechatPayModal
        isOpen={isModalOpen && selectedPayment === 'wechat'}
        onClose={() => setIsModalOpen(false)}
        totalPrice={totalPrice}
      />
      <AlipayModal
        isOpen={isModalOpen && selectedPayment === 'alipay'}
        onClose={() => setIsModalOpen(false)}
        totalPrice={totalPrice}
      />
      <CardPayModal
        isOpen={isModalOpen && selectedPayment === 'card'}
        onClose={() => setIsModalOpen(false)}
        totalPrice={totalPrice}
      />
    </div>
  );
}
