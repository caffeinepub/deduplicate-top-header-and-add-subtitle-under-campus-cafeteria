import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Banknote, Check, Smartphone } from "lucide-react";
import { useState } from "react";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (method: "Cash" | "UPI") => void;
  isLoading?: boolean;
}

export default function PaymentMethodDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: PaymentMethodDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<"Cash" | "UPI" | null>(
    null,
  );

  const handleConfirm = () => {
    if (selectedMethod) {
      onConfirm(selectedMethod);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Payment Method</DialogTitle>
          <DialogDescription>
            Choose how you would like to pay for your order
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card
            className={`cursor-pointer border-2 p-4 transition-all hover:shadow-md ${
              selectedMethod === "Cash"
                ? "border-orange-500 bg-orange-50"
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
                <Check className="h-5 w-5 text-orange-500" />
              )}
            </div>
          </Card>

          <Card
            className={`cursor-pointer border-2 p-4 transition-all hover:shadow-md ${
              selectedMethod === "UPI"
                ? "border-orange-500 bg-orange-50"
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
                <Check className="h-5 w-5 text-orange-500" />
              )}
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedMethod || isLoading}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            {isLoading ? "Processing..." : "Confirm Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
