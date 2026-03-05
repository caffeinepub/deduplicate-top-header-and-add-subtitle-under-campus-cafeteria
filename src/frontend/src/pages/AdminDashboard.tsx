import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  ChefHat,
  CircleCheck,
  Clock,
  Image as ImageIcon,
  Package,
  RotateCcw,
  Upload,
  UtensilsCrossed,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AllOrdersManagement from "../components/AllOrdersManagement";
import MenuManagement from "../components/MenuManagement";
import OrderManagement from "../components/OrderManagement";
import { useGetAllFoodItems, useGetAllOrders } from "../hooks/useQueries";
import {
  clearCustomLogo,
  getCustomLogo,
  saveCustomLogo,
} from "../lib/logoStorage";

export default function AdminDashboard() {
  const { data: orders = [] } = useGetAllOrders();
  const { data: foodItems = [] } = useGetAllFoodItems();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasCustomLogo, setHasCustomLogo] = useState(!!getCustomLogo());

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const preparingOrders = orders.filter((o) => o.status === "Preparing").length;
  const readyOrders = orders.filter((o) => o.status === "Ready").length;
  const completedOrders = orders.filter((o) => o.status === "Completed").length;

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(
        "Invalid file type. Please select an image file (PNG, JPG, etc.).",
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsUploading(true);

    try {
      // Convert image to data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          saveCustomLogo(dataUrl);
          setHasCustomLogo(true);
          toast.success("Logo uploaded successfully!");
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to read the image file. Please try again.");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo. Please try again.");
      setIsUploading(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResetLogo = () => {
    clearCustomLogo();
    setHasCustomLogo(false);
    toast.success("Logo reset to default successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your cafeteria menu and orders
        </p>
      </div>

      {/* Logo Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Header Logo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label
                htmlFor="logo-upload"
                className="mb-2 block text-sm font-medium"
              >
                Upload Custom Logo
              </Label>
              <Input
                id="logo-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
                className="cursor-pointer"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Accepts PNG, JPG, and other image formats. Recommended size:
                256x256px
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                variant="default"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
              {hasCustomLogo && (
                <Button
                  onClick={handleResetLogo}
                  disabled={isUploading}
                  variant="outline"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingOrders}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Preparing</CardTitle>
            <ChefHat className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {preparingOrders}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {readyOrders}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CircleCheck className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {completedOrders}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-orders" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="all-orders">All Orders</TabsTrigger>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
        </TabsList>

        <TabsContent value="all-orders">
          <AllOrdersManagement orders={orders} />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement orders={orders} />
        </TabsContent>

        <TabsContent value="menu">
          <MenuManagement foodItems={foodItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
