import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string; // unique cart item id
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  selectedOptions: {
    groupId: number;
    groupName: string;
    choiceId: number;
    choiceName: string;
    price: number;
  }[];
  specialInstructions?: string;
  imageUrl?: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  finalTotal: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('coffee_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [promoCode, setPromoCode] = useState<string>(() => {
    return localStorage.getItem('coffee_promo') || '';
  });

  useEffect(() => {
    localStorage.setItem('coffee_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('coffee_promo', promoCode);
  }, [promoCode]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.itemId}-${Date.now()}-${Math.random()}`;
    setCart((prev) => [...prev, { ...item, id }]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = cart.reduce((sum, item) => {
    const optionsTotal = item.selectedOptions.reduce((optSum, opt) => optSum + opt.price, 0);
    return sum + (item.price + optionsTotal) * item.quantity;
  }, 0);

  // Promo code PORTO2026 or WELCOME1 gives 10% discount
  const discount = (promoCode.toUpperCase() === 'PORTO2026' || promoCode.toUpperCase() === 'WELCOME1') ? subtotal * 0.10 : 0;
  
  // Delivery fee (e.g. 35 THB or 0 if free)
  const deliveryFee = subtotal > 0 ? 35 : 0;

  const finalTotal = Math.max(0, subtotal - discount + (deliveryFee));

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'PORTO2026' || clean === 'WELCOME1') {
      setPromoCode(clean);
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setPromoCode('');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        deliveryFee,
        finalTotal,
        promoCode,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
