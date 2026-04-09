import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetAllOrders, useUpdateOrderStatus } from "../hooks/useQueries";
import type { DemoOrderType } from "../lib/demoData";
import { subscribeToOrderUpdates } from "../lib/demoData";

const STATUS_BADGE: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Preparing: "bg-blue-100 text-blue-800",
  Ready: "bg-green-100 text-green-800",
  Completed: "bg-gray-100 text-gray-700",
};

export default function AdminOrdersPage() {
  const { data: initialOrders = [] } = useGetAllOrders();
  const [orders, setOrders] = useState<DemoOrderType[]>(initialOrders);
  const updateStatus = useUpdateOrderStatus();

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    const unsubscribe = subscribeToOrderUpdates((updated) => {
      setOrders(updated);
    });
    return unsubscribe;
  }, []);

  const handleAdvanceStatus = (order: DemoOrderType) => {
    const next =
      order.status === "Pending"
        ? "Preparing"
        : order.status === "Preparing"
          ? "Ready"
          : null;
    if (next) {
      updateStatus.mutate({ orderId: order.id, status: next });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all incoming orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          data-ocid="admin.orders.empty_state"
          className="flex min-h-[400px] items-center justify-center rounded-2xl glass border-white/30 border-2 border-dashed"
        >
          <div className="text-center">
            <Package className="mx-auto h-14 w-14 text-muted-foreground/40" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              No orders yet
            </p>
            <p className="text-sm text-muted-foreground">
              Orders will appear here when placed
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl glass border-white/40 shadow-lg overflow-hidden">
          <Table data-ocid="admin.orders.table">
            <TableHeader>
              <TableRow className="bg-white/30 hover:bg-white/30">
                <TableHead className="font-semibold text-gray-700">
                  Order ID
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Item(s)
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Qty
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Payment
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow
                  key={order.id}
                  data-ocid={`admin.orders.row.item.${idx + 1}`}
                  className="hover:bg-white/20 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-gray-600">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="max-w-[180px]">
                    <div className="space-y-0.5">
                      {order.items.map((item) => (
                        <p
                          key={item.foodItem.id}
                          className="text-sm font-medium"
                        >
                          {item.foodItem.name}
                        </p>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.items.reduce(
                      (sum, item) => sum + Number(item.quantity),
                      0,
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs bg-white/50">
                      {order.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_BADGE[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {order.status !== "Ready" &&
                      order.status !== "Completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full text-xs bg-white/50 hover:bg-white/80 border-white/50 transition-all duration-200"
                          onClick={() => handleAdvanceStatus(order)}
                        >
                          {order.status === "Pending"
                            ? "Start Preparing"
                            : "Mark Ready"}
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
