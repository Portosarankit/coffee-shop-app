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
