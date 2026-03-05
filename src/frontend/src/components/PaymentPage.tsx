import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Banknote,
  Check,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useGetCart, usePlaceOrder } from "../hooks/useQueries";
import { DEMO_IMAGE_MAP } from "../lib/demoData";
import OrderConfirmationScreen from "./OrderConfirmationScreen";
import UPIProcessingScreen from "./UPIProcessingScreen";

type CheckoutStage =
  | "payment-selection"
  | "upi-processing"
  | "order-confirmation";

interface PaymentPageProps {
  onBack: () => void;
  onSuccess: () => void;
  onViewOrders?: () => void;
}

// Generate a random demo order ID like #ORD1024
function generateOrderId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `#ORD${num}`;
}

export default function PaymentPage({
  onBack,
  onSuccess,
  onViewOrders,
}: PaymentPageProps) {
  const { data: cartItems = [] } = useGetCart();
  const placeOrder = usePlaceOrder();
  const [selectedMethod, setSelectedMethod] = useState<"Cash" | "UPI" | null>(
    null,
  );
  const [stage, setStage] = useState<CheckoutStage>("payment-selection");
  const [orderId] = useState<string>(generateOrderId());
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState<
    "Cash" | "UPI"
  >("Cash");
  const [confirmedTotal, setConfirmedTotal] = useState<number>(0);

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const handleConfirmOrder = async () => {
    if (!selectedMethod) return;

    const method = selectedMethod;
    const total = totalPrice;

    try {
      await placeOrder.mutateAsync(method);
      setConfirmedPaymentMethod(method);
      setConfirmedTotal(total);

      if (method === "UPI") {
        setStage("upi-processing");
      } else {
        setStage("order-confirmation");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  const handleUPISuccess = useCallback(() => {
    setStage("order-confirmation");
  }, []);

  const handleViewOrders = () => {
    onSuccess();
    if (onViewOrders) {
      onViewOrders();
    }
  };

  const handleBackToMenu = () => {
    onSuccess();
  };

  // UPI Processing Screen
  if (stage === "upi-processing") {
    return <UPIProcessingScreen onSuccess={handleUPISuccess} />;
  }

  // Order Confirmation Screen
  if (stage === "order-confirmation") {
    return (
      <OrderConfirmationScreen
        orderId={orderId}
        paymentMethod={confirmedPaymentMethod}
        totalAmount={confirmedTotal}
        onViewOrders={handleViewOrders}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  // Empty cart fallback
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          Your cart is empty
        </p>
        <Button onClick={onBack} className="mt-4">
          Back to Menu
        </Button>
      </div>
    );
  }

  // Payment Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-4 pb-24">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Payment & Order Summary</h1>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const imageUrl =
                    DEMO_IMAGE_MAP[item.id] || "/assets/placeholder.jpg";
                  const subtotal = item.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-lg border bg-white p-3"
                    >
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{subtotal}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Total Amount */}
        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold text-orange-600">
                  ₹{totalPrice}
                </p>
              </div>
              <Badge variant="outline" className="text-lg">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              type="button"
              className={`w-full text-left cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                selectedMethod === "Cash"
                  ? "border-orange-500 bg-orange-50 shadow-md"
                  : "border-gray-200 hover:border-orange-300"
              }`}
              onClick={() => setSelectedMethod("Cash")}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-3 ${selectedMethod === "Cash" ? "bg-orange-500" : "bg-gray-100"}`}
                >
                  <Banknote
                    className={`h-6 w-6 ${selectedMethod === "Cash" ? "text-white" : "text-gray-600"}`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Cash</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay with cash at pickup
                  </p>
                </div>
                {selectedMethod === "Cash" && (
                  <Check className="h-6 w-6 text-orange-500" />
                )}
              </div>
            </button>

            <button
              type="button"
              className={`w-full text-left cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                selectedMethod === "UPI"
                  ? "border-orange-500 bg-orange-50 shadow-md"
                  : "border-gray-200 hover:border-orange-300"
              }`}
              onClick={() => setSelectedMethod("UPI")}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-3 ${selectedMethod === "UPI" ? "bg-orange-500" : "bg-gray-100"}`}
                >
                  <Smartphone
                    className={`h-6 w-6 ${selectedMethod === "UPI" ? "text-white" : "text-gray-600"}`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">UPI</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay online via UPI
                  </p>
                </div>
                {selectedMethod === "UPI" && (
                  <Check className="h-6 w-6 text-orange-500" />
                )}
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Payment Status Info */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-yellow-100 p-2">
                <Banknote className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-yellow-900">
                  Payment Status: Pending
                </p>
                <p className="text-sm text-yellow-700">
                  Your payment will be marked as pending until confirmed by the
                  cafeteria staff.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Confirm Button */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
          <div className="mx-auto max-w-2xl">
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 py-6 text-lg hover:from-orange-600 hover:to-amber-600"
              size="lg"
              onClick={handleConfirmOrder}
              disabled={!selectedMethod || placeOrder.isPending}
            >
              {placeOrder.isPending ? "Processing..." : "Confirm Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
