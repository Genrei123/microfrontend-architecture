import { useState } from 'react';
import CartButton from 'cart/CartButton';
import { ProductsAPI } from './api/Products';

type Product = ReturnType<typeof ProductsAPI.getAllProducts>[number];
const money = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductDetails({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const images = [
    product.image,
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
  ].filter((value, index, list) => list.indexOf(value) === index);
  const related = ProductsAPI.getAllProducts().filter(
    (item) => item.category === product.category && item.sku !== product.sku,
  );
  return (
    <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10 lg:p-10">
      <div className="min-w-0">
        <div className="flex flex-col-reverse gap-3 sm:flex-row lg:sticky lg:top-5">
          <div className="flex shrink-0 gap-3 sm:flex-col" aria-label="Product image gallery">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`View image ${index + 1} of ${product.name}`}
                aria-pressed={activeImage === index}
                onClick={() => setActiveImage(index)}
                className={`size-16 overflow-hidden rounded-xl border-2 transition hover:border-teal-600 ${activeImage === index ? 'border-teal-700 ring-2 ring-teal-100' : 'border-transparent'}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-stone-100">
            <img
              src={images[activeImage]}
              alt={`${product.name} — lifestyle image ${activeImage + 1}`}
              className="aspect-[4/5] w-full object-cover sm:aspect-[3/4]"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-teal-900">
              {product.category}
            </span>
          </div>
        </div>
      </div>
      <div className="min-w-0">
        <p className="pr-10 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
          {product.billing === 'monthly'
            ? 'Payroll, made personal'
            : 'Everyday banking, simplified'}
        </p>
        <h2 id="detail-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {product.name}
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-2xl font-bold">
            {money(product.price)}
            {product.billing === 'monthly' && (
              <span className="text-base font-normal text-slate-500"> /month</span>
            )}
          </p>
          <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
            {product.billing === 'monthly' ? product.detail : 'Opening deposit'}
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600">{product.description}</p>
        <div className="mt-6 [&_button]:min-h-12 [&_button]:w-full [&_button]:rounded-full [&_button]:text-base">
          <CartButton sku={product.sku} />
        </div>
        <p className="mt-3 rounded-full bg-teal-100 px-4 py-2 text-center text-sm font-medium text-teal-900">
          {product.billing === 'monthly'
            ? 'A monthly plan for your growing team'
            : 'Your opening deposit becomes your balance'}
        </p>
        <div className="my-6 grid grid-cols-3 divide-x divide-stone-200 border-y border-stone-100 py-5 text-center text-xs leading-5 text-slate-600">
          <p className="px-2">
            Clear
            <br />
            pricing
          </p>
          <p className="px-2">
            {product.billing === 'monthly' ? 'Simple payroll' : 'Everyday access'}
            <br />
            features
          </p>
          <p className="px-2">
            Choose at
            <br />
            your own pace
          </p>
        </div>
        <h3 className="text-sm font-bold">Explore other options</h3>
        <div className="mt-3 space-y-3">
          {related.map((item) => (
            <button
              key={item.sku}
              onClick={() => onSelect(item)}
              className="group flex w-full items-center gap-4 rounded-2xl bg-teal-50 p-3 text-left transition hover:bg-teal-100"
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="size-16 shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{item.name}</span>
                <span className="mt-1 block text-xs text-slate-600">{item.detail}</span>
                <span className="mt-1 block text-sm font-bold">
                  {money(item.price)}
                  {item.billing === 'monthly' ? ' /mo' : ''}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-teal-800"
              >
                ↗
              </span>
            </button>
          ))}
        </div>
        <h3 className="mt-7 text-sm font-bold">What’s included</h3>
        <ul className="mt-3 space-y-2">
          {product.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-sm leading-6 text-slate-600">
              <span aria-hidden="true" className="text-teal-700">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-5 text-slate-500">
          Illustrative demo only. No payment is collected and no account or subscription is
          activated.
        </p>
      </div>
    </div>
  );
}
