import { createSignal, Show, For, onCleanup, onMount } from 'solid-js';
// Portal not needed for notif dropdown after simplification
import { useNavigate } from '@solidjs/router';
import { 
  Search, Bell, RefreshCw, Plus, User, Calendar as CalendarIcon, Clock, 
  ChevronRight, Heart, MessageCircle, Settings, Sun, Moon
} from 'lucide-solid'; // Hanya impor ikon yang digunakan

import { ShoppingCart } from 'lucide-solid'; // Tambahkan ShoppingCart
import { getProfile } from '../lib/api'; // Import getProfile

const AppNavbar = (props: any) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = createSignal('');
  const [showNotifications, setShowNotifications] = createSignal(false);
  const [profile, setProfile] = createSignal({} as any);
  
  // Load profile data on mount
  onMount(async () => {
    const res = await getProfile();
    if (res.ok) {
      setProfile(res.data);
    }
  });

  // Helper function to get user initials from name or email
  const getUserInitials = () => {
    const profileData = profile();
    if (profileData?.name && profileData.name.trim()) {
      return profileData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (profileData?.email) {
      return profileData.email[0].toUpperCase();
    }
    return 'U';
  };
  const [showCalendar, setShowCalendar] = createSignal(false); // (tidak dipakai untuk dropdown lagi di dashboard)
  const [showNewPlan, setShowNewPlan] = createSignal(false);
  const [planName, setPlanName] = createSignal('');
  const [planDate, setPlanDate] = createSignal('');
  const [now, setNow] = createSignal(new Date());
  let notifRef: HTMLDivElement | undefined;
  let notifBtnRef: HTMLButtonElement | undefined;
  let notifDropdownRef: HTMLDivElement | undefined;
  const [dropdownPos, setDropdownPos] = createSignal<{top:number; left:number}>({ top: 0, left: 0 });
  const timer = setInterval(() => setNow(new Date()), 1000);
  onCleanup(() => clearInterval(timer));

  // Close notifications when clicking outside or pressing ESC
  const ENABLE_OUTSIDE_CLOSE = true;
  if (typeof window !== 'undefined' && ENABLE_OUTSIDE_CLOSE) {
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideButton = !!(notifRef && target && notifRef.contains(target));
      const clickedInsideDropdown = !!(notifDropdownRef && target && notifDropdownRef.contains(target));
      if (showNotifications() && !clickedInsideButton && !clickedInsideDropdown) {
        setShowNotifications(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowNotifications(false);
    };
    document.addEventListener('pointerdown', handleDocClick);
    document.addEventListener('keydown', handleKey);
    onCleanup(() => {
      document.removeEventListener('pointerdown', handleDocClick);
      document.removeEventListener('keydown', handleKey);
    });
  }

  // Default page context, can be overridden by props
  const pageContext = () => props.pageContext || 'dashboard';
  const pageTitle = () => props.pageTitle || 'Dashboard';

  // State untuk kalender
  const [currentMonth, setCurrentMonth] = createSignal(new Date().getMonth()); // September (8)
  const [currentYear, setCurrentYear] = createSignal(new Date().getFullYear()); // 2025
  const [selectedDate, setSelectedDate] = createSignal(new Date().getDate()); // 23

  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value);
    if (props.onSearch) {
      props.onSearch(e.target.value);
    }
  };

  // Theme toggle (light/dark)
  const getInitialTheme = () => {
    try { return (localStorage.getItem('theme') || '') === 'dark'; } catch { return false; }
  };
  const [isDark, setIsDark] = createSignal(getInitialTheme());
  const toggleTheme = () => {
    const next = !isDark();
    setIsDark(next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next);
    }
  };

  // Current plan chip data
  const currentPlanName = () => {
    try {
      const plans = JSON.parse(localStorage.getItem('mealPlans') || '[]');
      const sel = localStorage.getItem('lastSelectedPlanId');
      const found = plans.find((p: any) => String(p.id) === String(sel)) || plans[0];
      return found?.name ? String(found.name) : 'No Plan';
    } catch { return 'No Plan'; }
  };

  const isDemo = () => {
    try {
      const user = localStorage.getItem('auth:user') || localStorage.getItem('authToken') || localStorage.getItem('auth:token');
      return !user;
    } catch {
      return false;
    }
  };

  const handleNotificationClick = (e: any) => {
    e.stopPropagation();
    if (isDemo()) {
      navigate('/login');
      return;
    }
    // Position dropdown relative to button
    if (notifBtnRef) {
      const r = notifBtnRef.getBoundingClientRect();
      const width = 320; // dropdown width
      // Use viewport coords; add scroll as safeguard if environment changes positioning
      const left = Math.max(8, r.right - width + (window.scrollX || 0));
      const top = r.bottom + 8 + (window.scrollY || 0);
      setDropdownPos({ top, left });
    } else {
      // Fallback position (top-right corner under navbar)
      setDropdownPos({ top: (56 + (window.scrollY || 0)), left: Math.max(8, (window.innerWidth || 360) - 320 - 16) });
    }
    const next = !showNotifications();
    setShowNotifications(next);
    if (props.onNotificationClick) {
      props.onNotificationClick();
    }
  };

  const handleProfileClick = () => {
    navigate("/settings"); // Navigasi ke halaman settings
    if (props.onProfileClick) {
      props.onProfileClick();
    }
  };

  const handleQuickAction = (action: string) => {
    if (props.onQuickAction) {
      props.onQuickAction(action);
    }
    console.log(`Quick action: ${action}`);
    if (action === 'refresh') {
      window.location.reload(); // Refresh halaman saat ini
    }
    if (action === 'today-plan') {
      // Arahkan ke halaman kalender supaya ada guna yang jelas
      navigate('/calendar');
    }
    if (action === 'new-plan') {
      setShowNewPlan(true);
    }
  };

  // Context-specific placeholders
  const getSearchPlaceholder = () => {
    switch(pageContext()) {
      case 'recipes': return "Search recipes, ingredients, chefs...";
      case 'planner': return "Search meals, dates, plans...";
      case 'dashboard': return "Search meals, recipes, tasks...";
      case 'settings': return "Search settings...";
      default: return "Search...";
    }
  };

  // Quick actions dihilangkan sesuai permintaan (hanya notif, new plan, profil)
  const getQuickActions = () => [] as any[];

  // Context-specific notifications
  const notifications = [
    { 
      id: 1, 
      title: pageContext() === 'recipes' ? "Your recipe got 5 new likes" : "New meal plan suggestion", 
      time: "2 min ago", 
      type: pageContext() === 'recipes' ? "recipe" : "plan", 
      unread: true 
    },
    { 
      id: 2, 
      title: "New comment on your post", 
      time: "1 hour ago", 
      type: "comment", 
      unread: true 
    },
    { 
      id: 3, 
      title: pageContext() === 'planner' ? "Shopping list reminder" : "Weekly summary ready", 
      time: "3 hours ago", 
      type: pageContext() === 'planner' ? "shopping" : "summary", 
      unread: false 
    },
  ];

  const getNotificationIcon = (type: string) => {
    const icons = {
      recipe: Heart,
      comment: MessageCircle,
      plan: CalendarIcon,
      shopping: ShoppingCart,
      summary: CalendarIcon
    } as const;
    const Icon = (icons as Record<string, any>)[type] || Bell;
    return <Icon size={16} />;
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear(), currentMonth(), 1).getDay();
    const daysInMonth = new Date(currentYear(), currentMonth() + 1, 0).getDate();
    const days = [];

    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({ day: null, date: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, date: new Date(currentYear(), currentMonth(), day) });
    }

    return days;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth() === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear() - 1);
    } else {
      setCurrentMonth(currentMonth() - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth() === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear() + 1);
    } else {
      setCurrentMonth(currentMonth() + 1);
    }
  };

  const handleDayClick = (day: number) => {
    if (day) {
      setSelectedDate(day);
      setShowCalendar(false); // Tutup kalender setelah memilih
      alert(`Selected date: ${day} ${months[currentMonth()]} ${currentYear()}`);
      if (props.onDateSelect) {
        props.onDateSelect(new Date(currentYear(), currentMonth(), day)); // Callback ke parent jika ada
      }
    }
  };

  return (
    <div class="mt-1 mb-3 -ml-24 mr-0 relative z-[999] overflow-visible">
      <div class="bg-teal-50/80 backdrop-blur-sm rounded-3xl rounded-l-3xl p-2 shadow-sm border border-teal-100 border-l-0 relative z-[999] overflow-visible">
        <div class="relative flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl rounded-l-3xl px-5 py-3 shadow-sm z-[999] overflow-visible">
          {/* Left: brand + optional breadcrumbs */}
          <div class="flex items-center gap-3 min-w-0 flex-shrink-0">
            <div class="hidden sm:block text-teal-700 font-semibold tracking-wide">MealsU</div>
            <Show when={props.showBreadcrumbs !== false}>
              <nav class="hidden lg:flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                <span class="hover:text-gray-900 cursor-pointer transition-colors">Home</span>
                <ChevronRight size={12} class="text-gray-400" />
                <span class={`font-medium ${
                  pageContext() === 'recipes' ? 'text-teal-600' : 
                  pageContext() === 'planner' ? 'text-blue-600' : 
                  pageContext() === 'dashboard' ? 'text-green-600' : 'text-purple-600'
                }`}>
                  {pageContext() === 'recipes' ? 'Recipes' : 
                   pageContext() === 'planner' ? 'Planner' : 
                   pageContext() === 'dashboard' ? 'Dashboard' : 'Settings'}
                </span>
                <Show when={pageTitle() !== pageContext() && pageTitle() !== 'Dashboard'}>
                  <ChevronRight size={12} class="text-gray-400" />
                  <span class="text-gray-900 font-semibold">{pageTitle()}</span>
                </Show>
              </nav>
            </Show>
          </div>

          {/* Center: search (responsive, no absolute so it won't overlap) */}
          <div class="relative order-2 w-full md:order-none md:flex-1 md:max-w-[720px] mx-0 md:mx-auto mt-2 md:mt-0 min-w-0">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10 pointer-events-none" />
            <input 
              type="text" 
              placeholder={getSearchPlaceholder()} 
              value={searchQuery()}
              onInput={handleSearch}
              class="w-full pl-9 pr-3 h-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm placeholder:text-gray-400"
            />
          </div>

          {/* Right: date/time chips + actions */}
          <div class="flex items-center gap-2 flex-shrink-0 order-3 md:order-none">
            {/* Date chip */}
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 text-sm text-gray-700">
              <CalendarIcon size={16} class="text-teal-600" />
              <span>{now().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {/* Time chip */}
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 text-sm text-gray-700 font-mono">
              <Clock size={16} class="text-teal-600" />
              <span>{now().toLocaleTimeString()}</span>
            </div>

            <div class="relative z-[2000]" ref={(el) => notifRef = el as HTMLDivElement}>
              <button 
                ref={(el) => notifBtnRef = el as HTMLButtonElement}
                onPointerDown={handleNotificationClick}
                onClick={handleNotificationClick}
                class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 group pointer-events-auto"
                title="Notifications"
                aria-label={`You have ${unreadCount} unread notifications`}
                aria-expanded={showNotifications() ? 'true' : 'false'}
                role="button"
              >
                <Bell size={18} />
                <Show when={unreadCount > 0}>
                  <span class={`pointer-events-none absolute -top-1 -right-1 flex items-center justify-center ${
                    unreadCount > 9 ? 'w-6 h-6' : 'w-5 h-5'
                  } bg-red-500 text-white rounded-full text-xs font-bold shadow-lg border-2 border-white`}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </Show>
                <span class="sr-only">You have {unreadCount} unread notifications</span>
              </button>
              <Show when={showNotifications()}>
                <div
                  ref={(el) => notifDropdownRef = el as HTMLDivElement}
                  class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 max-h-96 overflow-y-auto z-[3000]"
                  style={{ left: 'auto' }}
                >
                  <div class="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                    <div class="flex items-center justify-between">
                      <h4 class="font-semibold text-gray-800">Notifications</h4>
                      <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                        unreadCount > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {unreadCount} new
                      </span>
                    </div>
                  </div>
                  <For each={notifications.slice(0, 3)}>
                    {(notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      return (
                        <div class={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}>
                          <div class="flex items-start space-x-3">
                            <div class={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium ${
                              notification.type === 'recipe' ? 'bg-teal-500' :
                              notification.type === 'comment' ? 'bg-purple-500' :
                              notification.type === 'plan' ? 'bg-emerald-500' :
                              'bg-orange-500'
                            }`}>
                              {Icon}
                            </div>
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-gray-900 line-clamp-1">{notification.title}</p>
                              <p class="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            <Show when={notification.unread}>
                              <button class="text-xs text-blue-600 hover:text-blue-700 font-medium ml-auto">Mark read</button>
                            </Show>
                          </div>
                        </div>
                      );
                    }}
                  </For>
                </div>
              </Show>
            </div>

            {/* Current plan chip */}
            <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200 text-sm text-emerald-700">
              <CalendarIcon size={16} class="text-emerald-600" />
              <span class="max-w-[160px] truncate">{currentPlanName()}</span>
            </div>

            <button 
              class="hidden md:inline-flex p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200" 
              onClick={() => handleQuickAction('refresh')}
              aria-label="Refresh the current page"
            >
              <RefreshCw size={18} />
            </button>

            {/* Theme toggle */}
            <button 
              class="hidden md:inline-flex p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark() ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Settings button */}
            <button 
              class="hidden md:inline-flex p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200" 
              onClick={() => navigate('/settings')}
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={18} />
            </button>

            <button 
              class="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 group"
              title={pageContext() === 'recipes' ? 'Create new recipe' : 'Create new meal plan'}
              onClick={() => handleQuickAction(pageContext() === 'recipes' ? 'new-recipe' : 'new-plan')}
              aria-label={pageContext() === 'recipes' ? 'Create new recipe' : 'Create new meal plan'}
            >
              <Plus size={16} />
              <span>{pageContext() === 'recipes' ? 'New Recipe' : 'New Plan'}</span>
            </button>

            <button 
              onClick={handleProfileClick}
              class="relative w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 group overflow-hidden border-2 border-white"
              title="User Profile"
              aria-label="Open user profile menu"
            >
              <Show when={profile()?.avatar} fallback={
                <span class="text-sm font-semibold text-white relative z-10">{getUserInitials()}</span>
              }>
                <img src={profile().avatar} alt="Profile" class="w-full h-full rounded-full object-cover" />
              </Show>
              <div class="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </button>
          </div>
        </div>
      </div>

      {/* New Plan Modal */}
      <Show when={showNewPlan()}>
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1100]">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Create New Plan</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Plan Name</label>
                <input 
                  type="text" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Weekly Healthy Plan"
                  value={planName()}
                  onInput={(e) => setPlanName(e.currentTarget.value)}
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Date</label>
                <input 
                  type="date" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={planDate()}
                  onInput={(e) => setPlanDate(e.currentTarget.value)}
                />
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-6">
              <button class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setShowNewPlan(false)}>Cancel</button>
              <button 
                class="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
                onClick={() => {
                  const plans = JSON.parse(localStorage.getItem('mealPlans') || '[]');
                  const newPlan = {
                    id: Date.now(),
                    name: planName() || 'Untitled Plan',
                    date: planDate() || new Date().toISOString().slice(0,10),
                    createdAt: new Date().toISOString()
                  };
                  plans.push(newPlan);
                  localStorage.setItem('mealPlans', JSON.stringify(plans));
                  setShowNewPlan(false);
                  setPlanName('');
                  setPlanDate('');
                  navigate('/planner');
                }}
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default AppNavbar;