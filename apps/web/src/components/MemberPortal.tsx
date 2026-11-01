import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface MemberPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rewards' | 'history'>('dashboard');
  const [points, setPoints] = useState(240);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default mock logged in state
  const [authMessage, setAuthMessage] = useState('');

  if (!isOpen) return null;

  const handleRedeem = (rewardName: string, cost: number) => {
    if (points >= cost) {
      setPoints(points - cost);
      setRedeemedRewards((prev) => [rewardName, ...prev]);
      alert(`แลกรับสิทธิ์ "${rewardName}" สำเร็จ! กรุณาแสดงคูปองนี้กับพนักงานหน้าร้าน`);
    } else {
      alert('คะแนนสะสมของคุณไม่เพียงพอสำหรับการแลกรับสิทธิ์นี้');
    }
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail && authPassword) {
      setIsLoggedIn(true);
      setAuthMessage('เข้าสู่ระบบสำเร็จ!');
      setTimeout(() => setAuthMessage(''), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-[#f3eee2]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#f3eee2] flex justify-between items-center bg-[#f7f2ea]/60">
          <h3 className="text-xl font-black text-[#3e2723] flex items-center gap-2">
            <span>👑</span>
            <span>Porto Member Portal</span>
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-[#e6dcce] flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold shadow-xs">
            ✕
          </button>
        </div>

        {isLoggedIn ? (
          <>
            {/* Tabs */}
            <div className="grid grid-cols-3 border-b border-[#f3eee2] bg-[#f7f2ea]/30 text-xs font-bold text-[#5c3a31]">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-3 text-center border-b-2 transition-all ${activeTab === 'dashboard' ? 'border-[#3e2723] text-[#3e2723] bg-white' : 'border-transparent hover:bg-white/50'}`}
              >
                สมาชิก & คะแนน
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`py-3 text-center border-b-2 transition-all ${activeTab === 'rewards' ? 'border-[#3e2723] text-[#3e2723] bg-white' : 'border-transparent hover:bg-white/50'}`}
              >
                แลกสิทธิพิเศษ
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 text-center border-b-2 transition-all ${activeTab === 'history' ? 'border-[#3e2723] text-[#3e2723] bg-white' : 'border-transparent hover:bg-white/50'}`}
              >
                ประวัติออเดอร์
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Gold Member Card */}
                  <div className="bg-gradient-to-br from-[#3e2723] to-[#5c3a31] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-9xl">☕</div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-amber-300 font-black block">Porto Coffee Gold Card</span>
                        <h4 className="text-lg font-bold mt-0.5">คุณ สมชาย ใจดี</h4>
                      </div>
                      <span className="bg-amber-400 text-[#3e2723] font-black text-xs px-2.5 py-1 rounded-full">GOLD</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between items-end">
                      <div>
                        <span className="text-xs text-amber-100/80">คะแนนสะสมคงเหลือ (Points)</span>
                        <div className="text-3xl font-black text-amber-300">{points} <span className="text-sm font-normal text-white">แต้ม</span></div>
                      </div>
                      <span className="text-xs text-amber-100/70">ทุก 25 บาท = 1 แต้ม</span>
                    </div>
                  </div>

                  {/* Redeemed coupons list if any */}
                  {redeemedRewards.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#3e2723] text-sm">คูปองที่แลกแล้วของคุณ</h4>
                      <div className="space-y-2">
                        {redeemedRewards.map((rew, idx) => (
                          <div key={idx} className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex justify-between items-center text-xs">
                            <div>
                              <span className="font-black text-amber-900 block">{rew}</span>
                              <span className="text-gray-500 text-[10px]">ใช้แสดงกับพนักงานเพื่อรับสิทธิ์</span>
                            </div>
                            <span className="bg-amber-600 text-white font-bold px-2.5 py-1 rounded-xl">พร้อมใช้งาน</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#f7f2ea] p-4 rounded-2xl border border-[#e6dcce]">
                    <h5 className="font-bold text-[#3e2723] text-xs mb-1">สิทธิประโยชน์สมาชิก Gold</h5>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                      <li>รับเครื่องดื่มฟรี 1 แก้วในเดือนเกิด</li>
                      <li>อัปเกรดนมโอ๊ต/นมถั่วเหลืองฟรีทุกออเดอร์</li>
                      <li>สะสมแต้มไม่มีวันหมดอายุ</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'rewards' && (
                <div className="space-y-4">
                  <h4 className="font-black text-[#3e2723] text-sm">แคตตาล็อกของรางวัล (Rewards Catalog)</h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-[#f7f2ea]/60 border border-[#e6dcce] p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md">100 แต้ม</span>
                        <h5 className="font-bold text-[#3e2723] text-sm mt-1">คูปองเครื่องดื่มฟรี 1 แก้ว (มูลค่าสูงสุด 100฿)</h5>
                        <p className="text-xs text-gray-500 mt-0.5">เลือกเมนูโปรดของคุณได้ทุกรายการ</p>
                      </div>
                      <button
                        onClick={() => handleRedeem('คูปองเครื่องดื่มฟรี 1 แก้ว', 100)}
                        className="bg-[#3e2723] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#2c1810] shadow-xs"
                      >
                        แลกรับสิทธิ์
                      </button>
                    </div>

                    <div className="bg-[#f7f2ea]/60 border border-[#e6dcce] p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md">150 แต้ม</span>
                        <h5 className="font-bold text-[#3e2723] text-sm mt-1">ส่วนลด 50 บาท สำหรับทุกออเดอร์</h5>
                        <p className="text-xs text-gray-500 mt-0.5">ใช้เป็นส่วนลดทันทีในตะกร้าสินค้า</p>
                      </div>
                      <button
                        onClick={() => handleRedeem('ส่วนลด 50 บาท', 150)}
                        className="bg-[#3e2723] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#2c1810] shadow-xs"
                      >
                        แลกรับสิทธิ์
                      </button>
                    </div>

                    <div className="bg-[#f7f2ea]/60 border border-[#e6dcce] p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md">200 แต้ม</span>
                        <h5 className="font-bold text-[#3e2723] text-sm mt-1">ครัวหนุดเพียวรี่ หรือ ครัวซองต์เนยสดฟรี 1 ชิ้น</h5>
                        <p className="text-xs text-gray-500 mt-0.5">เบเกอรี่อบสดใหม่หอมกรุ่น</p>
                      </div>
                      <button
                        onClick={() => handleRedeem('ครัวซองต์เนยสดฟรี 1 ชิ้น', 200)}
                        className="bg-[#3e2723] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#2c1810] shadow-xs"
                      >
                        แลกรับสิทธิ์
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h4 className="font-black text-[#3e2723] text-sm">ประวัติการสั่งซื้อ (Order History)</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-[#f7f2ea]/40 border border-[#e6dcce] p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-[#3e2723] text-xs">#PORTO-8842</span>
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-md">สำเร็จแล้ว</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>• Iced Americano (หวานปกติ, นมสดปกติ)</p>
                        <p>• Croissant Butter (อุ่นร้อน)</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-[#f3eee2] text-xs font-bold">
                        <span className="text-gray-500">24 ต.ค. 2026 | 14:15 น.</span>
                        <span className="text-amber-900">฿145</span>
                      </div>
                    </div>

                    <div className="bg-[#f7f2ea]/40 border border-[#e6dcce] p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-[#3e2723] text-xs">#PORTO-8819</span>
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-md">สำเร็จแล้ว</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>• Hot Caffe Latte (หวาน 50%, นมโอ๊ต)</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-[#f3eee2] text-xs font-bold">
                        <span className="text-gray-500">22 ต.ค. 2026 | 09:30 น.</span>
                        <span className="text-amber-900">฿95</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#f3eee2] bg-[#f7f2ea]/40 flex justify-between items-center">
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                ออกจากระบบ (Sign Out)
              </button>
              <button
                onClick={onClose}
                className="bg-[#3e2723] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#2c1810]"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 space-y-4">
            <div className="text-center mb-2">
              <h4 className="font-black text-lg text-[#3e2723]">เข้าสู่ระบบสมาชิก Porto Coffee</h4>
              <p className="text-xs text-gray-500 mt-1">กรอกอีเมลเพื่อเข้าสู่ระบบหรือสมัครสมาชิกใหม่</p>
            </div>

            {authMessage && (
              <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3 rounded-xl font-bold text-center">
                {authMessage}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">อีเมล (Email)</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#3e2723]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">รหัสผ่าน (Password)</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#3e2723]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#3e2723] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2c1810] shadow-md transition"
              >
                เข้าสู่ระบบ / สมัครสมาชิก
              </button>
            </form>

            <div className="text-center pt-2">
              <Link
                to="/admin/login"
                onClick={onClose}
                className="text-xs font-bold text-amber-800 hover:underline"
              >
                เข้าสู่ระบบผู้ดูแลระบบ (Admin Portal)
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
