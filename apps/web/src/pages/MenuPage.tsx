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
  const { language, t } = useLanguage();

  useEffect(() => {
    const fallbackMenu = {
      categories: [
        {
          id: 1,
          name: 'Popular Signature',
          nameEn: 'Popular Signature',
          nameTh: 'เมนูยอดนิยม',
          nameZh: '人气招牌',
          items: [
            { id: 201, nameEn: 'Porto Signature', nameTh: 'พอร์โต ซิกเนเจอร์', nameZh: 'Porto招牌咖啡', descriptionEn: 'Special blended coffee with secret caramel touch', descriptionTh: 'พอร์โต ซิกเนเจอร์ กาแฟสูตรพิเศษหอมกลมกล่อม', descriptionZh: '特调招牌咖啡，带有秘密焦糖风味', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 202, nameEn: 'Young Coconut Coffee', nameTh: 'กาแฟมะพร้าวอ่อน', nameZh: '鲜椰子咖啡', descriptionEn: 'Fresh coconut water topped with rich espresso shot', descriptionTh: 'กาแฟมะพร้าวอ่อน น้ำมะพร้าวสดหอมหวานราดช็อตกาแฟ', descriptionZh: '新鲜椰子水搭配香浓浓缩咖啡', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 203, nameEn: 'Iced Thai Tea', nameTh: 'ชาไทยเย็น', nameZh: '泰式冰奶茶', descriptionEn: 'Traditional Thai milk tea with rich aroma', descriptionTh: 'ชาไทยเย็น หอมเข้มข้นสูตรดั้งเดิม', descriptionZh: '传统泰式奶茶，香浓醇厚', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 204, nameEn: 'Matcha Latte', nameTh: 'มัทฉะลาเต้', nameZh: '抹茶拿铁', descriptionEn: 'Premium Japanese green tea with fresh milk', descriptionTh: 'มัทฉะลาเต้ ชาเขียวญี่ปุ่นแท้พรีเมียม', descriptionZh: '优质日本绿茶搭配鲜奶', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 205, nameEn: 'Premium Cocoa', nameTh: 'โกโก้พรีเมียม', nameZh: '高级可可', descriptionEn: 'Rich and creamy dark cocoa', descriptionTh: 'โกโก้พรีเมียม เข้มข้นละมุนลิ้น', descriptionZh: '浓郁丝滑黑可可', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 206, nameEn: 'Taiwan Milk Tea', nameTh: 'ชานมไต้หวัน', nameZh: '台湾奶茶', descriptionEn: 'Authentic Taiwan milk tea', descriptionTh: 'ชานมไต้หวัน หอมกลิ่นชาไต้หวันแท้', descriptionZh: '地道台湾风味奶茶', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 207, nameEn: 'Butter Croissant', nameTh: 'ครัวซองต์เนยสด', nameZh: '牛角面包', descriptionEn: 'Flaky and buttery fresh croissant', descriptionTh: 'ครัวซองต์เนยสด หอมกรุ่น กรอบนอกนุ่มใน', descriptionZh: '酥脆香浓黄油牛角包', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 208, nameEn: 'Basque Burnt Cheesecake', nameTh: 'ชีสเค้กหน้าไหม้', nameZh: '巴斯克烧焦芝士蛋糕', descriptionEn: 'Rich and creamy burnt Basque cheesecake', descriptionTh: 'ชีสเค้กหน้าไหม้ เนื้อเนียนนุ่มละลายในปาก', descriptionZh: '香浓绵密巴斯克芝士蛋糕', basePrice: 110, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 209, nameEn: 'Traditional Brownie', nameTh: 'บราวนี่ฉ่ำโบราณ', nameZh: '传统布朗尼', descriptionEn: 'Fudgy and rich traditional chocolate brownie', descriptionTh: 'บราวนี่ฉ่ำโบราณ ช็อกโกแลตเข้มข้นหนึบหนับ', descriptionZh: '浓郁经典巧克力布朗尼', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 210, nameEn: 'Lemon Soda', nameTh: 'มะนาวโซดา', nameZh: '柠檬苏打', descriptionEn: 'Refreshing sparkling lemon soda', descriptionTh: 'มะนาวโซดา ซ่าสดชื่นคลายร้อน', descriptionZh: '清爽解渴柠檬气泡水', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop', isAvailable: true }
          ]
        },
        {
          id: 2,
          name: 'Coffee',
          nameEn: 'Coffee',
          nameTh: 'เมนูกาแฟ',
          nameZh: '咖啡系列',
          items: [
            { id: 101, nameEn: 'Espresso', nameTh: 'เอสเพรสโซ่', nameZh: '意式浓缩', descriptionEn: 'Rich and bold single shot of espresso', descriptionTh: 'เอสเพรสโซ่เข้มข้น หอมกรุ่นกลิ่นกาแฟคั่วบด', descriptionZh: '浓郁纯正意式浓缩咖啡', basePrice: 60, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 102, nameEn: 'Americano', nameTh: 'อเมริกาโน่', nameZh: '美式咖啡', descriptionEn: 'Smooth espresso with hot or iced water', descriptionTh: 'กาแฟดำอเมริกาโน่ หอมกลิ่นเมล็ดกาแฟแท้', descriptionZh: '经典顺滑美式咖啡', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 103, nameEn: 'Latte', nameTh: 'ลาเต้', nameZh: '拿铁咖啡', descriptionEn: 'Espresso with steamed milk and a light layer of foam', descriptionTh: 'ลาเต้นุ่มละมุน ผสมนมสดแท้กลมกล่อม', descriptionZh: '香浓拿铁咖啡伴顺滑奶泡', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 104, nameEn: 'Cappuccino', nameTh: 'คาปูชิโน่', nameZh: '卡布奇诺', descriptionEn: 'Espresso with equal parts steamed milk and milk foam', descriptionTh: 'คาปูชิโน่ฟองนมนุ่ม โรยผงโกโก้บางๆ', descriptionZh: '经典卡布奇诺伴丰富奶泡', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80', isAvailable: true },
            { id: 105, nameEn: 'Mocha', nameTh: 'มอคค่า', nameZh: '摩卡咖啡', descriptionEn: 'Espresso with chocolate and steamed milk', descriptionTh: 'มอคค่าเข้มข้นผสมช็อกโกแลตแท้พรีเมียม', descriptionZh: '浓缩咖啡融合香甜巧克力与鲜奶', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 106, nameEn: 'Caramel Macchiato', nameTh: 'คาราเมล มักคิอาโต้', nameZh: '焦糖玛奇朵', descriptionEn: 'Espresso with vanilla and caramel drizzle', descriptionTh: 'คาราเมล มักคิอาโต้ หอมหวานคาราเมล', descriptionZh: '香草与焦糖风味玛奇朵', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 107, nameEn: 'Dirty Coffee', nameTh: 'เดอร์ตี้ คอฟฟี่', nameZh: '脏咖啡', descriptionEn: 'Chilled rich milk layered with hot espresso shot', descriptionTh: 'เดอร์ตี้ คอฟฟี่ นมเย็นจัดราดด้วยช็อตเอสเพรสโซ่ร้อน', descriptionZh: '冰镇冰乳层叠热意式浓缩', basePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 108, nameEn: 'Cold Brew', nameTh: 'โคลด์บรูว์', nameZh: '冷萃咖啡', descriptionEn: 'Slow steeped smooth cold brew coffee', descriptionTh: 'โคลด์บรูว์ กาแฟสกัดเย็นนุ่มละมุน', descriptionZh: '慢速冷萃顺滑咖啡', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 109, nameEn: 'Orange Espresso', nameTh: 'เอสเพรสโซ่ส้ม', nameZh: '橙香意式浓缩', descriptionEn: 'Espresso shot over refreshing sweet orange juice', descriptionTh: 'เอสเพรสโซ่ส้ม ผสานน้ำส้มคั้นสดชื่น', descriptionZh: '香浓意式浓缩搭配新鲜橙汁', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 110, nameEn: 'Affogato', nameTh: 'อัฟโฟกาโต', nameZh: '阿芙佳朵', descriptionEn: 'Vanilla ice cream topped with a hot espresso shot', descriptionTh: 'อัฟโฟกาโต ไอศกรีมวนิลาลาดด้วยเอสเพรสโซ่ร้อน', descriptionZh: '香草冰淇淋浇筑热浓缩咖啡', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop', isAvailable: true }
          ]
        },
        {
          id: 3,
          name: 'Tea',
          nameEn: 'Tea',
          nameTh: 'เมนูชา',
          nameZh: '茶饮系列',
          items: [
            { id: 301, nameEn: 'Thai Tea', nameTh: 'ชาไทย', nameZh: '泰式奶茶', descriptionEn: 'Traditional Thai milk tea with rich aroma', descriptionTh: 'ชาไทยสูตรดั้งเดิม หอมหวานมันกลมกล่อม', descriptionZh: '传统浓香泰式奶茶', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 302, nameEn: 'Matcha Latte', nameTh: 'มัทฉะลาเต้', nameZh: '抹茶拿铁', descriptionEn: 'Premium Japanese green tea with fresh milk', descriptionTh: 'ชาเขียวมัทฉะพรีเมียมนำเข้าจากญี่ปุ่น หอมเข้มข้น', descriptionZh: '优质日本进口抹茶拿铁', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 303, nameEn: 'Lemon Tea', nameTh: 'ชามะนาว', nameZh: '柠檬茶', descriptionEn: 'Refreshing black tea infused with fresh lemon juice', descriptionTh: 'ชามะนาวรสเปรี้ยวหวานสดชื่น ดับกระหาย', descriptionZh: '清爽解腻柠檬红茶', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 304, nameEn: 'Iced Black Tea', nameTh: 'ชาดำเย็น', nameZh: '冰红茶', descriptionEn: 'Refreshing chilled black tea', descriptionTh: 'ชาดำเย็น หอมหวานชื่นใจ', descriptionZh: '清凉冰红茶', basePrice: 60, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 305, nameEn: 'Peach Jasmine Tea', nameTh: 'ชามะลิพีช', nameZh: '白桃茉莉花茶', descriptionEn: 'Fragrant jasmine tea infused with sweet peach', descriptionTh: 'ชามะลิพีช หอมกลิ่นมะลิและพีชหวานฉ่ำ', descriptionZh: '香甜白桃搭配清香茉莉绿茶', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 306, nameEn: 'Earl Grey Latte', nameTh: 'ชาเอิร์ลเกรย์ลาเต้', nameZh: '伯爵拿铁', descriptionEn: 'Earl Grey tea with steamed milk', descriptionTh: 'ชาเอิร์ลเกรย์ลาเต้ หอมกลิ่นเบอร์กามอตละมุน', descriptionZh: '香气怡人伯爵茶拿铁', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 307, nameEn: 'Hojicha Tea', nameTh: 'ชาโฮจิฉะ', nameZh: '焙茶', descriptionEn: 'Roasted Japanese green tea', descriptionTh: 'ชาโฮจิฉะ ชาเขียวคั่วหอมกลิ่นคั่วเอกลักษณ์', descriptionZh: '香浓日式烘焙绿茶', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 308, nameEn: 'Jasmine Green Tea', nameTh: 'ชาเขียวมะลิ', nameZh: '茉莉绿茶', descriptionEn: 'Light and fragrant jasmine green tea', descriptionTh: 'ชาเขียวมะลิ หอมสดชื่นเบาสบาย', descriptionZh: '清新淡雅茉莉绿茶', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 309, nameEn: 'Yuzu Orange Tea', nameTh: 'ชาส้มยูสุ', nameZh: '柚子茶', descriptionEn: 'Refreshing tea with Japanese yuzu orange', descriptionTh: 'ชาส้มยูสุ หอมกลิ่นยูสุเปรี้ยวหวานสดชื่น', descriptionZh: '日式柚子风味清爽茶饮', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 310, nameEn: 'Apple Tea', nameTh: 'ชาแอปเปิ้ล', nameZh: '苹果茶', descriptionEn: 'Refreshing apple flavored tea', descriptionTh: 'ชาแอปเปิ้ล หอมกลิ่นแอปเปิ้ลหวานละมุน', descriptionZh: '果香浓郁苹果茶', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop', isAvailable: true }
          ]
        },
        {
          id: 4,
          name: 'Chocolate & Milk',
          nameEn: 'Chocolate & Milk',
          nameTh: 'เมนูช็อกโกแลตและนม',
          nameZh: '巧克力与牛奶系列',
          items: [
            { id: 401, nameEn: 'Rich Cocoa', nameTh: 'โกโก้เข้มข้น', nameZh: '浓郁可可', descriptionEn: 'Rich and creamy dark cocoa with fresh milk', descriptionTh: 'โกโก้เข้มข้น หวานน้อย ละมุนลิ้น', descriptionZh: '浓郁香滑经典可可', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 402, nameEn: 'Hokkaido Fresh Milk', nameTh: 'นมสดฮอกไกโด', nameZh: '北海道鲜奶', descriptionEn: 'Pure Hokkaido fresh milk', descriptionTh: 'นมสดฮอกไกโด หอมมันเข้มข้นพิเศษ', descriptionZh: '香浓纯正北海道鲜奶', basePrice: 60, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 403, nameEn: 'Pink Milk', nameTh: 'นมชมพู', nameZh: '粉红牛奶', descriptionEn: 'Sweet Salas syrup with fresh milk', descriptionTh: 'นมชมพู หอมหวานกลมกล่อมชื่นใจ', descriptionZh: '香甜爽口红糖浆鲜奶', basePrice: 60, imageUrl: 'https://images.unsplash.com/photo-1579888944782-cb5f1db26005?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 404, nameEn: 'Caramel Fresh Milk', nameTh: 'นมสดคาราเมล', nameZh: '焦糖鲜奶', descriptionEn: 'Fresh milk with sweet caramel drizzle', descriptionTh: 'นมสดคาราเมล หอมหวานคาราเมลละมุน', descriptionZh: '香滑鲜奶淋上焦糖酱', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 405, nameEn: 'White Chocolate Milk', nameTh: 'นมสดไวท์ช็อกโกแลต', nameZh: '白巧克力牛奶', descriptionEn: 'Fresh milk with rich white chocolate', descriptionTh: 'นมสดไวท์ช็อกโกแลต หอมหวานนุ่มนวล', descriptionZh: '香浓白巧克力鲜奶', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 406, nameEn: 'Mint Chocolate', nameTh: 'ช็อกโกแลตมิ้นท์', nameZh: '薄荷巧克力', descriptionEn: 'Rich chocolate with refreshing mint', descriptionTh: 'ช็อกโกแลตมิ้นท์ หอมช็อกโกแลตและมิ้นท์เย็นสดชื่น', descriptionZh: '浓郁巧克力搭配清新薄荷', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 407, nameEn: 'Vanilla Fresh Milk', nameTh: 'นมสดวนิลา', nameZh: '香草鲜奶', descriptionEn: 'Fresh milk with sweet vanilla aroma', descriptionTh: 'นมสดวนิลา หอมหวานวนิลาละมุนลิ้น', descriptionZh: '香草风味鲜奶', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 408, nameEn: 'Chestnut Fresh Milk', nameTh: 'นมสดเกาลัด', nameZh: '栗子鲜奶', descriptionEn: 'Fresh milk with roasted chestnut flavor', descriptionTh: 'นมสดเกาลัด หอมกลิ่นเกาลัดคั่วพรีเมียม', descriptionZh: '香浓烤栗子风味鲜奶', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 409, nameEn: 'Hazelnut Chocolate', nameTh: 'ช็อกโกแลตเฮเซลนัท', nameZh: '榛果巧克力', descriptionEn: 'Rich chocolate with roasted hazelnut syrup', descriptionTh: 'ช็อกโกแลตเฮเซลนัท หอมถั่วเฮเซลนัทเข้มข้น', descriptionZh: '浓郁巧克力搭配榛果糖浆', basePrice: 80, imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 410, nameEn: 'Purple Sweet Potato Milk', nameTh: 'นมสดมันม่วง', nameZh: '紫薯牛奶', descriptionEn: 'Fresh milk with smooth purple sweet potato', descriptionTh: 'นมสดมันม่วง หอมหวานมันม่วงแท้จากญี่ปุ่น', descriptionZh: '香甜紫薯搭配醇厚鲜奶', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop', isAvailable: true }
          ]
        },
        {
          id: 5,
          name: 'Smoothie & Bakery',
          nameEn: 'Smoothie & Bakery',
          nameTh: 'เมนูปั่นและเบเกอรี',
          nameZh: '冰沙与烘焙系列',
          items: [
            { id: 501, nameEn: 'Butter Croissant', nameTh: 'ครัวซองต์เนยสด', nameZh: '牛角面包', descriptionEn: 'Flaky and buttery fresh croissant', descriptionTh: 'ครัวซองต์เนยสด หอมกรุ่น กรอบนอกนุ่มใน', descriptionZh: '酥脆香浓黄油牛角包', basePrice: 65, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 502, nameEn: 'Blueberry Cheesecake', nameTh: 'ชีสเค้กบลูเบอร์รี', nameZh: '蓝莓芝士蛋糕', descriptionEn: 'Creamy cheesecake topped with sweet blueberry compote', descriptionTh: 'ชีสเค้กบลูเบอร์รี เนื้อเนียนนุ่มราดซอสบลูเบอร์รีฉ่ำๆ', descriptionZh: '香浓芝士蛋糕淋上蓝莓果酱', basePrice: 110, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 503, nameEn: 'Chocolate Brownie', nameTh: 'บราวนี่ช็อกโกแลต', nameZh: '巧克力布朗尼', descriptionEn: 'Fudgy and rich chocolate brownie', descriptionTh: 'บราวนี่ช็อกโกแลต เข้มข้นหนึบหนับ', descriptionZh: '浓郁扎实巧克力布朗尼', basePrice: 70, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 504, nameEn: 'Matcha Frappe', nameTh: 'มัทฉะปั่น', nameZh: '抹茶冰沙', descriptionEn: 'Blended premium Japanese green tea', descriptionTh: 'มัทฉะปั่น หอมเข้มข้นหวานมันเย็นชื่นใจ', descriptionZh: '香浓顺滑抹茶冰沙', basePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 505, nameEn: 'Cocoa Frappe', nameTh: 'โกโก้ปั่น', nameZh: '可可冰沙', descriptionEn: 'Rich blended chocolate frappe', descriptionTh: 'โกโก้ปั่น เข้มข้นท็อปวิปครีมล้นๆ', descriptionZh: '浓郁可可冰沙顶部配奶油', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 506, nameEn: 'Strawberry Special Smoothie', nameTh: 'สตรอว์เบอร์รีสเปเชียลปั่น', nameZh: '草莓特调冰沙', descriptionEn: 'Sweet and tangy strawberry special smoothie', descriptionTh: 'สตรอว์เบอร์รีสเปเชียลปั่น เย็นฉ่ำชื่นใจ', descriptionZh: '酸甜清爽草莓特调冰沙', basePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 507, nameEn: 'Almond Croissant', nameTh: 'ครัวซองต์อัลมอนด์', nameZh: '杏仁牛角包', descriptionEn: 'Croissant filled and topped with sweet almond cream', descriptionTh: 'ครัวซองต์อัลมอนด์ หอมมันอัลมอนด์กรุบกรอบ', descriptionZh: '香脆杏仁酱牛角包', basePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 508, nameEn: 'Orange Cake', nameTh: 'เค้กส้ม', nameZh: '香橙蛋糕', descriptionEn: 'Soft sponge cake with fresh orange glaze', descriptionTh: 'เค้กส้ม เนื้อนุ่มราดซอสส้มเปรี้ยวหวานสดชื่น', descriptionZh: '清新香橙淋面松软蛋糕', basePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 509, nameEn: 'Soft Chocolate Cake', nameTh: 'เค้กช็อกโกแลตหน้านุ่ม', nameZh: '流心巧克力蛋糕', descriptionEn: 'Soft chocolate cake with thick chocolate ganache', descriptionTh: 'เค้กช็อกโกแลตหน้านุ่ม ช็อกโกแลตเยิ้มๆ ละมุน', descriptionZh: '浓郁流心巧克力蛋糕', basePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop', isAvailable: true },
            { id: 510, nameEn: 'Espresso Frappe', nameTh: 'เอสเพรสโซ่ปั่น', nameZh: '意式浓缩冰沙', descriptionEn: 'Blended espresso coffee', descriptionTh: 'เอสเพรสโซ่ปั่น เข้มข้นตื่นเต็มตา', descriptionZh: '提神醒脑意式浓缩冰沙', basePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop', isAvailable: true }
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

  const tabs = [
    { id: 1, label: t.menu.categories.all, index: 0 },
    { id: 2, label: t.menu.categories.coffee, index: 1 },
    { id: 3, label: t.menu.categories.tea, index: 2 },
    { id: 4, label: t.menu.categories.nonCoffee, index: 3 },
    { id: 5, label: t.menu.categories.bakery, index: 4 }
  ];

  const categories = menuData.categories || [];
  const activeTabObj = tabs.find(tObj => tObj.id === selectedCategory) || tabs[0];
  let currentCategory = categories[activeTabObj.index] || categories.find((cat: any) => 
    cat.id === selectedCategory || 
    cat.category === selectedCategory ||
    cat.name?.toLowerCase() === String(selectedCategory).toLowerCase()
  );

  if (!currentCategory) {
    currentCategory = categories[0] || { name: 'Menu', items: [] };
  }

  const categoryItems = currentCategory?.items && currentCategory.items.length > 0 
    ? currentCategory.items 
    : (categories[0]?.items || []);

  const nextSlider = () => {
    setSliderIndex((prev) => (prev + 1) % Math.max(1, categoryItems.length));
  };

  const prevSlider = () => {
    setSliderIndex((prev) => (prev - 1 + categoryItems.length) % Math.max(1, categoryItems.length));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-12 bg-[#F7F3EE] min-h-screen relative overflow-hidden">
      
      {/* Background Floating Decorative Elements */}
      <div className="absolute top-16 left-6 w-16 h-16 pointer-events-none animate-float-slow z-10 opacity-80 hidden sm:block">
        <div className="w-full h-full rounded-2xl liquid-glass flex items-center justify-center shadow-lg">
          <span className="text-2xl">☕</span>
        </div>
      </div>
      <div className="absolute top-32 right-8 w-14 h-14 pointer-events-none animate-float-fast z-10 opacity-80 hidden sm:block">
        <div className="w-full h-full rounded-full liquid-glass flex items-center justify-center shadow-lg">
          <span className="text-xl">🧋</span>
        </div>
      </div>

      {/* 1. Hero Section */}
      <section className="relative rounded-3xl p-6 sm:p-12 overflow-hidden shadow-2xl border border-white/60 bg-gradient-to-tr from-[#D4A373]/30 via-[#F7F3EE] to-[#1E3A8A]/15 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        <div className="space-y-6 z-10">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A]/10 text-[#1E3A8A] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <span>⭐ {t.hero.title}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1E1E1E] tracking-tight leading-tight">
            {t.hero.title} <br />
            <span className="text-[#C68B59]">{t.hero.subtitle}</span>
          </h1>
          <p className="text-[#1E1E1E]/80 text-sm sm:text-base leading-relaxed font-medium">
            {t.hero.openHours}
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('menu-showcase-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#1E3A8A] hover:bg-[#152e6d] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{t.hero.orderNow}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#D4A373]/40 via-[#F7F3EE] to-[#1E3A8A]/20 rounded-3xl blur-2xl"></div>
          <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl liquid-glass border border-white/80 shadow-2xl flex items-center justify-center p-6 transform hover:rotate-1 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop"
              alt="Featured Iced Latte"
              className="max-h-full max-w-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </section>

      {/* 2. Category Tabs */}
      <div id="menu-showcase-section" className="flex justify-center overflow-x-auto no-scrollbar py-2">
        <div className="flex space-x-2 sm:space-x-4 liquid-glass rounded-full px-6 py-3 shadow-lg">
          {tabs.map((tab) => {
            const isActive = selectedCategory === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setSliderIndex(0);
                }}
                className={`px-5 py-2.5 text-xs sm:text-sm font-black transition-all rounded-full whitespace-nowrap shadow-sm ${
                  isActive 
                    ? 'bg-[#1E3A8A] text-white shadow-[0_4px_20px_rgba(30,58,138,0.3)] scale-105' 
                    : 'bg-white/60 text-[#1E1E1E] hover:bg-white border border-white/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Carousel */}
      <section className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-[#EAE3DB] relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#3e2723]">
              {language === 'th' ? (currentCategory?.nameTh || currentCategory?.name) : language === 'zh' ? (currentCategory?.nameZh || currentCategory?.nameEn || currentCategory?.name) : (currentCategory?.nameEn || currentCategory?.name)}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{t.menu.title}</p>
          </div>
          <div className="bg-[#F4EFEB] text-[#3e2723] font-black px-4 py-1.5 rounded-full text-sm border border-[#EAE3DB]">
            {String(sliderIndex + 1).padStart(2, '0')} / {String(categoryItems.length).padStart(2, '0')}
          </div>
        </div>

        <div className="relative flex items-center justify-center py-6">
          <button
            onClick={prevSlider}
            className="absolute left-0 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#3e2723] hover:bg-[#F4EFEB] transition-all -ml-2 sm:-ml-6"
            title="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="w-full overflow-hidden px-4">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6 items-center justify-center"
              style={{ transform: `translateX(-${sliderIndex * (100 / Math.min(3, categoryItems.length))}%)` }}
            >
              {categoryItems.map((item: any, idx: number) => {
                const isCenter = idx === sliderIndex;
                const displayName = language === 'th' 
                  ? (item.nameTh || item.name || item.nameEn || item.nameZh)
                  : language === 'zh'
                  ? (item.nameZh || item.nameEn || item.name || item.nameTh)
                  : (item.nameEn || item.name || item.nameTh || item.nameZh);

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
                            {t.menu.addToCart}
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#1E1E1E] mb-1 line-clamp-1">
                      {displayName}
                    </h3>
                    <div className="text-[#1E3A8A] font-black text-base">
                      ฿{item.basePrice}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
        <div className="bg-[#5A483E] text-white rounded-t-3xl pt-16 pb-12 px-6 sm:px-12 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/60">
            <p>{t.footer.rights}</p>
            <p className="mt-2 sm:mt-0">Crafted with ❤️ for Coffee Lovers</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
