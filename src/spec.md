# Specification

## Summary
**Goal:** Ensure a single sticky top header is shown throughout the non-admin user flow and add a subtitle under “Campus Cafeteria” without changing any other layout.

**Planned changes:**
- Remove the duplicate Header rendering so only one header bar appears at the top (including on the Home page).
- Update the header title block to show “JSPM Canteen” directly beneath “Campus Cafeteria” in a smaller, light-gray style with clean spacing.
- Keep the Login/Logout button right-aligned in the single header and verify existing cart/login interactions remain working (including proceed-to-payment from the cart drawer).

**User-visible outcome:** Users see only one “Campus Cafeteria” header across the app, with a “JSPM Canteen” subtitle beneath it, while authentication and cart/payment navigation behave as before.
