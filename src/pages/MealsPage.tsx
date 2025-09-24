import { createSignal, For, Show, onMount } from 'solid-js';
import SidebarNavbar from '../components/SidebarNavbar'; // ✅ Import sidebar terpisah
import { Calendar, Users, Plus } from 'lucide-solid';
import { useNavigate } from '@solidjs/router';
import AppNavbar from "../components/AppNavbar";

const MealsApp = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = createSignal(23); // default sample (used only when no plan)

  // Load meal plans from localStorage
  const [plans, setPlans] = createSignal<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = createSignal<number | null>(null);
  const [planDays, setPlanDays] = createSignal<{ date: string; items: { id: number; title: string }[] }[]>([]);
  const [selectedDayIdx, setSelectedDayIdx] = createSignal(0);
  // Inline add modal state
  const [showAdd, setShowAdd] = createSignal(false);
  const [formType, setFormType] = createSignal('Breakfast');
  const [formTitle, setFormTitle] = createSignal('');
  const [formNotes, setFormNotes] = createSignal('');

  const loadPlans = () => {
    try {
      const raw = localStorage.getItem('mealPlans') || '[]';
      const arr = JSON.parse(raw);
      setPlans(Array.isArray(arr) ? arr : []);
      if (Array.isArray(arr) && arr.length > 0) {
        // Prefer last selected plan if available
        const lastIdStr = localStorage.getItem('lastSelectedPlanId');
        const lastId = lastIdStr ? Number(lastIdStr) : NaN;
        const candidate = arr.find((p:any) => p.id === lastId) || arr[0];
        setSelectedPlanId(candidate.id);
        loadPlanDays(candidate.id);
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
    // If navigated from Calendar with ?date=YYYY-MM-DD, select matching day after plans load
    const params = new URLSearchParams(window.location.search);
    const iso = params.get('date');
    if (iso) {
      // Wait a tick to ensure planDays has been set by loadPlans -> loadPlanDays
      setTimeout(() => {
        const idx = (planDays() || []).findIndex(d => d.date === iso);
        if (idx >= 0) setSelectedDayIdx(idx);
      }, 0);
    }
  });

  // When selected plan changes, refresh days
  const selectPlan = (id: number) => {
    setSelectedPlanId(id);
    localStorage.setItem('lastSelectedPlanId', String(id));
    loadPlanDays(id);
  };

  // Persist helper for current plan
  const persistCurrentPlanDays = () => {
    const pid = selectedPlanId();
    if (pid == null) return;
    localStorage.setItem(`plan:${pid}:items`, JSON.stringify(planDays()));
  };

  // Open inline add modal (for current selected day)
  const openAdd = () => {
    if (selectedPlanId() == null) {
      navigate('/planner');
      return;
    }
    setFormType('Breakfast');
    setFormTitle('');
    setFormNotes('');
    setShowAdd(true);
  };

  const saveItem = () => {
    if (selectedPlanId() == null) return;
    const title = formTitle().trim();
    if (!title) return;
    const idx = selectedDayIdx();
    const next = planDays().slice();
    const bucket = next[idx];
    if (!bucket) return;
    bucket.items = [...bucket.items, { id: Date.now(), title, type: formType(), notes: formNotes().trim() } as any];
    setPlanDays(next);
    persistCurrentPlanDays();
    setShowAdd(false);
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
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    alert(`Searching for: ${query}`);
  };

  // Handle quick actions from AppNavbar
  const handleQuickAction = (action: string) => {
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

  const MealCard = (props: any) => (
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

  // Type-based colors for plan items
  const typeBg = (t?: string) => {
    switch (t) {
      case 'Breakfast': return { bg: 'bg-pink-100', ring: 'from-pink-400 to-rose-400', chip: 'border-pink-200' };
      case 'Lunch': return { bg: 'bg-blue-100', ring: 'from-sky-400 to-blue-400', chip: 'border-blue-200' };
      case 'Dinner': return { bg: 'bg-purple-100', ring: 'from-purple-400 to-indigo-400', chip: 'border-purple-200' };
      case 'Snack': return { bg: 'bg-amber-100', ring: 'from-amber-400 to-orange-400', chip: 'border-amber-200' };
      default: return { bg: 'bg-gray-100', ring: 'from-gray-400 to-slate-400', chip: 'border-gray-200' };
    }
  };

  const EmptyCard = () => (
    <div class="bg-white border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center hover:border-teal-400 transition-colors cursor-pointer group"
      onClick={() => selectedPlanId() ? openAdd() : navigate('/planner')}>
      <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-teal-600 transition-colors shadow">
        <Plus class="text-white" size={24} />
      </div>
      <p class="text-gray-500 text-sm group-hover:text-teal-600 transition-colors">Add Recipe</p>
    </div>
  );

  return (
    <>
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

          <Show when={selectedPlanId() !== null && plans().length > 0} fallback={
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
                {(it: any) => {
                  const { bg, ring, chip } = typeBg(it.type);
                  return (
                    <div
                      class={`group relative rounded-2xl p-4 h-48 flex flex-col justify-between transition-all duration-200 hover:scale-[1.01] shadow-sm hover:shadow-lg border border-gray-300 ${bg} cursor-pointer`}
                      onClick={() => navigate(`/planner/${selectedPlanId()}`)}
                      role="button"
                    >
                      {/* subtle glow */}
                      <div class={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${ring} opacity-[0.06]`}></div>
                      
                      <div class="relative h-full flex flex-col">
                        {/* Meta row */}
                        <div class="flex items-center gap-4 text-[11px] text-gray-700">
                          <span class="inline-flex items-center gap-1"><Calendar size={12} /> 25 min</span>
                          <span class="inline-flex items-center gap-1"><Users size={12} /> 3 servings</span>
                        </div>

                        {/* Center icon */}
                        <div class="flex justify-center mt-1">
                          <div class="w-10 h-10 rounded-xl bg-white/70 border border-white/80 flex items-center justify-center shadow-sm">
                            <span class="text-[18px]">🔍</span>
                          </div>
                        </div>

                        {/* Title + desc */}
                        <div class="mt-1 text-center px-1">
                          <h3 class="font-semibold text-gray-800 leading-tight truncate">{it.title}</h3>
                          <p class="text-xs text-gray-700 mt-1 line-clamp-2">{it.notes || 'Custom item from plan'}</p>
                        </div>

                        {/* Action */}
                        <div class="mt-auto text-center">
                          <button
                            class="text-teal-700 text-sm font-medium hover:text-teal-800 transition-colors"
                            onClick={(e) => { e.stopPropagation(); navigate(`/planner/${selectedPlanId()}`); }}
                          >
                            See recipe
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </For>
              <EmptyCard />
              <EmptyCard />
            </div>
          </Show>
        </div>
      </div>
    </div>

    {/* Inline Add Item Modal */}
    <Show when={showAdd()}>
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1100]">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Add Item</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Type</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" value={formType()} onInput={(e) => setFormType((e.currentTarget as HTMLSelectElement).value)}>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Title</label>
              <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Omelette with veggies" value={formTitle()} onInput={(e) => setFormTitle((e.currentTarget as HTMLInputElement).value)} />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Notes</label>
              <textarea class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" rows={3} placeholder="Optional notes (ingredients, calories, etc.)" value={formNotes()} onInput={(e) => setFormNotes((e.currentTarget as HTMLTextAreaElement).value)} />
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setShowAdd(false)}>Cancel</button>
            <button class="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700" onClick={saveItem}>Save</button>
          </div>
        </div>
      </div>
    </Show>
    </>
  );
};

export default MealsApp;