import { useState, useEffect } from 'react';
import { useUpdateOrderStatus } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, CheckCircle2, ChefHat, Package } from 'lucide-react';
import { DEMO_IMAGE_MAP, subscribeToOrderUpdates, type DemoOrderType } from '../lib/demoData';

interface OrderManagementProps {
  orders: DemoOrderType[];
}

const STATUS_CONFIG = {
  Pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  Preparing: { icon: ChefHat, color: 'bg-blue-100 text-blue-800', label: 'Preparing' },
  Ready: { icon: CheckCircle2, color: 'bg-green-100 text-green-800', label: 'Ready' },
  Completed: { icon: Package, color: 'bg-gray-100 text-gray-800', label: 'Completed' },
};

export default function OrderManagement({ orders: initialOrders }: OrderManagementProps) {
  const [filter, setFilter] = useState<string>('all');
  const [orders, setOrders] = useState<DemoOrderType[]>(initialOrders);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const updateStatus = useUpdateOrderStatus();

  useEffect(() => {
    const unsubscribe = subscribeToOrderUpdates((updatedOrders) => {
      setOrders(updatedOrders);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateStatus.mutateAsync({ orderId, status });
      setTimeout(() => {
        setUpdatingOrderId(null);
      }, 600);
    } catch (error) {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">No orders yet</p>
          <p className="text-sm text-muted-foreground">Orders will appear here when customers place them</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quick Order Management</h2>
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
            const isUpdating = updatingOrderId === order.id;

            return (
              <Card 
                key={order.id}
                className={`transition-all duration-500 ${
                  isUpdating ? 'ring-2 ring-green-400 shadow-lg scale-[1.01]' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 12)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {order.userName}
                      </p>
                    </div>
                    <Badge 
                      className={`${statusConfig.color} transition-all duration-500 ${
                        isUpdating ? 'animate-pulse' : ''
                      }`}
                    >
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item, idx) => {
                      const imageUrl = DEMO_IMAGE_MAP[item.foodItem.id] || '/assets/placeholder.jpg';
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={imageUrl}
                            alt={item.foodItem.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.foodItem.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {Number(item.quantity)}</p>
                          </div>
                          <span className="font-semibold">₹{Number(item.foodItem.price) * Number(item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-orange-600">₹{Number(order.totalPrice)}</span>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'Pending' && (
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all"
                        onClick={() => handleStatusUpdate(order.id, 'Preparing')}
                        disabled={updateStatus.isPending || isUpdating}
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        {isUpdating ? 'Updating...' : 'Start Preparing'}
                      </Button>
                    )}
                    {order.status === 'Preparing' && (
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 transition-all"
                        onClick={() => handleStatusUpdate(order.id, 'Ready')}
                        disabled={updateStatus.isPending || isUpdating}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {isUpdating ? 'Updating...' : 'Mark as Ready'}
                      </Button>
                    )}
                    {order.status === 'Ready' && (
                      <Button
                        className="flex-1 bg-gray-600 hover:bg-gray-700 transition-all"
                        onClick={() => handleStatusUpdate(order.id, 'Completed')}
                        disabled={updateStatus.isPending || isUpdating}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        {isUpdating ? 'Updating...' : 'Mark as Completed'}
                      </Button>
                    )}
                    {order.status === 'Completed' && (
                      <div className="flex-1 rounded-lg bg-gray-50 p-3 text-center">
                        <p className="font-medium text-gray-800">Order Completed</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
