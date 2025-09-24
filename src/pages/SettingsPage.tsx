import { createSignal, For, onMount, Show, createMemo, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
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
    gender: 'Male',
    age: 25,
    bio: '',
    avatar: null
  });

  // Body measurements
  const [body, setBody] = createSignal({
    height: 170,
    currentWeight: 65,
    targetWeight: 62,
    waist: 78,
    chest: 95,
    thigh: 54,
    arm: 30,
  });

  // Goals & activity
  const [goal, setGoal] = createSignal<'Weight Loss' | 'Maintain' | 'Muscle Gain'>('Maintain');
  const [activity, setActivity] = createSignal('Lightly active');
  const [editProfile, setEditProfile] = createSignal<boolean>(true);

  // Saved snapshots to detect perubahan
  const [savedProfile, setSavedProfile] = createSignal<any>(null);
  const [savedBody, setSavedBody] = createSignal<any>(null);
  const [savedGA, setSavedGA] = createSignal<any>(null); // goals & activity

  const isEqual = (a: any, b: any) => {
    try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; }
  };

  // Logout modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = createSignal(false);
  const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowLogoutConfirm(false); };
  const confirmLogout = () => {
    try {
      localStorage.removeItem('auth:user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('auth:token');
      localStorage.removeItem('auth:demo');
    } catch {}
    navigate('/login');
  };
  const isProfileDirty = createMemo(() => savedProfile() ? !isEqual(profile(), savedProfile()) : false);
  const isBodyDirty = createMemo(() => savedBody() ? !isEqual(body(), savedBody()) : false);
  const isGADirty = createMemo(() => savedGA() ? !isEqual({ goal: goal(), activity: activity() }, savedGA()) : false);

  // Load from localStorage on mount
  onMount(() => {
    try {
      const p = localStorage.getItem('user:profile');
      if (p) setProfile({ ...profile(), ...JSON.parse(p) });
      const b = localStorage.getItem('user:body');
      if (b) setBody({ ...body(), ...JSON.parse(b) });
      const g = localStorage.getItem('user:goal');
      if (g) setGoal(JSON.parse(g));
      const a = localStorage.getItem('user:activity');
      if (a) setActivity(JSON.parse(a));
      // set snapshots after load
      setSavedProfile(profile());
      setSavedBody(body());
      setSavedGA({ goal: goal(), activity: activity() });
    } catch {}
  });

  // Save helpers and toast
  const [toast, setToast] = createSignal<string>('');
  let toastTimer: number | undefined;
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => setToast(''), 1800);
  };

  const saveProfile = () => {
    try {
      localStorage.setItem('user:profile', JSON.stringify(profile()));
      showToast('Profile saved');
      setSavedProfile(profile());
      setEditProfile(false);
    } catch {}
  };
  const saveBody = () => {
    try {
      localStorage.setItem('user:body', JSON.stringify(body()));
      showToast('Measurements saved');
      setSavedBody(body());
    } catch {}
  };
  const saveGoals = () => {
    try {
      localStorage.setItem('user:goal', JSON.stringify(goal()));
      localStorage.setItem('user:activity', JSON.stringify(activity()));
      showToast('Goals updated');
      setSavedGA({ goal: goal(), activity: activity() });
    } catch {}
  };

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
    <div
      class={`flex items-center justify-between p-4 transition-colors border-b border-gray-50 last:border-b-0 ${
        props.danger ? 'hover:bg-red-50' : 'hover:bg-gray-50'
      } ${props.onClick ? 'cursor-pointer' : ''}`}
      onClick={props.onClick}
      role={props.onClick ? 'button' : undefined}
      tabindex={props.onClick ? 0 : undefined}
    >
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
          <ChevronRight class={`${props.danger ? 'text-red-400' : 'text-gray-400'}`} size={20} />
        )}
      </div>
    </div>
  );

  const SettingSection = (props) => (
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div class="p-4 border-b border-gray-100 bg-gray-50">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">{props.title}</h2>
          {props.actionEl ? (
            props.actionEl
          ) : props.action ? (
            <button class="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
              {props.action}
            </button>
          ) : null}
        </div>
      </div>
      <div class="divide-y divide-gray-100">
        {props.children}
      </div>
    </div>
  );

  let nameInputRef: HTMLInputElement | undefined;
  createEffect(() => { if (editProfile()) setTimeout(() => nameInputRef?.focus(), 0); });

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
            onInput={(e) => setProfile({ ...profile(), name: (e.target as HTMLInputElement).value })}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Enter your name"
            disabled={!editProfile()}
            ref={(el) => (nameInputRef = el as HTMLInputElement)}
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
          <select 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={profile().dietaryPreference}
            onInput={(e) => setProfile({ ...profile(), dietaryPreference: (e.target as HTMLSelectElement).value })}
            disabled={!editProfile()}
          >
            <option>Balanced Diet</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Keto</option>
            <option>Paleo</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            value={profile().email}
            onInput={(e) => setProfile({ ...profile(), email: (e.target as HTMLInputElement).value })}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="you@example.com"
            disabled={!editProfile()}
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={profile().gender}
            onInput={(e) => setProfile({ ...profile(), gender: (e.target as HTMLSelectElement).value })}
            disabled={!editProfile()}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input 
            type="number" 
            value={profile().age}
            onInput={(e) => setProfile({ ...profile(), age: Number((e.target as HTMLInputElement).value) })}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="30"
            disabled={!editProfile()}
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea 
            value={profile().bio}
            onInput={(e) => setProfile({ ...profile(), bio: (e.target as HTMLTextAreaElement).value })}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            rows={3}
            placeholder="Tell us about your food preferences and goals..."
            disabled={!editProfile()}
          />
        </div>
      </div>
      
      <Show when={editProfile()}>
        <div class="mt-4">
          <button disabled={!isProfileDirty()} onClick={saveProfile} class={`px-6 py-2 rounded-lg font-medium ${isProfileDirty() ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
            Save Changes
          </button>
        </div>
      </Show>
    </div>
  );

  const navigate = useNavigate();

  return (
    <div class="flex h-screen overflow-hidden bg-gray-50"> 
      {/* Sidebar terpisah */}
      <SidebarNavbar />
      
      {/* Main Content */}
      <div class="flex-1 flex flex-col"> 
        <div class="p-7 ml-8 flex-1 overflow-y-auto"> 
          <div class="max-w-6xl">
            {/* Header with Back next to title (no breadcrumb) */}
            <div class="mb-6">
              <div class="rounded-xl p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                <div class="flex items-center gap-3">
                  <button onClick={() => window.history.back()} class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    <span class="text-sm">Back</span>
                  </button>
                  <Settings class="text-teal-500" size={26} />
                  <div>
                    <h1 class="text-2xl font-bold text-gray-800">Settings</h1>
                    <p class="text-gray-600">Customize your meal planning experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid layout */}
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left column */}
              <div class="md:col-span-8 space-y-6">
                {/* Profile Section */}
                <SettingSection title="Profile Information" actionEl={
                  editProfile()
                    ? <button disabled={!isProfileDirty()} onClick={saveProfile} class={`px-3 py-1.5 rounded-md text-sm font-medium ${isProfileDirty() ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Save Changes</button>
                    : <button onClick={() => setEditProfile(true)} class="px-3 py-1.5 rounded-md text-sm font-medium bg-teal-600 text-white hover:bg-teal-700">Edit</button>
                }>
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
              </div>

              {/* Right column */}
              <div class="md:col-span-4 space-y-6">
                {/* Body Measurements moved up */}
                <SettingSection title="Body Measurements" actionEl={
                  <button disabled={!isBodyDirty()} onClick={saveBody} class={`px-3 py-1.5 rounded-md text-sm font-medium ${isBodyDirty() ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Save</button>
                }>
                  <div class="grid grid-cols-2 md:grid-cols-2 gap-4 p-4">
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Height</label>
                      <input type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg" value={body().height} onInput={(e)=>setBody({ ...body(), height: Number((e.target as HTMLInputElement).value) })} />
                      <div class="text-xs text-gray-500 mt-1">cm</div>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Current weight</label>
                      <input type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg" value={body().currentWeight} onInput={(e)=>setBody({ ...body(), currentWeight: Number((e.target as HTMLInputElement).value) })} />
                      <div class="text-xs text-gray-500 mt-1">kg</div>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Target weight</label>
                      <input type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg" value={body().targetWeight} onInput={(e)=>setBody({ ...body(), targetWeight: Number((e.target as HTMLInputElement).value) })} />
                      <div class="text-xs text-gray-500 mt-1">kg</div>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Waist</label>
                      <input type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg" value={body().waist} onInput={(e)=>setBody({ ...body(), waist: Number((e.target as HTMLInputElement).value) })} />
                      <div class="text-xs text-gray-500 mt-1">cm</div>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Chest</label>
                      <input type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg" value={body().chest} onInput={(e)=>setBody({ ...body(), chest: Number((e.target as HTMLInputElement).value) })} />
                      <div class="text-xs text-gray-500 mt-1">cm</div>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Thigh</label>
                      <input type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg" value={body().thigh} onInput={(e)=>setBody({ ...body(), thigh: Number((e.target as HTMLInputElement).value) })} />
                      <div class="text-xs text-gray-500 mt-1">cm</div>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Arm</label>
                      <input type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg" value={body().arm} onInput={(e)=>setBody({ ...body(), arm: Number((e.target as HTMLInputElement).value) })} />
                      <div class="text-xs text-gray-500 mt-1">cm</div>
                    </div>
                  </div>
                </SettingSection>

                {/* Support */}
                <SettingSection title="Support & About">
                  <SettingItem
                    icon={<HelpCircle class="text-blue-600" size={20} />}
                    iconBg="bg-blue-100"
                    title="Help Center"
                    description="Browse FAQs and get help with common issues"
                    onClick={() => navigate('/help')}
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
                    onClick={() => setShowLogoutConfirm(true)}
                  />
                </SettingSection>
              </div>
            </div>

          </div>
        </div>
    </div>
    {/* Toast */}
    <Show when={toast()}>
      <div class="fixed bottom-4 right-4 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg opacity-90">
        {toast()}
      </div>
    </Show>

    {/* Logout Confirm Modal */}
    <Show when={showLogoutConfirm()}>
      <div class="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowLogoutConfirm(false)} onKeyDown={handleEsc} tabindex={-1}>
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-5" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <LogOut size={18} />
            </div>
            <div class="flex-1">
              <h3 id="logout-title" class="text-base font-semibold text-gray-800">Confirm Logout</h3>
              <p class="text-sm text-gray-600 mt-1">Are you sure you want to log out?</p>
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2">
            <button onClick={() => setShowLogoutConfirm(false)} class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</button>
            <button onClick={confirmLogout} class="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">Log out</button>
          </div>
        </div>
      </div>
    </Show>
  </div>
  );
};

export default SettingsPage;