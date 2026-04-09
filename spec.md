# Campus Cafeteria PWA – Liquid Glass UI Upgrade

## Current State
Fully functional PWA with student + admin flows. UI uses standard Tailwind classes, white cards, and orange gradient accents. No glassmorphism effects currently applied.

## Requested Changes (Diff)

### Add
- Global glassmorphism CSS utilities in `index.css`: `.glass-card`, `.glass-panel`, `.glass-nav`, `.glass-btn` using `backdrop-filter: blur()` and `rgba` backgrounds
- Smooth transitions and hover glow effects via CSS
- Fallback styles for browsers without `backdrop-filter` support

### Modify
- `index.css`: Add glass utility classes, update body background to a warm orange/beige gradient
- `App.tsx`: Apply gradient background to the student view wrapper
- `LandingPage.tsx`: Replace Card components with glass-style panels, glass-style buttons, glow on hover
- `Header.tsx`: Already has `bg-white/80 backdrop-blur-lg` — enhance with stronger blur, glass border, scroll transparency
- `FoodItemCard.tsx`: Replace Card with glass panel — semi-transparent bg, backdrop-blur, floating shadow
- `PaymentPage.tsx`: Glass containers for Order Items card, Total card, Payment Method selection, fixed bottom bar
- `CartDrawer.tsx`: Glass styling on cart item rows
- `AdminLogin.tsx`: Enhance existing glass card (already has `bg-white/80 backdrop-blur-sm`)
- `AdminLayout.tsx`: Sidebar with glass effect (`bg-white/70 backdrop-blur-xl`), mobile header glass nav
- `AdminDashboardPage.tsx`: Stat cards as floating glass widgets, recent orders rows glass styled
- `AdminOrdersPage.tsx`: Table container with glass/transparent background
- `AdminMenuPage.tsx`: No structural change needed; MenuManagement component will inherit glass styles if card classes are updated

### Remove
- Solid white `bg-white` on cards/panels (replace with semi-transparent glass equivalents)
- Solid `bg-gray-50` admin background (replace with warm gradient)

## Implementation Plan
1. Add glassmorphism CSS utility classes to `index.css`
2. Update background gradients globally (App.tsx, AdminLayout.tsx)
3. Upgrade LandingPage role cards to glass panels
4. Upgrade Header navbar to full glass nav
5. Upgrade FoodItemCard to glass panel
6. Upgrade PaymentPage cards to glass containers
7. Upgrade Admin sidebar and dashboard cards to glass widgets
8. Upgrade AdminOrdersPage table container
9. Validate build
