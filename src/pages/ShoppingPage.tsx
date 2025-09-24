import { createMemo, createSignal, For, Show } from 'solid-js';
import SidebarNavbar from '../components/SidebarNavbar'; // ✅ Import sidebar terpisah
import { ShoppingCart, Check, X, Plus } from 'lucide-solid'; // Menambahkan Plus
import AppNavbar from "../components/AppNavbar";

const ShoppingList = () => {
  // Plans and selections
  const [plans] = createSignal<any[]>(JSON.parse(localStorage.getItem('mealPlans') || '[]'));
  const [selectedPlanId, setSelectedPlanId] = createSignal<string | number>(localStorage.getItem('lastSelectedPlanId') || (JSON.parse(localStorage.getItem('mealPlans') || '[]')[0]?.id ?? ''));
  const planDays = createMemo(() => {
    const id = selectedPlanId();
    if (!id) return [] as any[];
    const raw = localStorage.getItem(`plan:${id}:items`);
    try { return JSON.parse(raw || '[]'); } catch { return []; }
  });
  // Map of selected meals (key: dayIndex-itemIndex => boolean)
  const [selectedMeals, setSelectedMeals] = createSignal<Record<string, boolean>>({});
  const toggleMeal = (k: string) => setSelectedMeals(s => ({ ...s, [k]: !s[k] }));

  // Helper to extract ingredients from a plan item
  const extractIngredients = (it: any): string[] => {
    if (Array.isArray(it.ingredients) && it.ingredients.length) return it.ingredients;
    if (typeof it.notes === 'string' && it.notes.trim()) {
      // Parse by comma or newline, strip bullets
      return it.notes
        .split(/\n|,/)
        .map(t => t.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean);
    }
    return [];
  };

  // Aggregated shopping items from selected meals
  const aggregated = createMemo(() => {
    const agg = new Map<string, { name: string; count: number }>();
    planDays().forEach((d, di) => {
      (d.items || []).forEach((it: any, ii: number) => {
        const key = `${di}-${ii}`;
        if (!selectedMeals()[key]) return;
        extractIngredients(it).forEach((ing) => {
          const norm = ing.toLowerCase();
          const cur = agg.get(norm) || { name: ing, count: 0 };
          cur.count += 1;
          agg.set(norm, cur);
        });
      });
    });
    return Array.from(agg.values()).sort((a,b) => a.name.localeCompare(b.name));
  });

  // Manual Shopping list state (allows extra items)
  const [items, setItems] = createSignal<any[]>([]);

  // Add item state
  const [newItem, setNewItem] = createSignal({ name: '', quantity: '', category: '' });
  const [showAddForm, setShowAddForm] = createSignal(false);

  // Toggle item checked state
  const toggleItem = (id) => {
    setItems(items().map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Add new item
  const addItem = () => {
    if (newItem().name && newItem().quantity) {
      setItems([...items(), { 
        id: Date.now(), 
        name: newItem().name, 
        quantity: newItem().quantity, 
        category: newItem().category || 'Other', 
        checked: false 
      }]);
      setNewItem({ name: '', quantity: '', category: '' });
      setShowAddForm(false);
    }
  };

  // Remove item
  const removeItem = (id) => {
    setItems(items().filter(item => item.id !== id));
  };

  // Handle search from AppNavbar
  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Tambahkan logika pencarian jika diperlukan
  };

  // Handle quick actions from AppNavbar
  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
    // Tambahkan logika aksi cepat jika diperlukan
  };

  return (
    <div class="flex h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      {/* Sidebar terpisah */}
      <SidebarNavbar class="bg-olive-100" /> {/* Sesuaikan sidebar dengan hijau zaitun muda */}

      {/* Main Content */}
      <div class="flex-1 flex flex-col">
        <AppNavbar 
          onSearch={handleSearch} 
          onQuickAction={handleQuickAction} 
          pageContext="shopping" 
          showBreadcrumbs={false} 
        />
        
        <div class="flex-1 p-6 overflow-y-auto"> 
          <div class="max-w-6xl">
            {/* Shopping List Header */}
            <div class="flex items-center gap-4 mb-4">
              <ShoppingCart class="text-teal-500" size={28} />
              <div>
                <h1 class="text-2xl font-bold text-gray-800">Shopping List</h1>
                <p class="text-gray-600">Pilih plan dan menu yang ingin dibelanjakan bahan-bahannya</p>
              </div>
            </div>

            {/* Plan Picker */}
            <div class="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <span class="text-sm text-gray-600">Plan</span>
              <select
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={String(selectedPlanId() || '')}
                onInput={(e) => setSelectedPlanId((e.target as HTMLSelectElement).value)}
              >
                <For each={plans()}>
                  {(p: any) => <option value={String(p.id)}>{p.name}</option>}
                </For>
              </select>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: select meals from plan */}
              <div class="lg:col-span-7 space-y-4">
                <div class="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 class="font-semibold text-gray-800 mb-3">Pilih Menu</h3>
                  <Show when={planDays().length > 0} fallback={<p class="text-sm text-gray-500">Belum ada plan. Buat plan dulu di Planner.</p>}>
                    <div class="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                      <For each={planDays()}>
                        {(d, di) => (
                          <div class="rounded-lg border border-gray-200">
                            <div class="px-3 py-2 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">{new Date(d.date).toLocaleDateString(undefined,{weekday:'long', day:'2-digit', month:'long'})}</div>
                            <div class="divide-y divide-gray-100">
                              <For each={d.items || []}>
                                {(it, ii) => {
                                  const key = `${di()}-${ii()}`;
                                  return (
                                    <label class="flex items-start gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50">
                                      <input type="checkbox" checked={!!selectedMeals()[key]} onInput={() => toggleMeal(key)} />
                                      <div class="min-w-0">
                                        <div class="font-medium text-gray-800">{it.title}</div>
                                        <div class="text-xs text-gray-500">{it.type || 'Meal'} • {extractIngredients(it).length} bahan</div>
                                      </div>
                                    </label>
                                  );
                                }}
                              </For>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>

                {/* Manual add */}
                <div class="bg-white rounded-xl border border-gray-200 p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-800">Tambah Item Manual</h3>
                    <button
                      onClick={() => setShowAddForm(true)}
                      class="bg-teal-500 text-white px-3 py-2 rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Item
                    </button>
                  </div>
                  <Show when={showAddForm()}>
                    <div class="bg-white rounded-xl border border-gray-200 p-3 mb-3">
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input class="px-3 py-2 border border-gray-300 rounded-lg" placeholder="Item" value={newItem().name} onInput={(e) => setNewItem({ ...newItem(), name: (e.target as HTMLInputElement).value })} />
                        <input class="px-3 py-2 border border-gray-300 rounded-lg" placeholder="Quantity" value={newItem().quantity} onInput={(e) => setNewItem({ ...newItem(), quantity: (e.target as HTMLInputElement).value })} />
                        <input class="px-3 py-2 border border-gray-300 rounded-lg" placeholder="Category" value={newItem().category} onInput={(e) => setNewItem({ ...newItem(), category: (e.target as HTMLInputElement).value })} />
                      </div>
                      <div class="mt-3 flex justify-end gap-2">
                        <button class="px-3 py-2 text-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
                        <button class="px-3 py-2 bg-teal-500 text-white rounded-lg text-sm" onClick={addItem}>Save</button>
                      </div>
                    </div>
                  </Show>

                  <div class="bg-white rounded-xl border border-gray-200">
                    <For each={items()}>
                      {(item) => (
                        <div class={`flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 ${item.checked ? 'bg-teal-50' : ''}`}>
                          <div class="flex items-center gap-3">
                            <button onClick={() => setItems(items().map(i=>i.id===item.id?{...i,checked:!i.checked}:i))} class={`p-1 rounded-full ${item.checked ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                              {item.checked ? <Check size={14} /> : <div class="w-3.5 h-3.5 rounded-full border-2 border-gray-400" />}
                            </button>
                            <div>
                              <div class="font-medium text-gray-800">{item.name}</div>
                              <div class="text-xs text-gray-500">{item.quantity} • {item.category}</div>
                            </div>
                          </div>
                          <button onClick={() => setItems(items().filter(i=>i.id!==item.id))} class="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100"><X size={14} /></button>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </div>

              {/* Right: aggregated list */}
              <div class="lg:col-span-5">
                <div class="bg-white rounded-xl border border-gray-200 p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-800">Daftar Belanja (Auto)</h3>
                    <span class="text-xs text-gray-500">{aggregated().length} item</span>
                  </div>
                  <Show when={aggregated().length > 0} fallback={<p class="text-sm text-gray-500">Centang beberapa menu di sebelah kiri untuk membuat daftar belanja otomatis dari bahan-bahan.</p>}>
                    <div class="divide-y divide-gray-100">
                      <For each={aggregated()}>
                        {(ing) => (
                          <div class="flex items-center justify-between py-2">
                            <span class="text-sm text-gray-800">{ing.name}</span>
                            <span class="text-xs text-gray-500">x{ing.count}</span>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;