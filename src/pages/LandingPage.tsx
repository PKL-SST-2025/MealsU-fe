 import type { Component } from 'solid-js';
 import { createSignal } from 'solid-js';
 import Navbar from '../components/Navbar';

const faqs = [
  {
    q: 'Apakah ada rekomendasi asupan kalori harian?',
    a: 'Ya. Setelah onboarding, sistem menghitung kebutuhan kalori harian berdasarkan tujuan, umur, berat, tinggi, dan preferensi.'
  },
  {
    q: 'Bisakah mengekspor daftar belanja?',
    a: 'Bisa. Daftar belanja dapat diekspor ke PDF/Print dari halaman Shopping List.'
  },
  {
    q: 'Apakah mendukung alergi / pantangan tertentu?',
    a: 'Dapat menandai preferensi makanan saat onboarding dan memfilter resep sesuai pantangan.'
  }
];

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Pekerja Kantoran',
    text:
      'MealsU membuat perencanaan makan harian jadi gampang dan konsisten. Berat badan turun, energi stabil!'
  },
  {
    name: 'William P.',
    role: 'Mahasiswa',
    text:
      'Resep sehatnya enak dan mudah diikuti. Shopping List-nya auto banget, tinggal ceklist pas belanja.'
  },
  {
    name: 'Anindita S.',
    role: 'Ibu Rumah Tangga',
    text:
      'Suka fitur progress tracker untuk melihat tren. Membantu keluarga tetap di jalur pola makan sehat.'
  }
];

const FeatureCard: Component<{ icon: string; title: string; desc: string }> = (props) => (
  <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
      <span class="text-lg">{props.icon}</span>
    </div>
    <h3 class="text-lg font-semibold text-gray-900">{props.title}</h3>
    <p class="mt-1 text-sm text-gray-600">{props.desc}</p>
  </div>
);

const FAQItem: Component<{ q: string; a: string }> = (props) => {
  const [open, setOpen] = createSignal(false);
  return (
    <div class="rounded-lg border border-gray-200 bg-white">
      <button
        class="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
        onClick={() => setOpen(!open())}
      >
        <span class="font-medium text-gray-900">{props.q}</span>
        <svg
          class={`h-5 w-5 text-gray-500 transition-transform ${open() ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open() && <div class="px-4 pb-4 text-sm text-gray-600">{props.a}</div>}
    </div>
  );
};

const LandingPage: Component = () => {
  return (
    <div class="min-h-screen bg-gray-50">
      {/* Nav */}
      <Navbar />

      {/* Hero */}
      <section class="relative">
        <div class="relative h-[440px] w-full overflow-hidden">
          <img
            src="/healthyfood.png"
            alt="Healthy food"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div class="absolute inset-0 bg-black/60" />
          <div class="relative z-10 mx-auto max-w-6xl px-4 py-20 text-center">
            <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">New • Meal Planner</span>
            <h1 class="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Eat Smart, Live Well.
              <br />
              Your Personal Meal Planner.
            </h1>
            <p class="mx-auto mt-4 max-w-2xl text-base text-white/80">
              Stop guessing your daily meals. Dapatkan rencana makan personal, resep sehat,
              dan daftar belanja otomatis untuk hidup lebih teratur dan sehat.
            </p>
            <div class="mt-8 flex items-center justify-center gap-3">
              <button class="rounded-lg bg-[#606C38] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#4f5a2f]">
                Mulai Sekarang
              </button>
              <button class="rounded-lg bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/25 hover:bg-white/20">
                Lihat Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" class="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">Everything You Need for a Healthier You</h2>
          <p class="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
            MealsU dirancang untuk membantu kamu tetap di jalur menuju gaya hidup yang lebih sehat.
          </p>
        </div>

        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon="🍽️" title="Meal Planner" desc="Rencana makan personal mingguan lengkap dengan porsi & nutrisi." />
          <FeatureCard icon="🥗" title="Healthy Recipes" desc="Resep sehat lezat dengan info kalori, protein, karbo, dan lemak." />
          <FeatureCard icon="🛒" title="Shopping List" desc="Daftar belanja otomatis dari meal plan, tinggal ceklist saat belanja." />
          <FeatureCard icon="📊" title="Progress Tracker" desc="Pantau kalori & berat badan dengan grafik yang mudah dipahami." />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" class="bg-white py-14">
        <div class="mx-auto max-w-6xl px-4">
          <h3 class="text-center text-2xl font-bold text-gray-900">Loved by Health Enthusiasts</h3>
          <div class="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <div class="rounded-xl border border-gray-200 p-6 shadow-sm">
                <p class="text-sm text-gray-700">“{t.text}”</p>
                <div class="mt-4 flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-400 to-green-600" />
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div class="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" class="mx-auto max-w-3xl px-4 py-14">
        <h3 class="text-center text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
        <div class="mt-6 space-y-3">
          {faqs.map((f) => (
            <FAQItem q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer class="border-t border-gray-200 bg-white">
        <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <div class="h-7 w-7 rounded-md bg-gradient-to-tr from-green-500 to-emerald-600"></div>
            <span class="text-sm font-semibold text-gray-800">MealsU</span>
          </div>
          <nav class="flex items-center gap-4 text-sm text-gray-600">
            <a class="hover:text-gray-900" href="#">Features</a>
            <a class="hover:text-gray-900" href="#">Sign In</a>
            <a class="hover:text-gray-900" href="#">Sign Up</a>
          </nav>
          <p class="text-xs text-gray-500">© {new Date().getFullYear()} MealsU. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
