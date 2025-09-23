import { createSignal, createMemo, For, Show } from 'solid-js';
import { 
  Search, Bell, Share2, RefreshCw, Plus, Calendar, Users, Clock, 
  ChevronLeft, ChevronRight, TrendingUp, BarChart3 
} from 'lucide-solid';
import SidebarNavbar from "../components/SidebarNavbar"; // ✅ sidebar terpisah
import AppNavbar from "../components/AppNavbar";

const MealPlannerApp = () => {
  const [currentView, setCurrentView] = createSignal('Weekly');
  const [selectedDate, setSelectedDate] = createSignal(23); // September 23rd highlighted (today)
  const [currentMonth, setCurrentMonth] = createSignal(8); // September (0-indexed)
  const [currentYear, setCurrentYear] = createSignal(2025);
  const [hoveredDay, setHoveredDay] = createSignal(null);

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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Enhanced meal data with more variety
  const mealData = {
    'Monday': [
      { name: 'Avocado Toast & Coffee', icons: ['🥑', '🍞', '☕'], time: '7:30', people: 1, calories: 320 },
      { name: 'Quinoa Salad Bowl', icons: ['🥗', '🌾'], time: '12:00', people: 2, calories: 450 },
      { name: 'Salmon with Asparagus', icons: ['🐟', '🥬'], time: '18:45', people: 3, calories: 520 }
    ],
    'Tuesday': [
      { name: 'Greek Yogurt Parfait', icons: ['🥛', '🍓', '🌰'], time: '7:45', people: 1, calories: 280 },
      { name: 'Turkey Wrap', icons: ['🔹', '🥬', '🧀'], time: '12:30', people: 2, calories: 380 },
      { name: 'Vegetable Stir Fry', icons: ['🥦', '🧅', '🍜'], time: '19:15', people: 4, calories: 410 }
    ],
    'Wednesday': [
      { name: 'Smoothie Bowl', icons: ['🥤', '🍌', '🥥'], time: '7:15', people: 1, calories: 290 },
      { name: 'Chicken Caesar Salad', icons: ['🍗', '🥬', '🧀'], time: '12:15', people: 2, calories: 420 },
      { name: 'Beef Tacos', icons: ['🌮', '🥩', '🧀'], time: '19:00', people: 4, calories: 560 }
    ],
    'Thursday': [
      { name: 'Oatmeal with Fruits', icons: ['🥣', '🍎', '🥜'], time: '7:30', people: 1, calories: 310 },
      { name: 'Lentil Soup', icons: ['🍲', '🌱'], time: '12:00', people: 3, calories: 360 },
      { name: 'Grilled Pork Chops', icons: ['🍖', '🥔'], time: '18:30', people: 3, calories: 480 }
    ],
    'Friday': [
      { name: 'Pancakes & Bacon', icons: ['🥞', '🥓', '☕'], time: '8:00', people: 2, calories: 420 },
      { name: 'Tuna Salad', icons: ['🐟', '🥗'], time: '12:30', people: 1, calories: 340 },
      { name: 'Pasta Primavera', icons: ['🍝', '🌶️', '🧀'], time: '19:30', people: 4, calories: 510 }
    ],
    'Saturday': [
      { name: 'French Toast', icons: ['🍞', '🥛', '🍓'], time: '9:00', people: 2, calories: 380 },
      { name: 'BBQ Chicken Pizza', icons: ['🍕', '🍗'], time: '13:00', people: 4, calories: 580 },
      { name: 'Chocolate Lava Cake', icons: ['🍫', '🍮'], time: '20:00', people: 3, calories: 320 }
    ],
    'Sunday': [
      { name: 'Eggs Benedict', icons: ['🍳', '🥓', '🥑'], time: '9:30', people: 2, calories: 450 },
      { name: 'Roast Beef', icons: ['🥩', '🥕', '🥔'], time: '14:00', people: 5, calories: 620 },
      { name: 'Cheesecake', icons: ['🍰', '🍓'], time: '19:30', people: 6, calories: 380 }
    ]
  };

  // Generate calendar days
  const generateCalendarDays = createMemo(() => {
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
  });

  // Calculate total calories for a day
  const calculateDayCalories = (meals) => {
    return meals.reduce((total, meal) => total + (meal.calories || 0), 0);
  };

  const MealCard = (props) => {
    const totalCalories = createMemo(() => calculateDayCalories(props.meals || []));

    const handleCardClick = () => {
      alert(`Clicked on ${props.day} - Total Calories: ${totalCalories()} cal`);
    };

    const handleShareClick = (e) => {
      e.stopPropagation(); // Prevent card click
      alert(`Share ${props.day}'s meal plan`);
    };

    const handleAddClick = (e) => {
      e.stopPropagation(); // Prevent card click
      alert(`Add new meal to ${props.day}`);
    };

    return (
      <div 
        onClick={handleCardClick}
        class={`group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full cursor-pointer ${
          props.isSelected ? 'ring-2 ring-teal-500 ring-opacity-50' : ''
        }`}
      >
        {/* Card Header */}
        <div class="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class={`w-2 h-2 rounded-full ${
                props.day === 'Saturday' || props.day === 'Sunday' 
                  ? 'bg-orange-400' 
                  : 'bg-teal-400'
              }`}></div>
              <h3 class="font-semibold text-gray-800 text-lg">{props.day}</h3>
            </div>
            <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleShareClick} class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                <Share2 size={14} />
              </button>
              <button onClick={handleAddClick} class="p-1 text-gray-400 hover:text-teal-600 rounded-full hover:bg-teal-50 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {props.isCompact ? (
          <div class="mt-3 space-y-2 p-4">
            <For each={props.meals.slice(0, 1)}>
              {(meal) => (
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 truncate flex-1">{meal.name}</span>
                  <div class="flex items-center space-x-2 ml-2 flex-shrink-0">
                    <span class="text-xs text-gray-500">{meal.time}</span>
                    <div class="flex gap-0.5">
                      <For each={meal.icons.slice(0, 2)}>
                        {(icon) => <span class="text-sm">{icon}</span>}
                      </For>
                      {meal.icons.length > 2 && <span class="text-xs text-gray-400">+{meal.icons.length - 2}</span>}
                    </div>
                  </div>
                </div>
              )}
            </For>
            {props.meals.length > 1 && (
              <div class="text-xs text-gray-500 flex items-center justify-between">
                <span>+{props.meals.length - 1} more</span>
                <span class="text-teal-600 font-medium">{totalCalories()} cal</span>
              </div>
            )}
          </div>
        ) : (
          <div class="mt-4 space-y-3 p-4">
            <For each={props.meals}>
              {(meal) => (
                <div key={meal.name} class="group/meal flex items-start space-x-3 p-2 rounded-lg hover:bg-teal-50 transition-colors">
                  <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center mt-1">
                    <div class="flex gap-0.5">
                      <For each={meal.icons.slice(0, 2)}>
                        {(icon) => <span class="text-lg">{icon}</span>}
                      </For>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <h4 class="font-medium text-gray-800 text-sm leading-tight">{meal.name}</h4>
                      <span class="text-xs text-teal-600 font-medium ml-2 flex-shrink-0">{meal.calories} cal</span>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                      <span class="text-xs text-gray-500">{meal.time}</span>
                      <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="flex -space-x-1">
                          <For each={[1, 2, 3].slice(0, meal.people)}>
                            {(person) => (
                              <div class="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs">
                                👤
                              </div>
                            )}
                          </For>
                        </div>
                        <Users size={12} class="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>
            <div class="pt-3 mt-3 border-t border-gray-100">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Total: {totalCalories()} calories</span>
                <button onClick={() => alert(`View details for ${props.day}`)} class="text-teal-600 hover:text-teal-700 font-medium flex items-center space-x-1">
                  <TrendingUp size={12} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const EnhancedProgressChart = () => {
    const progressData = [
      { label: 'Protein', value: 72, color: 'from-teal-400 to-blue-500', bgColor: 'bg-teal-100' },
      { label: 'Carbs', value: 65, color: 'from-emerald-400 to-green-500', bgColor: 'bg-emerald-100' },
      { label: 'Fats', value: 58, color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-100' },
      { label: 'Fiber', value: 45, color: 'from-purple-400 to-pink-500', bgColor: 'bg-purple-100' }
    ];

    const handleChartClick = () => {
      alert('Weekly Progress Chart clicked! View full report.');
    };

    return (
      <div onClick={handleChartClick} class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 cursor-pointer">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <BarChart3 size={20} class="text-teal-600" />
            <span>Weekly Progress</span>
          </h3>
          <button onClick={() => alert('View Report clicked!')} class="text-teal-600 hover:text-teal-700 text-sm font-medium">
            View Report
          </button>
        </div>
        
        {/* Radial Progress */}
        <div class="relative w-48 h-48 mx-auto mb-6">
          <svg viewBox="0 0 36 36" class="w-32 h-32 transform -rotate-90 absolute inset-0 mx-auto">
            <circle 
              cx="18" 
              cy="18" 
              r="15.9155" 
              fill="none" 
              stroke="#e5e7eb" 
              strokeWidth="2"
            />
            <circle 
              cx="18" 
              cy="18" 
              r="15.9155" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="2"
              strokeDasharray="50, 100"
              class="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#14b8a6' }} />
                <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-800">78%</div>
              <div class="text-sm text-gray-500 mt-1">Goal Achieved</div>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div class="space-y-3">
          <For each={progressData}>
            {(item) => (
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class={`w-3 h-3 rounded-full ${item.bgColor}`}></div>
                  <span class="text-sm text-gray-700">{item.label}</span>
                </div>
                <div class="flex-1 mx-4">
                  <div class="bg-gray-200 rounded-full h-2">
                    <div 
                      class={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
                <span class="text-sm font-medium text-gray-700">{item.value}%</span>
              </div>
            )}
          </For>
        </div>

        {/* Quick Stats */}
        <div class="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div onClick={() => alert('Calories clicked: 1,820')} class="text-center p-3 bg-teal-50 rounded-lg cursor-pointer">
            <div class="text-2xl font-bold text-teal-600">1,820</div>
            <div class="text-xs text-teal-700 uppercase tracking-wide">Calories</div>
          </div>
          <div onClick={() => alert('Meals clicked: 6')} class="text-center p-3 bg-emerald-50 rounded-lg cursor-pointer">
            <div class="text-2xl font-bold text-emerald-600">6</div>
            <div class="text-xs text-emerald-700 uppercase tracking-wide">Meals</div>
          </div>
        </div>
      </div>
    );
  };

  const EnhancedMiniCalendar = () => {
    const calendarDays = generateCalendarDays();

    const handleDayClick = (day) => {
      if (day) {
        setSelectedDate(day);
        alert(`Selected date: ${day} ${months[currentMonth()]}`);
      }
    };

    const handlePrevMonthClick = () => {
      handlePrevMonth();
      alert(`Moved to previous month: ${months[currentMonth() === 0 ? 11 : currentMonth() - 1]} ${currentYear()}`);
    };

    const handleNextMonthClick = () => {
      handleNextMonth();
      alert(`Moved to next month: ${months[currentMonth() === 11 ? 0 : currentMonth() + 1]} ${currentYear()}`);
    };

    return (
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div class="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <div class="flex items-center justify-between">
            <button 
              onClick={handlePrevMonthClick}
              class="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 cursor-pointer"
              title="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <div class="text-center">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {months[currentMonth()]} {currentYear()}
              </h3>
              <div class="text-lg font-semibold text-gray-800 mt-1">
                {months[currentMonth()]} Overview
              </div>
            </div>
            <button 
              onClick={handleNextMonthClick}
              class="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 cursor-pointer"
              title="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <For each={daysOfWeek}>
            {(day) => (
              <div 
                onClick={() => alert(`Clicked on ${day}`)}
                class="bg-white py-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
              >
                {day}
              </div>
            )}
          </For>
        </div>

        {/* Days Grid */}
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <For each={calendarDays}>
            {(item) => {
              const isToday = item.date && 
                item.date.getDate() === new Date().getDate() && 
                item.date.getMonth() === new Date().getMonth() && 
                item.date.getFullYear() === new Date().getFullYear();
              const isSelected = item.day === selectedDate();
              const isHovered = hoveredDay() === item.day;
              const hasMeals = item.day && Math.random() > 0.3;

              return (
                <button
                  onClick={() => handleDayClick(item.day)}
                  onMouseEnter={() => item.day && setHoveredDay(item.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  class={`relative group p-2 text-sm font-medium transition-all duration-200 flex flex-col h-14 cursor-pointer ${
                    !item.day 
                      ? 'invisible' 
                      : isToday 
                        ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' 
                        : isSelected 
                          ? 'bg-gradient-to-br from-teal-500 to-blue-500 text-white shadow-lg' 
                          : isHovered 
                            ? 'bg-teal-50 text-teal-700 hover:bg-teal-100' 
                            : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={item.day ? `${item.day} ${months[item.date.getMonth()]}` : ''}
                >
                  <span class="text-xs">{item.day || ''}</span>
                  {item.day && hasMeals && (
                    <div class={`mt-0.5 w-full h-0.5 rounded-full ${
                      isSelected || isToday ? 'bg-white bg-opacity-50' : 'bg-teal-400'
                    }`}></div>
                  )}
                  {item.day && (
                    <div class={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-teal-500'
                    } opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  )}
                </button>
              );
            }}
          </For>
        </div>

        {/* Legend */}
        <div class="p-3 bg-gray-50">
          <div class="flex items-center justify-between text-xs">
            <div 
              onClick={() => alert('Legend: Has meals clicked')}
              class="flex items-center space-x-2 cursor-pointer hover:text-teal-600"
            >
              <div class="w-2 h-2 bg-teal-400 rounded-full"></div>
              <span class="text-gray-600">Has meals</span>
            </div>
            <div 
              onClick={() => alert('Legend: Today clicked')}
              class="flex items-center space-x-2 cursor-pointer hover:text-orange-600"
            >
              <div class="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span class="text-gray-600">Today</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

  return (
    <div class="flex min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <SidebarNavbar class="bg-olive-100" /> {/* Sesuaikan sidebar dengan hijau zaitun muda */}

      <div class="flex-1 flex flex-col">
        <AppNavbar onSearch={handleSearch} onQuickAction={handleQuickAction} pageContext="planner" showBreadcrumbs={false} />
      
        {/* Main Content */}
        <div class="flex-1 p-6 overflow-hidden">
          {/* Enhanced View Toggle */}
          <div class="flex items-center space-x-2 mb-8">
            <div class="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
              <For each={['Weekly', 'Monthly', 'Yearly']}>
                {(view) => (
                  <button
                    onClick={() => {
                      setCurrentView(view);
                      alert(`Switched to ${view} view`);
                    }}
                    class={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative cursor-pointer ${
                      currentView() === view 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg transform scale-105' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {currentView() === view && (
                      <div class="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-lg blur opacity-75"></div>
                    )}
                    <span class="relative z-10">{view}</span>
                  </button>
                )}
              </For>
            </div>
            <div 
              onClick={() => alert(`Showing ${currentView()} view • ${selectedDate()} ${months[currentMonth()]}`)}
              class="text-sm text-gray-500 ml-4 cursor-pointer hover:text-teal-600"
            >
              Showing {currentView()} view • {selectedDate()} {months[currentMonth()]}
            </div>
          </div>

          {/* Main Content Area */}
          <div class="flex gap-8 h-[calc(100vh-200px)]">
            {/* Main Calendar Content */}
            <div class="flex-1 overflow-hidden">
              <Show when={currentView() === 'Weekly'}>
                <div class="h-full space-y-6 overflow-y-auto pr-2">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <For each={weekDays.slice(0, 6)}>
                      {(day) => (
                        <MealCard 
                          day={day} 
                          meals={mealData[day]} 
                          isCompact={true}
                          isSelected={day === 'Tuesday'} // Today is Tuesday, 23rd Sept 2025
                        />
                      )}
                    </For>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <For each={['Sunday']}>
                      {(day) => (
                        <MealCard 
                          day={day} 
                          meals={mealData[day]} 
                          isCompact={false}
                          isSelected={false}
                        />
                      )}
                    </For>
                  </div>
                </div>
              </Show>
              
              <Show when={currentView() === 'Monthly'}>
                <div class="h-full p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl">
                  <div class="text-center">
                    <h2 
                      onClick={() => alert('Monthly View clicked')}
                      class="text-2xl font-bold text-gray-800 mb-4 cursor-pointer hover:text-teal-600"
                    >
                      Monthly View
                    </h2>
                    <p 
                      onClick={() => alert('Monthly description clicked')}
                      class="text-gray-600 mb-8 max-w-md mx-auto cursor-pointer hover:text-teal-600"
                    >
                      Plan your meals for the entire month with our comprehensive calendar view.
                    </p>
                    <div class="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                      <For each={[1, 2, 3, 4, 5, 6]}>
                        {(day) => (
                          <div 
                            onClick={() => alert(`Day ${day} clicked`)}
                            class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                          >
                            <div class="text-2xl mb-2">📅</div>
                            <h3 class="font-semibold text-gray-800">Day {day}</h3>
                            <p class="text-sm text-gray-600 mt-1">3 meals planned</p>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </Show>
            </div>

            {/* Enhanced Right Sidebar */}
            <div class="w-80 flex flex-col space-y-6">
              {/* Enhanced Mini Calendar */}
              <EnhancedMiniCalendar />
              
              {/* Enhanced Progress Chart */}
              <EnhancedProgressChart />
              
              {/* Quick Actions */}
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 
                  onClick={() => alert('Quick Actions header clicked')}
                  class="font-semibold text-gray-800 mb-4 flex items-center space-x-2 cursor-pointer hover:text-teal-600"
                >
                  <Clock size={18} class="text-teal-600" />
                  <span>Quick Actions</span>
                </h3>
                <div class="space-y-2">
                  <button 
                    onClick={() => handleQuickAction('quick-add')}
                    class="w-full flex items-center justify-center space-x-2 p-3 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-all group cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Add New Recipe</span>
                    <ChevronRight size={16} class="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </button>
                  <button 
                    onClick={() => handleQuickAction('today-plan')}
                    class="w-full flex items-center justify-center space-x-2 p-3 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-all group cursor-pointer"
                  >
                    <Calendar size={16} />
                    <span>Today\'s Plan</span>
                    <ChevronRight size={16} class="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </button>
                  <button 
                    onClick={() => handleQuickAction('analytics')}
                    class="w-full flex items-center justify-center space-x-2 p-3 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-all group cursor-pointer"
                  >
                    <BarChart3 size={16} />
                    <span>Track Nutrition</span>
                    <ChevronRight size={16} class="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </button>
                  <button 
                    onClick={() => handleQuickAction('favorites')}
                    class="w-full flex items-center justify-center space-x-2 p-3 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-all group cursor-pointer"
                  >
                    <Users size={16} />
                    <span>Share Plan</span>
                    <ChevronRight size={16} class="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlannerApp;