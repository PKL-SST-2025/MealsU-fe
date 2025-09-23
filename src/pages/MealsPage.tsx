import { createSignal, For } from 'solid-js';
import SidebarNavbar from '../components/SidebarNavbar'; // ✅ Import sidebar terpisah
import { Calendar, Users, Plus } from 'lucide-solid';
import AppNavbar from "../components/AppNavbar";

const MealsApp = () => {
  const [selectedDate, setSelectedDate] = createSignal(23); // Updated to today: September 23, 2025

  // Sample data
  const dates = [
    { date: 21, day: 'Sun' },
    { date: 22, day: 'Mon' },
    { date: 23, day: 'Tue' }, // Today, corrected to Tuesday
    { date: 24, day: 'Wed' },
    { date: 25, day: 'Thu' },
    { date: 26, day: 'Fri' },
    { date: 27, day: 'Sat' }
  ];

  const mealCards = [
    { 
      id: 1, 
      name: 'Black Coffee', 
      description: 'Grilled Chicken, Mashed potatoes & Sauteed Vegetables',
      prepTime: '30 min',
      servings: '4 servings',
      color: 'bg-purple-100'
    },
    { 
      id: 2, 
      name: 'Breakfast Bowl', 
      description: 'Greek yogurt, fresh berries, granola & honey drizzle',
      prepTime: '25 min',
      servings: '3 servings',
      color: 'bg-blue-100'
    },
    { 
      id: 3, 
      name: 'Avocado Toast', 
      description: 'Smashed avocado on sourdough with poached eggs',
      prepTime: '45 min',
      servings: '6 servings',
      color: 'bg-green-100'
    },
    { 
      id: 4, 
      name: 'Smoothie', 
      description: 'Banana, spinach, almond milk & protein powder',
      prepTime: '35 min',
      servings: '4 servings',
      color: 'bg-orange-100'
    },
    { 
      id: 5, 
      name: 'Pancakes', 
      description: 'Fluffy buttermilk pancakes with maple syrup',
      prepTime: '40 min',
      servings: '5 servings',
      color: 'bg-pink-100'
    },
    { 
      id: 6, 
      name: 'Omelette', 
      description: 'Three-egg omelette with cheese & vegetables',
      prepTime: '20 min',
      servings: '2 servings',
      color: 'bg-yellow-100'
    },
    { 
      id: 7, 
      name: 'Waffle', 
      description: 'Belgian waffles with fresh fruit & whipped cream',
      prepTime: '50 min',
      servings: '8 servings',
      color: 'bg-indigo-100'
    },
    { 
      id: 8, 
      name: 'Chia Pudding', 
      description: 'Chia seeds soaked in coconut milk with mango',
      prepTime: '30 min',
      servings: '4 servings',
      color: 'bg-teal-100'
    },
    { 
      id: 9, 
      name: 'Quinoa Bowl', 
      description: 'Quinoa with roasted vegetables & tahini dressing',
      prepTime: '35 min',
      servings: '6 servings',
      color: 'bg-red-100'
    }
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

  const MealCard = (props) => (
    <div class={`${props.meal.color} rounded-lg p-4 h-48 flex flex-col justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer border border-${props.meal.color.replace('bg-', '')}-200`}>
      <div class="flex justify-between items-start mb-2">
        <div class="flex space-x-2 text-xs text-gray-600">
          <span class="flex items-center gap-1">
            <Calendar size={12} />
            {props.meal.prepTime}
          </span>
          <span class="flex items-center gap-1">
            <Users size={12} />
            {props.meal.servings}
          </span>
        </div>
      </div>
      
      <div class="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
        <span class="text-2xl">🍳</span>
      </div>
      
      <div class="text-center">
        <h3 class="font-semibold text-gray-800 mb-1">{props.meal.name}</h3>
        <p class="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-2">{props.meal.description}</p>
        <button class="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors">
          See recipe
        </button>
      </div>
    </div>
  );

  const EmptyCard = () => (
    <div class="bg-white border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center hover:border-teal-400 transition-colors cursor-pointer group">
      <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-teal-600 transition-colors">
        <Plus class="text-white" size={24} />
      </div>
      <p class="text-gray-500 text-sm group-hover:text-teal-600 transition-colors">Add Recipe</p>
    </div>
  );

  return (
    <div class="flex min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <SidebarNavbar class="bg-olive-100" /> {/* Sesuaikan sidebar dengan hijau zaitun muda */}

      <div class="flex-1 flex flex-col">
        <AppNavbar onSearch={handleSearch} onQuickAction={handleQuickAction} pageContext="dashboard" showBreadcrumbs={false} />
      
        {/* Main Content */}
        <div class="flex-1 p-6"> {/* ✅ Padding di dalam container utama */}
          {/* Date Navigation */}
          <div class="flex space-x-4 mb-8 overflow-x-auto pb-2">
            <For each={dates}>
              {(date) => (
                <button 
                  class={`flex flex-col items-center p-3 rounded-lg transition-colors flex-shrink-0 ${
                    selectedDate() === date.date 
                      ? 'bg-teal-500 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => setSelectedDate(date.date)}
                >
                  <span class="text-2xl font-bold">{date.date}</span>
                  <span class="text-sm">{date.day}</span>
                </button>
              )}
            </For>
          </div>

          {/* Meal Cards Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <For each={mealCards}>
              {(meal) => <MealCard meal={meal} />}
            </For>
            <EmptyCard />
            <EmptyCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealsApp;