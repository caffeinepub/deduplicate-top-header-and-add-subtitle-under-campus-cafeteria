import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import type { FoodItem, UserProfile } from "../backend";
import {
  type CartItem,
  addToCart,
  clearCart,
  getCartItems,
  removeCartItem,
  subscribeToCartUpdates,
  updateCartItemQuantity,
} from "../lib/cartStorage";
import {
  type DemoOrderType,
  addDemoFoodItem,
  deleteDemoFoodItem,
  getDemoMenuItems,
  getDemoOrders,
  initializeDemoData,
  placeDemoOrder,
  subscribeToOrderUpdates,
  updateDemoFoodItem,
  updateDemoOrderStatus,
  updateDemoPaymentStatus,
} from "../lib/demoData";

// Initialize demo data immediately on module load
initializeDemoData();

// User Profile Queries (Demo mode — reads name from localStorage)
export function useGetCallerUserProfile() {
  return useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: () => {
      const storedName = localStorage.getItem("cafeteria_user_name");
      const isLoggedIn =
        localStorage.getItem("cafeteria_is_logged_in") === "true";
      if (!isLoggedIn) return null;
      return { name: storedName || "Student" };
    },
    staleTime: 0,
    retry: false,
  });
}

export function useSaveCallerUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_profile: UserProfile) => {
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      toast.success("Profile saved successfully");
    },
  });
}

// Admin Check (Demo mode)
export function useIsCallerAdmin() {
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: () => {
      return localStorage.getItem("cafeteria-demo-admin") === "true";
    },
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
}

// Food Items Queries
export function useGetAllFoodItems() {
  return useQuery<FoodItem[]>({
    queryKey: ["foodItems"],
    queryFn: () => {
      return getDemoMenuItems();
    },
    staleTime: Number.POSITIVE_INFINITY,
    initialData: getDemoMenuItems(),
  });
}

export function useGetFoodItemsByCategory(category: string) {
  return useQuery<FoodItem[]>({
    queryKey: ["foodItems", category],
    queryFn: () => {
      const items = getDemoMenuItems();
      return items.filter((item) => item.category === category);
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useAddFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      price: bigint;
      category: string;
    }) => {
      return addDemoFoodItem(
        params.name,
        params.description,
        params.price,
        params.category,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
      toast.success("Food item added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add food item");
    },
  });
}

export function useUpdateFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      name: string;
      description: string;
      price: bigint;
      category: string;
    }) => {
      updateDemoFoodItem(
        params.id,
        params.name,
        params.description,
        params.price,
        params.category,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
      toast.success("Food item updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update food item");
    },
  });
}

export function useUpdateFoodItemImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
      toast.success("Image updated (demo mode - not persisted)");
    },
  });
}

export function useDeleteFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      deleteDemoFoodItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodItems"] });
      toast.success("Food item deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete food item");
    },
  });
}

// Cart Queries
export function useGetCart() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = subscribeToCartUpdates(() => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    });

    return unsubscribe;
  }, [queryClient]);

  return useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: () => {
      return getCartItems();
    },
    staleTime: 0,
    initialData: getCartItems(),
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { foodItem: FoodItem; quantity: bigint }) => {
      addToCart(params.foodItem, Number(params.quantity));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add to cart");
    },
  });
}

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { foodItemId: string; quantity: bigint }) => {
      updateCartItemQuantity(params.foodItemId, Number(params.quantity));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update quantity");
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodItemId: string) => {
      removeCartItem(foodItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Removed from cart");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove from cart");
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Order Queries with payment method
export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethod: "Cash" | "UPI") => {
      return placeDemoOrder(paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      toast.success("Order placed successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to place order");
    },
  });
}

export function useGetUserOrders() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = subscribeToOrderUpdates(() => {
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    });

    return unsubscribe;
  }, [queryClient]);

  return useQuery<DemoOrderType[]>({
    queryKey: ["userOrders"],
    queryFn: () => {
      return getDemoOrders();
    },
    staleTime: 1000,
    initialData: getDemoOrders(),
  });
}

export function useGetAllOrders() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = subscribeToOrderUpdates(() => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    });

    return unsubscribe;
  }, [queryClient]);

  return useQuery<DemoOrderType[]>({
    queryKey: ["allOrders"],
    queryFn: () => {
      return getDemoOrders();
    },
    staleTime: 1000,
    initialData: getDemoOrders(),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { orderId: string; status: string }) => {
      updateDemoOrderStatus(params.orderId, params.status as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      toast.success("Order status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order status");
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { orderId: string; paymentStatus: string }) => {
      updateDemoPaymentStatus(params.orderId, params.paymentStatus as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      toast.success("Payment status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update payment status");
    },
  });
}
