import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  ClipboardList,
  Clock,
  CreditCard,
  Hash,
  ShoppingBag,
} from "lucide-react";

interface OrderConfirmationScreenProps {
  orderId: string;
  paymentMethod: "Cash" | "UPI";
  totalAmount: number;
  onViewOrders: () => void;
  onBackToMenu: () => void;
}

export default function OrderConfirmationScreen({
  orderId,
  paymentMethod,
  totalAmount,
  onViewOrders,
  onBackToMenu,
}: OrderConfirmationScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Success Icon */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-green-100 shadow-lg">
            <CheckCircle
              className="h-16 w-16 text-green-500"
              strokeWidth={1.5}
            />
            <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold shadow">
              ✓
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
            <p className="mt-1 text-lg text-green-600 font-medium">
              Successfully
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your order has been received and is being prepared.
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <Card className="border-2 border-orange-200 shadow-md">
          <CardContent className="pt-6 space-y-4">
            {/* Order ID */}
            <div className="flex items-center justify-between rounded-lg bg-orange-50 px-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">Order ID</span>
              </div>
              <span className="font-bold text-orange-600 text-lg">
                {orderId}
              </span>
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm font-medium">Payment Method</span>
              </div>
              <Badge
                className={
                  paymentMethod === "UPI"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-green-100 text-green-800 border-green-200"
                }
                variant="outline"
              >
                {paymentMethod === "UPI" ? "📱 UPI" : "💵 Cash"}
              </Badge>
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-sm font-medium">Total Amount</span>
              </div>
              <span className="text-xl font-bold text-orange-600">
                ₹{totalAmount}
              </span>
            </div>

            <Separator />

            {/* Estimated Pickup Time */}
            <div className="flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Estimated Pickup Time
                </p>
                <p className="text-lg font-bold text-amber-700">
                  15–20 minutes
                </p>
              </div>
            </div>

            {/* Payment Status for UPI */}
            {paymentMethod === "UPI" && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Payment Successful
                  </p>
                  <p className="text-xs text-green-600">
                    UPI payment confirmed
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 py-6 text-base font-semibold hover:from-orange-600 hover:to-amber-600"
            size="lg"
            onClick={onViewOrders}
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            View My Orders
          </Button>
          <Button
            variant="outline"
            className="w-full border-orange-300 py-6 text-base font-semibold hover:bg-orange-50"
            size="lg"
            onClick={onBackToMenu}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
