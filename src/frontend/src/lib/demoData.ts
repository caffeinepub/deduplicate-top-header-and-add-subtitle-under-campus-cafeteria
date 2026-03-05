import { Principal } from "@dfinity/principal";
import type { FoodItem } from "../backend";
import { clearCart, getCartItems } from "./cartStorage";

// Extended Order Type with payment information
export interface DemoOrderType {
  id: string;
  userId: Principal;
  userName: string;
  items: Array<{
    foodItem: FoodItem;
    quantity: bigint;
  }>;
  totalPrice: bigint;
  status: "Pending" | "Preparing" | "Ready" | "Completed";
  paymentMethod: "Cash" | "UPI";
  paymentStatus: "Pending" | "Paid";
  timestamp: number;
}

// Map food item IDs to their image paths
export const DEMO_IMAGE_MAP: Record<string, string> = {
  "samosa-20-snacks": "/assets/generated/samosa.dim_400x400.jpg",
  "vada-pav-25-snacks": "/assets/generated/vada-pav.dim_400x400.jpg",
  "idli-30-south-indian": "/assets/generated/idli.dim_400x400.jpg",
  "dosa-40-south-indian": "/assets/generated/dosa.dim_400x400.jpg",
  "upma-25-south-indian": "/assets/generated/upma.dim_400x400.jpg",
  "poha-20-south-indian": "/assets/generated/poha.dim_400x400.jpg",
  "veg-thali-80-meals": "/assets/generated/veg-thali.dim_400x400.jpg",
  "sandwich-35-meals": "/assets/generated/sandwich.dim_400x400.jpg",
  "pav-bhaji-45-meals": "/assets/generated/pav-bhaji.dim_400x400.jpg",
  "fried-rice-50-meals": "/assets/generated/fried-rice.dim_400x400.jpg",
  "noodles-40-meals": "/assets/generated/noodles.dim_400x400.jpg",
  "tea-10-beverages": "/assets/generated/tea.dim_400x400.jpg",
  "coffee-15-beverages": "/assets/generated/coffee.dim_400x400.jpg",
  "cold-drinks-20-beverages": "/assets/generated/cold-drinks.dim_400x400.jpg",
};

// Hardcoded demo food items
export const DEMO_FOOD_ITEMS: FoodItem[] = [
  {
    id: "samosa-20-snacks",
    name: "Samosa",
    description: "Crispy fried pastry with spiced potato filling",
    category: "Snacks",
    price: BigInt(20),
    image: undefined,
  },
  {
    id: "vada-pav-25-snacks",
    name: "Vada Pav",
    description: "Mumbai street food - spiced potato fritter in a bun",
    category: "Snacks",
    price: BigInt(25),
    image: undefined,
  },
  {
    id: "idli-30-south-indian",
    name: "Idli",
    description: "Steamed rice cakes served with sambar and chutney",
    category: "South Indian",
    price: BigInt(30),
    image: undefined,
  },
  {
    id: "dosa-40-south-indian",
    name: "Dosa",
    description: "Crispy rice crepe with potato filling",
    category: "South Indian",
    price: BigInt(40),
    image: undefined,
  },
  {
    id: "upma-25-south-indian",
    name: "Upma",
    description: "Savory semolina porridge with vegetables",
    category: "South Indian",
    price: BigInt(25),
    image: undefined,
  },
  {
    id: "poha-20-south-indian",
    name: "Poha",
    description: "Flattened rice with peanuts and spices",
    category: "South Indian",
    price: BigInt(20),
    image: undefined,
  },
  {
    id: "veg-thali-80-meals",
    name: "Veg Thali",
    description: "Complete meal with rice, roti, dal, vegetables, and dessert",
    category: "Meals",
    price: BigInt(80),
    image: undefined,
  },
  {
    id: "sandwich-35-meals",
    name: "Sandwich",
    description: "Fresh vegetable sandwich with chutney",
    category: "Meals",
    price: BigInt(35),
    image: undefined,
  },
  {
    id: "pav-bhaji-45-meals",
    name: "Pav Bhaji",
    description: "Spiced vegetable mash served with buttered bread rolls",
    category: "Meals",
    price: BigInt(45),
    image: undefined,
  },
  {
    id: "fried-rice-50-meals",
    name: "Fried Rice",
    description: "Stir-fried rice with vegetables and soy sauce",
    category: "Meals",
    price: BigInt(50),
    image: undefined,
  },
  {
    id: "noodles-40-meals",
    name: "Noodles",
    description: "Hakka noodles with mixed vegetables",
    category: "Meals",
    price: BigInt(40),
    image: undefined,
  },
  {
    id: "tea-10-beverages",
    name: "Tea",
    description: "Hot Indian chai",
    category: "Beverages",
    price: BigInt(10),
    image: undefined,
  },
  {
    id: "coffee-15-beverages",
    name: "Coffee",
    description: "Fresh brewed coffee",
    category: "Beverages",
    price: BigInt(15),
    image: undefined,
  },
  {
    id: "cold-drinks-20-beverages",
    name: "Cold Drinks",
    description: "Chilled soft drinks",
    category: "Beverages",
    price: BigInt(20),
    image: undefined,
  },
];

// Sample pre-filled orders with payment information
const demoPrincipal = Principal.fromText("2vxsx-fae");

export const DEMO_ORDERS: DemoOrderType[] = [
  {
    id: "order-001",
    userId: demoPrincipal,
    userName: "Rahul Sharma",
    items: [
      {
        foodItem: DEMO_FOOD_ITEMS[0], // Samosa
        quantity: BigInt(2),
      },
      {
        foodItem: DEMO_FOOD_ITEMS[11], // Tea
        quantity: BigInt(1),
      },
    ],
    totalPrice: BigInt(50),
    status: "Pending",
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    timestamp: Date.now() - 300000, // 5 minutes ago
  },
  {
    id: "order-002",
    userId: demoPrincipal,
    userName: "Priya Patel",
    items: [
      {
        foodItem: DEMO_FOOD_ITEMS[3], // Dosa
        quantity: BigInt(1),
      },
      {
        foodItem: DEMO_FOOD_ITEMS[12], // Coffee
        quantity: BigInt(1),
      },
    ],
    totalPrice: BigInt(55),
    status: "Preparing",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    timestamp: Date.now() - 600000, // 10 minutes ago
  },
  {
    id: "order-003",
    userId: demoPrincipal,
    userName: "Amit Kumar",
    items: [
      {
        foodItem: DEMO_FOOD_ITEMS[6], // Veg Thali
        quantity: BigInt(1),
      },
    ],
    totalPrice: BigInt(80),
    status: "Ready",
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    timestamp: Date.now() - 900000, // 15 minutes ago
  },
  {
    id: "order-004",
    userId: demoPrincipal,
    userName: "Sneha Singh",
    items: [
      {
        foodItem: DEMO_FOOD_ITEMS[8], // Pav Bhaji
        quantity: BigInt(1),
      },
      {
        foodItem: DEMO_FOOD_ITEMS[13], // Cold Drinks
        quantity: BigInt(1),
      },
    ],
    totalPrice: BigInt(65),
    status: "Completed",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    timestamp: Date.now() - 1800000, // 30 minutes ago
  },
];

// Local storage keys for demo mode
const DEMO_ORDERS_KEY = "cafeteria-demo-orders";
const DEMO_MENU_KEY = "cafeteria-demo-menu";
const ORDERS_UPDATE_EVENT = "cafeteria-orders-updated";

// Type for order update listeners
type OrderUpdateListener = (orders: DemoOrderType[]) => void;
const orderUpdateListeners: Set<OrderUpdateListener> = new Set();

// Subscribe to order updates
export function subscribeToOrderUpdates(
  listener: OrderUpdateListener,
): () => void {
  orderUpdateListeners.add(listener);
  return () => {
    orderUpdateListeners.delete(listener);
  };
}

// Notify all listeners of order updates
function notifyOrderUpdate(orders: DemoOrderType[]) {
  for (const listener of orderUpdateListeners) {
    try {
      listener(orders);
    } catch (error) {
      console.error("Error in order update listener:", error);
    }
  }
}

// Initialize demo data in localStorage
export function initializeDemoData() {
  try {
    if (!localStorage.getItem(DEMO_MENU_KEY)) {
      localStorage.setItem(DEMO_MENU_KEY, JSON.stringify(DEMO_FOOD_ITEMS));
    }
    if (!localStorage.getItem(DEMO_ORDERS_KEY)) {
      localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(DEMO_ORDERS));
    }
  } catch (error) {
    console.error("Failed to initialize demo data:", error);
  }
}

// Get demo menu items
export function getDemoMenuItems(): FoodItem[] {
  try {
    const stored = localStorage.getItem(DEMO_MENU_KEY);
    return stored ? JSON.parse(stored) : DEMO_FOOD_ITEMS;
  } catch (error) {
    console.error("Failed to get demo menu items:", error);
    return DEMO_FOOD_ITEMS;
  }
}

// Get demo orders
export function getDemoOrders(): DemoOrderType[] {
  try {
    const stored = localStorage.getItem(DEMO_ORDERS_KEY);
    return stored ? JSON.parse(stored) : DEMO_ORDERS;
  } catch (error) {
    console.error("Failed to get demo orders:", error);
    return DEMO_ORDERS;
  }
}

// Save demo orders with notification
export function saveDemoOrders(orders: DemoOrderType[]) {
  try {
    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(
      new CustomEvent(ORDERS_UPDATE_EVENT, { detail: orders }),
    );
    notifyOrderUpdate(orders);
  } catch (error) {
    console.error("Failed to save demo orders:", error);
  }
}

// Place demo order with payment information
export function placeDemoOrder(paymentMethod: "Cash" | "UPI"): string {
  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const menuItems = getDemoMenuItems();
  const orderItems = cartItems.map((cartItem) => {
    const foodItem = menuItems.find((item) => item.id === cartItem.id);
    if (!foodItem) {
      throw new Error(`Food item ${cartItem.id} not found`);
    }
    return {
      foodItem,
      quantity: BigInt(cartItem.quantity),
    };
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Read the currently logged-in user name from localStorage
  const storedName =
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("cafeteria_user_name")) ||
    "Student";

  const orderId = `order-${Date.now()}`;
  const newOrder: DemoOrderType = {
    id: orderId,
    userId: demoPrincipal,
    userName: storedName,
    items: orderItems,
    totalPrice: BigInt(totalPrice),
    status: "Pending",
    paymentMethod,
    paymentStatus: "Pending",
    timestamp: Date.now(),
  };

  const orders = getDemoOrders();
  orders.unshift(newOrder);
  saveDemoOrders(orders);

  clearCart();

  return orderId;
}

// Update demo order status
export function updateDemoOrderStatus(
  orderId: string,
  status: "Pending" | "Preparing" | "Ready" | "Completed",
) {
  const orders = getDemoOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId);

  if (orderIndex >= 0) {
    orders[orderIndex].status = status;
    saveDemoOrders(orders);
  }
}

// Update demo payment status
export function updateDemoPaymentStatus(
  orderId: string,
  paymentStatus: "Pending" | "Paid",
) {
  const orders = getDemoOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId);

  if (orderIndex >= 0) {
    orders[orderIndex].paymentStatus = paymentStatus;
    saveDemoOrders(orders);
  }
}

// Get single order by ID
export function getDemoOrderById(orderId: string): DemoOrderType | undefined {
  const orders = getDemoOrders();
  return orders.find((o) => o.id === orderId);
}

// Add demo food item
export function addDemoFoodItem(
  name: string,
  description: string,
  price: bigint,
  category: string,
): string {
  const items = getDemoMenuItems();
  const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${price}-${category.toLowerCase().replace(/\s+/g, "-")}`;

  const newItem: FoodItem = {
    id,
    name,
    description,
    category,
    price,
    image: undefined,
  };

  items.push(newItem);
  localStorage.setItem(DEMO_MENU_KEY, JSON.stringify(items));

  return id;
}

// Update demo food item
export function updateDemoFoodItem(
  id: string,
  name: string,
  description: string,
  price: bigint,
  category: string,
) {
  const items = getDemoMenuItems();
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex >= 0) {
    items[itemIndex] = {
      ...items[itemIndex],
      name,
      description,
      price,
      category,
    };
    localStorage.setItem(DEMO_MENU_KEY, JSON.stringify(items));
  }
}

// Delete demo food item
export function deleteDemoFoodItem(id: string) {
  const items = getDemoMenuItems();
  const filtered = items.filter((item) => item.id !== id);
  localStorage.setItem(DEMO_MENU_KEY, JSON.stringify(filtered));
}
