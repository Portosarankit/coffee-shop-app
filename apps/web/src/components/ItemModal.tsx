import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ItemModalProps {
  item: any;
  onClose: () => void;
  onAddToCart: (customizedItem: any) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onAddToCart }) => {
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  
  const rawBase = item.basePrice > 1000 ? item.basePrice / 100 : item.basePrice;
  const [basePrice] = useState(rawBase);

  const defaultOptionGroups = [
    {
      id: 991,
      nameEn: 'Size / Type',
      nameTh: 'ขนาดแก้ว / รูปแบบ',
      nameZh: '杯型 / 规格',
      isRequired: true,
      choices: [
        { id: 901, nameEn: 'S (Small)', nameTh: 'S (แก้วเล็ก)', nameZh: '小杯 (S)', priceModifier: 0, isAvailable: true },
        { id: 902, nameEn: 'M (Medium +10฿)', nameTh: 'M (แก้วกลาง +10฿)', nameZh: '中杯 (M +10฿)', priceModifier: 10, isAvailable: true },
        { id: 903, nameEn: 'L (Large +20฿)', nameTh: 'L (แก้วใหญ่ +20฿)', nameZh: '大杯 (L +20฿)', priceModifier: 20, isAvailable: true }
      ]
    },
    {
      id: 992,
      nameEn: 'Sweetness Level',
      nameTh: 'ระดับความหวาน',
      nameZh: '甜度选择',
      isRequired: true,
      choices: [
        { id: 910, nameEn: t.itemModal.sweetnessLevels.s0, nameTh: t.itemModal.sweetnessLevels.s0, nameZh: t.itemModal.sweetnessLevels.s0, priceModifier: 0, isAvailable: true },
        { id: 911, nameEn: t.itemModal.sweetnessLevels.s25, nameTh: t.itemModal.sweetnessLevels.s25, nameZh: t.itemModal.sweetnessLevels.s25, priceModifier: 0, isAvailable: true },
        { id: 912, nameEn: t.itemModal.sweetnessLevels.s50, nameTh: t.itemModal.sweetnessLevels.s50, nameZh: t.itemModal.sweetnessLevels.s50, priceModifier: 0, isAvailable: true },
        { id: 913, nameEn: t.itemModal.sweetnessLevels.s75, nameTh: t.itemModal.sweetnessLevels.s75, nameZh: t.itemModal.sweetnessLevels.s75, priceModifier: 0, isAvailable: true },
        { id: 914, nameEn: t.itemModal.sweetnessLevels.s100, nameTh: t.itemModal.sweetnessLevels.s100, nameZh: t.itemModal.sweetnessLevels.s100, priceModifier: 0, isAvailable: true }
      ]
    },
    {
      id: 993,
      nameEn: 'Add-ons',
      nameTh: 'ท็อปปิ้งเพิ่มเติม',
      nameZh: '附加选项',
      isRequired: false,
      choices: [
        { id: 930, nameEn: 'Extra Shot (+15฿)', nameTh: 'เพิ่มช็อตกาแฟ (+15฿)', nameZh: '加浓缩 (+15฿)', priceModifier: 15, isAvailable: true },
        { id: 931, nameEn: 'Extra Foam (+10฿)', nameTh: 'เพิ่มฟองนม (+10฿)', nameZh: '加奶泡 (+10฿)', priceModifier: 10, isAvailable: true },
        { id: 932, nameEn: 'Standard', nameTh: 'มาตรฐาน', nameZh: '标准', priceModifier: 0, isAvailable: true }
      ]
    }
  ];

  const rawOptionGroups = item.optionGroups && item.optionGroups.length > 0 ? item.optionGroups : null;
  const optionGroups = rawOptionGroups || defaultOptionGroups;

  const [selectedOptions, setSelectedOptions] = useState<{ [groupId: number]: any }>(() => {
    const defaults: { [groupId: number]: any } = {};
    optionGroups.forEach((group: any) => {
      if (group.choices?.length > 0) {
        defaults[group.id] = group.choices[0];
      }
    });
    return defaults;
  });

  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleOptionSelect = (group: any, choice: any) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [group.id]: choice,
    }));
  };

  const calculateTotalPrice = () => {
    let total = basePrice;
    Object.values(selectedOptions).forEach((choice: any) => {
      if (choice) {
        const mod = choice.priceModifier ?? choice.priceDelta ?? 0;
        total += mod > 100 ? mod / 100 : mod;
      }
    });
    return total * quantity;
  };

  const handleAdd = () => {
    const formattedOptions = Object.values(selectedOptions)
      .filter(Boolean)
      .map((choice: any) => {
        const group = optionGroups.find((g: any) => g.choices.some((c: any) => c.id === choice.id));
        const mod = choice.priceModifier ?? choice.priceDelta ?? 0;
        return {
          groupId: group?.id || 0,
          groupName: group ? (language === 'th' ? group.nameTh : language === 'zh' ? group.nameZh : group.nameEn) : '',
          choiceId: choice.id,
          choiceName: language === 'th' ? (choice.nameTh || choice.nameEn) : language === 'zh' ? (choice.nameZh || choice.nameEn) : (choice.nameEn || choice.nameTh),
          price: mod > 100 ? mod / 100 : mod,
        };
      });

    const displayName = language === 'th' 
      ? (item.nameTh || item.name || item.title || item.nameEn || item.nameZh || "เมนูแนะนำ")
      : language === 'zh'
      ? (item.nameZh || item.nameEn || item.name || item.nameTh || "Featured Menu")
      : (item.nameEn || item.name || item.nameTh || item.nameZh || "Featured Menu");

    onAddToCart({
      itemId: item.id || item.itemId,
      name: displayName,
      price: basePrice,
      quantity,
      selectedOptions: formattedOptions,
      specialInstructions,
      imageUrl: item.imageUrl,
    });
    onClose();
  };

  const displayName = language === 'th' 
    ? (item.nameTh || item.name || item.title || item.nameEn || item.nameZh || "เมนูแนะนำ")
    : language === 'zh'
    ? (item.nameZh || item.nameEn || item.name || item.nameTh || "Featured Menu")
    : (item.nameEn || item.name || item.nameTh || item.nameZh || "Featured Menu");

  const displayDesc = language === 'th'
    ? (item.descriptionTh || item.descriptionEn || item.descriptionZh)
    : language === 'zh'
    ? (item.descriptionZh || item.descriptionEn || item.descriptionTh)
    : (item.descriptionEn || item.descriptionTh || item.descriptionZh);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-[#f3eee2]">
        
        {item.imageUrl && (
          <div className="h-56 w-full bg-[#f7f2ea] relative overflow-hidden flex items-center justify-center p-4">
            <img 
              src={item.imageUrl} 
              alt={displayName} 
              className="max-h-full max-w-full object-contain drop-shadow-xl" 
            />
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:bg-white shadow-md font-bold transition-all"
            >
              ✕
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!item.imageUrl && (
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-black text-[#3e2723]">{displayName}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                ✕
              </button>
            </div>
          )}

          <div className="border-t border-[#f3eee2] pt-4">
            <h3 className="text-xl font-bold text-[#1E1E1E]">{displayName}</h3>
            {displayDesc && <p className="text-gray-600 text-sm mt-1 leading-relaxed">{displayDesc}</p>}
            <p className="text-[#C68B59] font-black text-2xl mt-2">฿{basePrice.toFixed(0)}</p>
          </div>

          {optionGroups.map((group: any) => {
            const groupName = language === 'th' ? group.nameTh : language === 'zh' ? group.nameZh : group.nameEn;
            return (
              <div key={group.id} className="border-t border-[#f3eee2] pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-black text-[#1E1E1E] text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]"></span>
                    {groupName}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {group.choices.map((choice: any) => {
                    const isSelected = selectedOptions[group.id]?.id === choice.id;
                    const isChoiceAvailable = choice.isAvailable ?? true;
                    const choiceName = language === 'th' ? (choice.nameTh || choice.nameEn) : language === 'zh' ? (choice.nameZh || choice.nameEn) : (choice.nameEn || choice.nameTh);
                    const mod = choice.priceModifier ?? choice.priceDelta ?? 0;
                    const cleanMod = mod > 100 ? mod / 100 : mod;

                    return (
                      <button
                        key={choice.id}
                        type="button"
                        disabled={!isChoiceAvailable}
                        onClick={() => handleOptionSelect(group, choice)}
                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          !isChoiceAvailable
                            ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200'
                            : isSelected
                            ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white font-black shadow-lg scale-105'
                            : 'border-gray-200 bg-[#F7F3EE]/60 hover:bg-[#F7F3EE] text-[#1E1E1E]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight">{choiceName}</span>
                          <span className={`text-[11px] mt-1 ${isSelected ? 'text-amber-200 font-bold' : 'text-gray-500 font-semibold'}`}>
                            {cleanMod > 0 ? `+฿${cleanMod}` : ''}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-white text-[#1E3A8A] flex items-center justify-center text-xs font-black shadow-sm ml-2">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="border-t border-[#f3eee2] pt-4">
            <label className="block text-xs font-bold text-gray-700 mb-1">{t.itemModal.specialInstructions}</label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={t.itemModal.specialPlaceholder}
              className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div className="border-t border-[#f3eee2] pt-6 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 bg-[#f7f2ea] px-3 py-1.5 rounded-2xl border border-[#e6dcce]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white border border-[#e6dcce] flex items-center justify-center font-black text-[#3e2723] hover:bg-gray-100 shadow-xs"
              >
                -
              </button>
              <span className="font-black text-lg text-[#3e2723] w-6 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white border border-[#e6dcce] flex items-center justify-center font-black text-[#3e2723] hover:bg-gray-100 shadow-xs"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!item.isAvailable}
              className="flex-1 bg-[#1E3A8A] hover:bg-[#152e6d] text-white py-4 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              <span>{t.itemModal.addToCart}</span>
              <span>•</span>
              <span>฿{calculateTotalPrice().toFixed(0)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
