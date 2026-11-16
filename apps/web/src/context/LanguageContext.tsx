import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'th';

export const th = {
  common: {
    back: 'กลับ',
    confirm: 'ยืนยัน',
    cancel: 'ยกเลิก',
    save: 'บันทึก',
    delete: 'ลบ',
  },
  menu: {
    title: 'เมนู',
    addToCart: 'เพิ่มลงตะกร้า',
    outOfStock: 'สินค้าหมด',
  },
  order: {
    status: 'สถานะออเดอร์',
    received: 'ได้รับออเดอร์แล้ว',
    preparing: 'กำลังเตรียมอาหาร',
    served: 'เสิร์ฟแล้ว',
    canceled: 'ยกเลิกแล้ว',
  }
};

export type TranslationDictionary = typeof th;

export const en: TranslationDictionary = {
  common: {
    back: 'Back',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
  },
  menu: {
    title: 'Menu',
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
  },
  order: {
    status: 'Order Status',
    received: 'Received',
    preparing: 'Preparing',
    served: 'Served',
    canceled: 'Canceled',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = language === 'th' ? th : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
