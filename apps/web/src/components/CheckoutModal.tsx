import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ApiClient } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const CheckoutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { cart, finalTotal, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Fulfillment Type: Delivery vs Pickup vs Dine In
  const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP' | 'DINE_IN'>('DELIVERY');
  
  // Delivery address / Branch selector
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('สาขาหลัก สุขุมวิท 24');
  const [tableNumber, setTableNumber] = useState('');

  // Payment method options
  const [paymentMethod, setPaymentMethod] = useState<'QR_PROMPTPAY' | 'CREDIT_CARD' | 'CASH'>('QR_PROMPTPAY');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPromptPayQR, setShowPromptPayQR] = useState(false);
  const [createdOrderResult, setCreatedOrderResult] = useState<any>(null);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      setError('กรุณากรอกชื่อและเบอร์โทรศัพท์ผู้รับ');
      return;
    }
    if (orderType === 'DELIVERY' && !deliveryAddress) {
      setError('กรุณากรอกที่อยู่จัดส่งสำหรับบริการเดลิเวอรี');
      return;
    }
    if (orderType === 'DINE_IN' && !tableNumber) {
      setError('กรุณาระบุเลขโต๊ะสำหรับการทานที่ร้าน');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        customerName,
        customerPhone,
        orderType: orderType === 'DELIVERY' ? 'TAKEAWAY' : orderType, // mapped to backend schema enum
        tableNumber: orderType === 'DINE_IN' ? parseInt(tableNumber) : undefined,
        paymentMethod,
        items: cart.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || undefined,
          selectedOptions: item.selectedOptions.map((opt) => ({
            choiceId: opt.choiceId,
          })),
        })),
      };

      const order = await ApiClient.createOrder(payload);

      if (paymentMethod === 'QR_PROMPTPAY' && !showPromptPayQR) {
        setCreatedOrderResult(order);
        setShowPromptPayQR(true);
        setLoading(false);
        return;
      }

      clearCart();
      onClose();
      navigate(`/order/${order.id}`);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const confirmQRPayment = () => {
    if (createdOrderResult) {
      clearCart();
      onClose();
      navigate(`/order/${createdOrderResult.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-[#f3eee2]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#f3eee2] flex justify-between items-center bg-[#f7f2ea]/60">
          <h3 className="text-xl font-black text-[#3e2723] flex items-center gap-2">
            <span>💳</span>
            <span>ยืนยันคำสั่งซื้อ (Checkout)</span>
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-[#e6dcce] flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold shadow-xs">
            ✕
          </button>
        </div>

        {showPromptPayQR ? (
          <div className="p-6 text-center space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <h4 className="font-bold text-[#3e2723] text-base mb-1">สแกนคิวอาร์โค้ด PromptPay เพื่อชำระเงิน</h4>
              <p className="text-xs text-amber-800">ยอดชำระสุทธิ: ฿{finalTotal.toFixed(0)}</p>
            </div>

            <div className="bg-white p-4 border-2 border-dashed border-[#e6dcce] rounded-3xl inline-block shadow-inner">
              <div className="w-48 h-48 bg-[#f7f2ea] flex flex-col items-center justify-center rounded-2xl text-center p-4">
                <span className="text-4xl mb-2">📷</span>
                <span className="text-xs font-bold text-[#3e2723]">PromptPay QR Code</span>
                <span className="text-[10px] text-gray-500 mt-1">Porto Coffee Co., Ltd.</span>
                <span className="text-xs font-black text-amber-800 mt-2">฿{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmQRPayment}
                className="w-full bg-[#3e2723] text-white py-3.5 rounded-2xl font-black text-sm hover:bg-[#2c1810] shadow-lg transition-all"
              >
                ยืนยันการชำระเงินเรียบร้อยแล้ว
              </button>
              <button
                onClick={() => setShowPromptPayQR(false)}
                className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-200"
              >
                กลับไปแก้ไขข้อมูล
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">{error}</div>}

            {/* Customer Contact Info */}
            <div className="space-y-3">
              <h4 className="font-black text-[#3e2723] text-sm">1. ข้อมูลผู้ติดต่อ (Contact Information)</h4>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3e2723]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">เบอร์โทรศัพท์ *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0812345678"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3e2723]"
                />
              </div>
            </div>

            {/* Fulfillment Selector */}
            <div className="space-y-3 pt-2 border-t border-[#f3eee2]">
              <h4 className="font-black text-[#3e2723] text-sm">2. วิธีการรับสินค้า (Fulfillment Type)</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-xs text-center transition-all ${
                    orderType === 'DELIVERY' ? 'border-[#3e2723] bg-[#3e2723] text-white shadow-md' : 'border-[#e6dcce] bg-[#f7f2ea]/50 text-[#5c3a31]'
                  }`}
                >
                  เดลิเวอรี (Delivery)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-xs text-center transition-all ${
                    orderType === 'PICKUP' ? 'border-[#3e2723] bg-[#3e2723] text-white shadow-md' : 'border-[#e6dcce] bg-[#f7f2ea]/50 text-[#5c3a31]'
                  }`}
                >
                  รับหน้าร้าน (Pickup)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('DINE_IN')}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-xs text-center transition-all ${
                    orderType === 'DINE_IN' ? 'border-[#3e2723] bg-[#3e2723] text-white shadow-md' : 'border-[#e6dcce] bg-[#f7f2ea]/50 text-[#5c3a31]'
                  }`}
                >
                  ทานที่ร้าน (Dine In)
                </button>
              </div>

              {orderType === 'DELIVERY' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ที่อยู่จัดส่ง (Delivery Address) *</label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="บ้านเลขที่, ถนน, แขวง/เขต, จังหวัด"
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3e2723]"
                  />
                </div>
              )}

              {orderType === 'PICKUP' && (
                <div className="bg-[#f7f2ea] p-4 rounded-2xl border border-[#e6dcce] text-center space-y-1">
                  <h4 className="font-black text-[#3e2723] text-sm">รับที่หน้าร้าน (Store Pickup)</h4>
                  <p className="text-xs text-gray-600">รับสินค้าได้ทันทีที่เคาน์เตอร์บาร์ Porto Coffee</p>
                </div>
              )}

              {orderType === 'DINE_IN' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">เลขโต๊ะ (Table Number) *</label>
                  <input
                    type="number"
                    required
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="เช่น 5"
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3e2723]"
                  />
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2 border-t border-[#f3eee2]">
              <h4 className="font-black text-[#3e2723] text-sm">3. วิธีการชำระเงิน (Payment Method)</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QR_PROMPTPAY')}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-xs text-center transition-all ${
                    paymentMethod === 'QR_PROMPTPAY' ? 'border-[#3e2723] bg-[#3e2723] text-white shadow-md' : 'border-[#e6dcce] bg-[#f7f2ea]/50 text-[#5c3a31]'
                  }`}
                >
                  PromptPay QR
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-xs text-center transition-all ${
                    paymentMethod === 'CREDIT_CARD' ? 'border-[#3e2723] bg-[#3e2723] text-white shadow-md' : 'border-[#e6dcce] bg-[#f7f2ea]/50 text-[#5c3a31]'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-xs text-center transition-all ${
                    paymentMethod === 'CASH' ? 'border-[#3e2723] bg-[#3e2723] text-white shadow-md' : 'border-[#e6dcce] bg-[#f7f2ea]/50 text-[#5c3a31]'
                  }`}
                >
                  เงินสด (Cash)
                </button>
              </div>
            </div>

            {/* Footer Submit */}
            <div className="border-t border-[#f3eee2] pt-4 mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-sm text-gray-700">ยอดชำระสุทธิ (Total)</span>
                <span className="text-amber-900 text-xl font-black">฿{finalTotal.toFixed(0)}</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3e2723] text-white py-3.5 rounded-2xl font-black text-sm hover:bg-[#2c1810] transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'กำลังสร้างคำสั่งซื้อ...' : 'ยืนยันสั่งซื้อสินค้า (Place Order)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
