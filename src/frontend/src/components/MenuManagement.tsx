import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { FoodItem } from "../backend";
import {
  useAddFoodItem,
  useDeleteFoodItem,
  useUpdateFoodItem,
} from "../hooks/useQueries";
import { DEMO_IMAGE_MAP } from "../lib/demoData";

interface MenuManagementProps {
  foodItems: FoodItem[];
}

const CATEGORIES = ["Snacks", "Meals", "Beverages", "South Indian"];

export default function MenuManagement({ foodItems }: MenuManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Snacks",
  });

  const addFoodItem = useAddFoodItem();
  const updateFoodItem = useUpdateFoodItem();
  const deleteFoodItem = useDeleteFoodItem();

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", category: "Snacks" });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = BigInt(Number.parseInt(formData.price));

    try {
      if (editingItem) {
        await updateFoodItem.mutateAsync({
          id: editingItem.id,
          name: formData.name,
          description: formData.description,
          price,
          category: formData.category,
        });
      } else {
        await addFoodItem.mutateAsync({
          name: formData.name,
          description: formData.description,
          price,
          category: formData.category,
        });
      }

      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error saving food item:", error);
    }
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
    });
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Menu Management (Demo Mode)</h2>
          <p className="text-sm text-muted-foreground">
            Add, edit, or remove food items (changes stored locally)
          </p>
        </div>
        <Dialog
          open={showAddDialog}
          onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Food Item" : "Add New Food Item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                disabled={addFoodItem.isPending || updateFoodItem.isPending}
              >
                {editingItem ? "Update Item" : "Add Item"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foodItems.map((item) => {
            const imageUrl =
              DEMO_IMAGE_MAP[item.id] || "/assets/placeholder.jpg";
            return (
              <Card key={item.id}>
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  <Badge className="absolute right-2 top-2 bg-white/90 text-orange-600">
                    {item.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-1 font-semibold">{item.name}</h3>
                  <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="text-lg font-bold text-orange-600">
                    ₹{Number(item.price)}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2 p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => deleteFoodItem.mutate(item.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
