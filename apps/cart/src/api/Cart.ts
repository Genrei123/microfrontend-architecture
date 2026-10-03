import { getDefaultStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface CartItem {
  sku: string;
  quantity: number;
}

interface Cart {
  getCartItems(): CartItem[];
  addToCart(item: CartItem): void;
  removeFromCart(sku: string): void;
}

export const cartAtom = atomWithStorage<CartItem[]>(
  'cart', // localStorage key
  [], // initial value if nothing is stored
  undefined,
  { getOnInit: true },
);

const store = getDefaultStore();

export const CartAPI: Cart = {
  getCartItems() {
    return store.get(cartAtom);
  },

  addToCart(item) {
    store.set(cartAtom, (items) => {
      const exists = items.some((i) => i.sku === item.sku);
      return exists
        ? items.map((i) =>
            i.sku === item.sku ? { ...i, quantity: i.quantity + item.quantity } : i,
          )
        : [...items, item];
    });
  },

  removeFromCart(sku) {
    store.set(cartAtom, (items) => items.filter((i) => i.sku !== sku));
  },
};
