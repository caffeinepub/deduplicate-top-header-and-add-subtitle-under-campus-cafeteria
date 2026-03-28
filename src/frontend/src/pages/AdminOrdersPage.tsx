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
          className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white"
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
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <Table data-ocid="admin.orders.table">
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
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
              {orders.map((order, idx) => {
                const itemNames = order.items
                  .map((i) => i.foodItem.name)
                  .join(", ");
                const totalQty = order.items.reduce(
                  (s, i) => s + Number(i.quantity),
                  0,
                );
                const ocid =
                  idx < 3
                    ? (`admin.orders.row.${idx + 1}` as const)
                    : undefined;
                return (
                  <TableRow key={order.id} data-ocid={ocid}>
                    <TableCell className="font-mono text-xs text-gray-600">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-sm">
                      {itemNames}
                    </TableCell>
                    <TableCell className="text-sm">{totalQty}</TableCell>
                    <TableCell>
                      <span className="text-sm">{order.paymentMethod}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_BADGE[order.status] ?? ""}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.status === "Pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                          onClick={() => handleAdvanceStatus(order)}
                        >
                          Mark Preparing
                        </Button>
                      )}
                      {order.status === "Preparing" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-green-300 text-green-700 hover:bg-green-50"
                          onClick={() => handleAdvanceStatus(order)}
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === "Ready" && (
                        <Badge className="bg-gray-100 text-gray-600 text-xs">
                          Completed
                        </Badge>
                      )}
                      {order.status === "Completed" && (
                        <span className="text-xs text-gray-400">Done</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
