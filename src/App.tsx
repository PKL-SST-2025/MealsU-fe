import type { Component } from "solid-js";
import { Router, Route } from "@solidjs/router";

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

const App: Component = () => {
  return (
    <Router>
        {/* Auth routes */}
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={SignupPage} />

        {/* Main app routes */}
        <Route path="/home" component={HomePage} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/recipes" component={RecipesPage} />
        <Route path="/meals" component={MealsPage} />
        <Route path="/shopping" component={Shopping} />
        <Route path="/planner" component={PlannerPage} />
        <Route path="/planner/:id" component={PlannerDetailPage} />

        <Route path="/settings" component={Settings} />
        <Route path="/help" component={Help} />
    </Router>
  );
};

export default App;
