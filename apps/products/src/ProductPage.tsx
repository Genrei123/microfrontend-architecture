import { useEffect, useRef, useState } from 'react';
import { ProductsAPI } from './api/Products';
import CartButton from 'cart/CartButton';
import ProductDetails from './ProductDetails';
type Product = ReturnType<typeof ProductsAPI.getAllProducts>[number];
const money = (amount: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount);

export default function ProductPage() {
  const products = ProductsAPI.getAllProducts();
  const [category, setCategory] = useState('All products');
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState<Product | null>(null);
  const [playing, setPlaying] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startX: 0, scrollLeft: 0, active: false, moved: false });
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = products
    .filter((product) => category === 'All products' || product.category === category)
    .sort((a, b) =>
      sort === 'low'
        ? a.price - b.price
        : sort === 'high'
          ? b.price - a.price
          : sort === 'category'
            ? a.category.localeCompare(b.category)
            : 0,
    );
  useEffect(() => {
    if (
      !playing ||
      interacting ||
      selected ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const timer = setInterval(() => {
      const el = track.current;
      if (!el) return;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({
        left: end
          ? 0
          : el.scrollLeft + (el.firstElementChild?.getBoundingClientRect().width ?? 340) + 24,
        behavior: 'smooth',
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [playing, interacting, selected, category, sort]);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
  }, [selected]);
  function scroll(direction: number) {
    setPlaying(false);
    track.current?.scrollBy({
      left:
        direction * ((track.current.firstElementChild?.getBoundingClientRect().width ?? 340) + 24),
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }
  return (
    <section aria-labelledby="product-heading" className="bg-stone-50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
          For the life you live. For the team you lead.
        </p>
        <h2 id="product-heading" className="mt-4 font-serif text-4xl sm:text-5xl">
          Your next move, made simple.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Pay your people with a monthly payroll plan, or open a debit account with a deposit that
          becomes your balance.
        </p>
        <div className="my-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" aria-label="Filter products">
            {['All products', 'For business', 'For you'].map((item) => (
              <button
                key={item}
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item);
                  track.current?.scrollTo({ left: 0 });
                }}
                className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition ${category === item ? 'border-teal-800 bg-teal-800 text-white' : 'border-stone-300 bg-white text-slate-700 hover:bg-teal-50'}`}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-600">
            Sort by
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                track.current?.scrollTo({ left: 0 });
              }}
              className="min-h-11 rounded-xl border border-stone-300 bg-white px-3 text-slate-900"
            >
              <option value="featured">Featured</option>
              <option value="category">Category</option>
              <option value="low">Amount: low to high</option>
              <option value="high">Amount: high to low</option>
            </select>
          </label>
        </div>
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Banking products"
          onMouseEnter={() => setInteracting(true)}
          onMouseLeave={() => setInteracting(false)}
          onFocusCapture={() => setInteracting(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
          }}
        >
          <div
            ref={track}
            className={`flex select-none gap-6 overflow-x-auto px-3 pb-8 pt-4 [&_button]:cursor-inherit ${dragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'}`}
            onDragStart={(event) => event.preventDefault()}
            onPointerDown={(event) => {
              if (event.pointerType !== 'mouse' || event.button !== 0) return;
              drag.current = {
                startX: event.clientX,
                scrollLeft: event.currentTarget.scrollLeft,
                active: true,
                moved: false,
              };
            }}
            onPointerMove={(event) => {
              if (!drag.current.active) return;
              const distance = event.clientX - drag.current.startX;
              if (!drag.current.moved && Math.abs(distance) < 6) return;
              if (!drag.current.moved) {
                drag.current.moved = true;
                event.currentTarget.setPointerCapture(event.pointerId);
                event.currentTarget.style.scrollSnapType = 'none';
                setDragging(true);
                setPlaying(false);
              }
              event.preventDefault();
              event.currentTarget.scrollLeft = drag.current.scrollLeft - distance;
            }}
            onPointerUp={(event) => {
              drag.current.active = false;
              setDragging(false);
              event.currentTarget.style.removeProperty('scroll-snap-type');
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onPointerCancel={(event) => {
              drag.current.active = false;
              setDragging(false);
              event.currentTarget.style.removeProperty('scroll-snap-type');
            }}
            onLostPointerCapture={() => {
              drag.current.active = false;
              setDragging(false);
            }}
            onPointerLeave={() => {
              if (!drag.current.moved) drag.current.active = false;
            }}
            onClickCapture={(event) => {
              if (drag.current.moved) {
                event.preventDefault();
                event.stopPropagation();
                drag.current.moved = false;
              }
            }}
            tabIndex={0}
            aria-label="Scroll through products"
          >
            {visible.map((product) => (
              <article
                key={product.sku}
                className="relative flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:z-10 hover:shadow-xl motion-safe:hover:scale-[1.025] focus-within:shadow-xl sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <button
                  onClick={() => setSelected(product)}
                  className="group flex flex-1 flex-col text-left"
                  aria-label={`View details for ${product.name}`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-200">
                    <img
                      src={product.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 motion-safe:group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-bold text-teal-900">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      {product.detail}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold">{product.name}</h3>
                    <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>
                    <span className="mt-4 block text-sm font-semibold text-teal-800">
                      Explore details ↗
                    </span>
                  </div>
                </button>
                <div className="mx-6 flex items-center justify-between gap-3 border-t border-stone-200 py-5">
                  <div>
                    <p className="text-xl font-bold">
                      {money(product.price)}
                      {product.billing === 'monthly' && (
                        <span className="text-sm font-normal text-slate-500"> /mo</span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {product.billing === 'monthly'
                        ? 'Monthly subscription'
                        : 'One-time opening deposit'}
                    </p>
                  </div>
                  <CartButton sku={product.sku} />
                </div>
              </article>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">{visible.length} options · swipe to explore</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPlaying(!playing)}
                className="min-h-11 rounded-xl border border-stone-300 px-4 text-sm"
              >
                {playing ? 'Pause carousel' : 'Play carousel'}
              </button>
              <button
                aria-label="Previous products"
                onClick={() => scroll(-1)}
                className="size-11 rounded-xl border border-stone-300 bg-white"
              >
                ←
              </button>
              <button
                aria-label="Next products"
                onClick={() => scroll(1)}
                className="size-11 rounded-xl border border-stone-300 bg-white"
              >
                →
              </button>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs leading-6 text-slate-500">
          Demo catalog. All prices, limits and features are illustrative. No account is opened,
          payroll subscription activated or payment collected.
        </p>
      </div>
      <dialog
        ref={dialog}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="fixed inset-0 m-auto max-h-[94vh] w-[calc(100%-24px)] max-w-7xl overflow-y-auto rounded-3xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/70"
        aria-labelledby="detail-title"
      >
        {selected && (
          <>
            <div className="absolute right-3 top-3 z-10">
              <button
                autoFocus
                onClick={() => dialog.current?.close()}
                aria-label="Close product details"
                className="grid size-11 place-items-center rounded-full bg-white/95 text-slate-700 shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-100"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <ProductDetails key={selected.sku} product={selected} onSelect={setSelected} />
          </>
        )}
      </dialog>
    </section>
  );
}
