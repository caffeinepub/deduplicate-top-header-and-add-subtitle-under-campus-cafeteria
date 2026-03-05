import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useGetCart,
  useRemoveFromCart,
  useUpdateCartItemQuantity,
} from "../hooks/useQueries";
import { DEMO_IMAGE_MAP } from "../lib/demoData";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceedToPayment: () => void;
}

export default function CartDrawer({
  open,
  onOpenChange,
  onProceedToPayment,
}: CartDrawerProps) {
  const { data: cartItems = [] } = useGetCart();
  const updateQuantity = useUpdateCartItemQuantity();
  const removeItem = useRemoveFromCart();

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const handleProceedToPayment = () => {
    onOpenChange(false);
    onProceedToPayment();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </SheetDescription>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Your cart is empty
            </p>
            <p className="text-sm text-muted-foreground">
              Add some delicious items to get started!
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const imageUrl =
                    DEMO_IMAGE_MAP[item.id] || "/assets/placeholder.jpg";
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-lg border bg-card p-4"
                    >
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity.mutate({
                                foodItemId: item.id,
                                quantity: BigInt(
                                  Math.max(1, item.quantity - 1),
                                ),
                              })
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity.mutate({
                                foodItemId: item.id,
                                quantity: BigInt(item.quantity + 1),
                              })
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="ml-auto h-7 w-7 text-destructive"
                            onClick={() => removeItem.mutate(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-orange-600">₹{totalPrice}</span>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                size="lg"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
