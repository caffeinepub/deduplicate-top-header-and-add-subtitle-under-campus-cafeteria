# Cafeteria Pre-Order PWA - Offline Demo Version

## Overview
This is a self-contained offline demonstration version of a college cafeteria pre-ordering Progressive Web Application. All data is stored locally using browser localStorage, making it perfect for college project demonstrations without requiring backend infrastructure.

## Features

### User Features
- Browse menu items by category (Snacks, Meals, Beverages, South Indian)
- Add items to cart with quantity selection
- **Detailed Payment Page** with comprehensive order summary including:
  - Complete list of ordered items with images, quantities, and prices
  - Subtotal calculation for each item
  - Total amount payable prominently displayed
  - Payment method selection (Cash or UPI)
  - Simulated payment status display
- View order summary with detailed payment and status information
- Real-time order status tracking (Pending → Preparing → Ready → Completed)
- Real-time payment status updates (Pending → Paid)
- Persistent cart across browser sessions

### Admin Features
- **All Orders Section**: View complete list of all orders with payment information
- **Order Detail Modal**: Comprehensive order management with:
  - Full customer and order details
  - Payment method and status management
  - **"Mark as Received" button** to update payment status from Pending to Paid
  - Order status updates with visual feedback
  - Real-time synchronization with user interface
- **Quick Order Management**: Fast status updates for active orders
- **Menu Management**: Add, edit, and delete menu items (demo mode)
- Real-time synchronization with user interface

### PWA Features
- Installable on Android devices via "Add to Home Screen"
- Full-screen launch mode without browser UI
- Offline functionality with cached assets
- Instant loading with immediate data availability
- Cross-tab synchronization for cart and orders

## Installation & Setup

### Running Locally
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Installing as PWA on Android

1. **Open in Chrome**: Navigate to the app URL in Chrome browser

2. **Add to Home Screen**:
   - Tap the three-dot menu (⋮) in the top-right corner
   - Select "Add to Home Screen"
   - Confirm the installation

3. **Launch the App**:
   - Find the app icon on your home screen
   - Tap to launch in full-screen mode

## Demo Mode Usage

### Switching Between User and Admin Modes

The app includes a floating shield button (bottom-right corner) to toggle between user and admin modes:
- **User Mode**: Browse menu, place orders, track order status
- **Admin Mode**: Manage orders, update payment status, manage menu

### User Mode Demonstration

1. **Browse Menu**:
   - View food items organized by category
   - Use category filters to narrow down selection
   - Each item shows image, name, description, and price

2. **Add to Cart**:
   - Click on any food item
   - Select quantity
   - Click "Add to Cart"
   - Cart badge updates automatically

3. **Proceed to Payment**:
   - Open cart drawer (cart icon in header)
   - Review items and total
   - Click "Proceed to Payment"

4. **Payment Page - Detailed Order Summary**:
   - View complete list of ordered items with:
     - Item images
     - Item names
     - Quantity and individual prices
     - Subtotal for each item (quantity × price)
   - See total amount payable prominently displayed
   - Select payment method:
     - **Cash**: Pay at pickup
     - **UPI**: Online payment
   - View simulated payment status (Pending)
   - Click "Confirm Order" to place order

5. **Track Orders**:
   - Switch to "My Orders" tab
   - View all your orders with status badges
   - Click "View Details" for comprehensive order summary
   - See payment method and payment status
   - Watch for real-time status updates (animated)

### Admin Mode Demonstration

1. **View All Orders**:
   - Navigate to "All Orders" tab
   - See complete list of orders with customer names
   - Filter by status (All, Pending, Preparing, Ready, Completed)
   - View payment method and status for each order

2. **Manage Order Details**:
   - Click "View Details & Manage" on any order
   - See complete order information including:
     - Customer details
     - Itemized list with images and prices
     - Payment method and current status
     - Order progress visualization
   - **Update Payment Status**:
     - For orders with "Payment Pending" status
     - Click "Mark as Received" button
     - Payment status changes to "Paid" immediately
     - User view updates in real-time
   - **Update Order Status**:
     - Use dropdown to select new status
     - Choose from: Preparing, Ready, Completed
     - Changes sync immediately with user view
   - Visual feedback with animations during updates

3. **Quick Order Management**:
   - Navigate to "Order Management" tab
   - Use quick action buttons:
     - "Start Preparing" for Pending orders
     - "Mark as Ready" for Preparing orders
     - "Mark as Completed" for Ready orders
   - Visual feedback with animations during updates

4. **Menu Management**:
   - Navigate to "Menu Management" tab
   - Add new food items (demo mode - not persisted)
   - Edit existing items
   - Delete items

## Real-Time Synchronization Testing

### Testing Order Status Updates

1. **Setup**:
   - Open the app in two browser windows/tabs
   - Set one to User Mode, one to Admin Mode
   - Place an order from User Mode

2. **Test Status Updates**:
   - In Admin Mode, update order status
   - Watch User Mode for immediate update with animation
   - Status badge should pulse and change color
   - No page refresh required

3. **Cross-Tab Sync**:
   - Open multiple User Mode tabs
   - Update status in Admin Mode
   - All User Mode tabs update simultaneously

### Testing Payment Status Updates

1. **Setup**:
   - Place an order with "Cash" payment method
   - Order will have "Payment Pending" status

2. **Test Payment Updates**:
   - In Admin Mode, open order details
   - Click "Mark as Received"
   - User view updates immediately
   - Payment badge changes from yellow (Pending) to green (Paid)
   - Button changes to "Payment Received" confirmation

3. **Cross-Tab Payment Sync**:
   - Open order in multiple tabs
   - Update payment status in Admin Mode
   - All tabs reflect the change instantly

### Testing Cart Synchronization

1. **Setup**:
   - Open app in two User Mode tabs

2. **Test Cart Sync**:
   - Add items to cart in first tab
   - Cart badge updates in both tabs
   - Open cart drawer in second tab
   - Items appear immediately

## Demo Data

### Pre-loaded Orders
The app includes 4 sample orders with different statuses:
- Order #001: Rahul Sharma - Pending (Cash, Payment Pending)
- Order #002: Priya Patel - Preparing (UPI, Paid)
- Order #003: Amit Kumar - Ready (Cash, Paid)
- Order #004: Sneha Singh - Completed (UPI, Paid)

### Menu Items
14 food items across 4 categories:
- **Snacks**: Samosa (₹20), Vada Pav (₹25)
- **South Indian**: Idli (₹30), Dosa (₹40), Upma (₹25), Poha (₹20)
- **Meals**: Veg Thali (₹80), Sandwich (₹35), Pav Bhaji (₹45), Fried Rice (₹50), Noodles (₹40)
- **Beverages**: Tea (₹10), Coffee (₹15), Cold Drinks (₹20)

## College Submission Testing Guidelines

### Complete Workflow Demonstration

1. **Initial Setup** (1 minute):
   - Show app installation on Android device
   - Launch app in full-screen mode
   - Demonstrate offline functionality (turn off network)

2. **User Journey** (4 minutes):
   - Browse menu categories
   - Add multiple items to cart
   - Show cart persistence (refresh page)
   - Click "Proceed to Payment"
   - **Demonstrate Payment Page**:
     - Show detailed order summary with all items
     - Point out subtotals for each item
     - Highlight total amount
     - Select payment method (Cash or UPI)
     - Show payment status indicator
   - Confirm order
   - View order in "My Orders" tab
   - Show order summary with payment details

3. **Admin Management** (4 minutes):
   - Switch to Admin Mode
   - Show "All Orders" section with all orders
   - Open order detail modal
   - **Demonstrate Payment Management**:
     - Show order with "Payment Pending" status
     - Click "Mark as Received" button
     - Show immediate status change to "Paid"
     - Highlight visual feedback
   - **Demonstrate Order Status Updates**:
     - Update order status (Pending → Preparing → Ready → Completed)
     - Show dropdown selection
     - Highlight visual feedback
   - Show real-time sync in User Mode

4. **Real-Time Features** (2 minutes):
   - Open app in two windows side-by-side
   - Demonstrate status update synchronization
   - Show payment status updates across tabs
   - Demonstrate cart synchronization

5. **PWA Features** (1 minute):
   - Show offline functionality
   - Demonstrate instant loading
   - Show full-screen mode on mobile

## Troubleshooting

### White Screen on Startup
If you see a white screen:
1. Clear browser cache and localStorage
2. Refresh the page
3. Check browser console for errors
4. Ensure service worker is registered

### Orders Not Updating
If order status doesn't update:
1. Check that both windows are on the same domain
2. Clear localStorage: `localStorage.clear()`
3. Refresh both windows
4. Verify localStorage events are firing

### Cart Not Persisting
If cart items disappear:
1. Check browser localStorage is enabled
2. Verify localStorage quota not exceeded
3. Check for browser privacy settings blocking storage
4. Try in incognito mode to test

### Payment Status Not Changing
If payment status doesn't update:
1. Ensure you're in Admin Mode
2. Check order detail modal is open
3. Verify localStorage is working
4. Refresh the page and try again

### Real-Time Sync Not Working
If changes don't sync across tabs:
1. Ensure both tabs are on same domain
2. Check browser console for errors
3. Verify storage events are enabled
4. Try closing and reopening tabs

### Payment Page Not Showing Items
If payment page appears empty:
1. Verify cart has items before proceeding
2. Check localStorage "cart" key has data
3. Refresh the page
4. Try adding items again

## Technical Details

### Data Storage
- **Cart**: localStorage key "cart"
- **Orders**: localStorage key "cafeteria-demo-orders"
- **Menu**: localStorage key "cafeteria-demo-menu"
- **Admin Mode**: localStorage key "cafeteria-demo-admin"

### Synchronization Mechanism
- Storage events for cross-tab communication
- Observer pattern for in-app updates
- Custom events for order updates
- Automatic re-rendering on data changes

### Payment System
- Detailed payment page with order summary
- Payment method selection (Cash/UPI) before order placement
- Payment status tracking (Pending/Paid)
- Admin "Mark as Received" button for payment confirmation
- Real-time payment status synchronization across all views

## Notes for College Submission

- This is a **demonstration version** with hardcoded data
- All data is stored locally in browser localStorage
- No backend server or database required
- Perfect for offline demonstrations
- Real-time features work across browser tabs
- Payment system is simulated for demo purposes
- All features work without internet connection after initial load
- Payment page provides detailed order summary for professional presentation

## Support

For issues or questions during demonstration:
1. Check browser console for error messages
2. Verify localStorage is enabled
3. Try clearing cache and reloading
4. Ensure using a modern browser (Chrome, Firefox, Edge)
5. Check PWA installation status in browser settings

---

Built with ❤️ using [caffeine.ai](https://caffeine.ai)
