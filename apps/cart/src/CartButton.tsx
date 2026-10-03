import { useEffect, useRef, useState } from 'react';
import { CartAPI } from './api/Cart';
interface CartButtonProps {
  sku: string;
}
export default function CartButton({ sku }: CartButtonProps) {
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div>
      <button
        type="button"
        onClick={(event) => {
          CartAPI.addToCart({ sku, quantity: 1 });
          window.dispatchEvent(new Event('bank-app:cart-updated'));
          setAdded(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setAdded(false), 2400);
          const target = document.getElementById('header-cart');
          if (target && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const from = event.currentTarget.getBoundingClientRect();
            const to = target.getBoundingClientRect();
            const dot = document.createElement('span');
            dot.className =
              'pointer-events-none fixed z-[100] grid size-8 place-items-center rounded-full bg-teal-600 text-white shadow-lg';
            dot.textContent = '+';
            dot.setAttribute('aria-hidden', 'true');
            dot.style.left = from.left + from.width / 2 + 'px';
            dot.style.top = from.top + 'px';
            (event.currentTarget.closest('dialog') ?? document.body).appendChild(dot);
            const animation = dot.animate(
              [
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                {
                  transform: `translate(${(to.left - from.left) / 2}px, ${Math.min(-80, (to.top - from.top) / 2)}px) scale(.8)`,
                  opacity: 1,
                },
                {
                  transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(.25)`,
                  opacity: 0,
                },
              ],
              { duration: 700, easing: 'ease-in-out' },
            );
            animation.onfinish = () => {
              dot.remove();
              target.animate(
                [
                  { transform: 'scale(1)' },
                  { transform: 'scale(1.08)' },
                  { transform: 'scale(1)' },
                ],
                { duration: 250 },
              );
            };
          }
        }}
        className="min-h-11 min-w-20 rounded-xl bg-teal-800 px-4 text-sm font-bold text-white transition hover:bg-teal-700 active:scale-95"
      >
        {added ? 'Added ✓' : 'Add +'}
      </button>
      <span role="status" className="sr-only">
        {added ? 'Product added to your cart.' : ''}
      </span>
    </div>
  );
}
