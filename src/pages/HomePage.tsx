import { Component, createSignal, For } from "solid-js";
import {
  Clock,
  ShoppingCart,
  Plus,
  TrendingUp,
  Heart,
  Calendar
} from "lucide-solid";
import SidebarNavbar from "../components/SidebarNavbar";
import AppNavbar from "../components/AppNavbar";

const MealDashboard: Component = () => {
  const [shoppingItems, setShoppingItems] = createSignal([
    { id: 1, name: "Eggs", checked: false, icon: "🥚", category: "Dairy" },
    { id: 2, name: "Chicken breast", checked: false, icon: "🍗", category: "Meat" },
    { id: 3, name: "Cheese", checked: false, icon: "🧀", category: "Dairy" },
    { id: 4, name: "Milk", checked: false, icon: "🥛", category: "Dairy" },
    { id: 5, name: "Chocolate", checked: false, icon: "🍫", category: "Pantry" },
    { id: 6, name: "Bread", checked: false, icon: "🍞", category: "Bakery" },
    { id: 7, name: "Potatoes", checked: false, icon: "🥔", category: "Produce" },
  ]);

  const [tasks, setTasks] = createSignal([
    { id: 1, item: "Prepare breakfast ingredients", calories: 250, ingredients: "Eggs, bread, butter", time: "15 min", status: "pending", priority: "high", checked: false },
    { id: 2, item: "Marinate chicken for lunch", calories: 350, ingredients: "Chicken, spices, oil", time: "30 min", status: "pending", priority: "medium", checked: false },
    { id: 3, item: "Prep vegetables for dinner", calories: 180, ingredients: "Broccoli, carrots, onions", time: "20 min", status: "pending", priority: "low", checked: false },
  ]);

  const toggleShoppingItem = (id: number) => {
    setShoppingItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const toggleTask = (id: number) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
  };

  const addShoppingItem = () => {
    const newItem = { id: Date.now(), name: "New Item", checked: false, icon: "➕", category: "Miscellaneous" };
    setShoppingItems((prev) => [...prev, newItem]);
  };

  const addTask = () => {
    const newTask = { id: Date.now(), item: "New task", calories: 200, ingredients: "Ingredients", time: "30 min", status: "pending", priority: "medium", checked: false };
    setTasks((prev) => [...prev, newTask]);
  };

  const mealData = [
    { type: "Breakfast", time: "6m ago", calories: "320 cal", image: "🍳", bgColor: "bg-pink-100", gradient: "from-pink-200 to-red-200", description: "Quick and nutritious morning start", recipes: 3 },
    { type: "Lunch", time: "5h ago", calories: "450 cal", image: "🥗", bgColor: "bg-blue-100", gradient: "from-blue-200 to-sky-200", description: "Balanced midday meal", recipes: 5 },
    { type: "Dinner", time: "4h ago", calories: "580 cal", image: "🍽️", bgColor: "bg-purple-100", gradient: "from-purple-200 to-indigo-200", description: "Hearty evening meal", recipes: 7 },
  ];

  const todayMeals = [
    { id: 1, name: "Bread & Jam, Coffee", time: "7:30 AM", calories: 280, avatars: ["👤", "👤", "👤"], likes: 31, comments: 1, type: "breakfast" },
    { id: 2, name: "Grilled Chicken, Salad", time: "12:30 PM", calories: 420, avatars: ["👤", "👤"], likes: 28, comments: 2, type: "lunch" },
    { id: 3, name: "Fruit tarts, Chocolate mousse", time: "7:00 PM", calories: 380, avatars: ["👤", "👤", "👤"], likes: 45, comments: 3, type: "dinner" },
  ];

  const handleSearch = (query) => {
    console.log('Dashboard search:', query);
  };

  const handleQuickAction = (action) => {
    console.log('Dashboard quick action:', action);
    switch (action) {
      case 'quick-add':
        addTask();
        break;
      case 'today-plan':
        console.log('Show today\'s plan');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div class="flex min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <SidebarNavbar class="bg-olive-100" /> {/* Sesuaikan sidebar dengan hijau zaitun muda */}

      <div class="flex-1 flex flex-col">
        <AppNavbar onSearch={handleSearch} onQuickAction={handleQuickAction} pageContext="dashboard" showBreadcrumbs={false} />

        <div class="flex-1 p-8">
          <div class="bg-gradient-to-r from-green-50 via-teal-50 to-yellow-200 rounded-2xl p-8 mb-8 relative overflow-hidden shadow-lg border border-green-100">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-500"></div>
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-sm font-medium text-green-700">Live Dashboard</span>
                </div>
                <h1 class="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                  Plan Your Meals,
                  <br />
                  <span class="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                    Stay Healthy
                  </span> with Meals U
                </h1>
                <p class="text-gray-600 mb-6 max-w-md leading-relaxed text-lg">
                  Easily organize your meals and track your nutrition. Create a
                  personalized meal plan to meet your health goals.
                </p>
                <div class="flex gap-4">
                  <button
                    onClick={() => handleQuickAction('quick-add')}
                    class="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-orange-600 flex items-center space-x-2"
                  >
                    <Plus class="w-5 h-5" />
                    <span>Add Meal Plan</span>
                  </button>
                  <button
                    onClick={() => handleQuickAction('analytics')}
                    class="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <TrendingUp class="w-5 h-5" />
                    <span>View Analytics</span>
                  </button>
                </div>
              </div>
              <div class="w-96 h-64 bg-gradient-to-br from-yellow-100 to-green-100 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl">
                <div class="relative z-10 text-8xl animate-bounce">🥗</div>
                <div class="absolute inset-0 bg-gradient-to-br from-yellow-300/30 to-green-300/30 rounded-2xl"></div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div class="lg:col-span-4 space-y-6">
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <span class="text-xs text-gray-500 bg-teal-100 px-3 py-1 rounded-full font-medium inline-flex items-center space-x-1">
                      <Clock class="w-3 h-3" />
                      <span>Today • September 22</span>
                    </span>
                    <h2 class="text-xl font-bold text-gray-800 mt-2">Your Meals Today</h2>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-teal-600">1,080</div>
                    <div class="text-xs text-gray-500">calories</div>
                  </div>
                </div>
                <div class="space-y-4">
                  <For each={todayMeals}>
                    {(meal) => (
                      <div class="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-200">
                        <div class="flex-1">
                          <div class="flex items-start justify-between mb-2">
                            <h3 class="font-semibold text-gray-800 text-sm leading-tight flex-1 mr-2 line-clamp-1">
                              {meal.name}
                            </h3>
                            <span class="text-xs text-teal-600 font-medium px-2 py-1 bg-teal-50 rounded-full">
                              {meal.calories} cal
                            </span>
                          </div>
                          <div class="flex items-center justify-between text-xs">
                            <span class="text-gray-500">{meal.time}</span>
                            <div class="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div class="flex -space-x-1">
                                <For each={meal.avatars}>
                                  {(avatar) => (
                                    <div class="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-sm">
                                      {avatar}
                                    </div>
                                  )}
                                </For>
                              </div>
                              <div class="flex items-center space-x-2 text-gray-400">
                                <span class="flex items-center">
                                  <Heart class="w-3 h-3" />
                                  <span class="ml-1">{meal.likes}</span>
                                </span>
                                <span class="flex items-center">
                                  💬 {meal.comments}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button class="bg-teal-500 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-lg hover:shadow-xl transition-all ml-3 whitespace-nowrap">
                          View Details
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>

            <div class="lg:col-span-8">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <For each={mealData}>
                  {(meal) => (
                    <div class={`relative overflow-hidden group hover:shadow-xl transition-all duration-500 border border-${meal.bgColor.replace('bg-', '')}-200 rounded-2xl p-6 ${meal.bgColor}`}>
                      <div class={`absolute inset-0 opacity-5 ${meal.gradient} animate-pulse`}></div>
                      <div class="relative z-10 text-center">
                        <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span class="text-3xl">{meal.image}</span>
                        </div>
                        <h3 class="font-bold text-gray-800 mb-3 text-lg">{meal.type}</h3>
                        <p class="text-gray-600 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity">{meal.description}</p>
                        <div class="space-y-3 mb-6">
                          <div class="flex items-center justify-center space-x-4 text-xs text-gray-600">
                            <div class="flex items-center space-x-1">
                              <Clock class="w-3 h-3 text-orange-500" />
                              <span>{meal.time}</span>
                            </div>
                            <div class="text-orange-600 font-semibold">
                              {meal.calories}
                            </div>
                          </div>
                          <div class="flex items-center justify-center text-xs text-gray-500">
                            <span>{meal.recipes} recipes available</span>
                          </div>
                        </div>
                        <button class="bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-white hover:shadow-lg w-full transition-all duration-300 shadow-sm">
                          See Recipe
                        </button>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="lg:col-span-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-xl font-bold text-gray-800 mb-1">Upcoming Tasks</h2>
                  <p class="text-sm text-gray-500">3 tasks scheduled for today</p>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    onClick={addTask}
                    class="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200"
                    title="Add new task"
                    aria-label="Add new task"
                  >
                    <Plus class="w-5 h-5" />
                  </button>
                  <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {tasks().filter((t) => !t.checked).length} pending
                  </span>
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-gray-200 bg-gray-50">
                      <th class="text-left py-4 pr-4 w-8"></th>
                      <th class="text-left py-4 pr-4 font-semibold text-gray-700">Task</th>
                      <th class="text-left py-4 px-4 w-20 font-semibold text-gray-700">Calories</th>
                      <th class="text-left py-4 px-4 w-32 font-semibold text-gray-700">Ingredients</th>
                      <th class="text-left py-4 px-4 w-20 font-semibold text-gray-700">Time</th>
                      <th class="text-left py-4 px-4 w-24 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <For each={tasks()}>
                      {(task) => (
                        <tr class={`group hover:bg-gray-50 transition-colors duration-200 ${task.checked ? 'opacity-50' : ''}`}>
                          <td class="py-4 pr-4">
                            <input
                              type="checkbox"
                              checked={task.checked}
                              onChange={() => toggleTask(task.id)}
                              class="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500 transition-colors"
                            />
                          </td>
                          <td class="py-4 pr-4">
                            <div class="flex items-center space-x-3">
                              <div class={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                              <span class={`font-medium text-gray-900 max-w-0 truncate ${task.checked ? 'line-through text-gray-500' : ''}`}>
                                {task.item}
                              </span>
                            </div>
                          </td>
                          <td class="py-4 px-4">
                            <span class={`px-2 py-1 rounded-full text-xs font-medium ${task.checked ? 'bg-gray-100 text-gray-500' : 'bg-teal-100 text-teal-700'}`}>
                              {task.calories}
                            </span>
                          </td>
                          <td class="py-4 px-4">
                            <span class="text-gray-500 max-w-0 truncate block">
                              {task.ingredients}
                            </span>
                          </td>
                          <td class="py-4 px-4">
                            <span class="text-gray-700 font-medium">{task.time}</span>
                          </td>
                          <td class="py-4 px-4">
                            <span class={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                              {task.status}
                            </span>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="lg:col-span-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-6 shadow-sm border border-yellow-200 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-20 h-20 bg-yellow-200 rounded-full -mr-10 -mt-10 opacity-50 animate-pulse"></div>
              <div class="relative z-10">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-yellow-800 flex items-center space-x-2">
                    📝 <span>Quick Note</span>
                  </h3>
                  <button class="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-lg transition-all">
                    <Plus class="w-5 h-5" />
                  </button>
                </div>
                <div class="bg-white rounded-lg p-5 h-48 relative shadow-sm border border-gray-200 overflow-hidden">
                  <div class="absolute top-3 left-3 w-3 h-3 bg-red-400 rounded-full shadow-lg"></div>
                  <div class="absolute top-3 right-3 w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-400 rounded opacity-75"></div>
                  <div class="pt-6 relative z-10">
                    <p class="text-gray-700 text-sm leading-relaxed">
                      Don't forget to prep vegetables for tomorrow's meals. Check
                      your grocery list before heading to the store.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <ShoppingCart class="w-5 h-5 text-teal-600" />
                  <span>Shopping List</span>
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                  {shoppingItems().filter((item) => !item.checked).length} items remaining
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  onClick={addShoppingItem}
                  class="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200"
                  title="Add shopping item"
                  aria-label="Add new shopping item"
                >
                  <Plus class="w-4 h-4" />
                </button>
                <span class={`px-3 py-1 rounded-full text-sm font-medium ${shoppingItems().filter((item) => !item.checked).length === 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {shoppingItems().filter((item) => !item.checked).length} left
                </span>
              </div>
            </div>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <For each={shoppingItems()}>
                {(item) => {
                  const isChecked = item.checked;
                  return (
                    <div class={`group flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${isChecked ? 'bg-teal-50 border-teal-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleShoppingItem(item.id)}
                        class={`w-5 h-5 text-teal-600 rounded border-2 border-gray-300 focus:ring-teal-500 transition-all duration-200 ${isChecked ? 'bg-teal-600 border-teal-600' : 'hover:border-teal-400'}`}
                      />
                      <div class="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                        <span class="text-xl">{item.icon}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                          <span class={`font-semibold transition-colors ${isChecked ? 'line-through text-gray-500' : 'text-gray-800 group-hover:text-teal-600'}`}>
                            {item.name}
                          </span>
                          <span class={`text-xs px-2 py-1 rounded-full ${isChecked ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                      {isChecked && (
                        <div class="flex items-center space-x-1 text-xs text-teal-600 bg-teal-100 px-3 py-1 rounded-full font-medium">
                          <span>✓</span>
                          <span>Done</span>
                        </div>
                      )}
                    </div>
                  );
                }}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDashboard;