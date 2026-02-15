import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface OrderItem {
    quantity: bigint;
    foodItem: FoodItem;
}
export interface FoodItem {
    id: string;
    name: string;
    description: string;
    category: string;
    image?: ExternalBlob;
    price: bigint;
}
export interface Cart {
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
}
export interface OrderType {
    id: string;
    status: string;
    userId: Principal;
    items: Array<OrderItem>;
    totalPrice: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFoodItem(name: string, description: string, price: bigint, category: string): Promise<string>;
    addToCart(foodItem: FoodItem, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearUserCart(): Promise<void>;
    deleteFoodItem(id: string): Promise<void>;
    getAllFoodItems(): Promise<Array<FoodItem>>;
    getAllOrders(): Promise<Array<OrderType>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart>;
    getFoodItemsByCategory(category: string): Promise<Array<FoodItem>>;
    getPendingOrders(): Promise<Array<OrderType>>;
    getPreparingOrders(): Promise<Array<OrderType>>;
    getReadyOrders(): Promise<Array<OrderType>>;
    getUserOrders(userId: Principal): Promise<Array<OrderType>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(): Promise<string>;
    removeFromCart(foodItemId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCartItemQuantity(foodItemId: string, quantity: bigint): Promise<void>;
    updateFoodItem(id: string, name: string, description: string, price: bigint, category: string): Promise<void>;
    updateFoodItemImage(id: string, image: ExternalBlob): Promise<void>;
    updateOrderStatus(orderId: string, status: string): Promise<void>;
}
