import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle2, ChefHat, Package, Banknote, Smartphone, User } from 'lucide-react';
import { DEMO_IMAGE_MAP, type DemoOrderType } from '../lib/demoData';

interface OrderSummaryDialogProps {
  order: DemoOrderType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_CONFIG = {
  Pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending', step: 1 },
  Preparing: { icon: ChefHat, color: 'bg-blue-100 text-blue-800', label: 'Preparing', step: 2 },
  Ready: { icon: CheckCircle2, color: 'bg-green-100 text-green-800', label: 'Ready for Pickup', step: 3 },
  Completed: { icon: Package, color: 'bg-gray-100 text-gray-800', label: 'Completed', step: 4 },
};

const PAYMENT_STATUS_CONFIG = {
  Pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Payment Pending' },
  Paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
};

export default function OrderSummaryDialog({ order, open, onOpenChange }: OrderSummaryDialogProps) {
  if (!order) return null;

  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];
  const PaymentIcon = order.paymentMethod === 'Cash' ? Banknote : Smartphone;

  const orderDate = new Date(order.timestamp);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Order Summary</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Order Header */}
            <div className="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="text-lg font-bold">#{order.id.slice(0, 12)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}
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

            {/* Order Progress */}
            <div className="space-y-3">
              <h3 className="font-semibold">Order Progress</h3>
              <div className="flex items-center justify-between">
                {Object.entries(STATUS_CONFIG).map(([key, config], index) => {
                  const isActive = config.step <= statusConfig.step;
                  const Icon = config.icon;
                  return (
                    <div key={key} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                            isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className={`mt-2 text-xs ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                          {config.label.split(' ')[0]}
                        </p>
                      </div>
                      {index < Object.keys(STATUS_CONFIG).length - 1 && (
                        <div
                          className={`mx-2 h-0.5 flex-1 ${
                            config.step < statusConfig.step ? 'bg-orange-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div className="space-y-3">
              <h3 className="font-semibold">Order Items</h3>
              {order.items.map((item, idx) => {
                const imageUrl = DEMO_IMAGE_MAP[item.foodItem.id] || '/assets/placeholder.jpg';
                return (
                  <div key={idx} className="flex items-center gap-4 rounded-lg border p-3">
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
                        {order.paymentMethod === 'Cash' ? 'Pay at pickup' : 'Online payment'}
                      </p>
                    </div>
                  </div>
                  <Badge className={paymentStatusConfig.color}>
                    {paymentStatusConfig.label}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="rounded-lg bg-orange-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-orange-600">₹{Number(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
