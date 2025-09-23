import { Component, createSignal } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import { Home, Calendar, Utensils, BookOpen, ShoppingCart, Settings, HelpCircle, LogOut } from "lucide-solid";

const SidebarNavbar: Component = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State untuk konfirmasi logout
  const [showLogoutConfirm, setShowLogoutConfirm] = createSignal(false);

  // Navigation items dengan path dan tooltip
  const navigationItems = [
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
      <div class="w-16 bg-white shadow-sm flex flex-col items-center py-6 space-y-6 relative">
        {/* Logo/Home */}
        <div 
          class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors group relative"
          onClick={() => handleNavigation("/home")}
          title="Home"
        >
          <Home class="w-5 h-5 text-white" />
          
          {/* Tooltip */}
          <div class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            Home
          </div>
        </div>

        {/* Main Navigation */}
        <div class="flex flex-col space-y-4">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div class="relative group">
                <IconComponent 
                  class={`w-6 h-6 cursor-pointer transition-colors ${
                    isActive(item.path) 
                      ? 'text-green-600' 
                      : 'text-gray-400 hover:text-green-600'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                />
                
                {/* Tooltip */}
                <div class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.tooltip}
                </div>
                
                {/* Active indicator */}
                {isActive(item.path) && (
                  <div class="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-green-600 rounded-r"></div>
                )}
              </div>
            );
          })}
        </div>

        <div class="flex-1"></div>

        {/* Bottom Navigation */}
        <div class="flex flex-col space-y-4">
          {bottomItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div class="relative group">
                <IconComponent 
                  class={`w-6 h-6 cursor-pointer transition-colors ${
                    isActive(item.path) 
                      ? 'text-green-600' 
                      : 'text-gray-400 hover:text-green-600'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                />
                
                {/* Tooltip */}
                <div class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.tooltip}
                </div>
                
                {/* Active indicator */}
                {isActive(item.path) && (
                  <div class="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-green-600 rounded-r"></div>
                )}
              </div>
            );
          })}
          
          {/* Logout Button */}
          <div class="relative group">
            <LogOut 
              class="w-6 h-6 cursor-pointer text-gray-400 hover:text-red-600 transition-colors"
              onClick={handleLogout}
            />
            
            {/* Tooltip */}
            <div class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Logout
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <LogOut class="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                <p class="text-sm text-gray-600">Are you sure you want to logout?</p>
              </div>
            </div>
            
            <div class="flex gap-3 justify-end">
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
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarNavbar;