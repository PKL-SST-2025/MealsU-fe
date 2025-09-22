import type { Component } from 'solid-js';

const Navbar: Component = () => {
  return (
    <header class="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-gray-100">
      <div class="mx-auto max-w-6xl px-4">
        <div class="flex h-14 items-center justify-between">
          <a href="/" class="flex items-center gap-2">
            <img src="/logo.svg" alt="MealsU" class="h-7 w-auto" />
            <span class="text-lg font-semibold text-gray-900"></span>
          </a>
          <nav class="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a class="hover:text-gray-900" href="/">Home</a>
            <a class="hover:text-gray-900" href="#features">Features</a>
            <a class="hover:text-gray-900" href="#testimonials">Testimonials</a>
            <a class="hover:text-gray-900" href="#faq">FAQ</a>
          </nav>
          <div class="flex items-center gap-2">
            <a href="/login" class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              Sign In
            </a>
            <a href="/register" class="rounded-lg bg-[#606C38] px-4 py-2 text-sm font-medium text-white hover:bg-[#4f5a2f]">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
