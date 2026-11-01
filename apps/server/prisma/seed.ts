import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.choiceRecipeDelta.deleteMany();
  await prisma.optionChoice.deleteMany();
  await prisma.optionGroup.deleteMany();
  await prisma.recipeLine.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.staffUser.deleteMany();
  await prisma.tableToken.deleteMany();
  await prisma.storeConfig.deleteMany();
  await prisma.promotion.deleteMany();

  // 1. Store Config (Always OPEN)
  await prisma.storeConfig.upsert({
    where: { id: 1 },
    update: {
      name: 'Porto Coffee',
      status: 'OPEN',
      acceptOrders: true,
      announcement: '',
      scheduleText: 'เปิดบริการทุกวัน 08:00 - 17:00',
    },
    create: {
      id: 1,
      name: 'Porto Coffee',
      status: 'OPEN',
      announcement: '',
      scheduleText: 'เปิดบริการทุกวัน 08:00 - 17:00',
      acceptOrders: true,
    },
  });

  // 2. Promotions (Only WELCOME1)
  await prisma.promotion.create({
    data: {
      title: 'WELCOME1',
      description: 'Welcome Discount: Get special discount on your first order with WELCOME1!',
      discountType: 'PERCENT',
      discountValue: 10,
      isActive: true,
    },
  });

  // 3. Ingredients
  const beans = await prisma.ingredient.create({
    data: { name: 'Espresso Beans', unit: 'g', stockQty: 10000, minLevel: 1000, costPerUnit: 120 },
  });
  const milk = await prisma.ingredient.create({
    data: { name: 'Fresh Milk', unit: 'ml', stockQty: 20000, minLevel: 2000, costPerUnit: 5 },
  });
  const oatMilk = await prisma.ingredient.create({
    data: { name: 'Oat Milk', unit: 'ml', stockQty: 5000, minLevel: 500, costPerUnit: 15 },
  });
  const soyMilk = await prisma.ingredient.create({
    data: { name: 'Soy Milk', unit: 'ml', stockQty: 5000, minLevel: 500, costPerUnit: 12 },
  });
  const almondMilk = await prisma.ingredient.create({
    data: { name: 'Almond Milk', unit: 'ml', stockQty: 5000, minLevel: 500, costPerUnit: 25 },
  });
  const water = await prisma.ingredient.create({
    data: { name: 'Filtered Water', unit: 'ml', stockQty: 50000, minLevel: 5000, costPerUnit: 0 },
  });
  const chocolate = await prisma.ingredient.create({
    data: { name: 'Chocolate Sauce', unit: 'ml', stockQty: 5000, minLevel: 500, costPerUnit: 20 },
  });
  const matcha = await prisma.ingredient.create({
    data: { name: 'Matcha Powder', unit: 'g', stockQty: 2000, minLevel: 200, costPerUnit: 450 },
  });
  const teaLeaves = await prisma.ingredient.create({
    data: { name: 'Thai Tea Leaves', unit: 'g', stockQty: 2000, minLevel: 200, costPerUnit: 100 },
  });
  const lemon = await prisma.ingredient.create({
    data: { name: 'Fresh Lemon', unit: 'pcs', stockQty: 200, minLevel: 20, costPerUnit: 8 },
  });
  const flour = await prisma.ingredient.create({
    data: { name: 'Bread Flour', unit: 'g', stockQty: 10000, minLevel: 2000, costPerUnit: 4 },
  });
  const butter = await prisma.ingredient.create({
    data: { name: 'Unsalted Butter', unit: 'g', stockQty: 5000, minLevel: 1000, costPerUnit: 35 },
  });
  const cheese = await prisma.ingredient.create({
    data: { name: 'Cream Cheese', unit: 'g', stockQty: 5000, minLevel: 1000, costPerUnit: 40 },
  });

  // 4. Categories
  const catCoffee = await prisma.category.create({ 
    data: { 
      name: 'Coffee (กาแฟสด)', 
      sortOrder: 1
    } 
  });
  const catNonCoffee = await prisma.category.create({ 
    data: { 
      name: 'Non-Coffee & Tea (ชาและเครื่องดื่ม)', 
      sortOrder: 2
    } 
  });
  const catBakery = await prisma.category.create({ 
    data: { 
      name: 'Bakery & Desserts (เบเกอรีและของหวาน)', 
      sortOrder: 3
    } 
  });

  // Option Groups template for Drinks (Matching Prompt exact requirements: Sweetness 0%, 25%, 50%, 100%, 125%; Shots +15฿; Milk choices Whole, Oat, Soy, Almond; Temp Hot/Iced/Frappe)
  const drinkOptionGroups = {
    create: [
      {
        name: 'Temp (อุณหภูมิ)',
        type: 'SINGLE',
        required: true,
        choices: {
          create: [
            { name: 'Iced (เย็น)', priceDelta: 0, isDefault: true },
            { name: 'Hot (ร้อน)', priceDelta: 0 },
            { name: 'Frappe (ปั่น)', priceDelta: 1500 },
          ]
        }
      },
      {
        name: 'Sweetness (ระดับความหวาน)',
        type: 'SINGLE',
        required: true,
        choices: {
          create: [
            { name: '100% (ปกติ)', priceDelta: 0, isDefault: true },
            { name: '125% (หวานมาก)', priceDelta: 0 },
            { name: '50% (หวานน้อย)', priceDelta: 0 },
            { name: '25% (หวานน้อยมาก)', priceDelta: 0 },
            { name: '0% (ไม่หวานเลย)', priceDelta: 0 },
          ]
        }
      },
      {
        name: 'Milk Choice (ประเภทนม)',
        type: 'SINGLE',
        required: true,
        choices: {
          create: [
            { name: 'Whole Milk (นมสด)', priceDelta: 0, isDefault: true },
            { name: 'Oat Milk (นมโอ๊ต)', priceDelta: 2000 },
            { name: 'Soy Milk (นมถั่วเหลือง)', priceDelta: 1500 },
            { name: 'Almond Milk (นมอัลมอนด์)', priceDelta: 2500 },
          ]
        }
      },
      {
        name: 'Extra Shots (เพิ่มช็อตกาแฟ)',
        type: 'SINGLE',
        required: false,
        choices: {
          create: [
            { name: 'Standard (ปกติ)', priceDelta: 0, isDefault: true },
            { name: 'Extra Shot (+15฿)', priceDelta: 1500 },
          ]
        }
      }
    ]
  };

  // 5. Complete Menu Items Seeding (Exact pricing and high-res Unsplash images)
  const coffeeItems = [
    { name: 'Espresso (เอสเพรสโซ่)', desc: 'Rich and bold single origin shot', price: 6000, beanQty: 18, waterQty: 30, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80' },
    { name: 'Americano (อเมริกาโน่)', desc: 'Espresso with filtered water', price: 6500, beanQty: 18, waterQty: 120, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cafe Latte (คาเฟ่ ลาเต้)', desc: 'Smooth espresso with steamed milk', price: 7500, beanQty: 18, milkQty: 150, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cappuccino (คาปูชิโน่)', desc: 'Espresso with thick airy milk foam', price: 7500, beanQty: 18, milkQty: 120, imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Caramel Macchiato (คาราเมล มัคคิอาโต)', desc: 'Layered espresso with vanilla and caramel drizzle', price: 8500, beanQty: 18, milkQty: 150, imageUrl: 'https://images.unsplash.com/photo-1485808194679-6246e7b232ad?auto=format&fit=crop&w=800&q=80' },
    { name: 'Mocha (มอคค่า)', desc: 'Espresso blended with rich chocolate and milk', price: 8500, beanQty: 18, milkQty: 130, chocoQty: 30, imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6919f80753b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cold Brew (โคลด์ บรูว์)', desc: 'Slow-steeped smooth cold coffee', price: 8000, beanQty: 25, waterQty: 150, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80' },
  ];

  for (let i = 0; i < coffeeItems.length; i++) {
    const item = coffeeItems[i];
    await prisma.menuItem.create({
      data: {
        categoryId: catCoffee.id,
        name: item.name,
        description: item.desc,
        basePrice: item.price,
        imageUrl: item.imageUrl,
        sortOrder: i + 1,
        recipes: {
          create: [
            { ingredientId: beans.id, quantity: item.beanQty || 18 },
            ...(item.waterQty ? [{ ingredientId: water.id, quantity: item.waterQty }] : []),
            ...(item.milkQty ? [{ ingredientId: milk.id, quantity: item.milkQty }] : []),
            ...(item.chocoQty ? [{ ingredientId: chocolate.id, quantity: item.chocoQty }] : []),
          ]
        },
        optionGroups: drinkOptionGroups,
      }
    });
  }

  // --- NON-COFFEE & TEA ---
  const nonCoffeeItems = [
    { name: 'Matcha Latte (มัทฉะ ลาเต้)', desc: 'Premium Japanese green tea with milk', price: 8000, matchaQty: 6, milkQty: 150, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
    { name: 'Thai Milk Tea (ชาไทยนมสด)', desc: 'Traditional rich Thai tea with sweetened milk', price: 7000, teaQty: 15, milkQty: 150, imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cocoa / Chocolate (โกโก้ / ช็อกโกแลต)', desc: 'Rich velvety Dutch cocoa', price: 7000, chocoQty: 50, milkQty: 150, imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80' },
    { name: 'Fresh Milk (นมสด)', desc: 'Warm or iced fresh milk', price: 6000, milkQty: 200, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80' },
    { name: 'Lemon Tea (ชามะนาว)', desc: 'Refreshing black tea with fresh squeezed lemon', price: 6500, teaQty: 10, lemonQty: 1, waterQty: 150, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80' },
  ];

  for (let i = 0; i < nonCoffeeItems.length; i++) {
    const item = nonCoffeeItems[i];
    await prisma.menuItem.create({
      data: {
        categoryId: catNonCoffee.id,
        name: item.name,
        description: item.desc,
        basePrice: item.price,
        imageUrl: item.imageUrl,
        sortOrder: i + 1,
        recipes: {
          create: [
            ...(item.matchaQty ? [{ ingredientId: matcha.id, quantity: item.matchaQty }] : []),
            ...(item.teaQty ? [{ ingredientId: teaLeaves.id, quantity: item.teaQty }] : []),
            ...(item.chocoQty ? [{ ingredientId: chocolate.id, quantity: item.chocoQty }] : []),
            ...(item.milkQty ? [{ ingredientId: milk.id, quantity: item.milkQty }] : []),
            ...(item.lemonQty ? [{ ingredientId: lemon.id, quantity: item.lemonQty }] : []),
            ...(item.waterQty ? [{ ingredientId: water.id, quantity: item.waterQty }] : []),
          ]
        },
        optionGroups: drinkOptionGroups,
      }
    });
  }

  // --- BAKERY & DESSERTS ---
  const bakeryItems = [
    { name: 'Butter Croissant (ครัวซองต์เนยสด)', desc: 'Flaky, buttery French pastry', price: 6500, flourQty: 100, butterQty: 50, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80' },
    { name: 'Almond Croissant (ครัวซองต์อัลมอนด์)', desc: 'Croissant filled with sweet almond cream', price: 8000, flourQty: 100, butterQty: 50, imageUrl: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?auto=format&fit=crop&w=800&q=80' },
    { name: 'Chocolate Lava Cake (ช็อกโกแลตลาวาเค้ก)', desc: 'Warm cake with gooey molten chocolate center', price: 9500, flourQty: 60, butterQty: 40, chocoQty: 40, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
    { name: 'New York Cheesecake (นิวยอร์กชีสเค้ก)', desc: 'Rich and creamy classic baked cheesecake', price: 11000, cheeseQty: 100, flourQty: 30, butterQty: 20, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tiramisu (ทีรามิสุ)', desc: 'Italian coffee-flavored mascarpone dessert', price: 12000, cheeseQty: 80, flourQty: 40, imageUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Fudgy Brownie (ฟัดจ์บราวนี่)', desc: 'Dense, rich chocolate fudge brownie', price: 7000, flourQty: 50, butterQty: 40, chocoQty: 50, imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=800&q=80' },
  ];

  for (let i = 0; i < bakeryItems.length; i++) {
    const item = bakeryItems[i];
    await prisma.menuItem.create({
      data: {
        categoryId: catBakery.id,
        name: item.name,
        description: item.desc,
        basePrice: item.price,
        imageUrl: item.imageUrl,
        sortOrder: i + 1,
        recipes: {
          create: [
            { ingredientId: flour.id, quantity: item.flourQty || 80 },
            ...(item.butterQty ? [{ ingredientId: butter.id, quantity: item.butterQty }] : []),
            ...(item.chocoQty ? [{ ingredientId: chocolate.id, quantity: item.chocoQty }] : []),
            ...(item.cheeseQty ? [{ ingredientId: cheese.id, quantity: item.cheeseQty }] : []),
          ]
        },
      }
    });
  }

  // 6. Admin User
  const hashedPassword = await bcrypt.hash('admin1234', 10);
  await prisma.staffUser.create({
    data: {
      name: 'admin',
      role: 'ADMIN',
      passwordHash: hashedPassword,
    },
  });

  // 7. Table Tokens
  const tables = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
  for (const tableNo of tables) {
    await prisma.tableToken.create({
      data: { tableNo, token: `token-${tableNo}-${Math.random().toString(36).substr(2, 9)}` },
    });
  }

  console.log('Seed completed successfully with full menu and single WELCOME1 promotion!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
