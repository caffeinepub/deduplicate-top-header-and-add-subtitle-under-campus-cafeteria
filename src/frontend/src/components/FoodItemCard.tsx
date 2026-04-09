import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { FoodItem } from "../backend";
import { useAddToCart } from "../hooks/useQueries";
import { DEMO_IMAGE_MAP } from "../lib/demoData";

interface FoodItemCardProps {
  item: FoodItem;
}

export default function FoodItemCard({ item }: FoodItemCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();

  const handleAddToCart = async () => {
    await addToCart.mutateAsync({ foodItem: item, quantity: BigInt(quantity) });
    setShowDetails(false);
    setQuantity(1);
  };

  const imageUrl = DEMO_IMAGE_MAP[item.id] || "/assets/placeholder.jpg";

  return (
    <>
      <Card
        className="glass group cursor-pointer overflow-hidden border-white/40 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 rounded-2xl"
        onClick={() => setShowDetails(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute right-2 top-2 bg-white/90 text-orange-600 hover:bg-white">
            {item.category}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-1 font-semibold text-gray-900">{item.name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <span className="text-lg font-bold text-orange-600">
            ₹{Number(item.price)}
          </span>
          <Button
            size="sm"
            className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Add
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={imageUrl}
              alt={item.name}
              className="h-64 w-full rounded-xl object-cover"
            />
            <div>
              <Badge className="mb-2">{item.category}</Badge>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-orange-50/70 p-4 border border-orange-100/60">
              <span className="text-lg font-semibold">Price</span>
              <span className="text-2xl font-bold text-orange-600">
                ₹{Number(item.price)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Quantity</span>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-semibold">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              className="w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all duration-200"
              size="lg"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {addToCart.isPending
                ? "Adding..."
                : `Add to Cart - ₹${Number(item.price) * quantity}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
