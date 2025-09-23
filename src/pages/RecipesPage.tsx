import { createSignal, For } from 'solid-js';
import SidebarNavbar from '../components/SidebarNavbar'; // ✅ Import sidebar terpisah
import { Bell, Share2, Edit, Clock, Users, Flame, Play, ShoppingCart } from 'lucide-solid';
import AppNavbar from "../components/AppNavbar";

const RecipeDetail = () => {
  const [checkedIngredients, setCheckedIngredients] = createSignal(new Set());
  
  const ingredients = [
    { id: 1, name: 'Chicken breasts', amount: '4 boneless', category: 'Grilled chicken' },
    { id: 2, name: 'Olive oil', amount: '2 tablespoons', category: 'Grilled chicken' },
    { id: 3, name: 'Minced garlic', amount: '3 cloves', category: 'Grilled chicken' },
    { id: 4, name: 'Paprika', amount: '1 teaspoon', category: 'Grilled chicken' },
    { id: 5, name: 'Cumin powder', amount: '1 teaspoon', category: 'Grilled chicken' },
    { id: 6, name: 'Dried thyme', amount: '1 teaspoon', category: 'Grilled chicken' },
    { id: 7, name: 'Salt and pepper', amount: 'to taste', category: 'Grilled chicken' },
    { id: 8, name: 'Fresh lemon wedges', amount: 'for serving', category: 'Grilled chicken' },
    { id: 9, name: 'Chopped fresh parsley', amount: 'for garnish', category: 'Grilled chicken' },
    { id: 10, name: 'Yukon gold potatoes', amount: '2 pounds', category: 'Mashed potato' },
    { id: 11, name: 'Unsalted butter', amount: '4 tablespoons', category: 'Mashed potato' },
    { id: 12, name: 'Heavy cream', amount: '½ cup', category: 'Mashed potato' },
    { id: 13, name: 'Whole milk', amount: '¼ cup', category: 'Mashed potato' },
    { id: 14, name: 'Garlic powder', amount: '½ teaspoon', category: 'Mashed potato' },
    { id: 15, name: 'Salt', amount: '1 teaspoon', category: 'Mashed potato' },
    { id: 16, name: 'Black pepper', amount: '¼ teaspoon', category: 'Mashed potato' },
    { id: 17, name: 'Chopped chives', amount: '2 tablespoons', category: 'Mashed potato' }
  ];

  const toggleIngredient = (id) => {
    const newChecked = new Set(checkedIngredients());
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedIngredients(newChecked);
  };

  const tags = ['Chicken', 'Potato', 'Dinner', 'Easy', 'Healthy'];

  const steps = [
    { step: 1, title: 'Prepare the chicken', description: 'Pat the chicken breasts dry with paper towels. In a small bowl, combine olive oil, minced garlic, paprika, cumin, thyme, salt, and pepper. Rub the marinade all over the chicken breasts and let them sit at room temperature for 15-20 minutes.' },
    { step: 2, title: 'Cook the chicken', description: 'Preheat your grill to medium-high heat (about 400°F). Place the chicken on the grill and cook for 6-7 minutes per side, or until the internal temperature reaches 165°F. Let the chicken rest for 5 minutes before serving.' },
    { step: 3, title: 'Make the potatoes', description: 'While the chicken is marinating, place the potatoes in a large pot and cover with cold water. Add a pinch of salt and bring to a boil. Cook for 15-20 minutes until fork-tender.' },
    { step: 4, title: 'Mash the potatoes', description: 'Drain the potatoes and return them to the pot. Add butter, heavy cream, milk, garlic powder, salt, and pepper. Mash until smooth and creamy. Adjust seasoning to taste.' },
    { step: 5, title: 'Serve', description: 'Plate the grilled chicken alongside a generous portion of mashed potatoes. Garnish with fresh parsley and serve with lemon wedges on the side.' }
  ];

  const nutrition = [
    { label: 'Calories', value: '290', unit: 'kcal' },
    { label: 'Protein', value: '28', unit: 'g' },
    { label: 'Carbs', value: '22', unit: 'g' },
    { label: 'Fat', value: '12', unit: 'g' },
    { label: 'Fiber', value: '3', unit: 'g' },
    { label: 'Sugar', value: '1', unit: 'g' }
  ];

  // Handle search from AppNavbar
  const handleSearch = (query) => {
    console.log('Searching for:', query);
    alert(`Searching for: ${query}`);
  };

  // Handle quick actions from AppNavbar
  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
    switch (action) {
      case 'quick-add':
        alert('Add new recipe');
        break;
      case 'today-plan':
        alert('Show today\'s plan');
        break;
      case 'analytics':
        alert('View analytics');
        break;
      case 'favorites':
        alert('View favorites');
        break;
      default:
        alert(`Unknown action: ${action}`);
    }
  };

  return (
    <div class="flex h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-50">

      {/* Sidebar terpisah */}
      <SidebarNavbar class="bg-olive-100" /> {/* Sesuaikan sidebar dengan hijau zaitun muda */}

      {/* Main Content */}
      <div class="flex-1 flex flex-col">
        <AppNavbar onSearch={handleSearch} onQuickAction={handleQuickAction} pageContext="dashboard" showBreadcrumbs={false} />
        
        <div class="p-6 flex-1 overflow-y-auto"> {/* Padding di dalam container utama */}

          {/* Recipe Header Card */}
          <div class="bg-white rounded-xl p-6 mb-6 shadow-sm border border-teal-100">
            <div class="flex gap-6">
              {/* Recipe Image */}
              <div class="w-48 h-32 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                <span class="text-4xl">🍗🥔</span>
              </div>
              
              {/* Recipe Info */}
              <div class="flex-1">
                <div class="flex justify-between items-start mb-4">
                  <div class="max-w-2xl">
                    <h1 class="text-3xl font-bold text-gray-800 mb-3">Grilled Chicken & Creamy Mashed Potatoes</h1>
                    <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      Indulge in a culinary delight with our perfectly grilled chicken, a masterpiece of tenderness and smoky flavors. 
                      Paired with creamy mashed potatoes, this dish elevates your dining experience. The succulent chicken, marinated 
                      to perfection, complements the rich and velvety texture of the mashed potatoes for a harmonious symphony of taste and texture.
                    </p>
                  </div>
                  <div class="flex flex-col space-y-2">
                    <button class="text-teal-600 hover:text-teal-700 p-2 hover:bg-teal-50 rounded-lg">
                      <Share2 size={20} />
                    </button>
                    <button class="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-teal-600 transition-colors">
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
                
                {/* Recipe Stats */}
                <div class="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                  <span class="flex items-center gap-2">
                    <Clock size={16} class="text-teal-500" />
                    <span>45 minutes</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <Users size={16} class="text-teal-500" />
                    <span>6 servings</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <Flame size={16} class="text-orange-500" />
                    <span>290 calories</span>
                  </span>
                </div>
                
                {/* Tags */}
                <div class="flex flex-wrap gap-2">
                  <For each={tags}>
                    {(tag) => (
                      <span class="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            {/* Ingredients Section */}
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 class="text-lg font-semibold text-gray-800">Ingredients</h2>
                  <button class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
                    <ShoppingCart size={16} />
                    <span>Shop</span>
                  </button>
                </div>
                
                <div class="p-4">
                  {/* Category Tabs */}
                  <div class="mb-4">
                    <div class="flex space-x-4 text-sm border-b border-gray-200">
                      <button class="text-teal-600 border-b-2 border-teal-600 pb-2 font-medium">
                        Grilled chicken (9)
                      </button>
                      <button class="text-gray-500 hover:text-gray-700 pb-2 transition-colors">
                        Mashed potato (8)
                      </button>
                    </div>
                  </div>

                  {/* Ingredients List */}
                  <div class="space-y-3 max-h-96 overflow-y-auto">
                    <For each={ingredients}>
                      {(ingredient) => (
                        <div class={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                          checkedIngredients().has(ingredient.id) 
                            ? 'bg-teal-50 border border-teal-200' 
                            : 'hover:bg-gray-50'
                        }`}>
                          <input
                            type="checkbox"
                            id={`ingredient-${ingredient.id}`}
                            checked={checkedIngredients().has(ingredient.id)}
                            onChange={() => toggleIngredient(ingredient.id)}
                            class="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                          />
                          <label 
                            for={`ingredient-${ingredient.id}`}
                            class={`flex-1 text-sm cursor-pointer select-none ${
                              checkedIngredients().has(ingredient.id) 
                                ? 'line-through text-gray-400' 
                                : 'text-gray-700'
                            }`}
                          >
                            <span class="font-medium">{ingredient.name}</span>
                          </label>
                          <span class="text-xs text-gray-500 min-w-0 flex-shrink-0">
                            {ingredient.amount}
                          </span>
                        </div>
                      )}
                    </For>
                  </div>
                  
                  {/* Progress */}
                  <div class="mt-4 pt-4 border-t border-gray-100">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round((checkedIngredients().size / ingredients.length) * 100)}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(checkedIngredients().size / ingredients.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 class="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <div class="space-y-2">
                  <button class="w-full flex items-center justify-center gap-2 text-sm text-teal-600 hover:bg-teal-50 p-2 rounded-lg transition-colors">
                    <Play size={14} />
                    Watch Video
                  </button>
                  <button class="w-full flex items-center justify-center gap-2 text-sm text-teal-600 hover:bg-teal-50 p-2 rounded-lg transition-colors">
                    <Share2 size={14} />
                    Share Recipe
                  </button>
                  <button class="w-full flex items-center justify-center gap-2 text-sm text-teal-600 hover:bg-teal-50 p-2 rounded-lg transition-colors">
                    <Clock size={14} />
                    Add to Planner
                  </button>
                </div>
              </div>
            </div>

            {/* Recipe & Nutrition Section */}
            <div class="lg:col-span-2 space-y-6">
              {/* Recipe Instructions */}
              <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 class="text-lg font-semibold text-gray-800">Instructions</h2>
                  <button class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
                    <Play size={16} />
                    <span>Video</span>
                  </button>
                </div>
                
                <div class="p-4">
                  <div class="space-y-4">
                    <For each={steps}>
                      {(step) => (
                        <div class="flex gap-4">
                          <div class="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <span class="text-teal-600 font-semibold text-sm">{step.step}</span>
                          </div>
                          <div class="flex-1">
                            <h3 class="font-semibold text-gray-800 mb-1">{step.title}</h3>
                            <p class="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </div>

              {/* Nutrition Information */}
              <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="p-4 border-b border-gray-200">
                  <h2 class="text-lg font-semibold text-gray-800">Nutrition Facts</h2>
                  <p class="text-sm text-gray-500 mt-1">Per serving</p>
                </div>
                
                <div class="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <For each={nutrition}>
                    {(item) => (
                      <div class="text-center">
                        <div class="text-2xl font-bold text-gray-800">{item.value}</div>
                        <div class="text-xs text-gray-500 uppercase tracking-wide">{item.label}</div>
                        <div class="text-xs text-gray-400">{item.unit}</div>
                      </div>
                    )}
                  </For>
                </div>
                
                <div class="p-4 pt-0">
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-teal-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 text-center">75% of daily values</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;