import { createSignal, For } from 'solid-js';
import SidebarNavbar from '../components/SidebarNavbar'; // ✅ Import sidebar terpisah
import { HelpCircle, Book, Info, MessageSquare, Lock, Shield } from 'lucide-solid';
import AppNavbar from "../components/AppNavbar";

const HelpPage = () => {
  // FAQ state
  const [faqs, setFaqs] = createSignal([
    { id: 1, question: 'How do I create a meal plan?', answer: 'To create a meal plan, go to the Planner section, select your preferred dates, and add meals or recipes from your library.', expanded: false },
    { id: 2, question: 'How can I sync my data across devices?', answer: 'Ensure Auto Sync is enabled in Settings under App Preferences, then sign in with the same account on all devices.', expanded: false },
    { id: 3, question: 'What should I do if I forget my password?', answer: 'Go to the login page and click "Forgot Password" to reset it via email.', expanded: false },
    { id: 4, question: 'How do I add items to my shopping list?', answer: 'Navigate to the Shopping List, click "Add Item", and fill in the name, quantity, and category.', expanded: false },
    { id: 5, question: 'Where can I find recipe suggestions?', answer: 'Visit the Recipes section and use the search bar or browse featured recipes.', expanded: false },
  ]);

  // Toggle FAQ expansion
  const toggleFAQ = (id) => {
    setFaqs(faqs().map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : { ...faq, expanded: false }
    ));
  };

  // Contact support state
  const [contactForm, setContactForm] = createSignal({ name: '', email: '', message: '' });
  const [showContactForm, setShowContactForm] = createSignal(false);

  // Submit contact form
  const submitContact = () => {
    if (contactForm().name && contactForm().email && contactForm().message) {
      console.log('Contact form submitted:', contactForm());
      setContactForm({ name: '', email: '', message: '' });
      setShowContactForm(false);
    }
  };

  return (
    <div class="flex min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      {/* ✅ Sidebar terpisah */}
      <SidebarNavbar class="bg-olive-100" /> {/* Sesuaikan sidebar dengan hijau zaitun muda */}

      {/* Main Content */}
      <div class="flex-1 flex flex-col">
        <AppNavbar 
          onSearch={handleSearch} 
          onQuickAction={handleQuickAction} 
          pageContext="help" 
          showBreadcrumbs={false} 
        />
        
        <div class="flex-1 p-6 overflow-y-auto"> {/* ✅ Flex-1 untuk mengisi sisa space */}
          <div class="max-w-4xl">
            {/* Help Page Header */}
            <div class="flex items-center gap-4 mb-8">
              <HelpCircle class="text-teal-500" size={32} />
              <div>
                <h1 class="text-3xl font-bold text-gray-800">Help Center</h1>
                <p class="text-gray-600">Get support and answers to your questions</p>
              </div>
            </div>

            {/* FAQ Section */}
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div class="p-4 border-b border-gray-100 bg-gray-50">
                <h2 class="text-lg font-semibold text-gray-800">Frequently Asked Questions</h2>
              </div>
              <div class="divide-y divide-gray-100">
                <For each={faqs()}>
                  {(faq) => (
                    <div class="p-4">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        class="w-full text-left font-medium text-gray-800 hover:text-teal-600 transition-colors flex justify-between items-center"
                      >
                        {faq.question}
                        <span>{faq.expanded ? '−' : '+'}</span>
                      </button>
                      <Show when={faq.expanded}>
                        <p class="mt-2 text-sm text-gray-600">{faq.answer}</p>
                      </Show>
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* Contact Support Section */}
            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
              <div class="p-4 border-b border-gray-100 bg-gray-50">
                <h2 class="text-lg font-semibold text-gray-800">Contact Support</h2>
              </div>
              <div class="p-6">
                <button
                  onClick={() => setShowContactForm(true)}
                  class="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center gap-2 mb-4"
                >
                  <MessageSquare size={16} />
                  Open Contact Form
                </button>

                <Show when={showContactForm()}>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={contactForm().name}
                        onInput={(e) => setContactForm({ ...contactForm(), name: e.target.value })}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={contactForm().email}
                        onInput={(e) => setContactForm({ ...contactForm(), email: e.target.value })}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Your email"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        value={contactForm().message}
                        onInput={(e) => setContactForm({ ...contactForm(), message: e.target.value })}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24 resize-none"
                        placeholder="Your message"
                      />
                    </div>
                    <div class="flex justify-end gap-2">
                      <button
                        onClick={() => setShowContactForm(false)}
                        class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitContact}
                        class="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </Show>
              </div>
            </div>

            {/* About Section */}
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
              <div class="p-4 border-b border-gray-100 bg-gray-50">
                <h2 class="text-lg font-semibold text-gray-800">About This App</h2>
              </div>
              <div class="p-6 text-gray-600">
                <p class="mb-2">Meal Planner v2.1.3 is designed to help you organize your meals, create shopping lists, and manage your dietary preferences with ease.</p>
                <p>For more information, visit our <a href="#" class="text-teal-500 hover:underline">support page</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder functions for AppNavbar
const handleSearch = (query) => {
  console.log('Searching for:', query);
  // Tambahkan logika pencarian jika diperlukan
};

const handleQuickAction = (action) => {
  console.log('Quick action:', action);
  // Tambahkan logika aksi cepat jika diperlukan
};

export default HelpPage;