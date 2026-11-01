import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'cookies' | null>(null);

  return (
    <footer className="mt-20 bg-[#2C1810] text-amber-100/80 pt-16 pb-12 border-t border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
              ☕ Porto Coffee
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              ดื่มด่ำกับกาแฟคั่วบดคุณภาพเยี่ยม คัดสรรเมล็ดพันธุ์ชั้นดีจากทั่วโลกเพื่อส่งมอบความสุขในทุกๆ แก้วให้แก่คุณ
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">เวลาทำการ</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>วันจันทร์ - วันศุกร์: 07:00 - 20:00</li>
              <li>วันเสาร์ - วันอาทิตย์: 08:00 - 21:00</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>สาขาสุขุมวิท 101 กรุงเทพฯ</li>
              <li>โทร: 02-123-4567</li>
              <li>อีเมล: contact@portocoffee.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">รับข่าวสารและโปรโมชั่น</h4>
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
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-amber-100/60 gap-4">
          <p>© 2026 Porto Coffee Co., Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <span
              onClick={() => setActivePolicy('privacy')}
              className="cursor-pointer hover:underline text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              นโยบายความเป็นส่วนตัว
            </span>
            <span
              onClick={() => setActivePolicy('terms')}
              className="cursor-pointer hover:underline text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              ข้อกำหนดการใช้งาน
            </span>
            <span
              onClick={() => setActivePolicy('cookies')}
              className="cursor-pointer hover:underline text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              นโยบายคุกกี้
            </span>
          </div>
        </div>
      </div>

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
                  <p>บริษัท ปอร์โต คอฟฟี่ จำกัด ("เรา") ให้ความสำคัญอย่างยิ่งกับการคุ้มครองข้อมูลส่วนบุคคลของคุณ นโยบายความเป็นส่วนตัวฉบับนี้อธิบายถึงวิธีที่เราเก็บรวบรวม ใช้ เปิดเผย และปกป้องข้อมูลส่วนบุคคลของคุณเมื่อคุณใช้บริการเว็บไซต์และบริการของเรา</p>
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
    </footer>
  );
};
