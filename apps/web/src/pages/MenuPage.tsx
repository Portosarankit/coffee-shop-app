  import React, { useEffect, useState } from 'react';
import { ApiClient } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { ItemModal } from '../components/ItemModal';

export const MenuPage: React.FC = () => {
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | string>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    const fallbackMenu = {
      categories: [
        {
          id: 1,
          name: 'Popular Signature',
          nameEn: 'Popular Signature',
          nameTh: 'เมนูยอดนิยม',
          items: [
            { id: 201, nameEn: 'Porto Signature', nameTh: 'พอร์โต ซิกเนเจอร์', descriptionEn: 'Special blended coffee with secret caramel touch', descriptionTh: 'พอร์โต ซิกเนเจอร์ กาแฟสูตรพิเศษหอมกลมกล่อม', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 202, nameEn: 'Young Coconut Coffee', nameTh: 'กาแฟมะพร้าวอ่อน', descriptionEn: 'Fresh coconut water topped with rich espresso shot', descriptionTh: 'กาแฟมะพร้าวอ่อน น้ำมะพร้าวสดหอมหวานราดช็อตกาแฟ', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 203, nameEn: 'Iced Thai Tea', nameTh: 'ชาไทยเย็น', descriptionEn: 'Traditional Thai milk tea with rich aroma', descriptionTh: 'ชาไทยเย็น หอมเข้มข้นสูตรดั้งเดิม', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 204, nameEn: 'Matcha Latte', nameTh: 'มัทฉะลาเต้', descriptionEn: 'Premium Japanese green tea with fresh milk', descriptionTh: 'มัทฉะลาเต้ ชาเขียวญี่ปุ่นแท้พรีเมียม', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 205, nameEn: 'Premium Cocoa', nameTh: 'โกโก้พรีเมียม', descriptionEn: 'Rich and creamy dark cocoa', descriptionTh: 'โกโก้พรีเมียม เข้มข้นละมุนลิ้น', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 206, nameEn: 'Taiwan Milk Tea', nameTh: 'ชานมไต้หวัน', descriptionEn: 'Authentic Taiwan milk tea', descriptionTh: 'ชานมไต้หวัน หอมกลิ่นชาไต้หวันแท้', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 207, nameEn: 'Butter Croissant', nameTh: 'ครัวซองต์เนยสด', descriptionEn: 'Flaky and buttery fresh croissant', descriptionTh: 'ครัวซองต์เนยสด หอมกรุ่น กรอบนอกนุ่มใน', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 208, nameEn: 'Basque Burnt Cheesecake', nameTh: 'ชีสเค้กหน้าไหม้', descriptionEn: 'Rich and creamy burnt Basque cheesecake', descriptionTh: 'ชีสเค้กหน้าไหม้ เนื้อเนียนนุ่มละลายในปาก', basePrice: 110, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 209, nameEn: 'Traditional Brownie', nameTh: 'บราวนี่ฉ่ำโบราณ', descriptionEn: 'Fudgy and rich traditional chocolate brownie', descriptionTh: 'บราวนี่ฉ่ำโบราณ ช็อกโกแลตเข้มข้นหนึบหนับ', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 210, nameEn: 'Lemon Soda', nameTh: 'มะนาวโซดา', descriptionEn: 'Refreshing sparkling lemon soda', descriptionTh: 'มะนาวโซดา ซ่าสดชื่นคลายร้อน', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop', isAvailable: true }
          ]
        },
        {
          id: 2,
          name: 'Coffee',
          nameEn: 'Coffee',
          nameTh: 'เมนูกาแฟ',
          items: [
            { id: 101, nameEn: 'Espresso', nameTh: 'เอสเพรสโซ่', descriptionEn: 'Rich and bold single shot of espresso', descriptionTh: 'เอสเพรสโซ่เข้มข้น หอมกรุ่นกลิ่นกาแฟคั่วบด', basePrice: 60, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 102, nameEn: 'Americano', nameTh: 'อเมริกาโน่', descriptionEn: 'Smooth espresso with hot or iced water', descriptionTh: 'กาแฟดำอเมริกาโน่ หอมกลิ่นเมล็ดกาแฟแท้', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 103, nameEn: 'Latte', nameTh: 'ลาเต้', descriptionEn: 'Espresso with steamed milk and a light layer of foam', descriptionTh: 'ลาเต้นุ่มละมุน ผสมนมสดแท้กลมกล่อม', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 104, nameEn: 'Cappuccino', nameTh: 'คาปูชิโน่', descriptionEn: 'Espresso with equal parts steamed milk and milk foam', descriptionTh: 'คาปูชิโน่ฟองนมนุ่ม โรยผงโกโก้บางๆ', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80', isAvailable: true },
            { id: 105, nameEn: 'Mocha', nameTh: 'มอคค่า', descriptionEn: 'Espresso with chocolate and steamed milk', descriptionTh: 'มอคค่าเข้มข้นผสมช็อกโกแลตแท้พรีเมียม', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 106, nameEn: 'Caramel Macchiato', nameTh: 'คาราเมล มักคิอาโต้', descriptionEn: 'Espresso with vanilla and caramel drizzle', descriptionTh: 'คาราเมล มักคิอาโต้ หอมหวานคาราเมล', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 107, nameEn: 'Dirty Coffee', nameTh: 'เดอร์ตี้ คอฟฟี่', descriptionEn: 'Chilled rich milk layered with hot espresso shot', descriptionTh: 'เดอร์ตี้ คอฟฟี่ นมเย็นจัดราดด้วยช็อตเอสเพรสโซ่ร้อน', basePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 108, nameEn: 'Cold Brew', nameTh: 'โคลด์บรูว์', descriptionEn: 'Slow steeped smooth cold brew coffee', descriptionTh: 'โคลด์บรูว์ กาแฟสกัดเย็นนุ่มละมุน', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 109, nameEn: 'Orange Espresso', nameTh: 'เอสเพรสโซ่ส้ม', descriptionEn: 'Espresso shot over refreshing sweet orange juice', descriptionTh: 'เอสเพรสโซ่ส้ม ผสานน้ำส้มคั้นสดชื่น', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 110, nameEn: 'Affogato', nameTh: 'อัฟโฟกาโต', descriptionEn: 'Vanilla ice cream topped with a hot espresso shot', descriptionTh: 'อัฟโฟกาโต ไอศกรีมวนิลาลาดด้วยเอสเพรสโซ่ร้อน', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop', isAvailable: true }
          ]
        },
        {
          id: 3,
          name: 'Tea',
          nameEn: 'Tea',
          nameTh: 'เมนูชา',
          items: [
            { id: 301, nameEn: 'Thai Tea', nameTh: 'ชาไทย', descriptionEn: 'Traditional Thai milk tea with rich aroma', descriptionTh: 'ชาไทยสูตรดั้งเดิม หอมหวานมันกลมกล่อม', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 302, nameEn: 'Matcha Latte', nameTh: 'มัทฉะลาเต้', descriptionEn: 'Premium Japanese green tea with fresh milk', descriptionTh: 'ชาเขียวมัทฉะพรีเมียมนำเข้าจากญี่ปุ่น หอมเข้มข้น', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 303, nameEn: 'Lemon Tea', nameTh: 'ชามะนาว', descriptionEn: 'Refreshing black tea infused with fresh lemon juice', descriptionTh: 'ชามะนาวรสเปรี้ยวหวานสดชื่น ดับกระหาย', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 304, nameEn: 'Iced Black Tea', nameTh: 'ชาดำเย็น', descriptionEn: 'Refreshing chilled black tea', descriptionTh: 'ชาดำเย็น หอมหวานชื่นใจ', basePrice: 60, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 305, nameEn: 'Peach Jasmine Tea', nameTh: 'ชามะลิพีช', descriptionEn: 'Fragrant jasmine tea infused with sweet peach', descriptionTh: 'ชามะลิพีช หอมกลิ่นมะลิและพีชหวานฉ่ำ', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 306, nameEn: 'Earl Grey Latte', nameTh: 'ชาเอิร์ลเกรย์ลาเต้', descriptionEn: 'Earl Grey tea with steamed milk', descriptionTh: 'ชาเอิร์ลเกรย์ลาเต้ หอมกลิ่นเบอร์กามอตละมุน', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 307, nameEn: 'Hojicha Tea', nameTh: 'ชาโฮจิฉะ', descriptionEn: 'Roasted Japanese green tea', descriptionTh: 'ชาโฮจิฉะ ชาเขียวคั่วหอมกลิ่นคั่วเอกลักษณ์', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 308, nameEn: 'Jasmine Green Tea', nameTh: 'ชาเขียวมะลิ', descriptionEn: 'Light and fragrant jasmine green tea', descriptionTh: 'ชาเขียวมะลิ หอมสดชื่นเบาสบาย', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 309, nameEn: 'Yuzu Orange Tea', nameTh: 'ชาส้มยูสุ', descriptionEn: 'Refreshing tea with Japanese yuzu orange', descriptionTh: 'ชาส้มยูสุ หอมกลิ่นยูสุเปรี้ยวหวานสดชื่น', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 310, nameEn: 'Apple Tea', nameTh: 'ชาแอปเปิ้ล', descriptionEn: 'Refreshing apple flavored tea', descriptionTh: 'ชาแอปเปิ้ล หอมกลิ่นแอปเปิ้ลหวานละมุน', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop', isAvailable: true }
          ]
        },
        {
          id: 4,
          name: 'Chocolate & Milk',
          nameEn: 'Chocolate & Milk',
          nameTh: 'เมนูช็อกโกแลตและนม',
          items: [
            { id: 401, nameEn: 'Rich Cocoa', nameTh: 'โกโก้เข้มข้น', descriptionEn: 'Rich and creamy dark cocoa with fresh milk', descriptionTh: 'โกโก้เข้มข้น หวานน้อย ละมุนลิ้น', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 402, nameEn: 'Hokkaido Fresh Milk', nameTh: 'นมสดฮอกไกโด', descriptionEn: 'Pure Hokkaido fresh milk', descriptionTh: 'นมสดฮอกไกโด หอมมันเข้มข้นพิเศษ', basePrice: 60, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 403, nameEn: 'Pink Milk', nameTh: 'นมชมพู', descriptionEn: 'Sweet Salas syrup with fresh milk', descriptionTh: 'นมชมพู หอมหวานกลมกล่อมชื่นใจ', basePrice: 60, imageUrl: 'https://images.unsplash.com/photo-1579888944782-cb5f1db26005?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 404, nameEn: 'Caramel Fresh Milk', nameTh: 'นมสดคาราเมล', descriptionEn: 'Fresh milk with sweet caramel drizzle', descriptionTh: 'นมสดคาราเมล หอมหวานคาราเมลละมุน', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 405, nameEn: 'White Chocolate Milk', nameTh: 'นมสดไวท์ช็อกโกแลต', descriptionEn: 'Fresh milk with rich white chocolate', descriptionTh: 'นมสดไวท์ช็อกโกแลต หอมหวานนุ่มนวล', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 406, nameEn: 'Mint Chocolate', nameTh: 'ช็อกโกแลตมิ้นท์', descriptionEn: 'Rich chocolate with refreshing mint', descriptionTh: 'ช็อกโกแลตมิ้นท์ หอมช็อกโกแลตและมิ้นท์เย็นสดชื่น', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 407, nameEn: 'Vanilla Fresh Milk', nameTh: 'นมสดวนิลา', descriptionEn: 'Fresh milk with sweet vanilla aroma', descriptionTh: 'นมสดวนิลา หอมหวานวนิลาละมุนลิ้น', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 408, nameEn: 'Chestnut Fresh Milk', nameTh: 'นมสดเกาลัด', descriptionEn: 'Fresh milk with roasted chestnut flavor', descriptionTh: 'นมสดเกาลัด หอมกลิ่นเกาลัดคั่วพรีเมียม', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 409, nameEn: 'Hazelnut Chocolate', nameTh: 'ช็อกโกแลตเฮเซลนัท', descriptionEn: 'Rich chocolate with roasted hazelnut syrup', descriptionTh: 'ช็อกโกแลตเฮเซลนัท หอมถั่วเฮเซลนัทเข้มข้น', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 410, nameEn: 'Purple Sweet Potato Milk', nameTh: 'นมสดมันม่วง', descriptionEn: 'Fresh milk with smooth purple sweet potato', descriptionTh: 'นมสดมันม่วง หอมหวานมันม่วงแท้จากญี่ปุ่น', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop', isAvailable: true }
          ]
        },
        {
          id: 5,
          name: 'Smoothie & Bakery',
          nameEn: 'Smoothie & Bakery',
          nameTh: 'เมนูปั่นและเบเกอรี',
          items: [
            { id: 501, nameEn: 'Butter Croissant', nameTh: 'ครัวซองต์เนยสด', descriptionEn: 'Flaky and buttery fresh croissant', descriptionTh: 'ครัวซองต์เนยสด หอมกรุ่น กรอบนอกนุ่มใน', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 502, nameEn: 'Blueberry Cheesecake', nameTh: 'ชีสเค้กบลูเบอร์รี', descriptionEn: 'Creamy cheesecake topped with sweet blueberry compote', descriptionTh: 'ชีสเค้กบลูเบอร์รี เนื้อเนียนนุ่มราดซอสบลูเบอร์รีฉ่ำๆ', basePrice: 110, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 503, nameEn: 'Chocolate Brownie', nameTh: 'บราวนี่ช็อกโกแลต', descriptionEn: 'Fudgy and rich chocolate brownie', descriptionTh: 'บราวนี่ช็อกโกแลต เข้มข้นหนึบหนับ', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 504, nameEn: 'Matcha Frappe', nameTh: 'มัทฉะปั่น', descriptionEn: 'Blended premium Japanese green tea', descriptionTh: 'มัทฉะปั่น หอมเข้มข้นหวานมันเย็นชื่นใจ', basePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 505, nameEn: 'Cocoa Frappe', nameTh: 'โกโก้ปั่น', descriptionEn: 'Rich blended chocolate frappe', descriptionTh: 'โกโก้ปั่น เข้มข้นท็อปวิปครีมล้นๆ', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 506, nameEn: 'Strawberry Special Smoothie', nameTh: 'สตรอว์เบอร์รีสเปเชียลปั่น', descriptionEn: 'Sweet and tangy strawberry special smoothie', descriptionTh: 'สตรอว์เบอร์รีสเปเชียลปั่น เย็นฉ่ำชื่นใจ', basePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 507, nameEn: 'Almond Croissant', nameTh: 'ครัวซองต์อัลมอนด์', descriptionEn: 'Croissant filled and topped with sweet almond cream', descriptionTh: 'ครัวซองต์อัลมอนด์ หอมมันอัลมอนด์กรุบกรอบ', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 508, nameEn: 'Orange Cake', nameTh: 'เค้กส้ม', descriptionEn: 'Soft sponge cake with fresh orange glaze', descriptionTh: 'เค้กส้ม เนื้อนุ่มราดซอสส้มเปรี้ยวหวานสดชื่น', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 509, nameEn: 'Soft Chocolate Cake', nameTh: 'เค้กช็อกโกแลตหน้านุ่ม', descriptionEn: 'Soft chocolate cake with thick chocolate ganache', descriptionTh: 'เค้กช็อกโกแลตหน้านุ่ม ช็อกโกแลตเยิ้มๆ ละมุน', basePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 510, nameEn: 'Espresso Frappe', nameTh: 'เอสเพรสโซ่ปั่น', descriptionEn: 'Blended espresso coffee', descriptionTh: 'เอสเพรสโซ่ปั่น เข้มข้นตื่นเต็มตา', basePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop', isAvailable: true }
          ]
        }
      ]
    };

    ApiClient.getMenu()
      .then((data) => {
        if (!data || !data.categories || data.categories.length === 0) {
          setMenuData(fallbackMenu);
          setSelectedCategory(fallbackMenu.categories[0].id);
        } else {
          const normalizedCategories = data.categories.map((cat: any) => ({
            ...cat,
            items: (cat.items || []).map((item: any) => ({
              ...item,
              basePrice: item.basePrice > 1000 ? item.basePrice / 100 : item.basePrice
            }))
          }));
          setMenuData({ ...data, categories: normalizedCategories });
          if (normalizedCategories.length > 0) {
            setSelectedCategory(normalizedCategories[0].id);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setMenuData(fallbackMenu);
        setSelectedCategory(fallbackMenu.categories[0].id);
        setLoading(false);
      });

    const socket = ApiClient.getSocket();
    socket.emit('join', 'public');

    socket.on('menu:availability', (availabilityMap: { [itemId: number]: boolean }) => {
      setMenuData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.categories.map((cat: any) => ({
            ...cat,
            items: cat.items.map((item: any) => ({
              ...item,
              isAvailable: availabilityMap[item.id] ?? item.isAvailable,
            })),
          })),
        };
      });
    });

    return () => {
      socket.off('menu:availability');
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-pulse">
        <div className="h-16 bg-[#e6dcce] rounded-full mb-10 w-full"></div>
        <div className="h-96 bg-[#e6dcce] rounded-3xl mb-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-red-50 border border-red-200 p-8 rounded-3xl max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-red-900 mb-2">Unable to load menu</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!menuData) return null;

  // Tabs mapping keywords to categories with exact backend category matching or fallback
  const tabs = [
    { id: 1, label: 'เมนูยอดนิยม', keyword: 'Popular' },
    { id: 2, label: 'เมนูกาแฟ', keyword: 'Coffee' },
    { id: 3, label: 'เมนูชา', keyword: 'Tea' },
    { id: 4, label: 'เมนูช็อกโกแลตและนม', keyword: 'Chocolate' },
    { id: 5, label: 'เมนูปั่นและเบเกอรี', keyword: 'Smoothie' }
  ];

  const categories = menuData.categories || [];

  // Find the exact category corresponding to selectedCategory
  let currentCategory = categories.find((cat: any) => 
    cat.id === selectedCategory || 
    cat.category === selectedCategory ||
    cat.name?.toLowerCase() === String(selectedCategory).toLowerCase()
  );

  if (!currentCategory) {
    currentCategory = categories[0] || { name: 'Menu', items: [] };
  }

  const allProducts = categories.flatMap((cat: any) => cat.items || []);
  const categoryItems = (selectedCategory === 'all' || selectedCategory === 'popular' || selectedCategory === 1) && !categories.some((c: any) => c.category === 'popular' || c.id === 1)
    ? allProducts
    : (currentCategory?.items && currentCategory.items.length > 0 ? currentCategory.items : (categories[0]?.items || []));

  const nextSlider = () => {
    setSliderIndex((prev) => (prev + 1) % Math.max(1, categoryItems.length));
  };

  const prevSlider = () => {
    setSliderIndex((prev) => (prev - 1 + categoryItems.length) % Math.max(1, categoryItems.length));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-12 bg-[#F4EFEB] min-h-screen">
      
      {/* Category Sub-Header Navigation Tabs */}
      <div className="flex justify-center overflow-x-auto no-scrollbar py-2">
        <div className="flex space-x-2 sm:space-x-8 border-b border-[#EAE3DB] bg-white rounded-full shadow-sm px-6 py-2">
          {tabs.map((tab) => {
            const matchedCat = categories.find((c: any) => 
              c.id === tab.id || 
              c.name?.toLowerCase().includes(tab.keyword.toLowerCase()) || 
              c.nameTh?.includes(tab.label)
            ) || categories[tab.id - 1] || categories[0];

            const catId = matchedCat ? matchedCat.id : tab.id;
            const isActive = selectedCategory === catId;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (matchedCat) {
                    setSelectedCategory(matchedCat.id);
                  } else if (categories.length > 0) {
                    setSelectedCategory(categories[0].id);
                  }
                  setSliderIndex(0);
                }}
                className={`pb-1 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap px-3 py-2 rounded-xl ${
                  isActive ? 'bg-[#3e2723] text-white shadow-md' : 'text-[#5c3a31] hover:bg-[#F4EFEB]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Beverage Product Carousel */}
      <section className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-[#EAE3DB] relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#3e2723]">
              {language === 'th' ? (currentCategory?.nameTh || currentCategory?.name) : (currentCategory?.name || currentCategory?.nameTh)}
            </h2>
            <p className="text-gray-500 text-sm mt-1">เครื่องดื่มและเบเกอรีคัดสรรพิเศษเพื่อคุณโดยเฉพาะ</p>
          </div>
          {/* Counter Badge */}
          <div className="bg-[#F4EFEB] text-[#3e2723] font-black px-4 py-1.5 rounded-full text-sm border border-[#EAE3DB]">
            {String(sliderIndex + 1).padStart(2, '0')} / {String(categoryItems.length).padStart(2, '0')}
          </div>
        </div>

        {/* Carousel Container with 3D Beverage Showcase */}
        <div className="relative flex items-center justify-center py-6">
          {/* Left Arrow */}
          <button
            onClick={prevSlider}
            className="absolute left-0 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#3e2723] hover:bg-[#F4EFEB] transition-all -ml-2 sm:-ml-6"
            title="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Carousel Items Horizontal Track */}
          <div className="w-full overflow-hidden px-4">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6 items-center justify-center"
              style={{ transform: `translateX(-${sliderIndex * (100 / Math.min(3, categoryItems.length))}%)` }}
            >
              {categoryItems.map((item: any, idx: number) => {
                const isCenter = idx === sliderIndex;
                const displayName = language === 'th' ? (item.nameTh || item.nameEn) : (item.nameEn || item.nameTh);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSliderIndex(idx);
                      setSelectedItem(item);
                    }}
                    className={`flex-shrink-0 w-64 sm:w-72 bg-gradient-to-b from-[#faf6f0] to-[#EAE3DB] rounded-3xl p-6 text-center cursor-pointer transition-all duration-500 group relative border ${
                      isCenter ? 'scale-105 shadow-2xl border-[#d97706] ring-4 ring-amber-500/20' : 'scale-95 opacity-70 hover:opacity-100 border-[#EAE3DB]'
                    }`}
                  >
                    {/* Transparent Product Beverage Image with Floating "ดูเพิ่มเติม" Pill Overlay on Active Drink */}
                    <div className="relative w-40 h-48 mx-auto mb-4 flex items-center justify-center">
                      <img
                        src={item.imageUrl}
                        alt={displayName}
                        className="max-h-full max-w-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24' fill='none' stroke='%235A483E' stroke-width='1.5'><path d='M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3'/></svg>";
                        }}
                      />
                      {isCenter && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px] rounded-2xl">
                          <span className="bg-white text-[#3e2723] text-xs font-black px-4 py-2 rounded-full shadow-lg transform -translate-y-1">
                            ดูเพิ่มเติม
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Item Title & Price Neatly Below */}
                    <h3 className="font-black text-[#3e2723] text-base sm:text-lg mb-1 truncate px-2">
                      {displayName}
                    </h3>
                    <div className="text-[#d97706] font-black text-base">
                      {item.basePrice} บาท
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlider}
            className="absolute right-0 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#3e2723] hover:bg-[#F4EFEB] transition-all -mr-2 sm:-mr-6"
            title="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(customizedItem) => {
            const event = new CustomEvent('add-to-cart', { detail: customizedItem });
            window.dispatchEvent(event);
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-20">
        <div className="bg-[#EAE3DB] rounded-3xl p-8 sm:p-12 text-[#3e2723] shadow-lg mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#dfd6cc]">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Porto Coffee สาขาแฟลกชิป</h3>
            <p className="text-[#5c3a31]/80 text-sm mt-1">สัมผัสความหอมกรุ่นของกาแฟพรีเมียมและเบเกอรีอบสดใหม่ใจกลางเมือง</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => alert('กำลังค้นหาสาขาใกล้คุณ... (สาขาใกล้ที่สุด: สุขุมวิท 24 ห่างออกไป 1.2 กม.)')}
              className="bg-[#d97706] hover:bg-[#b45309] text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all"
            >
              ร้านใกล้ฉัน
            </button>
            <button
              onClick={() => alert('สาขา Porto Coffee ทั้งหมด:\n- สาขา สุขุมวิท 24 (เปิด 08:00 - 17:00)\n- สาขา อารีย์ (เปิด 07:30 - 18:00)\n- สาขา สีลมคอมเพล็กซ์ (เปิด 08:00 - 20:00)')}
              className="bg-white hover:bg-gray-50 text-[#3e2723] border border-[#d6c9b8] px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xs transition-all"
            >
              สาขา Porto Coffee
            </button>
          </div>
        </div>

        <div className="bg-[#5A483E] text-white rounded-t-3xl pt-16 pb-12 px-6 sm:px-12 shadow-2xl">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-white">Porto Coffee</h2>
              <p className="text-amber-100/80 text-sm leading-relaxed max-w-sm">
                ร้านกาแฟพรีเมียมคัดสรรเมล็ดพันธุ์ชั้นดี พิถีพิถันทุกขั้นตอนการชง เพื่อส่งมอบช่วงเวลาแห่งความสุขในทุกแก้วให้กับคุณ
              </p>
              
              <div className="flex space-x-3 pt-2">
                <a href="#facebook" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#d97706] transition-colors" title="Facebook">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#instagram" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#d97706] transition-colors" title="Instagram">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#youtube" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#d97706] transition-colors" title="YouTube">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#line" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#d97706] transition-colors" title="LINE">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .336-.236.63-.63.63-.33 0-.585-.24-5.85-.63v-4.38c0-.345.27-.63.6-.63.345 0 .63.285.63.63v3.75zM8.52 13.509H7.26V8.108c0-.345.285-.63.63-.63.345 0 .63.285.63.63v4.771c0 .343-.285.63-.63.63zm-4.89-3.646h-1.74c-.345 0-.63-.285-.63-.63 0-.349.285-.63.63-.63h1.74c.345 0 .63.281.63.63 0 .345-.285.63-.63.63zm18.525 2.137C22.195 5.753 17.665 2 12 2S1.805 5.753 1.805 12c0 5.568 4.11 10.198 9.51 10.957.375.054.645.36 0 .735l-.555 2.01c-.105.375.105.765.48.87.12.03.24.045.36.045 2.61 0 4.965-1.02 6.705-2.67 3.96-1.5 6.78-5.385 6.78-9.945z"/>
                  </svg>
                </a>
                <a href="#tiktok" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#d97706] transition-colors" title="TikTok">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.22-2.35.72-4.73 2.51-6.23 1.79-1.51 4.17-2.1 6.5-1.62.01 1.36 0 2.72 0 4.08-1.13-.31-2.37-.15-3.35.48-.98.63-1.6 1.71-1.65 2.89-.05 1.18.49 2.33 1.45 2.98.96.65 2.19.78 3.27.35 1.08-.43 1.84-1.44 1.94-2.58.12-1.33.02-2.67.03-4.01V.02z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-amber-300 text-sm uppercase tracking-wider mb-4">ร่วมธุรกิจ</h4>
              <ul className="space-y-2.5 text-sm text-amber-100/80">
                <li 
                  onClick={() => alert('เปิดรับสมัครแฟรนไชส์ Porto Coffee ร่วมเติบโตไปกับเราด้วยเงินลงทุนเริ่มต้นเพียง 150,000 บาท พร้อมทีมงานดูแลระบบและวัตถุดิบครบวงจร')}
                  className="cursor-pointer hover:underline hover:text-white transition-colors"
                >
                  ร่วมธุรกิจแฟรนไชส์
                </li>
                <li 
                  onClick={() => alert('สนใจเป็นคู่ค้าทางธุรกิจ / ซื้อวัตถุดิบเมล็ดกาแฟคั่วพรีเมียม / ติดต่อฝ่าย B2B ได้ที่ partner@portocoffee.com หรือโทร 02-123-4567')}
                  className="cursor-pointer hover:underline hover:text-white transition-colors"
                >
                  สมัครเป็นคู่ค้าทางธุรกิจ
                </li>
                <li 
                  onClick={() => alert('ร่วมงานกับ Porto Coffee ส่งเรซูเม่สมัครงานตำแหน่ง Barista, Store Manager, และ Food Developer ได้ที่ careers@portocoffee.com')}
                  className="cursor-pointer hover:underline hover:text-white transition-colors"
                >
                  ร่วมงานกับเรา
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-amber-300 text-sm uppercase tracking-wider mb-4">เมนู Porto</h4>
              <ul className="space-y-2.5 text-sm text-amber-100/80">
                <li 
                  onClick={() => {
                    const matched = categories.find((c: any) => c.name?.toLowerCase().includes('coffee') || c.nameTh?.includes('กาแฟ'));
                    if (matched) setSelectedCategory(matched.id);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="cursor-pointer hover:underline hover:text-white transition-colors"
                >
                  เอสเพรสโซ่ & กาแฟสด
                </li>
                <li 
                  onClick={() => {
                    const matched = categories.find((c: any) => c.name?.toLowerCase().includes('tea') || c.nameTh?.includes('ชา'));
                    if (matched) setSelectedCategory(matched.id);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="cursor-pointer hover:underline hover:text-white transition-colors"
                >
                  ชาไทย & มัทฉะลาเต้
                </li>
                <li 
                  onClick={() => {
                    const matched = categories.find((c: any) => c.name?.toLowerCase().includes('smoothie') || c.nameTh?.includes('เบเกอรี'));
                    if (matched) setSelectedCategory(matched.id);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="cursor-pointer hover:underline hover:text-white transition-colors"
                >
                  ครัวซองต์เนยสด
                </li>
                <li 
                  onClick={() => {
                    const matched = categories.find((c: any) => c.name?.toLowerCase().includes('smoothie') || c.nameTh?.includes('เบเกอรี'));
                    if (matched) setSelectedCategory(matched.id);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="cursor-pointer hover:underline hover:text-white transition-colors"
                >
                  เค้กและเบเกอรี
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-amber-300 text-sm uppercase tracking-wider mb-4">เกี่ยวกับเรา</h4>
              <ul className="space-y-2.5 text-sm text-amber-100/80 mb-6">
                <li><a href="#about" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-about-modal')); }} className="hover:text-white transition-colors">เรื่องราวแบรนด์</a></li>
                <li><a href="#branches" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-location-modal')); }} className="hover:text-white transition-colors">สาขาแฟลกชิปสุขุมวิท 24</a></li>
                <li><a href="#membership" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-member-modal')); }} className="hover:text-white transition-colors">Member & สิทธิประโยชน์</a></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-white/10 pt-10 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-bold text-white text-lg mb-1">ไม่พลาดทุกข่าวสารของ Porto Coffee</h4>
              <p className="text-xs text-amber-100/80">ลงทะเบียนอีเมลเพื่อรับสิทธิพิเศษ โปรโมชัน และข่าวสารใหม่ก่อนใคร</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('ขอบคุณสำหรับการสมัครรับข่าวสาร'); }} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="กรอกอีเมลของคุณ..."
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-amber-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="bg-[#d97706] hover:bg-[#b45309] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md whitespace-nowrap"
                >
                  ติดตามข่าวสาร
                </button>
              </div>
              <div className="flex items-center space-x-2 text-xs text-amber-100/80">
                <input type="checkbox" required id="porto_terms" className="rounded border-white/30 text-amber-600 focus:ring-amber-400" />
                <label htmlFor="porto_terms">ฉันยอมรับและเข้าใจ เงื่อนไขและข้อกำหนด นโยบายความเป็นส่วนตัว</label>
              </div>
            </form>
          </div>

          <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-amber-100/60 gap-4">
            <p>© 2026 Porto Coffee Co., Ltd. All rights reserved.</p>
            <div className="flex space-x-6">
              <span onClick={() => window.dispatchEvent(new CustomEvent('open-policy', { detail: 'privacy' }))} className="cursor-pointer hover:underline text-xs text-stone-400 hover:text-stone-200 transition-colors">นโยบายความเป็นส่วนตัว</span>
              <span onClick={() => window.dispatchEvent(new CustomEvent('open-policy', { detail: 'terms' }))} className="cursor-pointer hover:underline text-xs text-stone-400 hover:text-stone-200 transition-colors">ข้อกำหนดการใช้งาน</span>
              <span onClick={() => window.dispatchEvent(new CustomEvent('open-policy', { detail: 'cookies' }))} className="cursor-pointer hover:underline text-xs text-stone-400 hover:text-stone-200 transition-colors">นโยบายคุกกี้</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
