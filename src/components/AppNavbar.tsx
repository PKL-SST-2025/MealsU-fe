import { createSignal, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { 
  Search, Bell, Share2, RefreshCw, Plus, User, Calendar, 
  ChevronRight, Heart, MessageCircle, Settings
} from 'lucide-solid'; // Hanya impor ikon yang digunakan
import { ShoppingCart } from 'lucide-solid'; // Tambahkan ShoppingCart

const AppNavbar = (props) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = createSignal('');
  const [showNotifications, setShowNotifications] = createSignal(false);
  const [showCalendar, setShowCalendar] = createSignal(false); // State untuk menampilkan kalender di Today's Plan

  // Default page context, can be overridden by props
  const pageContext = () => props.pageContext || 'dashboard';
  const pageTitle = () => props.pageTitle || 'Dashboard';

  // State untuk kalender
  const [currentMonth, setCurrentMonth] = createSignal(new Date().getMonth()); // September (8)
  const [currentYear, setCurrentYear] = createSignal(new Date().getFullYear()); // 2025
  const [selectedDate, setSelectedDate] = createSignal(new Date().getDate()); // 23

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (props.onSearch) {
      props.onSearch(e.target.value);
    }
  };

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications());
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

  const handleQuickAction = (action) => {
    if (props.onQuickAction) {
      props.onQuickAction(action);
    }
    console.log(`Quick action: ${action}`);
    if (action === 'refresh') {
      window.location.reload(); // Refresh halaman saat ini
    }
    if (action === 'today-plan') {
      setShowCalendar(true); // Tampilkan kalender saat "Today's Plan" diklik
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

  // Context-specific quick actions
  const getQuickActions = () => {
    switch(pageContext()) {
      case 'recipes':
        return [
          { icon: Heart, label: 'Save to Favorites', action: 'save-recipe' },
          { icon: Calendar, label: 'Add to Planner', action: 'add-to-plan' }
        ];
      case 'planner':
        return [
          { icon: Plus, label: 'New Meal', action: 'new-meal' },
          { icon: Calendar, label: 'View Analytics', action: 'analytics' }
        ];
      case 'dashboard':
        return [
          { icon: Plus, label: 'Quick Add', action: 'quick-add' },
          { icon: Calendar, label: "Today's Plan", action: 'today-plan' }
        ];
      case 'settings':
        return [
          { icon: Settings, label: 'Account', action: 'account' },
          { icon: User, label: 'Privacy', action: 'privacy' }
        ];
      default:
        return [];
    }
  };

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

  const getNotificationIcon = (type) => {
    const icons = {
      recipe: Heart,
      comment: MessageCircle,
      plan: Calendar,
      shopping: ShoppingCart,
      summary: Calendar
    };
    const Icon = icons[type] || Bell;
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

  const handleDayClick = (day) => {
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
    <div class="flex items-center justify-between mb-8 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      {/* Left Section - Breadcrumbs & Search */}
      <div class="flex items-center space-x-4 flex-1">
        {/* Breadcrumbs */}
        <Show when={props.showBreadcrumbs !== false}>
          <nav class="hidden md:flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg shadow-sm border border-gray-200">
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

        {/* Search Bar */}
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <input 
            type="text" 
            placeholder={getSearchPlaceholder()} 
            value={searchQuery()}
            onInput={handleSearch}
            class="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>
      
      {/* Right Section - Actions & Profile */}
      <div class="flex items-center space-x-3">
        {/* Quick Actions (Context-specific) */}
        <Show when={getQuickActions().length > 0}>
          <div class="hidden md:flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg shadow-sm border border-gray-200">
            <For each={getQuickActions()}>
              {(action) => {
                const Icon = action.icon;
                return (
                  <button 
                    onClick={() => handleQuickAction(action.action)}
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 group"
                    title={action.label}
                    aria-label={action.label}
                  >
                    <Icon size={16} />
                    <span class="sr-only">{action.label}</span>
                  </button>
                );
              }}
            </For>
          </div>
        </Show>

        {/* Notification Bell */}
        <div class="relative">
          <button 
            onClick={handleNotificationClick}
            class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
            title="Notifications"
            aria-label={`You have ${unreadCount} unread notifications`}
          >
            <Bell size={18} />
            <Show when={unreadCount > 0}>
              <span class={`absolute -top-1 -right-1 flex items-center justify-center ${
                unreadCount > 9 ? 'w-6 h-6' : 'w-5 h-5'
              } bg-red-500 text-white rounded-full text-xs font-bold shadow-lg border-2 border-white`}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </Show>
            <span class="sr-only">You have {unreadCount} unread notifications</span>
          </button>
          
          {/* Simplified Notification Dropdown */}
          <Show when={showNotifications()}>
            <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200 max-h-80 overflow-y-auto">
              {/* Header */}
              <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div class="flex items-center justify-between">
                  <h4 class="font-semibold text-gray-800">Notifications</h4>
                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                    unreadCount > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {unreadCount} new
                  </span>
                </div>
              </div>
              
              {/* Notifications List */}
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
                          <button class="text-xs text-blue-600 hover:text-blue-700 font-medium ml-auto">
                            Mark read
                          </button>
                        </Show>
                      </div>
                    </div>
                  );
                }}
              </For>
              
              {/* Show more */}
              <Show when={notifications.length > 3}>
                <div class="px-4 py-3 border-t border-gray-100">
                  <button class="w-full text-sm text-teal-600 hover:text-teal-700 font-medium text-center">
                    View all ({notifications.length} total)
                  </button>
                </div>
              </Show>
            </div>
          </Show>
        </div>

        {/* Main Action Buttons */}
        <button 
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200" 
          title="Share"
          onClick={() => handleQuickAction('share')}
          aria-label="Share current page"
        >
          <Share2 size={18} />
        </button>
        
        <button 
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200" 
          title="Refresh Page"
          onClick={() => handleQuickAction('refresh')}
          aria-label="Refresh the current page"
        >
          <RefreshCw size={18} />
        </button>

        {/* Primary Action Button (Context-aware) */}
        <button 
          class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 group"
          title={pageContext() === 'recipes' ? 'Create new recipe' : 'Create new meal plan'}
          onClick={() => handleQuickAction(pageContext() === 'recipes' ? 'new-recipe' : 'new-plan')}
          aria-label={pageContext() === 'recipes' ? 'Create new recipe' : 'Create new meal plan'}
        >
          <Plus size={16} />
          <span>{pageContext() === 'recipes' ? 'New Recipe' : 'New Plan'}</span>
        </button>

        {/* Profile Avatar */}
        <button 
          onClick={handleProfileClick}
          class="relative w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 group overflow-hidden border-2 border-white"
          title="User Profile"
          aria-label="Open user profile menu"
        >
          <span class="text-sm font-semibold text-white relative z-10">U</span>
          <div class="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
        </button>
      </div>

      {/* Mini Calendar Dropdown for Today's Plan */}
      <Show when={showCalendar() && pageContext() === 'dashboard'}>
        <div class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div class="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <button onClick={handlePrevMonth} class="p-1 hover:bg-gray-100 rounded-full">
              <ChevronRight size={16} class="transform rotate-180" />
            </button>
            <div class="text-center">
              <h4 class="font-semibold text-gray-800">{months[currentMonth()]} {currentYear()}</h4>
            </div>
            <button onClick={handleNextMonth} class="p-1 hover:bg-gray-100 rounded-full">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekdays */}
          <div class="grid grid-cols-7 gap-px bg-gray-200">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div class="bg-white py-2 text-center text-xs font-medium text-gray-600 uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div class="grid grid-cols-7 gap-px bg-gray-200">
            <For each={generateCalendarDays()}>
              {(item) => {
                const isToday = item.date && item.date.toDateString() === new Date().toDateString();
                const isSelected = item.day === selectedDate() && currentMonth() === new Date().getMonth() && currentYear() === new Date().getFullYear();
                return (
                  <button
                    onClick={() => handleDayClick(item.day)}
                    class={`p-2 text-sm font-medium transition-all duration-200 flex items-center justify-center h-8 ${
                      !item.day 
                        ? 'invisible' 
                        : isToday 
                          ? 'bg-orange-500 text-white' 
                          : isSelected 
                            ? 'bg-teal-500 text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    disabled={!item.day}
                  >
                    {item.day || ''}
                  </button>
                );
              }}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default AppNavbar;