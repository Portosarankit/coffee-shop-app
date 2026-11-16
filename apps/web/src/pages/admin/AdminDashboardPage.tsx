import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'promotions' | 'inventory' | 'menu' | 'tables'>('status');
  const [storeConfig, setStoreConfig] = useState<any>(null);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTableQR, setSelectedTableQR] = useState<any>(null);
  const [newTableNo, setNewTableNo] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Promotion form state
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [discountType, setDiscountType] = useState('PERCENT');
  const [discountValue, setDiscountValue] = useState('10');
  const [isActivePromo, setIsActivePromo] = useState(true);

  // Inventory adjustment modal state
  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
  const [adjustType, setAdjustType] = useState('REFILL');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustNote, setAdjustNote] = useState('');

  // New Ingredient Modal
  const [showIngModal, setShowIngModal] = useState(false);
  const [ingName, setIngName] = useState('');
  const [ingUnit, setIngUnit] = useState('g');
  const [ingStock, setIngStock] = useState('');
  const [ingMinLevel, setIngMinLevel] = useState('');

  // New Menu Item Modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemImage, setItemImage] = useState('');

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [configRes, promoRes, invRes, menuRes, tablesRes] = await Promise.all([
        fetch('/api/admin/store/config', { signal: AbortSignal.timeout(3000) }),
        fetch('/api/admin/promotions', { signal: AbortSignal.timeout(3000) }),
        fetch('/api/admin/inventory', { signal: AbortSignal.timeout(3000) }),
        fetch('/api/admin/menu', { signal: AbortSignal.timeout(3000) }),
        fetch('/api/admin/tables', { signal: AbortSignal.timeout(3000) })
      ]);

      if (configRes.status === 401 || promoRes.status === 401 || invRes.status === 401 || menuRes.status === 401 || tablesRes.status === 401) {
        if (!localStorage.getItem('porto_admin_auth')) {
          navigate('/admin/login');
          return;
        }
      }

      const configData = configRes.ok ? await configRes.json() : { data: { name: 'Porto Coffee', status: 'OPEN', acceptOrders: true, announcement: '', scheduleText: '08:00 - 17:00' } };
      const promoData = promoRes.ok ? await promoRes.json() : { data: [{ id: 'p-1', title: 'WELCOME1', description: '10% off your first order', discountType: 'PERCENT', discountValue: 10, isActive: true }] };
      const invData = invRes.ok ? await invRes.json() : { data: [
        { id: 'i-1', name: 'Espresso Beans', unit: 'g', stockQty: 8500, minLevel: 1000 },
        { id: 'i-2', name: 'Fresh Milk', unit: 'ml', stockQty: 15000, minLevel: 2000 },
        { id: 'i-3', name: 'Matcha Powder', unit: 'g', stockQty: 1500, minLevel: 200 }
      ]};
      const menuData = menuRes.ok ? await menuRes.json() : { data: [] };
      const tablesData = tablesRes.ok ? await tablesRes.json() : { data: [{ id: 't-1', tableNo: '01', token: 'tok-1' }] };

      setStoreConfig(configData.data);
      setPromotions(promoData.data);
      setInventory(invData.data);
      setMenuCategories(menuData.data);
      setTables(tablesData.data);
      if (menuData.data?.length > 0 && !itemCategoryId) {
        setItemCategoryId(menuData.data[0].id);
      }
    } catch (err) {
      console.warn('Admin API unreachable. Using mock dashboard data for Vercel showcase.');
      setStoreConfig({ name: 'Porto Coffee', status: 'OPEN', acceptOrders: true, announcement: 'Welcome to Porto Coffee Vercel Demo!', scheduleText: '08:00 - 17:00' });
      setPromotions([{ id: 'p-1', title: 'WELCOME1', description: '10% off your first order', discountType: 'PERCENT', discountValue: 10, isActive: true }]);
      setInventory([
        { id: 'i-1', name: 'Espresso Beans', unit: 'g', stockQty: 8500, minLevel: 1000 },
        { id: 'i-2', name: 'Fresh Milk', unit: 'ml', stockQty: 15000, minLevel: 2000 },
        { id: 'i-3', name: 'Matcha Powder', unit: 'g', stockQty: 1500, minLevel: 200 }
      ]);
      setMenuCategories([]);
      setTables([{ id: 't-1', tableNo: '01', token: 'tok-1' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleUpdateStoreConfig = async (updates: any) => {
    try {
      const res = await fetch('/api/admin/store/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...storeConfig, ...updates }),
      });
      const data = await res.json();
      if (res.ok) {
        setStoreConfig(data.data);
        setMessage('Store settings updated successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: promoTitle,
          description: promoDesc,
          discountType,
          discountValue: parseFloat(discountValue),
          isActive: isActivePromo,
        }),
      });
      if (res.ok) {
        setShowPromoModal(false);
        setPromoTitle('');
        setPromoDesc('');
        fetchData();
        setMessage('Promotion created successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        setMessage('Promotion deleted');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredient) return;
    try {
      const multiplier = adjustType === 'WASTE' || adjustType === 'ADJUSTMENT' && parseFloat(adjustQty) < 0 ? -1 : 1; // Depending on input
      // Let's allow positive/negative directly or handle based on type
      let qty = parseFloat(adjustQty);
      if (adjustType === 'WASTE' && qty > 0) qty = -qty;

      const res = await fetch(`/api/admin/inventory/${selectedIngredient.id}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: adjustType, quantity: qty, note: adjustNote }),
      });
      if (res.ok) {
        setSelectedIngredient(null);
        setAdjustQty('');
        setAdjustNote('');
        fetchData();
        setMessage('Stock adjusted successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ingName,
          unit: ingUnit,
          stockQty: ingStock ? parseFloat(ingStock) : 0,
          minLevel: ingMinLevel ? parseFloat(ingMinLevel) : 0,
        }),
      });
      if (res.ok) {
        setShowIngModal(false);
        setIngName('');
        setIngStock('');
        setIngMinLevel('');
        fetchData();
        setMessage('Ingredient created successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSoldOut = async (itemId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/menu/items/${itemId}/sold-out`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualSoldOut: !currentStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/menu/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: itemCategoryId,
          name: itemName,
          description: itemDesc,
          basePrice: Math.round(parseFloat(itemPrice) * 100), // convert to satang
          imageUrl: itemImage || null,
        }),
      });
      if (res.ok) {
        setShowItemModal(false);
        setItemName('');
        setItemDesc('');
        setItemPrice('');
        setItemImage('');
        fetchData();
        setMessage('Menu item created successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('porto_admin_auth');
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
          <p className="text-sm text-gray-500">Manage store operating hours, inventory levels, recipes, and menu items</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('status')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 whitespace-nowrap transition ${
            activeTab === 'status' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Store Status & Hours
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 whitespace-nowrap transition ${
            activeTab === 'inventory' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Inventory & Stock
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 whitespace-nowrap transition ${
            activeTab === 'menu' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Menu & Sold-out Manager
        </button>
        <button
          onClick={() => setActiveTab('promotions')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 whitespace-nowrap transition ${
            activeTab === 'promotions' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Promotions & Banners
        </button>
      </div>

      {activeTab === 'status' && storeConfig && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Store Status Control</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleUpdateStoreConfig({ status: 'OPEN' })}
                className={`p-4 rounded-xl border font-semibold text-left transition ${
                  storeConfig.status === 'OPEN'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">🟢 OPEN</div>
                <div className="text-xs font-normal text-gray-500">Store is fully operational and accepting orders.</div>
              </button>

              <button
                onClick={() => handleUpdateStoreConfig({ status: 'CLOSED' })}
                className={`p-4 rounded-xl border font-semibold text-left transition ${
                  storeConfig.status === 'CLOSED'
                    ? 'bg-red-50 border-red-500 text-red-800'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">🔴 CLOSED</div>
                <div className="text-xs font-normal text-gray-500">Store is closed for the day.</div>
              </button>

              <button
                onClick={() => handleUpdateStoreConfig({ status: 'HOLIDAY' })}
                className={`p-4 rounded-xl border font-semibold text-left transition ${
                  storeConfig.status === 'HOLIDAY'
                    ? 'bg-amber-50 border-amber-500 text-amber-800'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">🏖️ HOLIDAY</div>
                <div className="text-xs font-normal text-gray-500">Store is on holiday leave.</div>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Accept Orders Override</h3>
                <p className="text-sm text-gray-500">Temporarily pause incoming orders without changing open status.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={storeConfig.acceptOrders}
                  onChange={(e) => handleUpdateStoreConfig({ acceptOrders: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-700"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Announcement Banner</label>
                <input
                  type="text"
                  value={storeConfig.announcement || ''}
                  onChange={(e) => setStoreConfig({ ...storeConfig, announcement: e.target.value })}
                  onBlur={() => handleUpdateStoreConfig({ announcement: storeConfig.announcement })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Schedule Text / Hours</label>
                <input
                  type="text"
                  value={storeConfig.scheduleText || ''}
                  onChange={(e) => setStoreConfig({ ...storeConfig, scheduleText: e.target.value })}
                  onBlur={() => handleUpdateStoreConfig({ scheduleText: storeConfig.scheduleText })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Inventory & Stock Levels</h2>
            <button
              onClick={() => setShowIngModal(true)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-semibold shadow transition"
            >
              + Add Ingredient
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                  <th className="p-4">Ingredient</th>
                  <th className="p-4">Stock Qty</th>
                  <th className="p-4">Min Level</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {inventory.map((ing) => {
                  const isLow = ing.stockQty <= ing.minLevel;
                  return (
                    <tr key={ing.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-semibold text-gray-900">{ing.name}</td>
                      <td className="p-4 font-bold text-gray-800">{ing.stockQty} {ing.unit}</td>
                      <td className="p-4 text-gray-500">{ing.minLevel} {ing.unit}</td>
                      <td className="p-4">
                        {isLow ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedIngredient(ing)}
                          className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold transition"
                        >
                          Adjust Stock / Refill
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Adjust Stock Modal */}
          {selectedIngredient && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Adjust Stock: {selectedIngredient.name}</h3>
                <p className="text-xs text-gray-500 mb-4">Current Stock: {selectedIngredient.stockQty} {selectedIngredient.unit}</p>
                <form onSubmit={handleAdjustStock} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Action Type</label>
                    <select
                      value={adjustType}
                      onChange={(e) => setAdjustType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="REFILL">Refill / Restock (+)</option>
                      <option value="ADJUSTMENT">Manual Count Adjustment (+ / -)</option>
                      <option value="WASTE">Waste / Spillage (-)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Quantity ({selectedIngredient.unit})</label>
                    <input
                      type="number"
                      step="any"
                      value={adjustQty}
                      onChange={(e) => setAdjustQty(e.target.value)}
                      placeholder="e.g. 1000 or -50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Note / Reason</label>
                    <input
                      type="text"
                      value={adjustNote}
                      onChange={(e) => setAdjustNote(e.target.value)}
                      placeholder="e.g. Weekly delivery from supplier"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedIngredient(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold shadow"
                    >
                      Save Adjustment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* New Ingredient Modal */}
          {showIngModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Ingredient</h3>
                <form onSubmit={handleCreateIngredient} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Name</label>
                    <input
                      type="text"
                      value={ingName}
                      onChange={(e) => setIngName(e.target.value)}
                      placeholder="e.g. Oat Milk"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Unit</label>
                      <select
                        value={ingUnit}
                        onChange={(e) => setIngUnit(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="g">g (Grams)</option>
                        <option value="ml">ml (Milliliters)</option>
                        <option value="pcs">pcs (Pieces)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Min Level</label>
                      <input
                        type="number"
                        step="any"
                        value={ingMinLevel}
                        onChange={(e) => setIngMinLevel(e.target.value)}
                        placeholder="e.g. 500"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Initial Stock Qty</label>
                    <input
                      type="number"
                      step="any"
                      value={ingStock}
                      onChange={(e) => setIngStock(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowIngModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold shadow"
                    >
                      Create Ingredient
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Menu & Sold-Out Manager</h2>
            <button
              onClick={() => setShowItemModal(true)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-semibold shadow transition"
            >
              + Add Menu Item
            </button>
          </div>

          <div className="space-y-8">
            {menuCategories.map((cat) => (
              <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-md font-bold text-amber-900 mb-4 pb-2 border-b">{cat.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50/50">
                      <div className="flex items-center space-x-4">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                        )}
                        <div>
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-500">฿{(item.basePrice / 100).toFixed(2)}</p>
                          <div className="text-xs text-amber-700 mt-1">
                            Recipe ingredients: {item.recipes?.length || 0} mapped
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleToggleSoldOut(item.id, item.manualSoldOut)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            item.manualSoldOut
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          {item.manualSoldOut ? 'Manual Sold Out' : 'Available'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* New Menu Item Modal */}
          {showItemModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Menu Item</h3>
                <form onSubmit={handleCreateMenuItem} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Category</label>
                    <select
                      value={itemCategoryId}
                      onChange={(e) => setItemCategoryId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      {menuCategories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Item Name</label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g. Caramel Macchiato"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Description</label>
                    <textarea
                      value={itemDesc}
                      onChange={(e) => setItemDesc(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Base Price (THB)</label>
                      <input
                        type="number"
                        step="any"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        placeholder="e.g. 95"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Image URL</label>
                      <input
                        type="text"
                        value={itemImage}
                        onChange={(e) => setItemImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowItemModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold shadow"
                    >
                      Create Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'promotions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Promotions & Banners</h2>
            <button
              onClick={() => setShowPromoModal(true)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-semibold shadow transition"
            >
              + Add Promotion
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{promo.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{promo.description || 'No description'}</p>
                  <div className="text-xs font-medium text-amber-700 bg-amber-50 inline-block px-2.5 py-1 rounded-md mb-4">
                    Discount: {promo.discountValue} {promo.discountType === 'PERCENT' ? '%' : 'THB'}
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDeletePromotion(promo.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showPromoModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Create Promotion</h3>
                <form onSubmit={handleCreatePromotion} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      value={promoTitle}
                      onChange={(e) => setPromoTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Description</label>
                    <textarea
                      value={promoDesc}
                      onChange={(e) => setPromoDesc(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Type</label>
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="PERCENT">Percent (%)</option>
                        <option value="FIXED">Fixed (THB)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Value</label>
                      <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPromoModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold shadow"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
