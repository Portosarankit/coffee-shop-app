import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MemberPortal } from './components/MemberPortal';
import { MenuPage } from './pages/MenuPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600 text-sm mb-6">
              {this.state.error?.message || 'An unexpected error occurred while rendering the application.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-900 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'cookies' | null>(null);
  const { addToCart } = useCart();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleAddToCartEvent = (e: any) => {
      addToCart(e.detail);
      setIsCartOpen(true);
    };
    const handleOpenMemberEvent = () => {
      setIsMemberOpen(true);
    };
    const handleOpenAboutEvent = () => {
      // open navbar about modal or dispatch event
    };

    window.addEventListener('add-to-cart' as any, handleAddToCartEvent);
    window.addEventListener('open-member' as any, handleOpenMemberEvent);
    window.addEventListener('open-about-modal' as any, () => {
      window.dispatchEvent(new CustomEvent('trigger-navbar-modal', { detail: 'about' }));
    });
    window.addEventListener('open-location-modal' as any, () => {
      window.dispatchEvent(new CustomEvent('trigger-navbar-modal', { detail: 'location' }));
    });
    window.addEventListener('open-member-modal' as any, () => {
      setIsMemberOpen(true);
    });
    window.addEventListener('open-policy' as any, (e: any) => {
      setActivePolicy(e.detail);
    });
    
    return () => {
      window.removeEventListener('add-to-cart' as any, handleAddToCartEvent);
      window.removeEventListener('open-member' as any, handleOpenMemberEvent);
    };
  }, [addToCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {!isAdminRoute && (
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenMember={() => setIsMemberOpen(true)} 
        />
      )}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/order/:orderId" element={<OrderStatusPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={() => setIsCheckoutOpen(true)}
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />

          <MemberPortal
            isOpen={isMemberOpen}
            onClose={() => setIsMemberOpen(false)}
          />

          {activePolicy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
              <div className="bg-[#1e120b] border border-amber-900/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-stone-200 shadow-2xl relative max-h-[85vh] overflow-y-auto">
                <button
                  onClick={() => setActivePolicy(null)}
                  className="absolute top-4 right-4 text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  ✕
                </button>

                {activePolicy === 'privacy' && (
                  <div>
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">นโยบายความเป็นส่วนตัว (Privacy Policy)</h2>
                    <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
                      <p>บริษัท ปอร์โต คอฟฟี่ จำกัด (&quot;เรา&quot;) ให้ความสำคัญอย่างยิ่งกับการคุ้มครองข้อมูลส่วนบุคคลของคุณ นโยบายความเป็นส่วนตัวฉบับนี้อธิบายถึงวิธีที่เราเก็บรวบรวม ใช้ เปิดเผย และปกป้องข้อมูลส่วนบุคคลของคุณเมื่อคุณใช้บริการเว็บไซต์และบริการของเรา</p>
                      <h3 className="font-semibold text-white mt-4">1. ข้อมูลที่เราเก็บรวบรวม</h3>
                      <p>เราอาจเก็บรวบรวมข้อมูลส่วนบุคคล เช่น ชื่อ นามสกุล ที่อยู่อีเมล หมายเลขโทรศัพท์ ที่อยู่จัดส่ง และข้อมูลการสั่งซื้อสินค้า เมื่อคุณลงทะเบียน สมัครสมาชิก หรือทำรายการซื้อสินค้า</p>
                      <h3 className="font-semibold text-white mt-4">2. วัตถุประสงค์ในการใช้ข้อมูล</h3>
                      <p>เราใช้ข้อมูลของคุณเพื่อการประมวลผลคำสั่งซื้อ การจัดส่งสินค้า การให้บริการลูกค้าสัมพันธ์ การปรับปรุงประสบการณ์การใช้งาน และการแจ้งเตือนสิทธิประโยชน์โปรโมชั่นต่างๆ</p>
                      <h3 className="font-semibold text-white mt-4">3. ความปลอดภัยของข้อมูล</h3>
                      <p>เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมทั้งในเชิงเทคนิคและองค์กรเพื่อป้องกันการเข้าถึง การสูญหาย หรือการเปิดเผยข้อมูลส่วนบุคคลของคุณโดยไม่ได้รับอนุญาต</p>
                    </div>
                  </div>
                )}

                {activePolicy === 'terms' && (
                  <div>
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">ข้อกำหนดการใช้งาน (Terms of Service)</h2>
                    <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
                      <p>ยินดีต้อนรับสู่บริการของ ปอร์โต คอฟฟี่ การเข้าใช้งานเว็บไซต์และบริการของเราถือว่าท่านยอมรับและตกลงที่จะผูกพันตามข้อกำหนดการใช้งานฉบับนี้</p>
                      <h3 className="font-semibold text-white mt-4">1. การบัญชีและความปลอดภัย</h3>
                      <p>ท่านมีหน้าที่รักษาความลับของบัญชีผู้ใช้งานและรหัสผ่านของท่าน และรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของท่าน</p>
                      <h3 className="font-semibold text-white mt-4">2. การสั่งซื้อและชำระเงิน</h3>
                      <p>ราคาสินค้าทั้งหมดรวมภาษีมูลค่าเพิ่มแล้ว (ถ้ามี) การสั่งซื้อสินค้าจะสมบูรณ์เมื่อท่านได้ชำระเงินเรียบร้อยและได้รับคำยืนยันคำสั่งซื้อจากระบบของเรา</p>
                      <h3 className="font-semibold text-white mt-4">3. ทรัพย์สินทางปัญญา</h3>
                      <p>เนื้อหา รูปภาพ โลโก้ และกราฟิกทั้งหมดบนเว็บไซต์นี้เป็นทรัพย์สินของ ปอร์โต คอฟฟี่ ห้ามมิให้ทำซ้ำ ดัดแปลง หรือเผยแพร่โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร</p>
                    </div>
                  </div>
                )}

                {activePolicy === 'cookies' && (
                  <div>
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">นโยบายคุกกี้ (Cookie Policy)</h2>
                    <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
                      <p>เว็บไซต์ของเราใช้คุกกี้และเทคโนโลยีที่คล้ายคลึงกันเพื่อแยกแยะท่านจากผู้ใช้งานรายอื่นๆ ซึ่งจะช่วยให้เราสามารถมอบประสบการณ์การใช้งานที่ดีและพัฒนาเว็บไซต์ของเราให้ดียิ่งขึ้น</p>
                      <h3 className="font-semibold text-white mt-4">1. คุกกี้คืออะไร</h3>
                      <p>คุกกี้คือไฟล์ข้อความขนาดเล็กที่ถูกดาวน์โหลดไปยังอุปกรณ์ของคุณเมื่อคุณเข้าชมเว็บไซต์ เพื่อจัดเก็บข้อมูลเกี่ยวกับการตั้งค่าและการใช้งานของคุณ</p>
                      <h3 className="font-semibold text-white mt-4">2. ประเภทของคุกกี้ที่เราใช้</h3>
                      <p>เราใช้คุกกี้ที่มีความจำเป็น (Strictly Necessary Cookies) เพื่อให้เว็บไซต์ทำงานได้อย่างถูกต้อง และคุกกี้เพื่อการวิเคราะห์ (Analytics Cookies) เพื่อช่วยให้เราเข้าใจพฤติกรรมการใช้งานของผู้เข้าชม</p>
                      <h3 className="font-semibold text-white mt-4">3. การจัดการคุกกี้</h3>
                      <p>คุณสามารถตั้งค่าเบราว์เซอร์ของคุณให้ปฏิเสธคุกกี้ทั้งหมดหรือแจ้งเตือนเมื่อมีการส่งคุกกี้ได้ แต่อาจส่งผลให้บางฟังก์ชันการทำงานของเว็บไซต์ไม่สามารถใช้งานได้อย่างเต็มประสิทธิภาพ</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-4 border-t border-amber-900/30 flex justify-end">
                  <button
                    onClick={() => setActivePolicy(null)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-md"
                  >
                    เข้าใจแล้ว
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
