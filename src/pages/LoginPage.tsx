import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Navbar from "../components/Navbar";
import { apiFetch, authHeader } from "../lib/api";

const Input = (props: {
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onInput?: (e: InputEvent) => void;
  error?: string;
}) => (
  <div>
    <input
      type={props.type ?? "text"}
      name={props.name}
      value={props.value}
      onInput={props.onInput}
      placeholder={props.placeholder}
      class={`w-full rounded-lg border ${
        props.error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40' : 'border-gray-300 focus:border-[#606C38] focus:ring-[#606C38]/40'
      } bg-white/90 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2`}
    />
    {props.error && (
      <p class="mt-1 text-xs text-red-600">{props.error}</p>
    )}
  </div>
);

const LoginPage: Component = () => {
  const navigate = useNavigate();
  
  // State untuk form fields
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [rememberMe, setRememberMe] = createSignal(false);
  
  // State untuk validasi dan loading
  const [errors, setErrors] = createSignal<{email?: string; password?: string}>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  // Fungsi validasi email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Fungsi validasi form
  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email().trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!validateEmail(email())) {
      newErrors.email = "Format email tidak valid";
    }
    
    if (!password().trim()) {
      newErrors.password = "Password harus diisi";
    } else if (password().length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit form
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email(), password: password() }),
      });

      if (!res.ok) {
        setErrors({ email: res.error || "Login gagal. Silakan coba lagi." });
        return;
      }

      // Simpan token JWT & email
      localStorage.setItem("token", res.data.token);
      localStorage.setItem('userEmail', email());

      // Ambil profil dasar agar akun tersimpan dan bisa dipakai di halaman lain
      const me = await apiFetch<{ email: string }>("/auth/me", { headers: { ...authHeader() } });
      if (me.ok) {
        try {
          localStorage.setItem('auth:user', JSON.stringify({ email: me.data.email }));
        } catch {}
      }

      // Simpan email jika remember me dicentang
      if (rememberMe()) {
        localStorage.setItem('rememberedEmail', email());
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Redirect ke home page
      navigate("/home", { replace: true });
      
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ email: "Login gagal. Silakan coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load remembered email saat component mount
  createEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  });

  // Clear error saat user mengetik
  createEffect(() => {
    if (email() && errors().email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  });

  createEffect(() => {
    if (password() && errors().password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  });

  return (
    <div class="min-h-screen">
      <Navbar />

      <section class="relative h-[calc(100vh-57px)] overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img src="/food.png" alt="Healthy food" class="h-full w-full object-cover" />
        </div>

        <div class="relative z-10 mx-auto flex h-full max-w-6xl items-center justify-center px-4 py-6">
          <div class="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
            <div class="mb-2 inline-flex items-center gap-2">
              <img src="/logo.svg" alt="MealsU" class="h-7 w-auto" />
            </div>

            <h1 class="text-2xl font-bold text-gray-900">Sign in</h1>
            <p class="mt-1 text-sm text-gray-600">Masuk untuk melanjutkan ke MealsU</p>

            <form class="mt-6 space-y-3" onSubmit={handleSubmit}>
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">Email</label>
                <Input 
                  type="email" 
                  name="email" 
                  placeholder="you@example.com"
                  value={email()}
                  onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                  error={errors().email}
                />
              </div>
              
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">Password</label>
                <Input 
                  type="password" 
                  name="password" 
                  placeholder="Password"
                  value={password()}
                  onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                  error={errors().password}
                />
              </div>
              
              <div class="flex items-center justify-between text-xs">
                <label class="inline-flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={rememberMe()}
                    onChange={(e) => setRememberMe((e.target as HTMLInputElement).checked)}
                    class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                  />
                  <span class="text-gray-700">Remember me</span>
                </label>
                <a href="#" class="text-[#606C38] hover:underline">Forgot password?</a>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting()}
                class={`mt-2 w-full rounded-lg py-2 text-sm font-semibold text-white transition-colors ${
                  isSubmitting() 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#606C38] hover:bg-[#4f5a2f]'
                }`}
              >
                {isSubmitting() ? (
                  <div class="flex items-center justify-center gap-2">
                    <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>

              <div class="text-center text-xs text-gray-600">
                Belum punya akun? <a href="#" class="font-medium text-green-700 hover:underline">Sign up</a>
              </div>
            </form>

            <div class="mt-4 grid grid-cols-2 gap-2">
              <button class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50">
                Google
              </button>
              <button class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50">
                Apple
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;