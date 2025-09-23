import { createSignal, For, Show } from 'solid-js';
import SidebarNavbar from '../components/SidebarNavbar'; // ✅ Import sidebar terpisah
import { ShoppingCart, Utensils, Scale, Check, X, Plus } from 'lucide-solid'; // Menambahkan Plus
import AppNavbar from "../components/AppNavbar";

const ShoppingList = () => {
  // Shopping list state
  const [items, setItems] = createSignal([
    { id: 1, name: 'Chicken breasts', quantity: '4 lbs', category: 'Protein', checked: false },
    { id: 2, name: 'Olive oil', quantity: '500 ml', category: 'Oils', checked: false },
    { id: 3, name: 'Yukon gold potatoes', quantity: '2 kg', category: 'Vegetables', checked: false },
    { id: 4, name: 'Heavy cream', quantity: '1 cup', category: 'Dairy', checked: false },
    { id: 5, name: 'Paprika', quantity: '50 g', category: 'Spices', checked: false },
  ]);

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
    <div class="flex min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      {/* ✅ Sidebar terpisah */}
      <SidebarNavbar class="bg-olive-100" /> {/* Sesuaikan sidebar dengan hijau zaitun muda */}

      {/* Main Content */}
      <div class="flex-1 flex flex-col">
        <AppNavbar 
          onSearch={handleSearch} 
          onQuickAction={handleQuickAction} 
          pageContext="shopping" 
          showBreadcrumbs={false} 
        />
        
        <div class="flex-1 p-6 overflow-y-auto"> {/* ✅ Flex-1 untuk mengisi sisa space */}
          <div class="max-w-4xl">
            {/* Shopping List Header */}
            <div class="flex items-center gap-4 mb-8">
              <ShoppingCart class="text-teal-500" size={32} />
              <div>
                <h1 class="text-3xl font-bold text-gray-800">Shopping List</h1>
                <p class="text-gray-600">Manage your ingredients for meal planning</p>
              </div>
            </div>

            {/* Add Item Button */}
            <div class="mb-6">
              <button
                onClick={() => setShowAddForm(true)}
                class="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {/* Add Item Form */}
            <Show when={showAddForm()}>
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                    <input
                      type="text"
                      value={newItem().name}
                      onInput={(e) => setNewItem({ ...newItem(), name: e.target.value })}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="e.g., Chicken breasts"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="text"
                      value={newItem().quantity}
                      onInput={(e) => setNewItem({ ...newItem(), quantity: e.target.value })}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="e.g., 4 lbs"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newItem().category}
                      onInput={(e) => setNewItem({ ...newItem(), category: e.target.value })}
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="Protein">Protein</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Oils">Oils</option>
                      <option value="Spices">Spices</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div class="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addItem}
                    class="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </Show>

            {/* Shopping List Items */}
            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
              <For each={items()}>
                {(item) => (
                  <div class={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${item.checked ? 'bg-teal-50' : ''}`}>
                    <div class="flex items-center space-x-3">
                      <button
                        onClick={() => toggleItem(item.id)}
                        class={`p-1 rounded-full ${item.checked ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'} hover:bg-teal-500 transition-colors`}
                      >
                        {item.checked ? <Check size={16} /> : <div class="w-4 h-4 rounded-full border-2 border-gray-400" />}
                      </button>
                      <div class="min-w-0 flex-1">
                        <h3 class={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {item.name}
                        </h3>
                        <p class={`text-sm ${item.checked ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.quantity} - {item.category}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      class="p-1 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;