import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthContext';
import ProductPage from 'products/ProductPage';
import CartPage from 'cart/CartPage';
import { Suspense, useEffect, useState, useSyncExternalStore } from 'react';

const photos = [
  'photo-1551836022-d5d88e9218df',
  'photo-1521737711867-e3b97375f902',
  'photo-1600585154340-be6161a56a0c',
];
const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=85`;
const brand =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=96&h=96&q=80';
type Page = 'products' | 'cart' | 'why';
function currentPage(): Page {
  return location.hash === '#/cart' ? 'cart' : location.hash === '#/why' ? 'why' : 'products';
}

function Hero() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setSlide((value) => (value + 1) % photos.length), 5500);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="overflow-hidden bg-teal-950 px-6 py-16 text-white lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-200">
            A little clarity. A world of possibility.
          </p>
          <h1 className="mt-6 max-w-xl font-serif text-5xl leading-tight sm:text-6xl">
            Make room for
            <br />
            what matters.
          </h1>
          <p className="mt-6 max-w-md leading-7 text-teal-100">
            From everyday moments to your biggest milestones, find a financial product for the life
            you're building.
          </p>
          <a
            href="#products"
            className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-white px-6 font-bold text-teal-950 hover:bg-teal-100"
          >
            Explore products →
          </a>
        </div>
        <div>
          <div
            className={`relative aspect-[4/3] overflow-hidden bg-teal-900 shadow-2xl transition-all duration-1000 motion-reduce:transition-none ${slide === 1 ? 'rounded-[40%_15%_35%_15%]' : slide === 2 ? 'rounded-[16%_40%_16%_35%]' : 'rounded-[32%_16%_32%_16%]'}`}
          >
            {photos.map((id, index) => (
              <img
                key={id}
                src={photo(id)}
                alt={
                  [
                    'People planning together',
                    'A team building a business',
                    'A welcoming family home',
                  ][index]
                }
                aria-hidden={slide !== index}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 motion-reduce:transition-none ${slide === index ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
                loading={index ? 'lazy' : 'eager'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Display-only subscription to the cart's existing persisted state.
function subscribeToCartIndicator(notify: () => void) {
  window.addEventListener('bank-app:cart-updated', notify);
  window.addEventListener('storage', notify);
  return () => {
    window.removeEventListener('bank-app:cart-updated', notify);
    window.removeEventListener('storage', notify);
  };
}
function hasSavedCartItems() {
  try {
    const items: unknown = JSON.parse(localStorage.getItem('cart') ?? '[]');
    return (
      Array.isArray(items) &&
      items.some((item) => item && typeof item.quantity === 'number' && item.quantity > 0)
    );
  } catch {
    return false;
  }
}
export default function App() {
  const { isAuthenticated, logout, user } = useAuth();
  const [page, setPage] = useState<Page>(currentPage);
  const hasCartItems = useSyncExternalStore(
    subscribeToCartIndicator,
    hasSavedCartItems,
    () => false,
  );
  useEffect(() => {
    const onHash = () => {
      if (location.hash.startsWith('#/')) {
        setPage(currentPage());
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  if (!isAuthenticated) return <LoginPage />;
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-stone-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a
            href="#/products"
            className="flex min-h-11 items-center gap-2 text-lg font-bold tracking-tight text-teal-950"
          >
            <img src={brand} alt="" className="size-9 rounded-xl object-cover" />
            Bank App
          </a>
          <nav
            aria-label="Main navigation"
            className="order-3 flex w-full gap-6 text-sm font-semibold md:order-none md:w-auto"
          >
            <a
              href="#/products"
              aria-current={page === 'products' ? 'page' : undefined}
              className="inline-flex min-h-11 items-center hover:text-teal-700"
            >
              Products
            </a>
            <a
              href="#/why"
              aria-current={page === 'why' ? 'page' : undefined}
              className="inline-flex min-h-11 items-center hover:text-teal-700"
            >
              Why Bank App
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              id="header-cart"
              href="#/cart"
              aria-current={page === 'cart' ? 'page' : undefined}
              className="relative inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-3 text-sm font-semibold hover:bg-teal-50"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-5"
              >
                <path
                  d="M3 3h2l3 12h11l2-8H6M9 20h.01M18 20h.01"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Your cart
              {hasCartItems && (
                <span className="absolute -right-1 -top-1 size-3 rounded-full bg-green-500 ring-2 ring-white">
                  <span className="sr-only">Contains items</span>
                </span>
              )}
            </a>
            <button
              onClick={logout}
              className="inline-flex h-11 items-center justify-center rounded-xl px-3 text-sm font-semibold hover:bg-stone-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      {page === 'products' ? (
        <main>
          <Hero />
          <div id="products">
            <Suspense fallback={<p className="p-12">Loading products…</p>}>
              <ProductPage />
            </Suspense>
          </div>
        </main>
      ) : page === 'cart' ? (
        <Suspense fallback={<p className="p-12">Loading your cart…</p>}>
          <CartPage />
        </Suspense>
      ) : (
        <main className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Why Bank App</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight">
            More room to live.
            <br />
            Less money guesswork.
          </h1>
          <p className="mt-6 max-w-xl leading-8 text-slate-600">
            We believe choosing your next financial product should feel clear, considered, and
            personal. Start with what matters to you.
          </p>
          <img
            src={photo(photos[1])}
            alt="People collaborating around a table"
            className="mt-12 aspect-[2/1] w-full rounded-3xl object-cover"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              [
                '01',
                'Clarity comes first',
                'Compare opening amounts and product details in one place. Take your time and build a shortlist that makes sense for you.',
              ],
              [
                '02',
                'Built around real life',
                'Daily spending or a growing team. Choose a personal debit account or compare payroll tiers for your business.',
              ],
              [
                '03',
                'Small steps count',
                'Start a debit account with a small opening deposit, or choose a payroll subscription that fits the size of your team.',
              ],
            ].map(([number, title, text]) => (
              <section key={number} className="rounded-2xl border border-stone-200 bg-white p-8">
                <p className="text-sm font-bold text-teal-700">{number}</p>
                <h2 className="mt-4 text-xl font-bold">{title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{text}</p>
              </section>
            ))}
          </div>
          <a
            href="#/products"
            className="mt-10 inline-flex min-h-12 items-center rounded-xl bg-teal-800 px-6 font-bold text-white hover:bg-teal-700"
          >
            Find your next step →
          </a>
        </main>
      )}
      <footer className="bg-slate-950 px-6 py-8 text-sm text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4">
          <p>© 2026 Bank App. Built for your next move.</p>
          <p>Welcome back, {user}.</p>
        </div>
      </footer>
    </div>
  );
}
