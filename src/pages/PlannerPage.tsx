import { Component, createSignal, For, onMount, Show } from "solid-js";
import SidebarNavbar from "../components/SidebarNavbar";
import AppNavbar from "../components/AppNavbar";
import { useNavigate } from "@solidjs/router";

interface MealPlan {
  id: number;
  name: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

const PlannerPage: Component = () => {
  const [plans, setPlans] = createSignal<MealPlan[]>([]);
  const navigate = useNavigate();

  const loadPlans = () => {
    try {
      const raw = localStorage.getItem("mealPlans") || "[]";
      const parsed = JSON.parse(raw);
      setPlans(Array.isArray(parsed) ? parsed : []);
    } catch {
      setPlans([]);
    }
  };

  onMount(loadPlans);

  const removePlan = (id: number) => {
    const next = plans().filter(p => p.id !== id);
    localStorage.setItem("mealPlans", JSON.stringify(next));
    setPlans(next);
  };

  return (
    <div class="flex h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <SidebarNavbar />
      <div class="flex-1 flex flex-col">
        <AppNavbar pageContext="planner" showBreadcrumbs={false} onQuickAction={(action: string) => {
          if (action === 'refresh') loadPlans();
        }} />

        <div class="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Meal Plans</h1>
              <p class="text-sm text-gray-500">Saved locally on this device</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={plans()}>
              {(plan) => (
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800">{plan.name}</h3>
                      <p class="text-sm text-gray-500 mt-1">Date: {plan.date}</p>
                      <p class="text-xs text-gray-400">Created: {new Date(plan.createdAt).toLocaleString()}</p>
                    </div>
                    <button
                      class="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1 text-sm"
                      onClick={() => removePlan(plan.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div class="mt-4">
                    <button class="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-2" onClick={() => navigate(`/planner/${plan.id}`)}>Open</button>
                  </div>
                </div>
              )}
            </For>
          </div>

          <Show when={plans().length === 0}>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
              <div class="text-4xl mb-3">🗓️</div>
              <h3 class="text-lg font-semibold text-gray-800">No Plans Yet</h3>
              <p class="text-gray-500 mt-1">Use the "New Plan" button in the navbar to create your first plan.</p>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default PlannerPage;
