import type { FoodItem } from '../backend';

// Cart item structure stored in localStorage
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CART_KEY = 'cart';

// Type for cart update listeners
type CartUpdateListener = (items: CartItem[]) => void;
const cartUpdateListeners: Set<CartUpdateListener> = new Set();

// Subscribe to cart updates
export function subscribeToCartUpdates(listener: CartUpdateListener): () => void {
  cartUpdateListeners.add(listener);
  return () => {
    cartUpdateListeners.delete(listener);
  };
}

// Notify all listeners of cart updates
function notifyCartUpdate(items: CartItem[]) {
  cartUpdateListeners.forEach((listener) => {
    try {
      listener(items);
    } catch (error) {
      console.error('Error in cart update listener:', error);
    }
  });
}

// Get cart items from localStorage
export function getCartItems(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    const items = JSON.parse(stored);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('Failed to get cart items:', error);
    return [];
  }
}

// Save cart items to localStorage
function saveCartItems(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    // Dispatch storage event for cross-tab synchronization
    window.dispatchEvent(new StorageEvent('storage', {
      key: CART_KEY,
      newValue: JSON.stringify(items),
      storageArea: localStorage,
    }));
    // Notify all subscribed listeners
    notifyCartUpdate(items);
  } catch (error) {
    console.error('Failed to save cart items:', error);
  }
}

// Add item to cart
export function addToCart(foodItem: FoodItem, quantity: number) {
  const items = getCartItems();
  const existingIndex = items.findIndex(item => item.id === foodItem.id);
  
  if (existingIndex >= 0) {
    // Update existing item quantity
    items[existingIndex].quantity += quantity;
  } else {
    // Add new item
    items.push({
      id: foodItem.id,
      name: foodItem.name,
      price: Number(foodItem.price),
      quantity,
    });
  }
  
  saveCartItems(items);
}

// Update item quantity
export function updateCartItemQuantity(itemId: string, quantity: number) {
  const items = getCartItems();
  const itemIndex = items.findIndex(item => item.id === itemId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      items.splice(itemIndex, 1);
    } else {
      items[itemIndex].quantity = quantity;
    }
    saveCartItems(items);
  }
}

// Remove item from cart
export function removeCartItem(itemId: string) {
  const items = getCartItems();
  const filtered = items.filter(item => item.id !== itemId);
  saveCartItems(filtered);
}

// Clear entire cart
export function clearCart() {
  saveCartItems([]);
}

// Get cart total
export function getCartTotal(): number {
  const items = getCartItems();
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart item count
export function getCartItemCount(): number {
  const items = getCartItems();
  return items.length;
}

// Listen for storage events from other tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === CART_KEY) {
      try {
        const items = event.newValue ? JSON.parse(event.newValue) : [];
        notifyCartUpdate(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error('Failed to parse cart update from storage event:', error);
      }
    }
  });
}
