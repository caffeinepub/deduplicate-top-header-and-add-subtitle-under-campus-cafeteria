import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, ChefHat, Clock, Eye, Package } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DEMO_IMAGE_MAP,
  type DemoOrderType,
  subscribeToOrderUpdates,
} from "../lib/demoData";
import OrderSummaryDialog from "./OrderSummaryDialog";

interface OrdersSectionProps {
  orders: DemoOrderType[];
}

const STATUS_CONFIG = {
  Pending: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
    label: "Pending",
  },
  Preparing: {
    icon: ChefHat,
    color: "bg-blue-100 text-blue-800",
    label: "Preparing",
  },
  Ready: {
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800",
    label: "Ready for Pickup",
  },
  Completed: {
    icon: Package,
    color: "bg-gray-100 text-gray-800",
    label: "Completed",
  },
};

const PAYMENT_STATUS_CONFIG = {
  Pending: { color: "bg-yellow-100 text-yellow-800", label: "Payment Pending" },
  Paid: { color: "bg-green-100 text-green-800", label: "Paid" },
};

export default function OrdersSection({
  orders: initialOrders,
}: OrdersSectionProps) {
  const [orders, setOrders] = useState<DemoOrderType[]>(initialOrders);
  const [updatingOrderIds, setUpdatingOrderIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedOrder, setSelectedOrder] = useState<DemoOrderType | null>(
    null,
  );
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToOrderUpdates((updatedOrders) => {
      const changedOrderIds = new Set<string>();
      for (const updatedOrder of updatedOrders) {
        const existingOrder = orders.find((o) => o.id === updatedOrder.id);
        if (
          existingOrder &&
          (existingOrder.status !== updatedOrder.status ||
            existingOrder.paymentStatus !== updatedOrder.paymentStatus)
        ) {
          changedOrderIds.add(updatedOrder.id);
        }
      }

      if (changedOrderIds.size > 0) {
        setUpdatingOrderIds(changedOrderIds);
        setTimeout(() => {
          setUpdatingOrderIds(new Set());
        }, 600);
      }

      setOrders(updatedOrders);
    });

    return unsubscribe;
  }, [orders]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cafeteria-demo-orders" && e.newValue) {
        try {
          const updatedOrders = JSON.parse(e.newValue);
          setOrders(updatedOrders);
        } catch (error) {
          console.error("Failed to parse orders from storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleViewOrder = (order: DemoOrderType) => {
    setSelectedOrder(order);
    setSummaryOpen(true);
  };

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            No orders yet
          </p>
          <p className="text-sm text-muted-foreground">
            Your orders will appear here once you place them
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">My Orders</h2>
          <p className="text-muted-foreground">
            Track your order status and payment
          </p>
        </div>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status];
              const StatusIcon = statusConfig.icon;
              const paymentStatusConfig =
                PAYMENT_STATUS_CONFIG[order.paymentStatus];
              const isUpdating = updatingOrderIds.has(order.id);

              return (
                <Card
                  key={order.id}
                  className={`transition-all duration-500 ${
                    isUpdating
                      ? "ring-2 ring-orange-400 shadow-lg scale-[1.02]"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(0, 12)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge
                          className={`${statusConfig.color} transition-all duration-500 ${
                            isUpdating ? "animate-pulse" : ""
                          }`}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                        <Badge className={paymentStatusConfig.color}>
                          {paymentStatusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {order.items.slice(0, 2).map((item, idx) => {
                      const imageUrl =
                        DEMO_IMAGE_MAP[item.foodItem.id] ||
                        "/assets/placeholder.jpg";
                      return (
                        <div
                          key={item.foodItem.id || idx}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={imageUrl}
                            alt={item.foodItem.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.foodItem.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {Number(item.quantity)}
                            </p>
                          </div>
                          <span className="font-semibold">
                            ₹
                            {Number(item.foodItem.price) *
                              Number(item.quantity)}
                          </span>
                        </div>
                      );
                    })}
                    {order.items.length > 2 && (
                      <p className="text-sm text-muted-foreground">
                        +{order.items.length - 2} more{" "}
                        {order.items.length - 2 === 1 ? "item" : "items"}
                      </p>
                    )}
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="font-semibold">Total</span>
                      <span className="text-lg font-bold text-orange-600">
                        ₹{Number(order.totalPrice)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <OrderSummaryDialog
        order={selectedOrder}
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
      />
    </>
  );
}
