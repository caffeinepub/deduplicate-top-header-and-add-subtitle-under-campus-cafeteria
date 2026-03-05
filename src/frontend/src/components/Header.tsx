import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { LogIn, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetCart } from "../hooks/useQueries";
import { useUserName } from "../hooks/useUserName";
import { getCustomLogo, subscribeToLogoUpdates } from "../lib/logoStorage";
import CartDrawer from "./CartDrawer";
import ProfileScreen from "./ProfileScreen";

interface HeaderProps {
  onProceedToPayment?: () => void;
}

export default function Header({ onProceedToPayment }: HeaderProps) {
  const { userName, isLoggedIn, login } = useUserName();
  const { data: cartItems = [] } = useGetCart();
  const queryClient = useQueryClient();
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const cartItemCount = cartItems.length;

  // Load custom logo on mount and subscribe to updates
  useEffect(() => {
    setLogoUrl(getCustomLogo());
    const unsubscribe = subscribeToLogoUpdates((newLogoUrl) => {
      setLogoUrl(newLogoUrl);
    });
    return unsubscribe;
  }, []);

  const handleProceedToPayment = () => {
    setShowCart(false);
    if (onProceedToPayment) {
      onProceedToPayment();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(nameInput);
    // Invalidate so header/profile immediately reflect new name
    queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    setShowLoginDialog(false);
    setNameInput("");
  };

  // Use custom logo if available, otherwise use default
  const displayLogoUrl =
    logoUrl || "/assets/generated/app-logo.dim_256x256.png";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-orange-200/50 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center">
              <img
                src={displayLogoUrl}
                alt="Campus Cafeteria Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Campus Cafeteria
              </h1>
              <p className="text-xs text-gray-500">JSPM Canteen</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <>
                {/* Cart Button */}
                <Button
                  data-ocid="header.cart.button"
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={() => setShowCart(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                      {cartItemCount}
                    </span>
                  )}
                </Button>

                {/* Profile Button */}
                <Button
                  data-ocid="header.profile.button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 hover:bg-orange-100"
                  onClick={() => setShowProfile(true)}
                >
                  <User className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                    {userName}
                  </span>
                </Button>
              </>
            )}

            {!isLoggedIn && (
              <Button
                data-ocid="header.login.button"
                onClick={() => setShowLoginDialog(true)}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent data-ocid="login.dialog" className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Welcome to Campus Cafeteria! 🍽️</DialogTitle>
            <DialogDescription>
              Sign in to place orders and track your food.
            </DialogDescription>
          </DialogHeader>

          {/* Social login buttons */}
          <div className="space-y-2 pt-2">
            <Button
              data-ocid="login.google.button"
              type="button"
              variant="outline"
              className="w-full flex items-center gap-3 border-gray-200 hover:bg-gray-50"
              onClick={() => {
                login("Google User");
                queryClient.invalidateQueries({
                  queryKey: ["currentUserProfile"],
                });
                setShowLoginDialog(false);
              }}
            >
              {/* Google "G" SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M488 261.8c0-17.8-1.6-34.9-4.6-51.4H249v97.4h134.9c-5.8 31.4-23.3 58-49.6 75.8v63h80.3c47-43.3 74.4-107.1 74.4-184.8z"
                />
                <path
                  fill="#34A853"
                  d="M249 512c67.5 0 124.1-22.4 165.5-60.6l-80.3-63c-22.3 14.9-50.8 23.7-85.2 23.7-65.5 0-121-44.2-140.8-103.6H25.6v65.2C66.9 455.6 152.4 512 249 512z"
                />
                <path
                  fill="#FBBC05"
                  d="M108.2 308.5c-5-14.9-7.8-30.8-7.8-47.2s2.8-32.3 7.8-47.2v-65.2H25.6C9.3 180.5 0 214.2 0 250c0 35.9 9.3 69.6 25.6 101.1l82.6-42.6z"
                />
                <path
                  fill="#EA4335"
                  d="M249 100.1c36.9 0 70 12.7 96.1 37.6l72-72C375.1 24.7 318.5 0 249 0 152.4 0 66.9 56.4 25.6 138.9l82.6 42.6C128 122.3 183.5 100.1 249 100.1z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              data-ocid="login.apple.button"
              type="button"
              variant="outline"
              className="w-full flex items-center gap-3 border-gray-200 hover:bg-gray-50"
              onClick={() => {
                login("Apple User");
                queryClient.invalidateQueries({
                  queryKey: ["currentUserProfile"],
                });
                setShowLoginDialog(false);
              }}
            >
              {/* Apple logo SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 814 1000"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46.7 790.7 0 663 0 541.8c0-207.5 135.4-317.3 268.7-317.3 70.5 0 129.2 46.5 173.2 46.5 41.8 0 108.2-49.3 190.5-49.3zm-160.3-167.4c37.5-44.5 63.9-106.1 63.9-167.7 0-8.4-.7-16.9-2.1-24.7-60.5 2.3-132.4 40.2-175.4 90.3-33.5 37.5-65.4 99.5-65.4 162.3 0 9.1 1.6 18.2 2.3 21.1 3.9.7 10.4 1.6 16.9 1.6 53.9 0 122.3-35.8 159.8-83z" />
              </svg>
              Continue with Apple
            </Button>
          </div>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">or</span>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="login-name">Your Name</Label>
              <Input
                data-ocid="login.input"
                id="login-name"
                placeholder="e.g. Uzair (leave blank for Student)"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
              />
            </div>
            <Button
              data-ocid="login.submit_button"
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              Continue
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <CartDrawer
        open={showCart}
        onOpenChange={setShowCart}
        onProceedToPayment={handleProceedToPayment}
      />

      <ProfileScreen open={showProfile} onOpenChange={setShowProfile} />
    </>
  );
}
