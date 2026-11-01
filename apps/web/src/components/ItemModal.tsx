import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ItemModalProps {
  item: any;
  onClose: () => void;
  onAddToCart: (customizedItem: any) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onAddToCart }) => {
  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  
  // Ensure base price is standard integer in THB (e.g., 60, 65, 75, not 6000)
  const rawBase = item.basePrice > 1000 ? item.basePrice / 100 : item.basePrice;
  const [basePrice] = useState(rawBase);

  // Initialize selected options (defaulting to first choice or standard pills)
  const [selectedOptions, setSelectedOptions] = useState<{ [groupId: number]: any }>(() => {
    const defaults: { [groupId: number]: any } = {};
    item.optionGroups?.forEach((group: any) => {
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
        const group = item.optionGroups.find((g: any) => g.choices.some((c: any) => c.id === choice.id));
        const mod = choice.priceModifier ?? choice.priceDelta ?? 0;
        return {
          groupId: group?.id || 0,
          groupName: group ? (language === 'th' ? group.nameTh : group.nameEn) : '',
          choiceId: choice.id,
          choiceName: language === 'th' ? choice.nameTh : choice.nameEn,
          price: mod > 100 ? mod / 100 : mod,
        };
      });

    onAddToCart({
      itemId: item.id,
      name: language === 'th' ? item.nameTh : item.nameEn,
      price: basePrice,
      quantity,
      selectedOptions: formattedOptions,
      specialInstructions,
      imageUrl: item.imageUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-[#f3eee2]">
        
        {/* Item Photo Header */}
        {item.imageUrl && (
          <div className="h-56 w-full bg-[#f7f2ea] relative overflow-hidden">
            <img src={item.imageUrl} alt={item.nameEn} className="w-full h-full object-cover" />
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-700 hover:bg-white shadow-md font-bold"
            >
              ✕
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!item.imageUrl && (
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-black text-[#3e2723]">
                {language === 'th' ? item.nameTh : item.nameEn}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                ✕
              </button>
            </div>
          )}

          <div>
            <h3 className="text-2xl font-black text-[#3e2723]">
              {language === 'th' ? item.nameTh : item.nameEn}
            </h3>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
              {language === 'th' ? item.descriptionTh : item.descriptionEn}
            </p>
            <p className="text-amber-800 font-black text-xl mt-2">฿{basePrice.toFixed(0)}</p>
          </div>

          {/* Visible Labelled Option Pills */}
          {item.optionGroups?.map((group: any) => {
            const groupName = language === 'th' ? group.nameTh : group.nameEn;
            return (
              <div key={group.id} className="border-t border-[#f3eee2] pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-[#3e2723] text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d97706]"></span>
                    {groupName}
                  </h4>
                  {group.isRequired && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">จำเป็น</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {group.choices.map((choice: any) => {
                    const isSelected = selectedOptions[group.id]?.id === choice.id;
                    const isChoiceAvailable = choice.isAvailable ?? true;
                    const choiceName = language === 'th' ? choice.nameTh : choice.nameEn;
                    const mod = choice.priceModifier ?? choice.priceDelta ?? 0;
                    const cleanMod = mod > 100 ? mod / 100 : mod;

                    return (
                      <button
                        key={choice.id}
                        type="button"
                        disabled={!isChoiceAvailable}
                        onClick={() => handleOptionSelect(group, choice)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          !isChoiceAvailable
                            ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200'
                            : isSelected
                            ? 'border-[#3e2723] bg-[#3e2723] text-white font-bold shadow-md'
                            : 'border-[#e6dcce] bg-[#f7f2ea]/50 hover:bg-[#f7f2ea] text-[#5c3a31]'
                        }`}
                      >
                        <span className="text-xs font-bold line-clamp-1">{choiceName}</span>
                        <span className={`text-[11px] mt-1 ${isSelected ? 'text-amber-300 font-bold' : 'text-gray-500'}`}>
                          {cleanMod > 0 ? `+฿${cleanMod}` : '+฿0'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="border-t border-[#f3eee2] pt-4">
            <label className="block text-xs font-bold text-gray-700 mb-1">หมายเหตุเพิ่มเติม (Special Instructions)</label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="เช่น หวานน้อย, เพิ่มช็อตเอสเพรสโซ่"
              className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3e2723]"
            />
          </div>

          {/* Quantity Control & Action Button */}
          <div className="border-t border-[#f3eee2] pt-6 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 bg-[#f7f2ea] px-3 py-1.5 rounded-2xl border border-[#e6dcce]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white border border-[#e6dcce] flex items-center justify-center font-black text-[#3e2723] hover:bg-gray-100 shadow-xs"
              >
                -
              </button>
              <span className="font-black text-lg text-[#3e2723] w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white border border-[#e6dcce] flex items-center justify-center font-black text-[#3e2723] hover:bg-gray-100 shadow-xs"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!item.isAvailable}
              className="flex-1 bg-[#3e2723] text-white py-3.5 px-6 rounded-2xl font-black text-sm hover:bg-[#2c1810] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <span>เพิ่มลงในตะกร้า</span>
              <span>•</span>
              <span>฿{calculateTotalPrice().toFixed(0)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
