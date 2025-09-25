import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Navbar from '../components/Navbar';
import { apiFetch } from '../lib/api';

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

const SignupPage: Component = () => {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    if (!email().trim() || !password().trim()) {
      setError('Email dan password wajib diisi');
      return;
    }
    setSubmitting(true);
    const res = await apiFetch<{ token: string }>("/auth/register", {
      method: 'POST',
      body: JSON.stringify({ email: email(), password: password() })
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || 'Registrasi gagal');
      return;
    }
    // Setelah register berhasil, arahkan ke login
    navigate('/login');
  };

  return (
    <div class="min-h-screen">
      {/* Top Nav */}
      <Navbar />

      {/* Background + Center Card (crop image, no scroll) */}
      <section class="relative h-[calc(100vh-57px)] overflow-hidden">
        {/* Background image */}
        <div class="absolute inset-0 z-0">
          <img src="/food.png" alt="Healthy food" class="h-full w-full object-cover" />
        </div>

        <div class="relative z-10 mx-auto flex h-full max-w-6xl items-center justify-center px-4 py-6">
          <div class="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
            {/* Mini logo */}
            <div class="mb-2 inline-flex items-center gap-2">
              <img src="/logo.svg" alt="MealsU" class="h-7 w-auto" />
              <span class="text-sm font-semibold text-gray-800">MealsU</span>
            </div>

            <h1 class="text-2xl font-bold text-gray-900">Sign up</h1>
            <p class="mt-1 text-sm text-gray-600">Daftar untuk menikmati fitur MealsU</p>

            <form class="mt-6 space-y-3" onSubmit={onSubmit}>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">Your Name</label>
                <Input name="name" placeholder="Nama lengkap" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  class="w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/40"
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">Email</label>
                <input type="email" name="email" placeholder="you@example.com"
                       value={email()} onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                       class="w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/40"/>
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">Password</label>
                <input type="password" name="password" placeholder="Password"
                       value={password()} onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                       class="w-full rounded-lg border border-gray-300 bg-white/90 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/40"/>
              </div>

              {error() && (
                <div class="text-xs text-red-600">{error()}</div>
              )}

              <button type="submit" disabled={submitting()} class="mt-2 w-full rounded-lg py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed bg-[#606C38] hover:bg-[#4f5a2f]">
                {submitting() ? 'Processing...' : 'Sign up'}
              </button>

              <div class="text-center text-xs text-gray-600">
                Sudah punya akun? <a href="/login" class="font-medium text-[#606C38] hover:underline">Sign in</a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;
