import { io, Socket } from 'socket.io-client';

const API_BASE = '/api';

// Robust Mock Data matching Prisma Seed
const MOCK_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Popular Signature (เมนูยอดนิยม)',
    sortOrder: 1,
    items: [
      {
        id: 'item-1',
        name: 'Porto Signature (พอร์โต ซิกเนเจอร์)',
        description: 'Special blended coffee with secret caramel touch',
        basePrice: 8500,
        imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        optionGroups: [
          {
            id: 'og-1',
            name: 'Temp (อุณหภูมิ)',
            type: 'SINGLE',
            required: true,
            choices: [
              { id: 'c-1', name: 'Iced (เย็น)', priceDelta: 0, isDefault: true },
              { id: 'c-2', name: 'Hot (ร้อน)', priceDelta: 0, isDefault: false },
              { id: 'c-3', name: 'Frappe (ปั่น)', priceDelta: 1500, isDefault: false }
            ]
          },
          {
            id: 'og-2',
            name: 'Sweetness (ระดับความหวาน)',
            type: 'SINGLE',
            required: true,
            choices: [
              { id: 'c-4', name: '100% (ปกติ)', priceDelta: 0, isDefault: true },
              { id: 'c-5', name: '50% (หวานน้อย)', priceDelta: 0, isDefault: false },
              { id: 'c-6', name: '0% (ไม่หวานเลย)', priceDelta: 0, isDefault: false }
            ]
          },
          {
            id: 'og-3',
            name: 'Milk Choice (ประเภทนม)',
            type: 'SINGLE',
            required: true,
            choices: [
              { id: 'c-7', name: 'Whole Milk (นมสด)', priceDelta: 0, isDefault: true },
              { id: 'c-8', name: 'Oat Milk (นมโอ๊ต)', priceDelta: 2000, isDefault: false }
            ]
          }
        ]
      },
      {
        id: 'item-2',
        name: 'Young Coconut Coffee (กาแฟมะพร้าวอ่อน)',
        description: 'Fresh coconut water topped with rich espresso shot',
        basePrice: 8500,
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 2,
        optionGroups: []
      },
      {
        id: 'item-3',
        name: 'Iced Thai Tea (ชาไทยเย็น)',
        description: 'Traditional Thai milk tea with rich aroma',
        basePrice: 7000,
        imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 3,
        optionGroups: []
      },
      {
        id: 'item-4',
        name: 'Matcha Latte (มัทฉะลาเต้)',
        description: 'Premium Japanese green tea with fresh milk',
        basePrice: 8000,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 4,
        optionGroups: []
      },
      {
        id: 'item-5',
        name: 'Butter Croissant (ครัวซองต์เนยสด)',
        description: 'Flaky and buttery fresh croissant',
        basePrice: 6500,
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 5,
        optionGroups: []
      },
      {
        id: 'item-6',
        name: 'Basque Burnt Cheesecake (ชีสเค้กหน้าไหม้)',
        description: 'Rich and creamy burnt Basque cheesecake',
        basePrice: 11000,
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 6,
        optionGroups: []
      }
    ]
  },
  {
    id: 'cat-2',
    name: 'Coffee (เมนูกาแฟ)',
    sortOrder: 2,
    items: [
      {
        id: 'item-7',
        name: 'Espresso (เอสเพรสโซ่)',
        description: 'Rich and bold single origin shot',
        basePrice: 6000,
        imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        optionGroups: []
      },
      {
        id: 'item-8',
        name: 'Americano (อเมริกาโน่)',
        description: 'Espresso with filtered water',
        basePrice: 6500,
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 2,
        optionGroups: []
      },
      {
        id: 'item-9',
        name: 'Cafe Latte (คาเฟ่ ลาเต้)',
        description: 'Smooth espresso with steamed milk',
        basePrice: 7500,
        imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 3,
        optionGroups: []
      }
    ]
  },
  {
    id: 'cat-3',
    name: 'Tea (เมนูชา)',
    sortOrder: 3,
    items: [
      {
        id: 'item-10',
        name: 'Thai Milk Tea (ชาไทยนมสด)',
        description: 'Traditional rich Thai tea with sweetened milk',
        basePrice: 7000,
        imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        optionGroups: []
      },
      {
        id: 'item-11',
        name: 'Lemon Tea (ชามะนาว)',
        description: 'Refreshing black tea with fresh squeezed lemon',
        basePrice: 6500,
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 2,
        optionGroups: []
      }
    ]
  },
  {
    id: 'cat-4',
    name: 'Chocolate & Milk (เมนูช็อกโกแลตและนม)',
    sortOrder: 4,
    items: [
      {
        id: 'item-12',
        name: 'Rich Cocoa (โกโก้เข้มข้น)',
        description: 'Rich and creamy dark cocoa with fresh milk',
        basePrice: 7500,
        imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        optionGroups: []
      },
      {
        id: 'item-13',
        name: 'Hokkaido Fresh Milk (นมสดฮอกไกโด)',
        description: 'Pure Hokkaido fresh milk',
        basePrice: 6000,
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 2,
        optionGroups: []
      }
    ]
  },
  {
    id: 'cat-5',
    name: 'Smoothie & Bakery (เมนูปั่นและเบเกอรี)',
    sortOrder: 5,
    items: [
      {
        id: 'item-14',
        name: 'New York Cheesecake (นิวยอร์กชีสเค้ก)',
        description: 'Rich and creamy classic baked cheesecake',
        basePrice: 11000,
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 1,
        optionGroups: []
      },
      {
        id: 'item-15',
        name: 'Chocolate Lava Cake (ช็อกโกแลตลาวาเค้ก)',
        description: 'Warm cake with gooey molten chocolate center',
        basePrice: 9500,
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        isSoldOut: false,
        sortOrder: 2,
        optionGroups: []
      }
    ]
  }
];

export class ApiClient {
  private static socket: Socket | null = null;

  static async getMenu() {
    try {
      const res = await fetch(`${API_BASE}/menu`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) {
        throw new Error('Failed to fetch menu');
      }
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('Backend API unreachable or Vercel production mode. Falling back to built-in mock menu.');
      return MOCK_CATEGORIES;
    }
  }

  static async createOrder(payload: any) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to create order');
      }
      return json.data;
    } catch (err) {
      console.warn('Backend API unreachable. Creating mock order stored in localStorage.');
      const mockOrderId = 'ord-' + Math.random().toString(36).substr(2, 9);
      const mockOrder = {
        id: mockOrderId,
        orderNo: 'P-' + Math.floor(1000 + Math.random() * 9000),
        status: 'PENDING',
        queueNo: Math.floor(1 + Math.random() * 50),
        tableNo: payload.tableNo || '01',
        customerName: payload.customerName || 'Guest',
        items: payload.items || [],
        totalAmount: payload.items?.reduce((sum: number, i: any) => sum + (i.unitPrice || 100) * (i.quantity || 1), 0) || 15000,
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage for OrderStatusPage fallback
      const existingOrders = JSON.parse(localStorage.getItem('porto_mock_orders') || '{}');
      existingOrders[mockOrderId] = mockOrder;
      localStorage.setItem('porto_mock_orders', JSON.stringify(existingOrders));

      return mockOrder;
    }
  }

  static getSocket(): Socket {
    if (!this.socket) {
      // If backend socket is unreachable, create a dummy mock socket emitter
      try {
        this.socket = io({ timeout: 2000 });
      } catch (e) {
        // Fallback mock socket
        this.socket = {
          emit: () => {},
          on: () => {},
          off: () => {},
          disconnect: () => {},
        } as unknown as Socket;
      }
    }
    return this.socket;
  }
}
