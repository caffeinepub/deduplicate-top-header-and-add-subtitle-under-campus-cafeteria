import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Banknote,
  CheckCircle2,
  ChefHat,
  Clock,
  Package,
  Smartphone,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from "../hooks/useQueries";
import { DEMO_IMAGE_MAP, type DemoOrderType } from "../lib/demoData";

interface AdminOrderDetailDialogProps {
  order: DemoOrderType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
    label: "Ready",
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

export default function AdminOrderDetailDialog({
  order,
  open,
  onOpenChange,
}: AdminOrderDetailDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateStatus = useUpdateOrderStatus();
  const updatePaymentStatus = useUpdatePaymentStatus();

  if (!order) return null;

  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];
  const PaymentIcon = order.paymentMethod === "Cash" ? Banknote : Smartphone;

  const orderDate = new Date(order.timestamp);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateStatus.mutateAsync({ orderId: order.id, status: newStatus });
      setTimeout(() => setIsUpdating(false), 600);
    } catch (_error) {
      setIsUpdating(false);
    }
  };

  const handleMarkAsReceived = async () => {
    if (order.paymentStatus === "Paid") return;

    setIsUpdating(true);
    try {
      await updatePaymentStatus.mutateAsync({
        orderId: order.id,
        paymentStatus: "Paid",
      });
      setTimeout(() => setIsUpdating(false), 600);
    } catch (_error) {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Order Details & Management
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Order Header */}
            <div
              className={`rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-4 transition-all ${
                isUpdating ? "ring-2 ring-orange-400" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="text-lg font-bold">#{order.id.slice(0, 12)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {orderDate.toLocaleDateString()} at{" "}
                    {orderDate.toLocaleTimeString()}
                  </p>
                </div>
                <Badge className={statusConfig.color}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-2">
              <h3 className="font-semibold">Customer Details</h3>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.userName}</span>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div className="space-y-3">
              <h3 className="font-semibold">Order Items</h3>
              {order.items.map((item, idx) => {
                const imageUrl =
                  DEMO_IMAGE_MAP[item.foodItem.id] || "/assets/placeholder.jpg";
                return (
                  <div
                    key={item.foodItem.id || idx}
                    className="flex items-center gap-4 rounded-lg border p-3"
                  >
                    <img
                      src={imageUrl}
                      alt={item.foodItem.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.foodItem.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{Number(item.foodItem.price)} × {Number(item.quantity)}
                      </p>
                    </div>
                    <span className="font-semibold">
                      ₹{Number(item.foodItem.price) * Number(item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Payment Information */}
            <div className="space-y-3">
              <h3 className="font-semibold">Payment Information</h3>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-2">
                      <PaymentIcon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{order.paymentMethod}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.paymentMethod === "Cash"
                          ? "Pay at pickup"
                          : "Online payment"}
                      </p>
                    </div>
                  </div>
                  <Badge className={paymentStatusConfig.color}>
                    {paymentStatusConfig.label}
                  </Badge>
                </div>
                {order.paymentStatus === "Pending" && (
                  <Button
                    className="mt-3 w-full bg-green-600 hover:bg-green-700"
                    onClick={handleMarkAsReceived}
                    disabled={isUpdating}
                  >
                    Mark as Received
                  </Button>
                )}
                {order.paymentStatus === "Paid" && (
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Payment Received
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="rounded-lg bg-orange-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-orange-600">
                  ₹{Number(order.totalPrice)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Status Management */}
            <div className="space-y-3">
              <h3 className="font-semibold">Update Order Status</h3>
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Preparing">Preparing</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
