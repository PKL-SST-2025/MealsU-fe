 import type { Component } from 'solid-js';
 import Navbar from '../components/Navbar';

const Input = (props: {
  type?: string;
  placeholder?: string;
  name?: string;
}) => (
  <input
    type={props.type ?? 'text'}
    name={props.name}
    placeholder={props.placeholder}
    class="w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/40"
  />
);

const LoginPage: Component = () => {
  return (
    <div class="min-h-screen">
      {/* Top Nav */}
      <Navbar />

      {/* Background + Center Card (crop image, no scroll) */}
      <section class="relative h-[calc(100vh-57px)] overflow-hidden">
        {/* Background image */}
        <div class="absolute inset-0 z-0">
          <img src="/food.png" alt="Healthy food" class="h-full w-full object-cover" />
          {/* No overlay to keep image vivid */}
        </div>

        <div class="relative z-10 mx-auto flex h-full max-w-6xl items-center justify-center px-4 py-6">
          <div class="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
            {/* Mini logo */}
            <div class="mb-2 inline-flex items-center gap-2">
              <img src="/logo.svg" alt="MealsU" class="h-7 w-auto" />
              <span class="text-sm font-semibold text-gray-800"></span>
            </div>

            <h1 class="text-2xl font-bold text-gray-900">Sign in</h1>
            <p class="mt-1 text-sm text-gray-600">Masuk untuk melanjutkan ke MealsU</p>

            <form class="mt-6 space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">Email</label>
                <Input type="email" name="email" placeholder="you@example.com" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">Password</label>
                <Input type="password" name="password" placeholder="Password" />
              </div>
              <div class="flex items-center justify-between text-xs">
                <label class="inline-flex items-center gap-2">
                  <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span class="text-gray-700">Remember me</span>
                </label>
                <a href="#" class="text-[#606C38] hover:underline">Forgot password?</a>
              </div>

              <button type="submit" class="mt-2 w-full rounded-lg bg-[#606C38] py-2 text-sm font-semibold text-white hover:bg-[#4f5a2f]">Sign in</button>

              <div class="text-center text-xs text-gray-600">
                Belum punya akun? <a href="#" class="font-medium text-green-700 hover:underline">Sign up</a>
              </div>
            </form>

            {/* Social (opsional placeholder) */}
            <div class="mt-4 grid grid-cols-2 gap-2">
              <button class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50">Google</button>
              <button class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50">Apple</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
