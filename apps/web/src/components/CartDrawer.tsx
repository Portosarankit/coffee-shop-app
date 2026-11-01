import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    discount, 
    deliveryFee, 
    finalTotal, 
    promoCode, 
    applyPromoCode, 
    removePromoCode 
  } = useCart();
  const { language } = useLanguage();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const success = applyPromoCode(inputCode);
    if (!success) {
      setPromoError('รหัสโปรโมชันไม่ถูกต้อง (ลองใช้ PORTO2026 หรือ WELCOME1)');
    } else {
      setInputCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-[#f3eee2] flex items-center justify-between bg-[#f7f2ea]/60">
            <h2 className="text-xl font-black text-[#3e2723] flex items-center gap-2">
              <span>🛒</span>
              <span>ตะกร้าสินค้า (Shopping Cart)</span>
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-[#e6dcce] flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold shadow-xs">
              ✕
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-3">☕</p>
                <p className="font-bold text-lg text-[#3e2723]">ตะกร้าของคุณยังว่างอยู่</p>
                <p className="text-xs text-gray-500 mt-1">เลือกเมนูเครื่องดื่มสุดโปรดของคุณได้เลย!</p>
              </div>
            ) : (
              cart.map((item) => {
                const optionsTotal = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
                const itemTotalPrice = (item.price + optionsTotal) * item.quantity;

                return (
                  <div key={item.id} className="flex gap-4 p-4 border border-[#f3eee2] rounded-2xl bg-[#f7f2ea]/30 shadow-xs">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-xs" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-[#3e2723] text-sm">{item.name}</h4>
                      
                      {item.selectedOptions.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                          {item.selectedOptions.map((opt, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>• {opt.choiceName}</span>
                              {opt.price > 0 && <span className="text-amber-800 font-semibold">+฿{opt.price}</span>}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.specialInstructions && (
                        <div className="text-xs text-amber-800 mt-1.5 italic bg-amber-50 p-1 rounded border border-amber-200">
                          หมายเหตุ: {item.specialInstructions}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#f3eee2]">
                        <span className="font-black text-amber-900 text-sm">฿{itemTotalPrice.toFixed(0)}</span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 bg-white flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 shadow-xs"
                          >
                            -
                          </button>
                          <span className="text-sm font-black text-[#3e2723] w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 bg-white flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 shadow-xs"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 ml-2 text-xs font-bold"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Summary & Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#f3eee2] bg-[#f7f2ea]/40 space-y-4">
              
              {/* Promo Code Input Section */}
              <div className="bg-white p-3 rounded-2xl border border-[#e6dcce]">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-[#3e2723]">รหัสส่วนลด (Promo Code)</span>
                  {promoCode && (
                    <button onClick={removePromoCode} className="text-xs text-red-600 font-bold hover:underline">
                      ยกเลิกโค้ด
                    </button>
                  )}
                </div>

                {promoCode ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-2 rounded-xl font-bold flex justify-between items-center">
                    <span>ใช้โค้ด {promoCode} ลด 10% สำเร็จ!</span>
                    <span>✓</span>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="ลองใส่ PORTO2026"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 uppercase text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#3e2723]"
                    />
                    <button
                      type="submit"
                      className="bg-[#3e2723] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#2c1810]"
                    >
                      ใช้
                    </button>
                  </form>
                )}
                {promoError && <p className="text-[11px] text-red-600 mt-1 font-semibold">{promoError}</p>}
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-1.5 text-xs font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>ยอดรวมสินค้า (Subtotal)</span>
                  <span>฿{subtotal.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>ส่วนลดโปรโมชัน (10%)</span>
                    <span>-฿{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง (Delivery Fee)</span>
                  <span>฿{deliveryFee.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#3e2723] pt-2 border-t border-[#e6dcce]">
                  <span>ยอดชำระสุทธิ (Total)</span>
                  <span className="text-amber-800 text-lg">฿{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full bg-[#3e2723] text-white py-3.5 rounded-2xl font-black text-sm hover:bg-[#2c1810] transition-all shadow-lg text-center block"
              >
                ดำเนินการชำระเงิน (Proceed to Checkout) • ฿{finalTotal.toFixed(0)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
