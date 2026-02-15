import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCart } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';
import CartDrawer from './CartDrawer';

interface HeaderProps {
  onProceedToPayment?: () => void;
}

export default function Header({ onProceedToPayment }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: cartItems = [] } = useGetCart();
  const queryClient = useQueryClient();
  const [showCart, setShowCart] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const cartItemCount = cartItems.length;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleProceedToPayment = () => {
    setShowCart(false);
    if (onProceedToPayment) {
      onProceedToPayment();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-orange-200/50 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
              <span className="text-xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Campus Cafeteria</h1>
              <p className="text-xs text-gray-500">JSPM Canteen</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && userProfile && (
              <>
                <Button
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
                <div className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">
                  <User className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">{userProfile.name}</span>
                </div>
              </>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              size="sm"
              variant={isAuthenticated ? 'outline' : 'default'}
              className={
                isAuthenticated
                  ? ''
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
              }
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
      <CartDrawer open={showCart} onOpenChange={setShowCart} onProceedToPayment={handleProceedToPayment} />
    </>
  );
}
