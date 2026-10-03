import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { cartAtom, CartAPI } from '../api/Cart';
const labels: Record<string, { name: string; price: number; billing: 'monthly' | 'deposit' }> = {
  'PAY-START': { name: 'Payroll Starter', price: 999, billing: 'monthly' },
  'PAY-GROW': { name: 'Payroll Growth', price: 2499, billing: 'monthly' },
  'PAY-SCALE': { name: 'Payroll Scale', price: 5999, billing: 'monthly' },
  'DEBIT-EVERY': { name: 'Everyday Debit', price: 500, billing: 'deposit' },
  'DEBIT-STUDENT': { name: 'Student Debit', price: 100, billing: 'deposit' },
  'DEBIT-PLUS': { name: 'Everyday Plus Debit', price: 2500, billing: 'deposit' },
};
const money = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
export default function CartPage() {
  const cartItems = useAtomValue(cartAtom);
  useEffect(() => {
    window.dispatchEvent(new Event('bank-app:cart-updated'));
  }, [cartItems]);
  const monthly = cartItems.reduce(
    (sum, item) =>
      sum + (labels[item.sku]?.billing === 'monthly' ? labels[item.sku].price * item.quantity : 0),
    0,
  );
  const deposits = cartItems.reduce(
    (sum, item) =>
      sum + (labels[item.sku]?.billing === 'deposit' ? labels[item.sku].price * item.quantity : 0),
    0,
  );
  return (
    <main className="min-h-[100vh] bg-stone-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <a
          href="#/products"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-teal-800"
        >
          ← Keep exploring
        </a>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-5xl">Your cart</h1>
          {cartItems.length > 0 && (
            <button
              onClick={() => cartItems.forEach((item) => CartAPI.removeFromCart(item.sku))}
              className="min-h-11 rounded-xl border border-stone-300 px-4 text-sm hover:bg-stone-200"
            >
              Empty cart
            </button>
          )}
        </div>
        {cartItems.length === 0 ? (
          <section className="mt-10 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center">
            <h2 className="font-serif text-3xl">A fresh start.</h2>
            <p className="mt-4 text-slate-600">
              Your cart is empty. Add a product when you find the right fit.
            </p>
            <a
              href="#/products"
              className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-teal-800 px-6 font-bold text-white hover:bg-teal-700"
            >
              Explore products
            </a>
          </section>
        ) : (
          <>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              These are your previously saved selections. Remove an item or empty your cart to start
              again.
            </p>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
              <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
                {cartItems.map((item) => {
                  const product = labels[item.sku];
                  return (
                    <article
                      key={item.sku}
                      className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 p-6 last:border-0"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                          {product
                            ? product.billing === 'monthly'
                              ? 'Business payroll'
                              : 'Personal debit account'
                            : 'Previous catalog selection'}
                        </p>
                        <h2 className="mt-2 text-xl font-bold">{product?.name ?? item.sku}</h2>
                        <p className="mt-2 text-sm text-slate-600">
                          Quantity: {item.quantity}
                          {!product && ' · No longer offered in this demo'}
                        </p>
                      </div>
                      <div className="text-right">
                        {product && (
                          <p className="font-bold">
                            {money(product.price * item.quantity)}
                            {product.billing === 'monthly' ? ' /mo' : ''}
                          </p>
                        )}
                        <button
                          onClick={() => CartAPI.removeFromCart(item.sku)}
                          className="mt-2 min-h-11 rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
              <aside className="h-fit rounded-3xl bg-teal-950 p-8 text-white">
                <h2 className="font-serif text-2xl">Your shortlist</h2>
                <dl className="mt-6 space-y-6">
                  <div>
                    <dt className="text-sm text-teal-100">Payroll subscriptions / month</dt>
                    <dd className="mt-2 text-2xl font-bold">{money(monthly)}</dd>
                  </div>
                  <div className="border-t border-teal-800 pt-6">
                    <dt className="text-sm text-teal-100">One-time opening deposits</dt>
                    <dd className="mt-2 text-2xl font-bold">{money(deposits)}</dd>
                  </div>
                </dl>
                <p className="mt-6 text-sm leading-6 text-teal-100">
                  Opening deposits become account balances. Payroll prices are monthly
                  subscriptions.
                </p>
                <p className="mt-6 border-t border-teal-800 pt-6 text-xs leading-5 text-teal-100">
                  Demo only. No payment is collected and no account or subscription is activated.
                </p>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
