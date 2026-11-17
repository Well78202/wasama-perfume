
export const CART_KEY = "wasama-cart";

const MAX_CART_QUANTITY = 99;

export type CartItem = {
  slug: string;
  quantity: number;
};

// ================= QUANTITY VALIDATION =================

function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;

  return Math.min(
    MAX_CART_QUANTITY,
    Math.max(1, Math.trunc(quantity))
  );
}

// ================= GET CART =================

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_KEY);

    const parsed: unknown = stored
      ? JSON.parse(stored)
      : [];

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
          MAX_CART_QUANTITY,
          (quantities.get(item.slug) ?? 0) +
            item.quantity
        )
      );
    }

    return Array.from(
      quantities,
      ([slug, quantity]) => ({
        slug,
        quantity,
      })
    );
  } catch {
    return [];
  }
}

// ================= SAVE CART =================

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(items)
  );

  window.dispatchEvent(
    new Event("cart-updated")
  );
}

// ================= ADD TO CART =================

export function addToCart(
  slug: string,
  quantity = 1
) {
  if (!slug.trim()) return;

  const cart = getCart();

  const validQuantity =
    normalizeQuantity(quantity);

  const existing = cart.find(
    (item) => item.slug === slug
  );

  if (existing) {
    existing.quantity = Math.min(
      MAX_CART_QUANTITY,
      existing.quantity + validQuantity
    );
  } else {
    cart.push({
      slug,
      quantity: validQuantity,
    });
  }

  saveCart(cart);
}

// ================= UPDATE QUANTITY =================

export function updateCartQuantity(
  slug: string,
  quantity: number
) {
  const cart = getCart();

  if (!Number.isFinite(quantity)) return;

  if (quantity <= 0) {
    saveCart(
      cart.filter(
        (item) => item.slug !== slug
      )
    );
    return;
  }

  const validQuantity =
    normalizeQuantity(quantity);

  saveCart(
    cart.map((item) =>
      item.slug === slug
        ? {
            ...item,
            quantity: validQuantity,
          }
        : item
    )
  );
}

// ================= REMOVE ITEM =================

export function removeFromCart(
  slug: string
) {
  saveCart(
    getCart().filter(
      (item) => item.slug !== slug
    )
  );
}

// ================= CLEAR CART =================

export function clearCart() {
  saveCart([]);
}
