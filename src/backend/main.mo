import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  module FoodItem {
    public func compareByCategory(foodItem1 : FoodItem, foodItem2 : FoodItem) : Order.Order {
      Text.compare(foodItem1.category, foodItem2.category);
    };
  };

  module OrderModule {
    public func compareByStatus(order1 : OrderType, order2 : OrderType) : Order.Order {
      Text.compare(order1.status, order2.status);
    };
  };

  // Types
  public type FoodItem = {
    id : Text;
    name : Text;
    description : Text;
    category : Text;
    price : Nat;
    image : ?Storage.ExternalBlob;
  };

  public type OrderItem = {
    foodItem : FoodItem;
    quantity : Nat;
  };

  public type OrderType = {
    id : Text;
    userId : Principal;
    items : [OrderItem];
    totalPrice : Nat;
    status : Text; // "Pending", "Preparing", "Ready"
  };

  public type Cart = {
    items : [OrderItem];
  };

  public type UserProfile = {
    name : Text;
  };

  // Storage
  let foodItems = Map.empty<Text, FoodItem>();
  let orders = Map.empty<Text, OrderType>();
  let carts = Map.empty<Principal, Cart>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Image Storage
  include MixinStorage();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Menu Management
  public shared ({ caller }) func addFoodItem(name : Text, description : Text, price : Nat, category : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add food items");
    };
    let id = name # price.toText() # category;
    let foodItem : FoodItem = {
      id;
      name;
      description;
      price;
      category;
      image = null;
    };
    foodItems.add(id, foodItem);
    id;
  };

  public shared ({ caller }) func updateFoodItem(id : Text, name : Text, description : Text, price : Nat, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update food items");
    };
    switch (foodItems.get(id)) {
      case (null) { Runtime.trap("This food item does not exist") };
      case (?existing) {
        let updated : FoodItem = {
          id = existing.id;
          name;
          description;
          price;
          category;
          image = existing.image;
        };
        foodItems.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteFoodItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete food items");
    };
    if (not foodItems.containsKey(id)) {
      Runtime.trap("This food item does not exist");
    };
    foodItems.remove(id);
  };

  public shared ({ caller }) func updateFoodItemImage(id : Text, image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update food item images");
    };
    switch (foodItems.get(id)) {
      case (null) { Runtime.trap("This food item does not exist") };
      case (?existing) {
        let updated : FoodItem = {
          id = existing.id;
          name = existing.name;
          description = existing.description;
          price = existing.price;
          category = existing.category;
          image = ?image;
        };
        foodItems.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getAllFoodItems() : async [FoodItem] {
    // Public access - anyone can view menu
    foodItems.values().toArray();
  };

  public query ({ caller }) func getFoodItemsByCategory(category : Text) : async [FoodItem] {
    // Public access - anyone can view menu
    foodItems.values().toArray().filter(func(item) { item.category == category });
  };

  // Cart Management
  public shared ({ caller }) func addToCart(foodItem : FoodItem, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };
    let orderItem : OrderItem = {
      foodItem;
      quantity;
    };
    let cart = switch (carts.get(caller)) {
      case (null) {
        { items = [orderItem] };
      };
      case (?existing) {
        let items = existing.items.concat([orderItem]);
        { items };
      };
    };
    carts.add(caller, cart);
  };

  public shared ({ caller }) func removeFromCart(foodItemId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("This cart does not exist") };
      case (?existing) {
        let items = existing.items.filter(func(item) { item.foodItem.id != foodItemId });
        { items };
      };
    };
    carts.add(caller, cart);
  };

  public shared ({ caller }) func updateCartItemQuantity(foodItemId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart items");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("This cart does not exist") };
      case (?existing) {
        let items = existing.items.map(
          func(item) {
            if (item.foodItem.id == foodItemId) {
              { foodItem = item.foodItem; quantity };
            } else { item };
            }
          );
        { items };
      };
    };
    carts.add(caller, cart);
  };

  public shared ({ caller }) func clearUserCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear their cart");
    };
    carts.remove(caller);
  };

  public query ({ caller }) func getCart() : async Cart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };
    switch (carts.get(caller)) {
      case (null) { { items = [] } };
      case (?cart) { cart };
    };
  };

  // Order Management
  public shared ({ caller }) func placeOrder() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("This cart does not exist") };
      case (?cart) {
        if (cart.items.size() == 0) {
          Runtime.trap("Cannot place order with empty shopping cart");
        };
        let totalPrice = cart.items.foldLeft(
          0,
          func(acc, item) {
            acc + (item.foodItem.price * item.quantity);
          },
        );
        let id = caller.toText() # totalPrice.toText();
        let order : OrderType = {
          id;
          userId = caller;
          items = cart.items;
          totalPrice;
          status = "Pending";
        };
        orders.add(id, order);
        carts.remove(caller);
        id;
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("This order does not exist") };
      case (?order) {
        let updated : OrderType = {
          id = order.id;
          userId = order.userId;
          items = order.items;
          totalPrice = order.totalPrice;
          status;
        };
        orders.add(orderId, updated);
      };
    };
  };

  public query ({ caller }) func getUserOrders(userId : Principal) : async [OrderType] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter<OrderType>(
      func(order) { order.userId == userId }
    );
  };

  public query ({ caller }) func getAllOrders() : async [OrderType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getPendingOrders() : async [OrderType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending orders");
    };
    orders.values().toArray().filter<OrderType>(func(o) { o.status == "Pending" });
  };

  public query ({ caller }) func getPreparingOrders() : async [OrderType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view preparing orders");
    };
    orders.values().toArray().filter<OrderType>(func(o) { o.status == "Preparing" });
  };

  public query ({ caller }) func getReadyOrders() : async [OrderType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view ready orders");
    };
    orders.values().toArray().filter<OrderType>(func(o) { o.status == "Ready" });
  };
};
