
export const WISHLIST_KEY = "wasama-wishlist";

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is string => typeof item === "string"
        )
      : [];
  } catch {
    return [];
  }
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().includes(productId);
}

export function toggleWishlist(productId: string): boolean {
  const wishlist = getWishlist();
  const exists = wishlist.includes(productId);

  const updated = exists
    ? wishlist.filter((id) => id !== productId)
    : [...wishlist, productId];

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(updated)
  );

  window.dispatchEvent(new Event("wishlist-updated"));

  return !exists;
}
