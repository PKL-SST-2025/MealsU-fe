import type { Component, JSXElement } from "solid-js";
import { Router, Route, useNavigate } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { apiFetch, authHeader } from "./lib/api";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import RecipesPage from "./pages/RecipesPage";
import MealsPage from "./pages/MealsPage";
import Shopping from "./pages/ShoppingPage";

import Settings from "./pages/SettingsPage";
import PlannerPage from "./pages/PlannerPage";
import PlannerDetailPage from "./pages/PlannerDetailPage";
import Help from "./pages/HelpPage";

const RequireAuth: Component<{ children: JSXElement }> = (props) => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = createSignal<boolean | null>(null);

  onMount(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAllowed(false);
      navigate("/login", { replace: true });
      return;
    }

    // Verifikasi token ke backend
    (async () => {
      const res = await apiFetch<{ email: string }>("/auth/me", {
        headers: { ...authHeader() },
      });
      if (!res.ok) {
        localStorage.removeItem("token");
        setAllowed(false);
        navigate("/login", { replace: true });
        return;
      }
      setAllowed(true);
    })();
  });

  // Jangan render anak sebelum verifikasi selesai; jika tidak allowed, render null saja.
  return (
    <Show when={allowed() === true} fallback={null}>
      {props.children}
    </Show>
  );
};

const RequireGuest: Component<{ children: JSXElement }> = (props) => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = createSignal<boolean | null>(null);

  onMount(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAllowed(true);
      return;
    }

    // Verifikasi token ke backend
    (async () => {
      const res = await apiFetch<{ email: string }>("/auth/me", {
        headers: { ...authHeader() },
      });
      if (res.ok) {
        // User sudah login, redirect ke home
        setAllowed(false);
        navigate("/home", { replace: true });
        return;
      }
      // Token invalid, hapus dan izinkan akses
      localStorage.removeItem("token");
      setAllowed(true);
    })();
  });

  // Jangan render anak sebelum verifikasi selesai; jika tidak allowed, render null saja.
  return (
    <Show when={allowed() === true} fallback={null}>
      {props.children}
    </Show>
  );
};

// Wrapper components untuk rute guest (tidak boleh sudah login)
const GuestLogin: Component = () => (
  <RequireGuest>
    <LoginPage />
  </RequireGuest>
);

const GuestSignup: Component = () => (
  <RequireGuest>
    <SignupPage />
  </RequireGuest>
);

// Wrapper components untuk rute terlindungi
const ProtectedHome: Component = () => (
  <RequireAuth>
    <HomePage />
  </RequireAuth>
);

const ProtectedCalendar: Component = () => (
  <RequireAuth>
    <CalendarPage />
  </RequireAuth>
);

const ProtectedRecipes: Component = () => (
  <RequireAuth>
    <RecipesPage />
  </RequireAuth>
);

const ProtectedMeals: Component = () => (
  <RequireAuth>
    <MealsPage />
  </RequireAuth>
);

const ProtectedShopping: Component = () => (
  <RequireAuth>
    <Shopping />
  </RequireAuth>
);

const ProtectedPlanner: Component = () => (
  <RequireAuth>
    <PlannerPage />
  </RequireAuth>
);

const ProtectedPlannerDetail: Component = () => (
  <RequireAuth>
    <PlannerDetailPage />
  </RequireAuth>
);

const ProtectedSettings: Component = () => (
  <RequireAuth>
    <Settings />
  </RequireAuth>
);

const ProtectedHelp: Component = () => (
  <RequireAuth>
    <Help />
  </RequireAuth>
);

const App: Component = () => {
  return (
    <Router>
        {/* Auth routes */}
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={GuestLogin} />
        <Route path="/register" component={GuestSignup} />

        {/* Main app routes (protected) */}
        <Route path="/home" component={ProtectedHome} />
        <Route path="/calendar" component={ProtectedCalendar} />
        <Route path="/recipes" component={ProtectedRecipes} />
        <Route path="/meals" component={ProtectedMeals} />
        <Route path="/shopping" component={ProtectedShopping} />
        <Route path="/planner" component={ProtectedPlanner} />
        <Route path="/planner/:id" component={ProtectedPlannerDetail} />

        <Route path="/settings" component={ProtectedSettings} />
        <Route path="/help" component={ProtectedHelp} />
    </Router>
  );
};

export default App;
