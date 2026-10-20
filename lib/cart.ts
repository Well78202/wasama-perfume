
export const CART_KEY = "wasama-cart";

export type CartItem = {
  slug: string;
  quantity: number;
};

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];

    if (!Array.isArray(parsed)) return [];

    const quantities = new Map<string, number>();

    for (const item of parsed) {
      if (
        !item ||
        typeof item !== "object" ||
        typeof item.slug !== "string" ||
        !item.slug.trim() ||
        typeof item.quantity !== "number" ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      ) {
        continue;
      }

      quantities.set(
        item.slug,
        Math.min(
          99,
          (quantities.get(item.slug) ?? 0) + item.quantity
        )
      );
    }

    return Array.from(quantities, ([slug, quantity]) => ({
      slug,
      quantity,
    }));
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(slug: string, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.slug === slug);

  if (existing) {
    existing.quantity = Math.min(
      99,
      existing.quantity + quantity
    );
  } else {
    cart.push({
      slug,
      quantity: Math.min(99, Math.max(1, quantity)),
    });
  }

  saveCart(cart);
}

export function updateCartQuantity(
  slug: string,
  quantity: number
) {
  const cart = getCart();

  if (quantity <= 0) {
    saveCart(cart.filter((item) => item.slug !== slug));
    return;
  }

  saveCart(
    cart.map((item) =>
      item.slug === slug
        ? { ...item, quantity: Math.min(99, quantity) }
        : item
    )
  );
}

export function removeFromCart(slug: string) {
  saveCart(getCart().filter((item) => item.slug !== slug));
}

export function clearCart() {
  saveCart([]);
}
