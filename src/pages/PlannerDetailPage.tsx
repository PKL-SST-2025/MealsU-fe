import { Component, createSignal, For, onMount, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import SidebarNavbar from "../components/SidebarNavbar";
import AppNavbar from "../components/AppNavbar";

interface PlanItem { id: number; title: string; type?: string; notes?: string; };
interface DayPlan { date: string; items: PlanItem[] };

const PlannerDetailPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = createSignal<any>(null);
  const [days, setDays] = createSignal<DayPlan[]>([]);
  const [showAdd, setShowAdd] = createSignal(false);
  const [targetDayIdx, setTargetDayIdx] = createSignal<number | null>(null);
  const [formType, setFormType] = createSignal('Breakfast');
  const [formTitle, setFormTitle] = createSignal('');
  const [formNotes, setFormNotes] = createSignal('');

  onMount(() => {
    const raw = localStorage.getItem('mealPlans') || '[]';
    const arr = JSON.parse(raw);
    const found = arr.find((p: any) => String(p.id) === params.id);
    if (!found) {
      navigate('/planner');
      return;
    }
    setPlan(found);
    // Initialize day buckets: today and next 6 days
    const base = new Date(found.date || new Date());
    const list: DayPlan[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      list.push({ date: d.toISOString().slice(0,10), items: [] });
    }
    // Try to load existing items per day
    const rawItems = localStorage.getItem(`plan:${found.id}:items`);
    if (rawItems) {
      const parsed = JSON.parse(rawItems);
      setDays(parsed);
    } else {
      setDays(list);
    }
  });

  const openAdd = (dayIdx: number) => {
    setTargetDayIdx(dayIdx);
    setFormType('Breakfast');
    setFormTitle('');
    setFormNotes('');
    setShowAdd(true);
  };

  const saveItem = () => {
    const idx = targetDayIdx();
    if (idx === null) return;
    const title = formTitle().trim();
    if (!title) return;
    const next = days().slice();
    const bucket = next[idx];
    bucket.items = [...bucket.items, { id: Date.now(), title, type: formType(), notes: formNotes().trim() }];
    setDays(next);
    persist();
    setShowAdd(false);
  };

  const deleteItem = (dayIdx: number, id: number) => {
    const next = days().slice();
    next[dayIdx].items = next[dayIdx].items.filter(i => i.id !== id);
    setDays(next);
    persist();
  };

  const persist = () => {
    if (!plan()) return;
    localStorage.setItem(`plan:${plan().id}:items`, JSON.stringify(days()));
  };

  return (
    <div class="flex h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <SidebarNavbar />
      <div class="flex-1 flex flex-col">
        <AppNavbar pageContext="planner" showBreadcrumbs={false} />

        <div class="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">{plan()?.name || 'Plan'}</h1>
              <p class="text-sm text-gray-500">Start Date: {plan()?.date}</p>
            </div>
            <button class="text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg px-3 py-2" onClick={() => navigate('/planner')}>Back to plans</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={days()}>
              {(day, idx) => (
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-800">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long' })}</h3>
                    <button class="text-sm text-teal-700 hover:text-teal-800" onClick={() => openAdd(idx())}>+ Add</button>
                  </div>
                  <div class="space-y-2">
                    <For each={day.items}>
                      {(it) => (
                        <div class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                          <div class="flex items-center gap-2 min-w-0">
                            <Show when={it.type}>
                              <span class="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 whitespace-nowrap">{it.type}</span>
                            </Show>
                            <div class="min-w-0">
                              <div class="text-sm text-gray-800 font-medium truncate">{it.title}</div>
                              <Show when={it.notes}>
                                <div class="text-xs text-gray-500 truncate">{it.notes}</div>
                              </Show>
                            </div>
                          </div>
                          <button class="text-xs text-red-600 hover:text-red-700" onClick={() => deleteItem(idx(), it.id)}>Delete</button>
                        </div>
                      )}
                    </For>
                    <Show when={day.items.length === 0}>
                      <div class="text-sm text-gray-400">No items yet.</div>
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>
        
          {/* Add Item Modal */}
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
        </div>
      </div>
    </div>
  );
};

export default PlannerDetailPage;
