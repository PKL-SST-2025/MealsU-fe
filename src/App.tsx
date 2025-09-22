import type { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={SignupPage} />
    </Router>
  );
};

export default App;
