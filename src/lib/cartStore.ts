const KEY = 'pashvik_cart_lines';

export type CartLine = { id: number; name: string; price: number; quantity: number };

export function getCartLines(): CartLine[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCartLines(lines: CartLine[]) {
  sessionStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event('pashvik-cart'));
}

export function addProductToCart(product: { id: number; name: string; price: number }) {
  const lines = getCartLines();
  const idx = lines.findIndex((l) => l.id === product.id);
  if (idx >= 0) {
    lines[idx] = { ...lines[idx], quantity: lines[idx].quantity + 1 };
  } else {
    lines.push({ ...product, quantity: 1 });
  }
  setCartLines(lines);
}

export function cartItemCount(): number {
  return getCartLines().reduce((n, l) => n + l.quantity, 0);
}
