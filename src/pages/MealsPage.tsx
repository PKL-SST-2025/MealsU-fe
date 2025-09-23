import { createSignal, For, Show, onMount } from 'solid-js';
import SidebarNavbar from '../components/SidebarNavbar'; // ✅ Import sidebar terpisah
import { Calendar, Users, Plus } from 'lucide-solid';
import { useNavigate } from '@solidjs/router';
import AppNavbar from "../components/AppNavbar";

const MealsApp = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = createSignal(23); // default sample

  // Load meal plans from localStorage
  const [plans, setPlans] = createSignal<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = createSignal<number | null>(null);
  const [planDays, setPlanDays] = createSignal<{ date: string; items: { id: number; title: string }[] }[]>([]);
  const [selectedDayIdx, setSelectedDayIdx] = createSignal(0);

  const loadPlans = () => {
    try {
      const raw = localStorage.getItem('mealPlans') || '[]';
      const arr = JSON.parse(raw);
      setPlans(Array.isArray(arr) ? arr : []);
      if (Array.isArray(arr) && arr.length > 0) {
        const firstId = arr[0].id;
        setSelectedPlanId(firstId);
        // Load days immediately so tanggal muncul dari awal
        loadPlanDays(firstId);
      } else {
        setPlanDays([]);
      }
    } catch {
      setPlans([]);
      setPlanDays([]);
    }
  };

  const loadPlanDays = (planId: number) => {
    const all = plans();
    const plan = all.find((p) => p.id === planId);
    if (!plan) return;
    const base = new Date(plan.date || new Date());
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return { date: d.toISOString().slice(0, 10), items: [] as { id: number; title: string }[] };
    });
    const rawItems = localStorage.getItem(`plan:${plan.id}:items`);
    if (rawItems) {
      try {
        const parsed = JSON.parse(rawItems);
        if (Array.isArray(parsed)) setPlanDays(parsed);
        else setPlanDays(days);
      } catch {
        setPlanDays(days);
      }
    } else {
      setPlanDays(days);
    }
    setSelectedDayIdx(0);
  };

  onMount(() => {
    loadPlans();
  });

  // When selected plan changes, refresh days
  const selectPlan = (id: number) => {
    setSelectedPlanId(id);
    loadPlanDays(id);
  };

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
    <div class="bg-white border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center hover:border-teal-400 transition-colors cursor-pointer group"
      onClick={() => selectedPlanId() ? navigate(`/planner/${selectedPlanId()}`) : navigate('/planner')}>
      <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-teal-600 transition-colors shadow">
        <Plus class="text-white" size={24} />
      </div>
      <p class="text-gray-500 text-sm group-hover:text-teal-600 transition-colors">Add Recipe</p>
    </div>
  );

  return (
    <div class="flex h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <SidebarNavbar class="bg-olive-100" /> {/* Sesuaikan sidebar dengan hijau zaitun muda */}

      <div class="flex-1 flex flex-col">
        <AppNavbar onSearch={handleSearch} onQuickAction={handleQuickAction} pageContext="dashboard" showBreadcrumbs={false} />
      
        {/* Main Content */}
        <div class="flex-1 p-6 overflow-y-auto"> {/* Padding di dalam container utama */}
          {/* Plans Row */}
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 overflow-x-auto pb-1">
              <For each={plans()}>
                {(p) => (
                  <button
                    class={`px-4 py-2 rounded-full border text-sm whitespace-nowrap ${selectedPlanId() === p.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => selectPlan(p.id)}
                  >
                    {p.name}
                  </button>
                )}
              </For>
            </div>
            <div class="flex items-center gap-2">
              <button class="text-sm text-teal-700 hover:text-teal-800" onClick={() => navigate('/planner')}>Manage Plans</button>
            </div>
          </div>

          <Show when={selectedPlanId() !== null} fallback={
            <div>
              {/* Fallback: sample grid when no plan selected */}
              <div class="flex space-x-4 mb-8 overflow-x-auto pb-2">
                <For each={dates}>{(date) => (
                  <button class={`flex flex-col items-center p-3 rounded-lg transition-colors flex-shrink-0 ${selectedDate() === date.date ? 'bg-teal-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`} onClick={() => setSelectedDate(date.date)}>
                    <span class="text-2xl font-bold">{date.date}</span>
                    <span class="text-sm">{date.day}</span>
                  </button>
                )}</For>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <For each={mealCards}>{(meal) => <MealCard meal={meal} />}</For>
                <EmptyCard />
                <EmptyCard />
              </div>
            </div>
          }>
            {/* Plan mode: show 7-day selector and items for selected day */}
            <div class="flex space-x-4 mb-6 overflow-x-auto pb-2">
              <For each={planDays()}>
                {(d, idx) => (
                  <button
                    class={`flex flex-col items-center p-3 rounded-lg transition-colors flex-shrink-0 ${selectedDayIdx() === idx() ? 'bg-teal-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                    onClick={() => setSelectedDayIdx(idx())}
                  >
                    <span class="text-2xl font-bold">{new Date(d.date).getDate()}</span>
                    <span class="text-sm">{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                  </button>
                )}
              </For>
            </div>

            <div class="flex items-center justify-between mb-3">
              <div class="text-gray-600 text-sm">
                <Show when={planDays().length > 0} fallback={<span>Select a plan</span>}>
                  Showing items for {new Date(planDays()[selectedDayIdx()].date).toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long' })}
                </Show>
              </div>
              <button class="text-sm text-teal-700 hover:text-teal-800" onClick={() => navigate(`/planner/${selectedPlanId()}`)}>Edit This Plan</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <For each={planDays()[selectedDayIdx()]?.items || []}>
                {(it) => (
                  <div
                    class={`bg-white rounded-2xl p-4 h-48 flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] hover:shadow-lg border border-gray-200 cursor-pointer`}
                    onClick={() => navigate(`/planner/${selectedPlanId()}`)}
                    role="button"
                  >
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <div class="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">🍽️</div>
                          <h3 class="font-semibold text-gray-800 truncate">{it.title}</h3>
                        </div>
                        <Show when={(it as any).type}>
                          <span class="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 whitespace-nowrap">{(it as any).type}</span>
                        </Show>
                      </div>
                      <p class="text-xs text-gray-500 line-clamp-2">{(it as any).notes || 'Custom item from plan'}</p>
                    </div>
                    <div class="text-right">
                      <button
                        class="inline-flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors"
                        onClick={(e) => { e.stopPropagation(); navigate(`/planner/${selectedPlanId()}`); }}
                      >
                        See recipe
                      </button>
                    </div>
                  </div>
                )}
              </For>
              <EmptyCard />
              <EmptyCard />
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default MealsApp;