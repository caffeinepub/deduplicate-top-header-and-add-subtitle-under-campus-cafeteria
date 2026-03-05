import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Banknote,
  CheckCircle2,
  ChefHat,
  Clock,
  Eye,
  Package,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DEMO_IMAGE_MAP,
  type DemoOrderType,
  subscribeToOrderUpdates,
} from "../lib/demoData";
import AdminOrderDetailDialog from "./AdminOrderDetailDialog";

interface AllOrdersManagementProps {
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

export default function AllOrdersManagement({
  orders: initialOrders,
}: AllOrdersManagementProps) {
  const [filter, setFilter] = useState<string>("all");
  const [orders, setOrders] = useState<DemoOrderType[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<DemoOrderType | null>(
    null,
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToOrderUpdates((updatedOrders) => {
      setOrders(updatedOrders);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleViewDetails = (order: DemoOrderType) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            No orders yet
          </p>
          <p className="text-sm text-muted-foreground">
            Orders will appear here when customers place them
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Orders</h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Preparing">Preparing</SelectItem>
              <SelectItem value="Ready">Ready</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status];
              const StatusIcon = statusConfig.icon;
              const paymentStatusConfig =
                PAYMENT_STATUS_CONFIG[order.paymentStatus];
              const PaymentIcon =
                order.paymentMethod === "Cash" ? Banknote : Smartphone;

              const itemsSummary =
                order.items.length === 1
                  ? `${Number(order.items[0].quantity)}x ${order.items[0].foodItem.name}`
                  : `${order.items.length} items`;

              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(0, 12)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {order.userName}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={statusConfig.color}>
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
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {itemsSummary}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="font-semibold">Total</span>
                      <span className="text-lg font-bold text-orange-600">
                        ₹{Number(order.totalPrice)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details & Manage
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <AdminOrderDetailDialog
        order={selectedOrder}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </>
  );
}
