import { Component, createSignal } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import { Home, Calendar, Utensils, BookOpen, ShoppingCart, Settings, HelpCircle, LogOut } from "lucide-solid";

const SidebarNavbar: Component<{ class?: string }> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State untuk konfirmasi logout
  const [showLogoutConfirm, setShowLogoutConfirm] = createSignal(false);

  // Navigation items dengan path dan tooltip
  const navigationItems = [
    { icon: Home, path: "/home", tooltip: "Home", label: "Home" },
    { icon: Calendar, path: "/calendar", tooltip: "Calendar", label: "Calendar" },
    { icon: Utensils, path: "/meals", tooltip: "Meals", label: "Meals" },
    { icon: BookOpen, path: "/recipes", tooltip: "Recipes", label: "Recipes" },
    { icon: ShoppingCart, path: "/shopping", tooltip: "Shopping List", label: "Shopping" },
  ];

  const bottomItems = [
    { icon: HelpCircle, path: "/help", tooltip: "Help", label: "Help" }
  ];

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Handle logout dengan konfirmasi
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear user session
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Redirect to login
    navigate('/login');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Check if current path matches navigation item
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <div class={`${props.class ?? ''} fixed top-0 left-0 h-screen w-24 bg-teal-50/80 backdrop-blur-sm border-r border-teal-100 shadow-sm flex flex-col items-center py-5 space-y-5 relative z-40 rounded-r-3xl transition-opacity ${showLogoutConfirm() ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Brand Circle */}
        <div 
          class="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors shadow"
          onClick={() => handleNavigation("/home")}
          title="Home"
        >
          <div class="w-4 h-4 bg-white rounded-full"></div>
        </div>

        {/* Main Navigation */}
        <nav class="flex flex-col items-center space-y-4 w-full px-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            return (
              <button
                class={`w-full group transition-all duration-200 ${active ? '' : 'hover:opacity-90'}`}
                onClick={() => handleNavigation(item.path)}
                title={item.tooltip}
              >
                {active ? (
                  <div class="bg-white rounded-2xl shadow px-2 py-2 flex flex-col items-center w-full">
                    <IconComponent class="w-6 h-6 text-teal-600" />
                    <span class="text-[12px] font-medium text-teal-600 mt-1">{item.label}</span>
                  </div>
                ) : (
                  <div class="flex flex-col items-center text-gray-500">
                    <IconComponent class="w-6 h-6" />
                    <span class="text-[11px] mt-1">{item.label}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div class="flex-1" />

        {/* Bottom Navigation */}
        <nav class="flex flex-col items-center space-y-4 w-full px-2">
          {bottomItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            return (
              <button
                class={`w-full group transition-all duration-200 ${active ? '' : 'hover:opacity-90'}`}
                onClick={() => handleNavigation(item.path)}
                title={item.tooltip}
              >
                {active ? (
                  <div class="bg-white rounded-2xl shadow px-2 py-2 flex flex-col items-center w-full">
                    <IconComponent class="w-6 h-6 text-teal-600" />
                    <span class="text-[12px] font-medium text-teal-600 mt-1">{item.label}</span>
                  </div>
                ) : (
                  <div class="flex flex-col items-center text-gray-500">
                    <IconComponent class="w-6 h-6" />
                    <span class="text-[11px] mt-1">{item.label}</span>
                  </div>
                )}
              </button>
            );
          })}

          {/* Logout */}
          <button class="flex flex-col items-center text-gray-500 hover:text-red-600 transition-colors" onClick={handleLogout} title="Logout">
            <LogOut class="w-6 h-6" />
            <span class="text-[11px] mt-1">Log out</span>
          </button>
        </nav>
      </div>

      {/* Spacer to preserve layout width so content doesn't go under the fixed sidebar */}
      <div class="w-24" aria-hidden="true"></div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm() && (
        <div 
          class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
          onClick={cancelLogout}
          onKeyDown={(e) => { if ((e as unknown as KeyboardEvent).key === 'Escape') cancelLogout(); }}
          tabindex={-1}
        >
          <div 
            class="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog" aria-modal="true" aria-labelledby="sidebar-logout-title"
          >
            <div class="flex items-start gap-3 mb-4">
              <div class="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut class="w-5 h-5 text-red-600" />
              </div>
              <div class="flex-1">
                <h3 id="sidebar-logout-title" class="text-base font-semibold text-gray-900">Confirm Logout</h3>
                <p class="text-sm text-gray-600">Are you sure you want to log out?</p>
              </div>
            </div>
            <div class="flex gap-2 justify-end">
              <button
                onClick={cancelLogout}
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarNavbar;