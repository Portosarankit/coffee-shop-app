import React, { useState, useEffect } from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenMember?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenMember }) => {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  // Modal states
  const [activeModal, setActiveModal] = useState<'promo' | 'business' | 'about' | 'location' | 'search' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQueryInput, setSearchQueryInput] = useState('');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    const handleTriggerModal = (e: any) => {
      setActiveModal(e.detail);
    };
    window.addEventListener('trigger-navbar-modal' as any, handleTriggerModal);
    return () => {
      window.removeEventListener('trigger-navbar-modal' as any, handleTriggerModal);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQueryInput.trim()) {
      setActiveModal(null);
      navigate(`/?search=${encodeURIComponent(searchQueryInput.trim())}`);
    }
  };

  const applyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInput.toUpperCase() === 'WELCOME1' || couponCodeInput.toUpperCase() === 'PORTO2026') {
      setCouponApplied(true);
    } else {
      alert(t.cart.promoInvalid);
    }
  };

  const cycleLanguage = () => {
    if (language === 'th') setLanguage('en');
    else if (language === 'en') setLanguage('zh');
    else setLanguage('th');
  };

  return (
    <>
      {/* 🟢 Liquid Glass Capsule Container */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl liquid-glass rounded-full px-6 py-3 flex items-center justify-between">
        {/* Left Side: Character Logo + Brand Name */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <img 
              src="/logo.svg" 
              alt="Porto Coffee" 
              className="h-12 w-auto object-contain drop-shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
                const nextEl = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                if (nextEl) nextEl.style.display = 'block';
              }}
            />
            <span className="text-lg sm:text-xl font-black text-[#3e2723] tracking-tight hover:opacity-95 transition-opacity" style={{ display: 'none' }}>
              Porto Coffee
            </span>
            <span className="text-lg sm:text-xl font-black text-[#3e2723] tracking-tight hover:opacity-95 transition-opacity">
              Porto Coffee
            </span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 font-semibold text-sm text-[#5c3a31]">
            <Link to="/" className="hover:text-[#2c1810] transition-colors">
              {t.navbar.menu}
            </Link>
            <Link to="/order/history" className="hover:text-[#2c1810] transition-colors">
              {t.navbar.orders}
            </Link>
            <button onClick={() => setActiveModal('promo')} className="hover:text-[#2c1810] transition-colors">
              {t.navbar.member}
            </button>
            <button onClick={() => setActiveModal('business')} className="hover:text-[#2c1810] transition-colors flex items-center gap-1">
              <span>{t.navbar.admin}</span>
            </button>
          </nav>
        </div>

        {/* Right Side Utility Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Switcher UI: clearly shows TH, EN, ZH */}
          <div className="flex items-center bg-white/60 border border-white/40 rounded-full p-0.5 shadow-sm">
            <button
              onClick={() => setLanguage('th')}
              className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${language === 'th' ? 'bg-[#3e2723] text-white shadow-sm' : 'text-[#5c3a31] hover:text-[#3e2723]'}`}
              title="ภาษาไทย"
            >
              TH
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${language === 'en' ? 'bg-[#3e2723] text-white shadow-sm' : 'text-[#5c3a31] hover:text-[#3e2723]'}`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${language === 'zh' ? 'bg-[#3e2723] text-white shadow-sm' : 'text-[#5c3a31] hover:text-[#3e2723]'}`}
              title="中文"
            >
              ZH
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-1 text-[#5c3a31]">
            {/* Search SVG */}
            <button
              onClick={() => setActiveModal('search')}
              className="p-2 hover:bg-white/60 rounded-full transition-colors flex items-center justify-center text-[#3e2723]"
              title={t.common.search}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User SVG */}
            <button
              onClick={() => {
                if (onOpenMember) onOpenMember();
              }}
              className="p-2 hover:bg-white/60 rounded-full transition-colors flex items-center justify-center text-[#3e2723]"
              title={t.navbar.profile}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          {/* Hamburger Menu Toggles Mobile Drawer Navigation */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-[#3e2723] hover:bg-white/60 rounded-full transition-colors text-lg font-bold"
            title="Menu"
          >
            ☰
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative bg-[#3e2723] text-white p-2 sm:px-4 sm:py-2 rounded-full font-semibold hover:bg-[#2c1810] transition-all duration-300 shadow-md flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="hidden sm:inline text-xs font-bold">{t.navbar.cart}</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d97706] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- MODALS OVERLAYS --- */}

      {/* 1. Promotion Modal */}
      {activeModal === 'promo' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#f3eee2] relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-[#3e2723]">{t.navbar.member}</h3>
              <p className="text-sm text-gray-600 mt-1">{t.cart.promoCodePlaceholder}</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-amber-900 text-sm">PORTO2026</span>
                <span className="bg-amber-600 text-white text-xs font-black px-2 py-0.5 rounded-md">-10%</span>
              </div>
              <p className="text-xs text-amber-800">{t.cart.promoSuccess}</p>
            </div>

            <form onSubmit={applyPromoCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="PORTO2026"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 uppercase text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3e2723]"
                  />
                  <button
                    type="submit"
                    className="bg-[#3e2723] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#2c1810]"
                  >
                    {t.cart.applyPromo}
                  </button>
                </div>
              </div>
              {couponApplied && (
                <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3 rounded-xl font-bold text-center">
                  {t.cart.promoSuccess}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* 2. Franchise / Business Modal */}
      {activeModal === 'business' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#f3eee2] relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-[#3e2723]">{t.admin.dashboard}</h3>
              <p className="text-sm text-gray-600 mt-1">Admin Access</p>
            </div>
            <div className="space-y-3 mb-6">
              <Link
                to="/admin/login"
                onClick={() => setActiveModal(null)}
                className="block w-full text-center bg-[#3e2723] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2c1810]"
              >
                {t.navbar.login} (Admin Login)
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Quick Search Overlay */}
      {activeModal === 'search' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#f3eee2] relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-[#3e2723]">{t.common.search}</h3>
              <p className="text-sm text-gray-600 mt-1">{t.menu.searchPlaceholder}</p>
            </div>
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <input
                type="text"
                value={searchQueryInput}
                onChange={(e) => setSearchQueryInput(e.target.value)}
                placeholder={t.menu.searchPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3e2723]"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-[#3e2723] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2c1810]"
              >
                {t.common.search}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-80 h-full p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-black text-[#3e2723]">Porto Coffee</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="mb-6 bg-gray-50 p-3 rounded-2xl flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Language</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setLanguage('th')} className={`px-2.5 py-1 text-xs font-bold rounded-lg ${language === 'th' ? 'bg-[#3e2723] text-white' : 'bg-white text-[#3e2723]'}`}>TH</button>
                  <button onClick={() => setLanguage('en')} className={`px-2.5 py-1 text-xs font-bold rounded-lg ${language === 'en' ? 'bg-[#3e2723] text-white' : 'bg-white text-[#3e2723]'}`}>EN</button>
                  <button onClick={() => setLanguage('zh')} className={`px-2.5 py-1 text-xs font-bold rounded-lg ${language === 'zh' ? 'bg-[#3e2723] text-white' : 'bg-white text-[#3e2723]'}`}>ZH</button>
                </div>
              </div>

              <div className="space-y-4 font-bold text-sm text-[#5c3a31]">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl hover:bg-[#f7f2ea] transition-colors"
                >
                  {t.navbar.menu}
                </Link>
                <Link
                  to="/order/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl hover:bg-[#f7f2ea] transition-colors"
                >
                  {t.navbar.orders}
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-xl hover:bg-[#f7f2ea] transition-colors"
                >
                  {t.navbar.admin}
                </Link>
              </div>
            </div>
            <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
              {t.footer.rights}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
