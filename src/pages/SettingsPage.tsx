import { createSignal, For } from 'solid-js';
import SidebarNavbar from '../components/SidebarNavbar'; // ✅ Import sidebar terpisah
import { 
  Search, Bell, User, Settings, Shield, Globe, 
  Palette, Clock, Utensils, Scale, Heart, 
  ChevronRight, Camera, Edit2,
  Trash2, LogOut, HelpCircle, Info
} from 'lucide-solid'; // ✅ Ganti ke lucide-solid

const SettingsPage = () => {
  // Settings state
  const [notifications, setNotifications] = createSignal(true);
  const [darkMode, setDarkMode] = createSignal(false);
  const [autoSync, setAutoSync] = createSignal(true);
  const [mealReminders, setMealReminders] = createSignal(true);
  const [weeklyPlanning, setWeeklyPlanning] = createSignal(false);
  const [metricUnits, setMetricUnits] = createSignal(true);

  // Profile info
  const [profile, setProfile] = createSignal({
    name: 'John Doe',
    email: 'john.doe@example.com',
    dietaryPreference: 'Balanced Diet',
    avatar: null
  });

  // Language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  const ToggleSwitch = (props) => (
    <div class="flex items-center">
      <button
        class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          props.checked ? 'bg-teal-600 shadow-inner' : 'bg-gray-200'
        }`}
        onClick={() => props.onChange(!props.checked)}
        role="switch"
        aria-checked={props.checked}
      >
        <span class="sr-only">{props.checked ? 'On' : 'Off'}</span>
        <span
          class={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
            props.checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SettingItem = (props) => (
    <div class={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${
      props.danger ? 'hover:bg-red-50' : ''
    }`}>
      <div class="flex items-center space-x-3">
        <div class={`p-2 rounded-lg flex-shrink-0 ${props.iconBg || 'bg-gray-100'}`}>
          {props.icon}
        </div>
        <div class="min-w-0 flex-1">
          <h3 class={`font-medium ${props.danger ? 'text-red-800' : 'text-gray-800'}`}>
            {props.title}
          </h3>
          {props.description && (
            <p class="text-sm text-gray-500 line-clamp-2">{props.description}</p>
          )}
        </div>
      </div>
      <div class="flex items-center space-x-2">
        {props.value && (
          <span class={`text-sm ${props.danger ? 'text-red-600' : 'text-gray-500'}`}>
            {props.value}
          </span>
        )}
        {props.toggle ? (
          <ToggleSwitch 
            checked={props.checked} 
            onChange={props.onChange}
          />
        ) : props.select ? (
          <select class="text-sm text-gray-500 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded pr-8 appearance-none">
            <option>{props.value}</option>
          </select>
        ) : (
          <ChevronRight class={`text-gray-400 ${props.danger ? 'text-red-400' : ''}`} size={20} />
        )}
      </div>
    </div>
  );

  const SettingSection = (props) => (
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div class="p-4 border-b border-gray-100 bg-gray-50">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">{props.title}</h2>
          {props.action && (
            <button class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
              {props.action}
            </button>
          )}
        </div>
      </div>
      <div class="divide-y divide-gray-100">
        {props.children}
      </div>
    </div>
  );

  const ProfileEditor = () => (
    <div class="p-6 bg-gray-50">
      <div class="flex items-center space-x-4 mb-6">
        <div class="relative">
          <div class={`w-20 h-20 bg-gradient-to-br ${profile().avatar ? 'from-teal-400 to-blue-500' : 'from-orange-400 to-red-500'} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
            {profile().avatar ? (
              <img src={profile().avatar} alt="Profile" class="w-full h-full rounded-full object-cover" />
            ) : (
              profile().name.split(' ').map(n => n[0]).join('')
            )}
          </div>
          <button class="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors shadow-md">
            <Camera size={16} />
          </button>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-800 mb-1">{profile().name}</h3>
          <p class="text-gray-600 mb-2">{profile().email}</p>
          <div class="flex items-center gap-2 text-sm text-teal-600 bg-teal-100 px-3 py-1 rounded-full">
            <Utensils size={14} />
            {profile().dietaryPreference}
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input 
            type="text" 
            value={profile().name}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
          <select 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option>Balanced Diet</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Keto</option>
            <option>Paleo</option>
          </select>
        </div>
      </div>
      
      <div class="mt-4">
        <button class="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div class="flex h-screen overflow-hidden bg-gray-50"> 
      {/* Sidebar terpisah */}
      <SidebarNavbar />
      
      {/* Main Content */}
      <div class="flex-1 flex flex-col"> 
        <div class="p-6 flex-1 overflow-y-auto"> 
          <div class="max-w-4xl">
            <div class="flex items-center gap-4 mb-8">
              <Settings class="text-teal-500" size={32} />
              <div>
                <h1 class="text-3xl font-bold text-gray-800">Settings</h1>
                <p class="text-gray-600">Customize your meal planning experience</p>
              </div>
            </div>

            {/* Profile Section */}
            <SettingSection title="Profile Information">
              <ProfileEditor />
            </SettingSection>

            {/* Meal Planning Section */}
            <SettingSection title="Meal Planning">
              <SettingItem
                icon={<Clock class="text-teal-600" size={20} />}
                iconBg="bg-teal-100"
                title="Meal Reminders"
                description="Get notified about your scheduled meals and cooking times"
                toggle={true}
                checked={mealReminders()}
                onChange={setMealReminders}
              />
              <SettingItem
                icon={<Utensils class="text-blue-600" size={20} />}
                iconBg="bg-blue-100"
                title="Weekly Planning"
                description="Enable weekly meal planning with automatic suggestions"
                toggle={true}
                checked={weeklyPlanning()}
                onChange={setWeeklyPlanning}
              />
              <SettingItem
                icon={<Scale class="text-purple-600" size={20} />}
                iconBg="bg-purple-100"
                title="Measurement Units"
                description="Choose between metric or imperial units for recipes"
                value={metricUnits() ? "Metric (kg, L)" : "Imperial (lbs, cups)"}
                toggle={true}
                checked={metricUnits()}
                onChange={setMetricUnits}
              />
              <SettingItem
                icon={<Heart class="text-red-600" size={20} />}
                iconBg="bg-red-100"
                title="Dietary Preferences"
                description="Set your dietary restrictions and preferences"
                value={profile().dietaryPreference}
              />
            </SettingSection>

            {/* App Preferences */}
            <SettingSection title="App Preferences">
              <SettingItem
                icon={<Bell class="text-orange-600" size={20} />}
                iconBg="bg-orange-100"
                title="Push Notifications"
                description="Receive timely notifications for meals and updates"
                toggle={true}
                checked={notifications()}
                onChange={setNotifications}
              />
              <SettingItem
                icon={<Palette class="text-indigo-600" size={20} />}
                iconBg="bg-indigo-100"
                title="Dark Mode"
                description="Switch to dark theme for better night viewing"
                toggle={true}
                checked={darkMode()}
                onChange={setDarkMode}
              />
              <SettingItem
                icon={<Globe class="text-green-600" size={20} />}
                iconBg="bg-green-100"
                title="Language"
                description="Choose your preferred app language"
                select={true}
                value="English"
              />
              <SettingItem
                icon={<Settings class="text-gray-600" size={20} />}
                iconBg="bg-gray-100"
                title="Auto Sync"
                description="Automatically sync your data across devices"
                toggle={true}
                checked={autoSync()}
                onChange={setAutoSync}
              />
            </SettingSection>

            {/* Data & Privacy */}
            <SettingSection title="Data & Privacy">
              <SettingItem
                icon={<Shield class="text-blue-600" size={20} />}
                iconBg="bg-blue-100"
                title="Privacy Settings"
                description="Manage your data sharing and privacy preferences"
              />
              <SettingItem
                icon={<User class="text-gray-600" size={20} />}
                iconBg="bg-gray-100"
                title="Data Export"
                description="Download your meal plans, recipes, and preferences"
              />
              <SettingItem
                icon={<Trash2 class="text-red-600" size={20} />}
                iconBg="bg-red-50"
                title="Delete Account"
                description="Permanently delete your account and all associated data"
                danger={true}
              />
            </SettingSection>

            {/* Support */}
            <SettingSection title="Support & About">
              <SettingItem
                icon={<HelpCircle class="text-blue-600" size={20} />}
                iconBg="bg-blue-100"
                title="Help Center"
                description="Browse FAQs and get help with common issues"
              />
              <SettingItem
                icon={<Info class="text-gray-600" size={20} />}
                iconBg="bg-gray-100"
                title="About Meal Planner"
                description="Learn more about the app and our mission"
                value="v2.1.3"
              />
              <SettingItem
                icon={<LogOut class="text-red-600" size={20} />}
                iconBg="bg-red-50"
                title="Sign Out"
                description="Sign out of your account and return to login"
                danger={true}
              />
            </SettingSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;